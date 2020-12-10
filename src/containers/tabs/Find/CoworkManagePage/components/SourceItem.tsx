/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import { Toast, scaleSize } from '../../../../../utils'
import { CheckBox } from '../../../../../components'
import RNFS from 'react-native-fs'
import { FileTools } from '../../../../../native'
import { color } from '../../../../../styles'
import { UserType, ConstPath } from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import { Users } from '../../../../../redux/models/user'
import DataHandler from '../../../Mine/DataHandler'

export const itemHeight = 140
export const imageWidth = 90
export const imageHeight = 90
const smallFontSize = 12
const largeFontSize = 18
const paddingLeft = 15
const styles = StyleSheet.create({
  itemViewStyle: {
    width: '100%',
    height: itemHeight,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: color.image_bg_white,
  },
  contentView: {
    flex: 1,
    flexDirection: 'row',
  },
  restTitleTextStyle: {
    width: '100%',
    fontSize: largeFontSize,
    fontWeight: 'bold',
    // color: 'white',
    paddingLeft,
    textAlign: 'left',
    flexWrap: 'wrap',
    marginRight: 100,
  },

  viewStyle2: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    paddingLeft,
    marginTop: 10,
    marginRight: 100,
  },
  imageStyle2: {
    width: 20,
    height: 20,
  },
  textStyle2: {
    textAlign: 'left',
    // color: 'white',
    lineHeight: 20,
    fontSize: smallFontSize,
    paddingLeft: 5,
  },
  separateViewStyle: {
    width: '100%',
    height: 2,
  },
})

interface State {
  progress: number | string,
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
  exist: boolean
  downloading: boolean
  downloadingPath: string
  titleName: string

  static defaultProps = {
    hasDownload: true,
  }

  constructor(props: Props) {
    super(props)
    this.path = undefined
    this.exist = false
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
      progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD,
      // '下载',
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

    this.exist = false
    let exist = await FileTools.fileIsExist(this.downloadingPath + '_')
    if (exist) {
      this.exist = true
      this.setState({
        progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY,
        //'下载完成',
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
          this.exist = true
          this.setState({
            progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY,
            //'下载完成',
            isDownloading: false,
          })
        } else {
          let result = await RNFS.readFile(this.downloadingPath)
          this.setState({
            progress: result,
            //'下载完成',
            isDownloading: true,
          })
        }
      }, 2000)
      this.setState({
        progress: getLanguage(GLOBAL.language).Prompt.DOWNLOADING,
        //'下载完成',
        isDownloading: true,
      })
    }

    // this.titleName = ''
    // if (this.props.data.fileName) {
    //   let index = this.props.data.fileName.lastIndexOf('.')
    //   this.titleName =
    //     index === -1
    //       ? this.props.data.fileName
    //       : this.props.data.fileName.substring(0, index)
    // }
  }
  
  _downloadFile = async () => {
    if (this.exist) {
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
        //'正在下载...')
        return
      }
      this.setState({
        progress: getLanguage(GLOBAL.language).Prompt.DOWNLOADING,
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
              cookie: GLOBAL.cookie,
            }
          },
        }),
        fromUrl: dataUrl,
        toFile: this.path || '',
        background: true,
        progress: (res: any) => {
          let value = ~~res.progress.toFixed(0)
          let progress = value + '%'
          if (this.state.progress !== progress) {
            this.setState({ progress })
          }
          RNFS.writeFile(this.downloadingPath, progress, 'utf8')
        },
      }
      try {
        const ret = RNFS.downloadFile(downloadOptions)
        ret.promise
          .then(async () => {
            this.setState({
              progress: getLanguage(GLOBAL.language).Prompt
                .DOWNLOAD_SUCCESSFULLY,
              //'下载完成',
              isDownloading: false,
            })
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
              Toast.show(getLanguage(GLOBAL.language).Prompt.ONLINE_DATA_ERROR)
            } else {
              this.exist = true
            }
            FileTools.deleteFile(this.downloadingPath)
            RNFS.writeFile(this.downloadingPath + '_', '100%', 'utf8')
          })
          .catch(() => {
            Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_FAILED)
            FileTools.deleteFile(this.path)
            FileTools.deleteFile(this.downloadingPath + '_')
            this.setState({ progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD, isDownloading: false })
          })
      } catch (e) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.NETWORK_ERROR)
        FileTools.deleteFile(this.path)
        this.setState({ progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD, isDownloading: false })
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

  _renderDownload = () => {
    if (!this.props.hasDownload) return null
    return (
      <View
        style={{
          width: 100,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
            style={{ width: 35, height: 35, tintColor: color.fontColorGray }}
            source={require('../../../../../assets/tabBar/find_download.png')}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 12,
            textAlign: 'center',
            width: 125,
            color: color.fontColorGray,
          }}
          numberOfLines={1}
        >
          {this.state.progress}
        </Text>
      </View>
    )
  }
  
  render() {
    let fontColor = color.fontColorGray
    let titleFontColor = color.fontColorBlack
    return (
      <View>
        <View style={styles.itemViewStyle}>
          {
            this.props.openCheckBox &&
            <CheckBox
              style={{
                marginLeft: scaleSize(32),
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
              style={styles.imageStyle}
              source={{ uri: this.props.data.thumbnail }}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={[styles.restTitleTextStyle, { color: titleFontColor }]}
                numberOfLines={2}
              >
                {this.props.data.resourceName}
              </Text>
              <View style={styles.viewStyle2}>
                <Image
                  style={[styles.imageStyle2, { tintColor: fontColor }]}
                  resizeMode={'contain'}
                  source={require('../../../../../assets/tabBar/tab_user.png')}
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
                  source={require('../../../../../assets/tabBar/find_time.png')}
                />
                <Text
                  style={[styles.textStyle2, { color: fontColor }]}
                  numberOfLines={1}
                >
                  {new Date(this.props.data.updateTime).Format("yyyy-MM-dd hh:mm:ss")}
                </Text>
              </View>
            </View>

          </TouchableOpacity>
          {this._renderDownload()}
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
