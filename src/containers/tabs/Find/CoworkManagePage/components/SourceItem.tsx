/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import { Toast, scaleSize } from '../../../../../utils'
import { CheckBox, ListSeparator, Progress } from '../../../../../components'
import RNFS from 'react-native-fs'
import { FileTools } from '../../../../../native'
import { color, size } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
import { UserType, ConstPath } from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import { Users } from '../../../../../redux/models/user'
import DataHandler from '../../../Mine/DataHandler'
import { SOnlineService } from 'imobile_for_reactnative'

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    paddingRight: scaleSize(28),
    paddingLeft: scaleSize(30),
    paddingVertical: scaleSize(24),
    height: scaleSize(160),
    // backgroundColor: 'yellow',
    alignItems: 'center',
  },
  itemImage: {
    height: scaleSize(80),
    width: scaleSize(80),
  },
  contentView: {
    flex: 1,
    flexDirection: 'row',
  },
  contentSubView: {
    // flex: 1,
    flexDirection: 'column',
    marginLeft: scaleSize(40),
    // justifyContent: 'space-between',
  },
  restTitleTextStyle: {
    width: '100%',
    fontSize: size.fontSize.fontSizeXXl,
    fontWeight: 'bold',
    // color: 'white',
    textAlign: 'left',
    flexWrap: 'wrap',
    // marginRight: 100,
  },

  viewStyle2: {
    // width: '100%',
    // height: 20,
    flexDirection: 'row',
    // marginTop: 10,
    // marginRight: 100,
  },
  imageStyle2: {
    width: 20,
    height: 20,
  },
  textStyle2: {
    textAlign: 'left',
    // color: 'white',
    // lineHeight: 20,
    padding: 0,
    fontSize: size.fontSize.fontSizeLg,
    paddingLeft: 5,
  },
  separateViewStyle: {
    width: '100%',
    height: 2,
  },
})

interface State {
  // progress: number | string,
  exist: boolean,
  isDownloading: boolean,
  selectedData: Map<string, Object>, //被选中人员数组数组
}

interface Props {
  user: Users,
  // [name: string]: any,
  data: any,
  /** 打开CheckBox选择框 */
  openCheckBox?: boolean,
  /** CheckBox是否被选中 */
  checked?: boolean,
  checkAction?: (value: boolean) => void,
  onPress?: (item?: any) => void,
  /** 是否可以下载 */
  hasDownload?: boolean,
}

export default class SourceItem extends Component<Props, State> {

  path: string | undefined
  downloading: boolean
  downloadingPath: string
  titleName: string
  itemProgress: Progress | undefined | null

  static defaultProps = {
    hasDownload: true,
  }

  constructor(props: Props) {
    super(props)
    this.path = undefined
    this.downloading = false
    this.downloadingPath = ''
    this.titleName = ''
    if (this.props.data.resourceName) {
      let index = this.props.data.resourceName.lastIndexOf('.')
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
    this.path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.resourceName

    this.downloadingPath =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.resourceId

    let exist = await FileTools.fileIsExist(this.downloadingPath + '_')
    if (exist) {
      this.setState({
        exist: true,
        isDownloading: false,
      })
    }

    //检测是否下载完成
    exist = await FileTools.fileIsExist(this.downloadingPath)
    if (exist) {
      this.downloading = true
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

  _downloadFile = async () => {
    if (this.state.exist) {
      await this.unZipFile()
      Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY)
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
        Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOADING)
        return
      }
      this.setState({
        isDownloading: true,
      })
      RNFS.writeFile(this.downloadingPath, '0%', 'utf8')

      let dataId = this.props.data.resourceId
      let dataUrl =
        'https://www.supermapol.com/web/datas/' + dataId + '/download'
      const downloadOptions = {
        // Android 访问online私有数据，需要冲抵cookie
        ...Platform.select({
          android: {
            headers: {
              cookie: await SOnlineService.getAndroidSessionID(),
            },
          },
        }),
        fromUrl: dataUrl,
        toFile: this.path || '',
        background: true,
        progress: (res: any) => {
          let value = ~~res.progress.toFixed(0)
          if (this.itemProgress) {
            this.itemProgress.progress = value / 100
          }
        },
      }
      try {
        const ret = RNFS.downloadFile(downloadOptions)
        ret.promise
          .then(async () => {
            let { result, path } = await this.unZipFile()

            if (result) {
              let dataList = await DataHandler.getExternalData(path)
              let results = []
              for (let i = 0; i < dataList.length; i++) {
                results.push(
                  await DataHandler.importExternalData(this.props.user.currentUser, dataList[i]),
                )
              }
              result = results.some(value => value === true)
              FileTools.deleteFile(this.path)
            }

            if (result === false) {
              this.setState({
                isDownloading: false,
              })
              Toast.show(getLanguage(GLOBAL.language).Prompt.ONLINE_DATA_ERROR)
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
            Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_FAILED)
            FileTools.deleteFile(this.path)
            FileTools.deleteFile(this.downloadingPath + '_')
            this.setState({
              isDownloading: false,
            })
          })
      } catch (e) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.NETWORK_ERROR)
        FileTools.deleteFile(this.path)
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

  _onPress = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  _checkAction = (value: boolean) => {
    this.props.checkAction && this.props.checkAction(value)
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
    if (!this.props.hasDownload) return null
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
          onPress={() => {
            this._downloadFile()
          }}
        >
          <Image
            style={{ width: scaleSize(50), height: scaleSize(50), tintColor: color.fontColorGray }}
            source={getThemeAssets().cowork.icon_nav_import}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _renderContentView = () => {
    return (
      <View style={styles.contentSubView}>
        <Text
          style={[styles.restTitleTextStyle, { color: color.fontColorBlack }]}
          numberOfLines={2}
        >
          {this.props.data.resourceName.replace('.zip', '')}
        </Text>
        <View style={[styles.viewStyle2, {marginTop: scaleSize(20)}]}>
          <Image
            style={[styles.imageStyle2, { tintColor: color.fontColorGray }]}
            resizeMode={'contain'}
            source={require('../../../../../assets/tabBar/tab_user.png')}
          />
          <Text
            style={[styles.textStyle2, { color: color.fontColorGray }]}
            numberOfLines={1}
          >
            {this.props.data.nickname}
          </Text>
        </View>
        <View style={[styles.viewStyle2, {marginTop: scaleSize(15)}]}>
          <Image
            style={[styles.imageStyle2, { tintColor: color.fontColorGray }]}
            resizeMode={'contain'}
            source={require('../../../../../assets/tabBar/find_time.png')}
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
                marginLeft: scaleSize(15),
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
