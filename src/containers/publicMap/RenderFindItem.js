/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from './Styles'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'
import {RNFS} from 'imobile_for_reactnative'
import { FileTools } from '../../native'
import ConstPath from '../../constants/ConstPath'
import { color } from '../../styles'
import UserType from '../../constants/UserType'
import { getLanguage } from '../../language'
import { IDownloadProps } from '../../redux/models/down'

export default class RenderFindItem extends Component {
  props: {
    data: Object,
    user: Object,
    downloads: Array<any>,
    downloadFile: (param: IDownloadProps) => Promise<any>,
  }

  constructor(props) {
    super(props)
    this.path = undefined
    this.exist = false
    this.titleName = ''
    if (this.props.data.fileName) {
      let index = this.props.data.fileName.lastIndexOf('.')
      this.titleName =
        index === -1
          ? this.props.data.fileName
          : this.props.data.fileName.substring(0, index)
    }
    this.state = {
      progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD,
      // '下载',
      isDownloading: 0,//0 未下载，1 下载中，2 已完成
    }
    // debugger
    this.unZipFile = this.unZipFile.bind(this)
    this.timer = null
  }

  /**
  * 获取下载进度
  * @returns {Number} 下载进度，1-100。未下载时返回-1
  */
  getDownloadProgress = () => {
    let downloads = this.props.downloads
    if (downloads.length > 0) {
      for (let i = 0; i < downloads.length; i++) {
        if (
          downloads[i].id === this.props.data.MD5 &&
          !downloads[i].downloaded
        ) {
          return downloads[i].progress
        }
      }
    }
    return -1
  }
  /** 获取并设置此特效的状态 */
  getStatus = async () => {
    let progress = this.getDownloadProgress()
    if (progress >= 0) {//下载中
      this.setState({
        progress: progress + '%',
        isDownloading: 1,
      })
      this.addDownloadListener()
    } else {
      // debugger
      this.exist = await FileTools.fileIsExist(this.path)
      if (this.exist) {//文件存在，下载完成
        this.setState({
          progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY,
          isDownloading: 2,
        })
      } else {//文件不存在，可以下载
        this.setState({
          progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD,
          isDownloading: 0,
        })
      }
    }
  }
  /** 下载完成监听 */
  addDownloadListener = () => {
    this.timer = setInterval(async () => {

      let progress = this.getDownloadProgress()
      if (progress >= 0) {//下载中
        this.setState({
          progress: progress + '%',
          isDownloading: 1,
        })
      } else {
        let downloaded = false
        let downloads = this.props.downloads
        if (downloads.length > 0) {
          for (let i = 0; i < downloads.length; i++) {
            if (downloads[i].id === this.props.data.MD5) {
              downloaded = downloads[i].downloaded
              break
            }
          }
        }
        if (downloaded) {
          this.exist = await FileTools.fileIsExist(this.path) // 下载完成，检测本地文件是否存在
          if(this.exist)
          {
            Toast.show(getLanguage(GLOBAL.language).Find.DOWNLOADED)
          }
          this.setState({
            progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY,
            isDownloading: 2,
          })
          this.removeDownloadListner()
          this.unZipFile()
        }
      }
    }, 2000)
  }
  /** 移除下载监听 */
  removeDownloadListner() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  componentWillUnmount() {
    this.removeDownloadListner()
  }
  async componentDidMount() {

    this.path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.fileName

    this.getStatus()
  }

  _downloadFile = async () => {
    if (this.exist) {
      await this.unZipFile()
      Toast.show(getLanguage(GLOBAL.language).Find.DOWNLOADED)
      // Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY)
      return
    }
    if (
      this.props.user &&
      this.props.user.currentUser &&
      (this.props.user.currentUser.userType === UserType.PROBATION_USER ||
        (this.props.user.currentUser.userName &&
          this.props.user.currentUser.userName !== ''))
    ) {
      if (this.state.isDownloading == 1) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOADING)
        //'正在下载...')
        return
      }
      this.setState({
        progress: getLanguage(GLOBAL.language).Prompt.DOWNLOADING,
        isDownloading: 1,
      })
      // RNFS.writeFile(this.downloadingPath, '0%', 'utf8')

      let dataId = this.props.data.id
      let dataUrl =
        'https://www.supermapol.com/web/datas/' + dataId + '/download'
      const downloadOptions = {
        fromUrl: dataUrl,
        toFile: this.path,
        background: true,
        key: this.props.data.MD5,
      }

      try {
        this.props.downloadFile(downloadOptions)
        this.addDownloadListener()
      } catch (e) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_FAILED)
        FileTools.deleteFile(this.path)
        this.setState({ progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD, isDownloading: 0 })
      }
    } else {
      Toast.show('登录后可下载')
    }
  }

  async unZipFile() {
    let appHome = await FileTools.appendingHomeDirectory()

    let fileDir =
      appHome +
      ConstPath.ExternalData + '/' +
      this.titleName
    let exists = await RNFS.exists(fileDir)
    if (!exists) {
      await RNFS.mkdir(fileDir)
    } else {
      for (let i = 1; ; i++) {
        if (!await RNFS.exists(fileDir + '_' + i)) {
          fileDir = fileDir + '_' + i
          break
        }
      }
    }
    let result = await FileTools.unZipFile(this.path, fileDir)
    return result
  }

  _navigator = uri => {
    NavigationService.navigate('MyOnlineMap', {
      uri: uri,
    })
  }
  _nextView = async () => {
    if (this.props.data.type === 'WORKSPACE') {
      if (this.props.data.serviceStatus === 'UNPUBLISHED') {
        let dataId = this.props.data.id
        let dataUrl = 'https://www.supermapol.com/web/datas/' + dataId + '.json'
        this._navigator(dataUrl)
      } else {
        Toast.show('服务没有公开，无权限浏览')
      }
    } else {
      let info = this.props.data.type + '数据无法浏览'
      Toast.show(info)
    }
  }
  render() {
    let date = new Date(this.props.data.lastModfiedTime)
    let year = date.getFullYear() + '/'
    let month = date.getMonth() + 1 + '/'
    let day = date.getDate() + ''
    let hour = date.getHours() + ':'
    if (hour.length < 3) {
      hour = '0' + hour
    }
    let minute = date.getMinutes() + ''
    if (minute.length < 2) {
      minute = '0' + minute
    }
    let time = year + month + day + ' ' + hour + minute
    let size =
      this.props.data.size / 1024 / 1024 > 0.1
        ? (this.props.data.size / 1024 / 1024).toFixed(2) + 'MB'
        : (this.props.data.size / 1024).toFixed(2) + 'K'
    let fontColor = color.fontColorGray
    let titleFontColor = color.fontColorBlack
    return (
      <View>
        <View style={styles.itemViewStyle}>
          <TouchableOpacity
            onPress={() => {
              this._nextView()
            }}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.imageStyle}
              source={{ uri: this.props.data.thumbnail }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={[styles.restTitleTextStyle, { color: titleFontColor }]}
              numberOfLines={2}
            >
              {this.titleName}
            </Text>
            <View style={styles.viewStyle2}>
              <Image
                style={[styles.imageStyle2, { tintColor: fontColor }]}
                resizeMode={'contain'}
                source={require('../../assets/tabBar/tab_user.png')}
              />
              <Text
                style={[styles.textStyle2, { color: fontColor }]}
                numberOfLines={1}
              >
                {this.props.data.nickname}
              </Text>
            </View>
            <View style={[styles.viewStyle2, { marginTop: 5 }]}>
              <Image
                style={[styles.imageStyle2, { tintColor: fontColor }]}
                resizeMode={'contain'}
                source={require('../../assets/tabBar/find_time.png')}
              />
              <Text
                style={[styles.textStyle2, { color: fontColor }]}
                numberOfLines={1}
              >
                {time}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 100,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 12, textAlign: 'center', color: fontColor }}
              numberOfLines={1}
            >
              {size}
            </Text>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this._downloadFile()
              }}
            >
              <Image
                style={{ width: 35, height: 35, tintColor: fontColor }}
                source={require('../../assets/tabBar/find_download.png')}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                textAlign: 'center',
                width: 125,
                color: fontColor,
              }}
              numberOfLines={1}
            >
              {this.state.progress}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.separateViewStyle,
            {
              backgroundColor: color.separateColorGray,
            },
          ]}
        />
      </View>
    )
  }
}
