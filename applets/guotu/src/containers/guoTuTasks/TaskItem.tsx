/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet, Platform, GestureResponderEvent } from 'react-native'
import { Toast, scaleSize, OnlineServicesUtils } from '@/utils'
import { CheckBox, ListSeparator, Progress } from '@/components'
import { FileTools } from '@/native'
import { RNFS  } from 'imobile_for_reactnative'
import { color, size } from '@/styles'
import { getThemeAssets } from '@/assets'
import { UserType, ConstPath } from '@/constants'
import { getLanguage } from '@/language'
import { Users } from '@/redux/models/user'
import DataHandler from '@/utils/DataHandler'
import { Download, IDownloadProps } from '@/redux/models/down'
import { ResourceType } from '@/containers/tabs/Find/CoworkManagePage/types'
import DataImport from '@/utils/DataHandler/DataImport'

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    paddingRight: scaleSize(28),
    paddingLeft: scaleSize(30),
    paddingVertical: scaleSize(24),
    height: scaleSize(160),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    height: scaleSize(80),
    width: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentSubView: {
    flexDirection: 'column',
    marginLeft: scaleSize(40),
    width: '100%',
  },
  restTitleTextStyle: {
    width: '80%',
    fontSize: size.fontSize.fontSizeXXl,
    fontWeight: 'bold',
    textAlign: 'left',
    flexWrap: 'wrap',
    color: color.fontColorBlack,
  },

  viewStyle2: {
    flexDirection: 'row',
  },
  imageStyle2: {
    width: 20,
    height: 20,
  },
  textStyle2: {
    textAlign: 'left',
    padding: 0,
    fontSize: size.fontSize.fontSizeLg,
    paddingLeft: 5,
  },
  separateViewStyle: {
    width: '100%',
    height: 2,
  },
})

export interface MoreParams {
  event: GestureResponderEvent,
  data: ResourceType,
  download: () => Promise<void>,
}

interface State {
  // progress: number | string,
  exist: boolean,
  isDownloading: boolean,
  selectedData: Map<string, any>,
}

interface Props {
  user: Users,
  // [name: string]: any,
  data: ResourceType,
  /** 打开CheckBox选择框 */
  openCheckBox?: boolean,
  /** CheckBox是否被选中 */
  checked?: boolean,
  checkAction?: (checkParams: {value: boolean, data: ResourceType, download: () => Promise<void>}) => void,
  onChecked?: (checkParams: {value: boolean, data: ResourceType, download: () => Promise<void>}) => void,
  onMoreAction?: (data: MoreParams) => void,
  onPress?: (item?: {
    path: string,
    name: string,
    data: any,
  }) => void,
  /** 是否可以下载 */
  // hasDownload?: boolean,
  // downloadData: Download[],
  downloadData: Download,
  downloadSourceFile: (params: IDownloadProps) => Promise<any[]>,
  deleteSourceDownloadFile: (id: number | string) => Promise<any[]>,
}

export default class TaskItem extends Component<Props, State> {

  path: string | undefined
  mapPath: string
  downloading: boolean
  downloadingPath: string
  titleName: string
  itemProgress: Progress | undefined | null

  static defaultProps = {
    // hasDownload: true,
  }

  constructor(props: Props) {
    super(props)
    this.path = undefined
    this.downloading = false
    this.downloadingPath = ''
    this.titleName = ''
    this.mapPath = ''
    if (this.props.data.resourceName) {
      const index = this.props.data.resourceName.lastIndexOf('.')
      this.titleName =
        index === -1
          ? this.props.data.resourceName
          : this.props.data.resourceName.substring(0, index)
    }
    this.state = {
      exist: false,
      isDownloading: false,
      selectedData: new Map(),
    }
  }

  async componentDidMount() {
    this.mapPath =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Map +
      this.props.data.resourceName.replace('.zip', '.xml')
    this.path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.UserData +
      this.props.data.resourceName

    this.downloadingPath =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.UserData +
      this.props.data.resourceId

    let exist = await FileTools.fileIsExist(this.downloadingPath + '_')
    if (exist) {
      this.setState({
        exist: true,
        isDownloading: false,
      })
    } else {
      //检测是否下载完成
      exist = await FileTools.fileIsExist(this.downloadingPath)
      if (exist) {
        this.downloading = true
        const timer = setInterval(async () => {
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
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.checked !== this.props.checked && typeof this.props.onChecked === 'function') {
      this.props.onChecked({value: !!this.props.checked, data: this.props.data, download: this._downloadFile})
    }
    const download = this.props.downloadData
    if (this.itemProgress && download) {
      if (download.progress === 100) {
        this.props.deleteSourceDownloadFile(this.props.data.resourceId)
      }
      this.itemProgress.progress = download.progress / 100
    }
  }

  _downloadFile = async () => {
    if (this.state.exist) {
      // 判断地图文件是否导入
      const exist = await FileTools.fileIsExist(this.mapPath)
      if (!exist) {
        await this.unZipFile()
      }
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY)
      return
    }
    if (
      this.props.user &&
      this.props.user.currentUser &&
      (this.props.user.currentUser.userType === UserType.PROBATION_USER ||
        (this.props.user.currentUser.userName &&
          this.props.user.currentUser.userName !== ''))
    ) {
      if (this.state.isDownloading) {
        Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
        return
      }
      this.setState({
        isDownloading: true,
      })
      RNFS.writeFile(this.downloadingPath, '0%', 'utf8')

      const dataId = this.props.data.resourceId
      let dataUrl, onlineServicesUtils
      if (UserType.isIPortalUser(this.props.user.currentUser)) {
        let url = this.props.user.currentUser.serverUrl || ''
        if (url.indexOf('http') !== 0) {
          url = 'http://' + url
        }
        dataUrl = `${url}/datas/${dataId}/download`
        onlineServicesUtils = new OnlineServicesUtils('iportal')
      } else {
        dataUrl = 'https://www.supermapol.com/web/datas/' + dataId + '/download'
        onlineServicesUtils = new OnlineServicesUtils('online')
      }
      const downloadOptions = {
        key: dataId,
        // Android 访问online私有数据，需要冲抵cookie
        ...Platform.select({
          android: {
            headers: {
              cookie: await onlineServicesUtils.getCookie(),
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
        // },
      }
      try {
        this.props.downloadSourceFile(downloadOptions)
          .then(async () => {
            let result, path
            if (this.path?.indexOf('.zip', this.path?.length - '.zip'.length) !== -1) {
              const zipResult = await this.unZipFile()
              result = zipResult.result
              path = zipResult.path

              if (result) {
                const dataList = await DataHandler.getExternalData(path)
                for (const dataItem of dataList) {
                  const _result = await DataImport.importWorkspace(dataItem)
                  if (_result instanceof Array && _result.length > 0) {
                    this.mapPath = (await FileTools.getHomeDirectory()) +
                      ConstPath.UserPath +
                      this.props.user.currentUser.userName +
                      '/' +
                      ConstPath.RelativePath.Map + _result[0] + '.xml'
                  }
                }
                this.path && FileTools.deleteFile(this.path)
              }
            } else {
              result = true // 非zip压缩包
            }

            if (!this.mapPath) {
              this.setState({
                isDownloading: false,
              })
              Toast.show(getLanguage(global.language).Prompt.ONLINE_DATA_ERROR)
            } else {
              this.setState({
                exist: true,
                isDownloading: false,
              })
            }
            FileTools.deleteFile(this.downloadingPath)
            RNFS.writeFile(this.downloadingPath + '_', '100%', 'utf8')
          })
          .catch(() => {
            Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_FAILED)
            this.path && FileTools.deleteFile(this.path)
            FileTools.deleteFile(this.downloadingPath + '_')
            this.setState({
              isDownloading: false,
            })
          })
      } catch (e) {
        Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
        this.path && FileTools.deleteFile(this.path)
        this.setState({
          isDownloading: false,
        })
      }
    } else {
      Toast.show('登录后可下载')
    }
  }

  unZipFile = async () => {
    if (!this.path) {
      return {
        result: false,
        path: '',
      }
    }
    const index = this.path.lastIndexOf('.')
    const fileDir = this.path.substring(0, index)
    const exists = await RNFS.exists(fileDir)
    if (!exists) {
      await RNFS.mkdir(fileDir)
    }
    const result = await FileTools.unZipFile(this.path, fileDir)
    if (!result) {
      FileTools.deleteFile(this.path)
    }
    return {
      result,
      path: fileDir,
    }
  }

  _onPress = () => {
    if (this.state.exist) {
      const mapName = this.mapPath.substring(this.mapPath.lastIndexOf("/") + 1, this.mapPath.lastIndexOf("."))
      this.props.onPress && this.props.onPress({
        path: this.mapPath,
        name: mapName,
        data: this.props.data,
      })
    } else {
      Toast.show('请先下载任务')
    }
  }

  _checkAction = (value: boolean) => {
    this.props.checkAction && this.props.checkAction({value, data: this.props.data, download: this._downloadFile})
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

  _renderDownload = () => {
    if (!this.props.onMoreAction) return null
    return (
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            // width: 50,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'yellow',
          }}
          onPress={event => {
            this.props.onMoreAction?.({event, data: this.props.data, download: this._downloadFile})
          }}
        >
          <Image
            style={{ width: scaleSize(50), height: scaleSize(50), tintColor: color.fontColorGray }}
            // source={getThemeAssets().cowork.icon_nav_import}
            source={getThemeAssets().publicAssets.icon_move}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _renderContentView = () => {
    let name = ''
    if (this.props.data.description) {
      const description = JSON.parse(this.props.data.description)
      name = description?.executor
    }
    return (
      <View style={styles.contentSubView}>
        <Text
          style={styles.restTitleTextStyle}
          numberOfLines={1}
        >
          {this.props.data.resourceName.replace('.zip', '')}
        </Text>
        <View style={[styles.viewStyle2, {marginTop: scaleSize(20)}]}>
          <Image
            style={[styles.imageStyle2, { tintColor: color.fontColorGray }]}
            resizeMode={'contain'}
            source={require('@/assets/tabBar/tab_user.png')}
          />
          <Text
            style={[styles.textStyle2, { color: color.fontColorGray }]}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
        <View style={[styles.viewStyle2, {marginTop: scaleSize(15)}]}>
          <Image
            style={[styles.imageStyle2, { tintColor: color.fontColorGray }]}
            resizeMode={'contain'}
            source={require('@/assets/tabBar/find_time.png')}
          />
          <Text
            style={[styles.textStyle2, { color: color.fontColorGray }]}
            numberOfLines={1}
          >
            {new Date(this.props.data.updateTime).Format("yyyy-MM-dd hh:mm:ss")}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        <View style={styles.rowContainer}>
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
            style={styles.contentView}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.itemImage}
              // source={{ uri: this.props.data.thumbnail }}
              source={getThemeAssets().cowork.icon_img_zip}
            />
            {this._renderContentView()}
          </TouchableOpacity>
          {this._renderDownload()}
        </View>
        {this._renderProgress()}
        <ListSeparator color={color.itemColorGray2} style={{marginLeft: scaleSize(150), marginRight: scaleSize(42)}} />
      </View>
    )
  }
}
