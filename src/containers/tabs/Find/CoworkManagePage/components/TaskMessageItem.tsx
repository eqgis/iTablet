import React from 'react'
import { View, TouchableOpacity, Text, Image, Platform } from 'react-native'
import { ListSeparator, Progress, RedDot, CheckBox } from '../../../../../components'
import { ConstPath, UserType } from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import { getThemeAssets } from '../../../../../assets'
import { color, size } from '../../../../../styles'
import { Toast, scaleSize } from '../../../../../utils'
import * as OnlineServicesUtils from '../../../../../utils/OnlineServicesUtils'
import DataHandler from '../../../../../utils/DataHandler'
import { FileTools } from '../../../../../native'
import { RNFS  } from 'imobile_for_reactnative'
import { IDownloadProps, Download } from '../../../../../redux/models/down'

import styles from './styles'

interface Props {
  data: any,
  user: any,
  // isSelf: boolean,
  unread: number,
  downloadData: Download,
  openCheckBox?: boolean,
  checked?: boolean,
  onPress: (data: any) => void,
  addCoworkMsg: (data: any) => void,
  deleteCoworkMsg: (data: any) => void,
  showMore: (item: {data: any, event: any}) => void,
  getModule?: (key: string, index: number) => any,
  downloadSourceFile: (params: IDownloadProps) => Promise<any[]>,
  deleteSourceDownloadFile: (id: number | string) => Promise<any[]>,
  checkAction?: (checkParams: {value: boolean, data: any, download: () => Promise<void>}) => void,
}

interface State {
  progress: number,
  isDownloading: boolean,
  // isSelf: boolean,
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
      // isSelf: props.isSelf,
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
    let exist = await this.fileExist()
    if (!exist && this.props.downloadData) {
      // 下载过程中退出当前界面,再次进入当前界面
      // 防止下载完成后,进度条不会消失
      let timer = setInterval(async () => {
        exist = await this.fileExist()
        if (exist) {
          clearInterval(timer)
          this.setState({
            isDownloading: false,
            exist: true,
          })
        } else {
          this.setState({
            isDownloading: true,
            exist: false,
          })
        }
      }, 2000)
      this.setState({
        isDownloading: true,
        exist: false,
      })
    } else {
      this.setState({
        isDownloading: false,
        exist: true,
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
    const newState: any = {}
    if (
      this.props.getModule &&
      (
        this.props.data.module.key !== prevProps.data.module.key ||
        this.props.data.module.index !== prevProps.data.module.index
      )
    ) {
      let module = this.props.getModule(this.props.data.module.key, this.props.data.module.index)
      newState.module = module
    }
    const download = this.props.downloadData
    if (this.itemProgress && download) {
      if (this.itemProgress && download.progress === 100) {
        this.props.deleteSourceDownloadFile(this.props.data.id)
      }
      this.itemProgress.progress = download.progress / 100
    }
    const fileExist = await this.fileExist()
    if (this.state.exist !== fileExist) {
      newState.exist = fileExist
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState)
    }
  }

  fileExist = async () => {
    return await FileTools.fileIsExist(this.downloadingPath + '_')
  }

  _onPress = async () => {
    let mapData, data = this.props.data
    if (await this.fileExist()) {
      mapData = await RNFS.readFile(this.downloadingPath + '_', 'utf8')
      data = Object.assign({map: JSON.parse(mapData)}, this.props.data)
    }
    this.props.onPress(data)
  }

  _showMore = (event: any) => {
    this.props.showMore({
      data: this.props.data,
      event: event,
    })
  }

  _downloadFile = async () => {
    // if (this.state.exist) {
    if (await this.fileExist()) {
      await this.unZipFile()
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY)
      return
    }
    if (this.state.isDownloading) {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
      return
    }
    // let downloadData = this.getDownloadData(this.props.downloadData, this.props.data.id)
    // let downloadData = this.props.downloadData
    // if (downloadData && downloadData.progress < 100) {
    //   Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
    //   return
    // }
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
        .then(this._afterDownload)
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
              Toast.show(this.props.data.resource.resourceName + ' ' + getLanguage(global.language).Friends.RESOURCE_NOT_EXIST)
            } else {
              Toast.show(this.props.data.resource.resourceName + ' ' + getLanguage(global.language).Prompt.DOWNLOAD_FAILED)
            }
          })
        })
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
      FileTools.deleteFile(this.path)
      this.setState({
        isDownloading: false,
      })
    }
  }

  _afterDownload = async () => {
    try {
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
        Toast.show(getLanguage(global.language).Prompt.ONLINE_DATA_ERROR)
      } else {
        this.setState({
          isDownloading: false,
          exist: true,
          // mapData,
        })
      }
    } catch (error) {

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

  _checkAction = (value: boolean) => {
    this.props.checkAction && this.props.checkAction({value, data: this.props.data, download: this._downloadFile})
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
    // let downloadData = this.getDownloadData(this.props.downloadData, this.props.data.id)
    // let downloadData = this.props.downloadData
    // if (!downloadData || downloadData.downloaded) return null
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
          {/* {getLanguage(global.language).Friends.TASK_TITLE + ': ' + this.state.module.title} */}
          {getLanguage(global.language).Friends.TASK_TITLE + ': ' + this.props.data.resource.resourceName.replace('.zip', '')}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: size.fontSize.fontSizeMd,
            color: color.fontColorBlack,
          }}
        >
          {/* {getLanguage(global.language).Friends.TASK_MAP + ': ' + this.props.data.resource.resourceName.replace('.zip', '')} */}
          {getLanguage(global.language).Friends.TASK_MODULE + ': ' + this.state.module.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: size.fontSize.fontSizeSm,
            color: color.fontColorGray3,
          }}
        >
          {getLanguage(global.language).Friends.TASK_CREATE_TIME + ': ' + new Date(this.props.data.time).Format("yyyy-MM-dd hh:mm:ss")}
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
        <View
          style={styles.rowContainer}
        >
          {
            this.props.openCheckBox &&
            <CheckBox
              style={{
                marginLeft: scaleSize(20),
                marginRight: scaleSize(32),
                height: scaleSize(30),
                width: scaleSize(30),
              }}
              checked={this.props.checked}
              onChange={this._checkAction}
            />
          }
          <TouchableOpacity
            activeOpacity={1}
            onPress={this._onPress}
            style={{
              flex: 1,
              flexDirection: 'row',
              height: scaleSize(160),
              marginLeft: scaleSize(10),
              paddingVertical: scaleSize(24),
              alignItems: 'center',
            }}
          >
            <Image style={styles.itemImage} source={this.state.module.moduleImage} />
            <View
              style={{ flex: 1, flexDirection: 'column', marginLeft: scaleSize(40) }}
            >
              {this._renderContentView()}
            </View>
            {
              !this.state.exist && this._renderButton({
                image: getThemeAssets().cowork.icon_nav_import,
                title: this.state.progress,
                action: this._downloadFile,
              })
            }
            {
              // this.state.exist &&
              this._renderButton({
                image: getThemeAssets().publicAssets.icon_move,
                action: this._showMore,
                style: {marginLeft: scaleSize(24)},
              })
            }
          </TouchableOpacity>
        </View>
        {
          this.props.unread > 0 &&
          <RedDot style={{position: 'absolute', top: scaleSize(30), left: scaleSize(30)}} />
        }
        {this._renderProgress()}
        <ListSeparator color={color.colorEF} style={{marginLeft: scaleSize(150), marginRight: scaleSize(42)}} />
      </View>
    )
  }
}