import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, Animated, Easing } from 'react-native'
import styles from './styles'
import { scaleSize } from '../../utils'
import { Progress } from '../../components'
import RNFS from 'react-native-fs'
import { FileTools } from '../../native'
import ConstPath from '../../constants/ConstPath'
import UserType from '../../constants/UserType'
import { getLanguage } from '../../language'
import { getPublicAssets } from '../../assets'

export default class SampleMapItem extends Component {
  props: {
    data: Object,
    user: Object,
    moduleData: Object,
    downloadData: Object,
    style?: Object,
  
    downloadFile: () => {}
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
      downloaded: false,
      rotateValue: new Animated.Value(0),
    }

    this.unZipFile = this.unZipFile.bind(this)
  }

  componentDidMount() {
    (async function () {
      let fileCachePath = GLOBAL.homePath + ConstPath.CachePath
      let fileName = this.props.data.fileName.substr(0, this.props.data.fileName.lastIndexOf('.zip'))
      let fileName2 = ''
      if (fileName.endsWith('_示范数据')) {
        fileName2 = fileName.substr(0, fileName.lastIndexOf('_示范数据'))
      } else {
        fileName2 = fileName + '_示范数据'
      }
      if (
        await FileTools.fileIsExist(fileCachePath + fileName) ||
        await FileTools.fileIsExist(fileCachePath + fileName2)
      ) {
        this.setState({
          downloaded: true,
        })
      }
    }.bind(this)())
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    ) {
      return true
    }
    return false
  }
  
  // componentDidUpdate() {
  //   if (this.mProgress) {
  //     this.mProgress.progress = this.props.downloadData.progress / 100
  //   }
  // }
  
  spin = () => {
    this.state.rotateValue.setValue(0)
    const aniMotion = Animated.timing(this.state.rotateValue,{
      toValue: this.state.rotateValue._value === 0 ? 1 : 0,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    Animated.loop(aniMotion).start()
  }
  
  
  _downloadFile = async () => {
    if (this.state.isDownloading || this.state.downloaded) return
    try {
      if (typeof this.props.downloadFile === 'function') {
        let cachePath = GLOBAL.homePath + ConstPath.CachePath
        let toPath = GLOBAL.homePath + ConstPath.CachePath + this.props.data.fileName
        let defaultExample = {}, example = this.props.moduleData.example
        if (example) {
          if (example.checkUrl === undefined) {
            defaultExample.checkUrl =
              'https://www.supermapol.com/web/datas.json?currentPage=1&filterFields=%5B%22FILENAME%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&keywords='
          }
          if (example.nickname === undefined) {
            defaultExample.nickname = 'xiezhiyan123'
          }
          if (example.type === undefined) {
            defaultExample.type = 'zip'
          }
        }
        if (!this.state.isDownloading) {
          this.setState({
            isDownloading: true,
          })
        }
        this.spin()
        let fileName = this.props.data.fileName.replace('.zip', '')
        let result = await this.props.downloadFile({
          id: this.props.data.id,
          fileName: fileName,
          cachePath: cachePath,
          copyFilePath: toPath,
          // itemData: item,
          tmpCurrentUser: this.props.user.currentUser,
          url: this.props.data.url,
          ...example,
          ...defaultExample,
        })
  
        setTimeout(() => {
          this.setState({
            isDownloading: false,
            downloaded: !!result,
          })
        }, 1000)
      }
    } catch (e) {
      this.setState({
        isDownloading: false,
      })
    }
  }

  async unZipFile() {
    let appHome = await FileTools.appendingHomeDirectory()
    let userName =
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? 'Customer'
        : this.props.user.currentUser.userName
    let fileDir =
      appHome +
      ConstPath.UserPath +
      userName +
      '/' +
      ConstPath.RelativePath.ExternalData +
      this.titleName
    let exists = await RNFS.exists(fileDir)
    if (!exists) {
      await RNFS.mkdir(fileDir)
    }
    let result = await FileTools.unZipFile(this.path, fileDir)
    if (!result) {
      FileTools.deleteFile(this.path)
    }
    return result
  }
  
  // _renderDownloadButton = () => {
  //   // let size = (this.props.data.size / 1024 / 1024).toFixed(2) + ' MB'
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={1}
  //       style={styles.itemDownloadView}
  //       onPress={this._downloadFile}
  //     >
  //       {
  //         this.props.downloadData && this.state.isDownloading &&
  //         <Progress
  //           ref={ref => (this.mProgress = ref)}
  //           style={styles.progress}
  //           // progress={this.props.downloadData.progress / 100}
  //           height={scaleSize(44)}
  //         />
  //       }
  //       {/*<Text style={[styles.itemName, { marginLeft: scaleSize(22) }]}>{size}</Text>*/}
  //       <Image
  //         resizeMode={'contain'}
  //         source={require('../../assets/tabBar/find_download.png')}
  //         style={styles.itemDownload}
  //       />
  //     </TouchableOpacity>
  //   )
  // }
  //
  // _renderDownloadedButton = () => {
  //   return (
  //     <View
  //       style={[styles.itemDownloadView, styles.itemDownloadedView]}
  //     >
  //       <Text style={[styles.itemName, { marginHorizontal: scaleSize(22) }]}>
  //         {getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY}
  //       </Text>
  //     </View>
  //   )
  // }
  
  _renderDownload = () => {
    if (
      this.props.downloadData &&
      (
        this.props.downloadData.progress <= 100 || this.props.downloadData.progress >= 0
      )
    ) {
      return (
        <Animated.Image
          resizeMode={'contain'}
          style={[
            styles.downloadImg,
            {
              transform: [{rotate: this.state.rotateValue
                .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']})
              }]
            }
          ]}
          source={getPublicAssets().common.icon_downloading}
        />
      )
    } else {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={this._downloadFile}
        >
          <Image
            resizeMode={'cover'}
            source={
              this.state.downloaded
                ? getPublicAssets().common.icon_complete
                : getPublicAssets().common.icon_download
            }
            style={styles.downloadImg}
          />
        </TouchableOpacity>
      )
    }
  }
  
  render() {
    let titleName = ''
    if (this.props.data.fileName) {
      let index = this.props.data.fileName.lastIndexOf('.')
      titleName =
        index === -1
          ? this.props.data.fileName
          : this.props.data.fileName.substring(0, index)
    }
    let size = (this.props.data.size / 1024 / 1024).toFixed(2) + ' MB'
    return (
      <View style={[styles.itemView, this.props.style]}>
        <View style={styles.itemImageView}>
          <Image
            resizeMode={'cover'}
            source={{ uri: this.props.data.thumbnail }}
            style={styles.itemImage}
          />
        </View>
        <View style={styles.itemBottom}>
          <Text style={styles.itemName}>{titleName}</Text>
          <View style={styles.itemBottomContent}>
            <Text style={styles.sizeText}>{size}</Text>
            {this._renderDownload()}
          </View>
        </View>
      </View>
    )
  }
}
