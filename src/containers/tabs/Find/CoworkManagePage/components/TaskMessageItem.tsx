import React from 'react'
import { View, TouchableOpacity, Text, Image, Platform } from 'react-native'
import { ListSeparator, Progress, RedDot } from '../../../../../components'
import { ConstPath, UserType } from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import { getThemeAssets } from '../../../../../assets'
import { color, size } from '../../../../../styles'
import RNFS from 'react-native-fs'
import { Toast, scaleSize } from '../../../../../utils'
import * as OnlineServicesUtils from '../../../../../utils/OnlineServicesUtils'
import DataHandler from '../../../Mine/DataHandler'
import { FileTools } from '../../../../../native'
import { IDownloadProps, Download } from '../../../../../redux/models/down'

import styles from './styles'

interface Props {
  data: any,
  user: any,
  isSelf: boolean,
  unread: number,
  downloadData: Download[],
  onPress: (data: any) => void,
  addCoworkMsg: (data: any) => void,
  deleteCoworkMsg: (data: any) => void,
  showMore: (item: {data: any, event: any}) => void,
  getModule?: (key: string, index: number) => any,
  downloadSourceFile: (params: IDownloadProps) => Promise<any[]>,
  deleteSourceDownloadFile: (params: {id: number}) => Promise<any[]>,
}

interface State {
  progress: number,
  isDownloading: boolean,
  isSelf: boolean,
  module: any,
  exist: boolean,
  mapData: {
    name: string,
    path: string,
  } | undefined,
}

export default class TaskMessageItem extends React.Component<Props, State> {

  path: string | undefined
  downloading: boolean
  downloadingPath: string
  itemProgress: Progress | undefined | null

  constructor(props: Props) {
    super(props)
    this.path = ''
    this.downloading = false
    this.downloadingPath = ''
    this.state = {
      isDownloading: false,
      isSelf: props.isSelf,
      module: this.props.getModule && this.props.getModule(this.props.data.module.key, this.props.data.module.index),
      progress: 0,
      exist: false,
      mapData: undefined,
    }
  }

  async componentDidMount() {
    const recourceName = this.props.data.resource.resourceName.replace('.zip', `_${this.props.data.id}.zip`)
    this.path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      recourceName

    this.downloadingPath =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.id

    // 检测是否下载完成
    let exist = await FileTools.fileIsExist(this.downloadingPath)
    if (exist) {
      this.downloading = true
      // 下载过程中退出当前界面,再次进入当前界面
      // 防止下载完成后,进度条不会消失
      let timer = setInterval(async () => {
        exist = await FileTools.fileIsExist(this.downloadingPath + '_')
        if (exist) {
          clearInterval(timer)
          this.setState({
            exist: true,
            isDownloading: false,
          })
        } else {
          this.setState({
            exist: false,
            isDownloading: true,
          })
        }
      }, 2000)
      this.setState({
        exist: false,
        isDownloading: true,
      })
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    )
  }

  async componentDidUpdate(prevProps: Props) {
    if (
      this.props.getModule &&
      (
        this.props.data.module.key !== prevProps.data.module.key ||
        this.props.data.module.index !== prevProps.data.module.key
      )
    ) {
      let module = this.props.getModule(this.props.data.module.key, this.props.data.module.index)
      this.setState({
        module: module,
      })
    }
    const download = this.getDownloadData(this.props.downloadData, this.props.data.id)
    if (this.itemProgress && download) {
      if (this.itemProgress && download.progress === 100) {
        this.props.deleteSourceDownloadFile({id: this.props.data.id})
      }
      this.itemProgress.progress = download.progress / 100
    } else if (download && !this.state.isDownloading && download.progress >= 0 && download.progress < 100) {
      this.setState({
        isDownloading: true,
      })
    }
  }

  getDownloadData = (datas: Download[], id: number | string) => {
    for (let item of this.props.downloadData) {
      if (item.id === id) {
        return item
      }
    }
  }

  _onPress = () => {
    let data = Object.assign({map: this.state.mapData}, this.props.data)
    this.props.onPress(data)
  }

  _showMore = (event: any) => {
    this.props.showMore({
      data: this.props.data,
      event: event,
    })
  }

  _downloadFile = async () => {
    if (this.state.exist) {
      await this.unZipFile()
      Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY)
      return
    }
    if (this.state.isDownloading) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOADING)
      return
    }
    this.setState({
      isDownloading: true,
    })
    RNFS.writeFile(this.downloadingPath, '0%', 'utf8')

    let dataId = this.props.data.resource.resourceId
    let dataUrl
    if (UserType.isIPortalUser(this.props.user.currentUser)) {
      let url = this.props.user.currentUser.serverUrl
      if (url.indexOf('http') !== 0) {
        url = 'http://' + url
      }
      dataUrl = `${url}/datas/${dataId}/download`
    } else {
      dataUrl = 'https://www.supermapol.com/web/datas/' + dataId + '/download'
    }

    const downloadOptions = {
      key: this.props.data.id,
      ...Platform.select({
        android: {
          headers: {
            cookie: await OnlineServicesUtils.getService()?.getCookie() || '',
          },
        },
      }),
      fromUrl: dataUrl,
      toFile: this.path || '',
      background: true,
      // progress: (res: any) => {
      //   let value = ~~res.progress.toFixed(0)
      //   if (this.itemProgress) {
      //     this.itemProgress.progress = value / 100
      //   }
      //   // RNFS.writeFile(this.downloadingPath, progress, 'utf8')
      // },
    }

    try {
      this.props.downloadSourceFile(downloadOptions)
        .then(async () => {
          let { result, path } = await this.unZipFile()

          let results: any[] = []
          if (result) {
            let dataList = await DataHandler.getExternalData(path)

            for (let data of dataList) {
              let importResult = await DataHandler.importWorkspace(data)
              if (importResult && importResult.length > 0) {
                results = results.concat(importResult)
              }
            }
            FileTools.deleteFile(this.path)
          }

          let mapData
          if (results.length > 0) {
            let mapName = results[0]
            let mapPath = `${ConstPath.UserPath + this.props.user.currentUser.userName}/${ConstPath.RelativePath.Map + mapName}.xml`
            mapData = {
              name: mapName,
              path: mapPath,
            }
          }

          await FileTools.deleteFile(this.downloadingPath)
          await RNFS.writeFile(this.downloadingPath + '_', JSON.stringify(mapData), 'utf8')

          if (result.length === 0) {
            this.setState({
              isDownloading: false,
            })
            Toast.show(getLanguage(GLOBAL.language).Prompt.ONLINE_DATA_ERROR)
          } else {
            this.setState({
              isDownloading: false,
              exist: true,
              mapData,
            })
          }
        })
        .catch(e => {
          FileTools.deleteFile(this.path)
          FileTools.deleteFile(this.path + '_tmp') // 删除下载的临时文件
          FileTools.deleteFile(this.downloadingPath + '_')
          this.setState({
            isDownloading: false,
          }, () => {
            if (
              e.message.includes('no such file or directory') || // Android提示
              e.message.includes('Failed to open target resource') // iOS提示
            ) {
              Toast.show(getLanguage(GLOBAL.language).Friends.RESOURCE_NOT_EXIST)
            } else {
              Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_FAILED)
            }
          })
        })
    } catch (e) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.NETWORK_ERROR)
      FileTools.deleteFile(this.path)
      this.setState({
        isDownloading: false,
      })
    }
  }

  unZipFile = async () => {
    if (!this.path) {
      return {
        result: false,
        path: '',
      }
    }
    let index = this.path.lastIndexOf('.')
    let fileDir = this.path.substring(0, index)
    let exists = await RNFS.exists(fileDir)
    if (!exists) {
      await RNFS.mkdir(fileDir)
    }
    let result = await FileTools.unZipFile(this.path, fileDir)
    if (!result) {
      FileTools.deleteFile(this.path)
    }
    return {
      result,
      path: fileDir,
    }
  }

  _renderButton = ({ image, title, action, style }: any) => {
    return (
      <View
        style={[{
          justifyContent: 'center',
          alignItems: 'center',
        }, style]}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={action}
        >
          <Image
            style={{ width: scaleSize(50), height: scaleSize(50), tintColor: color.fontColorGray }}
            source={image}
          />
        </TouchableOpacity>
        {/* {
          title && */}
        {/* <Text
          style={{
            fontSize: 12,
            textAlign: 'center',
            width: 125,
            color: color.fontColorGray,
          }}
          numberOfLines={1}
        >
          {title}
        </Text> */}
        {/* } */}
      </View>
    )
  }

  _renderProgress = () => {
    if (!this.state.isDownloading) return null
    return (
      <Progress
        ref={ref => (this.itemProgress = ref)}
        pointerEvents={'box-none'}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: scaleSize(160),
          width: '100%',
        }}
        progressAniDuration={0}
        progressColor={'#rgba(70, 128, 223, 0.2)'}
      />
    )
  }

  _renderContentView = () => {
    return (
      <View style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between'}}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: size.fontSize.fontSizeLg,
            color: color.fontColorBlack,
          }}
        >
          {getLanguage(GLOBAL.language).Friends.TASK_TITLE + ': ' + this.state.module.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: size.fontSize.fontSizeMd,
            color: color.fontColorBlack,
          }}
        >
          {getLanguage(GLOBAL.language).Friends.TASK_MAP + ': ' + this.props.data.resource.resourceName.replace('.zip', '')}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: size.fontSize.fontSizeSm,
            color: color.fontColorGray3,
          }}
        >
          {getLanguage(GLOBAL.language).Friends.TASK_CREATE_TIME + ': ' + new Date(this.props.data.time).Format("yyyy-MM-dd hh:mm:ss")}
        </Text>
      </View>
    )
  }

  render() {
    if (!this.state.module) {
      return <View />
    }
    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this._onPress}
          style={styles.rowContainer}
        >
          <Image style={styles.itemImage} source={this.state.module.moduleImage} />
          <View
            style={{ flex: 1, flexDirection: 'column', marginLeft: scaleSize(40) }}
          >
            {this._renderContentView()}
          </View>
          {!this.state.exist && this._renderButton({
            image: getThemeAssets().cowork.icon_nav_import,
            title: this.state.progress,
            action: this._downloadFile,
          })}
          {
            // this.state.exist &&
            this._renderButton({
              image: getThemeAssets().publicAssets.icon_move,
              action: this._showMore,
              style: {marginLeft: scaleSize(24)},
            })
          }
          {/* {this._renderButton({
            image: getThemeAssets().edit.icon_delete,
            action: () => this.props.deleteCoworkMsg(this.props.data),
          })} */}
        </TouchableOpacity>
        {
          this.props.unread > 0 &&
          <RedDot style={{position: 'absolute', top: scaleSize(30), left: scaleSize(30)}} />
        }
        {this._renderProgress()}
        <ListSeparator color={color.itemColorGray2} style={{marginLeft: scaleSize(150), marginRight: scaleSize(42)}} />
      </View>
    )
  }
}