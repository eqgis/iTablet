import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { Toast } from '@/utils'

import { RNFS  } from 'imobile_for_reactnative'
import ConstPath from '@/constants/ConstPath'
import { color } from '@/styles'
import UserType from '@/constants/UserType'
import { getLanguage } from '@/language'
import { OnlineData } from 'imobile_for_reactnative/types/interface/iserver/types'
import { Users } from '@/redux/models/user'
import { DownloadProgressCallbackResult } from 'imobile_for_reactnative/types/fs'

interface Props {
  data: OnlineData,
  user: Users,
  down: Array<any>,
  updateDownList: (params: {
    id: number,
    progress: number,
    downed: boolean,
  }) => void,
  removeItemOfDownList: (params: { id: number }) => void,
  onDownloaded: () => void,
}

interface State {
  progress: string,
  isDownloading: boolean,
}

export default class AppletItem extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      progress: getLanguage(global.language).Prompt.DOWNLOAD,
      isDownloading: false,
    }
  }

  componentDidMount() {
    this.getDownloadProgress()
  }

  shouldComponentUpdate(prevProps: Props, preState: State) {
    if (
      preState.progress !== this.state.progress ||
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
    ) {
      return true
    }
    if (JSON.stringify(prevProps.down) !== JSON.stringify(this.props.down)) {
      for (let i = 0; i < this.props.down.length; i++) {
        if (this.props.data.iptResId === this.props.down[i].id) {
          return true
        }
      }
    }
    return false
  }

  componentDidUpdate(prevProps: Props) {
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
      if (this.props.data.iptResId === this.props.down[i].id) {
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
        this.props.removeItemOfDownList({ id: data.iptResId })
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
    const path =  global.homePath + ConstPath.BundlesPath + this.props.data.name
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

  _downloadFile = async () => {
    const dataId = this.props.data.iptResId
    const path = global.homePath + ConstPath.BundlesPath + this.props.data.name + '.zip'
    let dataUrl
    try {
      if (this.state.isDownloading) {
        Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
        return
      }
      if (await RNFS.exists(path)) {
        this.onDownloaded(path)
        return
      }
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path)
      }
      this.setState({
        progress: getLanguage(global.language).Prompt.DOWNLOADING,
        isDownloading: true,
      })
      if (UserType.isIPortalUser(this.props.user.currentUser)) {
        let url = this.props.user.currentUser.serverUrl || ''
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
        progress: (res: DownloadProgressCallbackResult) => {
          const value = ~~res.progress.toFixed(0)
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
      this.onDownloaded(path)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_FAILED)
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path)
      }
    }
  }

  onDownloaded = async (path: string) => {
    let result = false
    if (await RNFS.exists(path)) {
      result = true
    }
    this.getDownloadProgress()
    this.props.onDownloaded?.()
    result
      ? Toast.show(getLanguage(global.language).Find.DOWNLOADED)
      : Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY)
  }

  render() {
    const date = new Date(this.props.data.updateTime)
    const year = date.getFullYear() + '/'
    const month = date.getMonth() + 1 + '/'
    const day = date.getDate() + ''
    let hour = date.getHours() + ':'
    if (hour.length < 3) {
      hour = '0' + hour
    }
    let minute = date.getMinutes() + ''
    if (minute.length < 2) {
      minute = '0' + minute
    }
    const time = year + month + day + ' ' + hour + minute
    // let size =
    //   this.props.data.size / 1024 / 1024 > 0.1
    //     ? (this.props.data.size / 1024 / 1024).toFixed(2) + 'MB'
    //     : (this.props.data.size / 1024).toFixed(2) + 'K'
    const fontColor = color.fontColorGray
    const titleFontColor = color.fontColorBlack
    return (
      <View>
        <View style={styles.itemViewStyle}>
          <TouchableOpacity
            onPress={() => {
            }}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.imageStyle}
              source={{ uri: this.props.data.url }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={[styles.restTitleTextStyle, { color: titleFontColor }]}
              numberOfLines={2}
            >
              {this.props.data.name}
            </Text>
            <View style={styles.viewStyle2}>
              <Image
                style={[styles.imageStyle2, { tintColor: fontColor }]}
                resizeMode={'contain'}
                source={require('@/assets/tabBar/tab_user.png')}
              />
              <Text
                style={[styles.textStyle2, { color: fontColor }]}
                numberOfLines={1}
              >
                {this.props.data.userName}
              </Text>
            </View>
            <View style={[styles.viewStyle2, { marginTop: 5 }]}>
              <Image
                style={[styles.imageStyle2, { tintColor: fontColor }]}
                resizeMode={'contain'}
                source={require('@/assets/tabBar/find_time.png')}
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
              {/* {size} */}
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
                source={require('@/assets/tabBar/find_download.png')}
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
