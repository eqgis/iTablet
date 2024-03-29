import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, Platform } from 'react-native'
import styles from './styles'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { FileTools } from '../../../../native'
import {RNFS} from 'imobile_for_reactnative'
import ConstPath from '../../../../constants/ConstPath'
import { color } from '../../../../styles'
import UserType from '../../../../constants/UserType'
import { getLanguage } from '../../../../language'

export default class AppletItem extends Component {
  props: {
    data: Object,
    user: Object,
    down: Array,
    downloadData: () => {},
    updateDownList: () => {},
    removeItemOfDownList: () => {},
    onDownloaded: () => {},
  }

  constructor(props) {
    super(props)
    this.path = undefined
    this.exist = false
    this.downloading = false
    this.downloadingPath = false
    this.state = {
      progress: getLanguage(global.language).Prompt.DOWNLOAD,
      isDownloading: false,
    }
  }

  componentDidMount() {
    this.getDownloadProgress()
  }

  shouldComponentUpdate(prevProps, preState) {
    if (
      preState.progress !== this.state.progress ||
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
    ) {
      return true
    }
    if (JSON.stringify(prevProps.down) !== JSON.stringify(this.props.down)) {
      for (let i = 0; i < this.props.down.length; i++) {
        if (this.props.data.id === this.props.down[i].id) {
          return true
        }
      }
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data) ||
      JSON.stringify(prevProps.down) !== JSON.stringify(this.props.down)
    ) {
      this.getDownloadProgress()
    }
  }

  getDownloadProgress = () => {
    let data
    for (let i = 0; i < this.props.down.length; i++) {
      if (this.props.data.id === this.props.down[i].id) {
        data = this.props.down[i]
        break
      }
    }
    if (data) {
      if (data.downed) {
        this.setState({
          progress: getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY,
          isDownloading: false,
        })
        this.props.removeItemOfDownList({ id: data.id })
      } else {
        this.setState({
          progress: data.progress + '%',
          isDownloading: true,
        })
      }
    } else {
      this.getDownloadStatus()
    }
  }

  getDownloadStatus = async () => {
    let path =
      global.homePath + ConstPath.BundlesPath + this.props.data.fileName
    if (await RNFS.exists(path)) {
      this.setState({
        progress: getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY,
        isDownloading: false,
      })
    } else {
      this.setState({
        progress: getLanguage(global.language).Prompt.DOWNLOAD,
        isDownloading: false,
      })
    }
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
  _downloadFile = async () => {
    let fileName = this.props.data.fileName
    // let fileName =
    //   'index.' + (Platform.OS === 'ios' ? 'ios' : 'android') + '.bundle.zip'
    let dataId = this.props.data.id
    let path = global.homePath + ConstPath.BundlesPath + fileName
    let dataUrl
    try {
      if (this.state.isDownloading) {
        Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
        return
      }
      if (await RNFS.exists(path)) {
        this.onDownloaded(fileName, path)
        return
      }
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path)
      }
      this.setState({
        progress: getLanguage(global.language).Prompt.DOWNLOADING,
        isDownloading: true,
      })
      if (UserType.isIPortalUser(this.props.user)) {
        let url = this.props.user.currentUser.serverUrl
        if (url.indexOf('http') !== 0) {
          url = 'http://' + url
        }
        dataUrl = url + '/datas/' + dataId + '/download'
      } else {
        dataUrl = 'https://www.supermapol.com/web/datas/' + dataId + '/download'
      }
      let preProgress = 0
      const downloadOptions = {
        fromUrl: dataUrl,
        toFile: path,
        background: true,
        progress: res => {
          let value = ~~res.progress.toFixed(0)
          if (value !== preProgress) {
            preProgress = value
            this.props.updateDownList({
              id: dataId,
              progress: value,
              downed: false,
            })
          }
        },
      }

      await RNFS.downloadFile(downloadOptions).promise
      this.props.updateDownList({
        id: dataId,
        progress: 100,
        downed: true,
      })
      this.onDownloaded(fileName, path)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_FAILED)
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path)
      }
    }
  }

  onDownloaded = async (fileName, path) => {
    let appHome = await FileTools.appendingHomeDirectory()
    let bundlesPath = appHome + ConstPath.BundlesPath
    let index = fileName.lastIndexOf('.')
    let name, type
    if (index !== -1) {
      name = fileName.substring(0, index)
      type = fileName.substring(index + 1).toLowerCase()
    }

    let result
    if (!type) {
      result = false
    } else if (type === 'zip') {
      this.setState({
        progress: getLanguage(global.language).Prompt.UNZIPPING,
      })
      if (await RNFS.exists(bundlesPath + name)) {
        await RNFS.unlink(bundlesPath + name)
      }
      result = await FileTools.unZipFile(path, bundlesPath)
    } else {
      result = await FileTools.copyFile(path, bundlesPath, true)
    }
    this.setState({
      progress: getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY,
      isDownloading: false,
    })
    // result
    //   ? Toast.show(getLanguage(global.language).Find.APPLET_DOWNLOADED_RELOAD)
    //   : Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY)
    if (this.props.onDownloaded) {
      this.props.onDownloaded(result)
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
    this.titleName = ''
    if (this.props.data.fileName) {
      let index = this.props.data.fileName.lastIndexOf('.')
      this.titleName =
        index === -1
          ? this.props.data.fileName
          : this.props.data.fileName.substring(0, index)
      const suffix = (Platform.OS === 'ios' ? '.ios' : '.android') + '.bundle'
      if (this.titleName.endsWith(suffix)) {
        this.titleName = this.titleName.replace(suffix, '')
      }
    }
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
            {/*<View style={styles.viewStyle2}>*/}
            {/*<Image*/}
            {/*style={[styles.imageStyle2, { tintColor: fontColor }]}*/}
            {/*resizeMode={'contain'}*/}
            {/*source={require('../../../../assets/tabBar/tab_user.png')}*/}
            {/*/>*/}
            {/*<Text*/}
            {/*style={[styles.textStyle2, { color: fontColor }]}*/}
            {/*numberOfLines={1}*/}
            {/*>*/}
            {/*{this.props.data.nickname}*/}
            {/*</Text>*/}
            {/*</View>*/}
            <View style={[styles.viewStyle2, { marginTop: 5 }]}>
              <Image
                style={[styles.imageStyle2, { tintColor: fontColor }]}
                resizeMode={'contain'}
                source={require('../../../../assets/tabBar/find_time.png')}
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
                source={require('../../../../assets/tabBar/find_download.png')}
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
