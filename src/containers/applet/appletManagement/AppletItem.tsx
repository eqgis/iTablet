/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { Text, TouchableOpacity, Platform, ImageBackground, Animated } from 'react-native'
import { Toast } from '@/utils'
import { getLanguage } from '@/language'
import { FileTools } from '@/native'
import { UserType, ConstPath, ChunkType } from '@/constants'
import { getThemeAssets } from '@/assets'
import { ConfigUtils, RNFS } from 'imobile_for_reactnative'
import _mapModules, { mapModules } from '@/../configs/mapModules'

import styles from './styles'
import { Users } from '@/redux/models/user'

interface Props {
  data: any,
  user: Users,
  down: any[],
  disable: boolean,
  downloadData: (params: {
    fromUrl: string,
    toFile: string,
    background: boolean,
    progress: (res: any) => void,
  }) => void,
  updateDownList: (params: {
    id: string,
    progress: string | number,
    downed: boolean,
  }) => void,
  removeItemOfDownList: (params: {id: string}) => void,
  onDownloaded: () => void,
  refreshData: () => void,
  setMapModule: () => void,
}

interface State {
  progress: string | number,
  isDownloading: boolean,
}

export default class AppletItem extends React.Component<Props, State> {

  path: string | undefined = undefined
  exist = false
  downloading = false
  downloadingPath = false

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
        if (this.props.data.id === this.props.down[i].id) {
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
    const path =
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

  _action = async () => {
    // const filePath = global.homePath + ConstPath.BundlesPath + this.props.data.fileName
    if (_mapModules.indexOf(this.props.data.fileName) >= 0) {
      // 判断redux中是否存在未显示的小插件
      const applets = [] // redux使用的对象数组
      const _applets = [] // 本地文件的字符串数组

      // 添加系统默认模块
      Object.keys(ChunkType).map(key => {
        for (let i = 0; i < mapModules.length; i++) {
          if (ChunkType[key] === mapModules[i].key) {
            applets.push(mapModules[i])
            _applets.push(mapModules[i].key)
          }
        }
      })

      for (let i = 0; i < mapModules.length; i++) {
        if (this.props.data.fileName === mapModules[i].key) {
          applets.push(mapModules[i])
          _applets.push(mapModules[i].key)
        }
      }

      await this.props.setMapModule(applets)
      await ConfigUtils.recordApplets(this.props.user.currentUser.userName, _applets)
      this.props.refreshData && this.props.refreshData()
    } else {
      // 判断本地是否有小插件bundle
      // 下载小插件
      this._downloadFile()
    }
  }

  _downloadFile = async () => {
    if (this.props.disable) return
    const fileName = this.props.data.fileName
    // let fileName =
    //   'index.' + (Platform.OS === 'ios' ? 'ios' : 'android') + '.bundle.zip'
    const dataId = this.props.data.id
    const path = global.homePath + ConstPath.BundlesPath + fileName
    let dataUrl
    try {
      if (this.state.isDownloading) {
        Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
        return
      }
      if (await RNFS.exists(path)) {
        this._onDownloaded(fileName, path)
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
        progress: res => {
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
      this._onDownloaded(fileName, path)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_FAILED)
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path)
      }
    }
  }

  _onDownloaded = async (fileName: string, path: string) => {
    const bundlesPath = global.homePath + ConstPath.BundlesPath
    const index = fileName.lastIndexOf('.')
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

    if (this.props.onDownloaded) {
      this.props.onDownloaded(result)
    }
  }

  render() {
    let titleName = ''
    if (this.props.data.fileName) {
      const index = this.props.data.fileName.lastIndexOf('.')
      titleName =
        index === -1
          ? this.props.data.fileName
          : this.props.data.fileName.substring(0, index)
      const suffix = (Platform.OS === 'ios' ? '.ios' : '.android') + '.bundle'
      if (titleName.endsWith(suffix)) {
        titleName = titleName.replace(suffix, '')
      }
    }

    const reg = new RegExp('_[0-9]{8}_[0-9]*$')
    const matchResult = titleName.match(reg)
    if (matchResult) {
      titleName = titleName.slice(0, matchResult.index)
    }

    const image = this.props.data.image || getThemeAssets().mine.my_applets_default

    return (
      <TouchableOpacity
        style={styles.btn}
        onPress={this._action}
      >
        <ImageBackground
          resizeMode={'contain'}
          source={image}
          style={styles.itemImg}
        >
          {
            this.state.isDownloading && (
              <Animated.View style={styles.progressView}>
                <Text style={styles.progressText}>{this.state.progress}</Text>
              </Animated.View>
            )
          }
        </ImageBackground>
        <Text style={styles.itemText}>{titleName}</Text>
      </TouchableOpacity>
    )
  }
}
