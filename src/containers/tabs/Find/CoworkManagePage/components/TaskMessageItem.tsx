import React from 'react'
import { View, TouchableOpacity, Text, Image, Platform } from 'react-native'
import { Button } from '../../../../../components'
import { ConstPath, UserType } from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import { color } from '../../../../../styles'
import RNFS from 'react-native-fs'
import { Toast } from '../../../../../utils'
import DataHandler from '../../../Mine/DataHandler'
import { FileTools } from '../../../../../native'

import MessageItem from './MessageItem'
import styles from './styles'

interface Props {
  data: any,
  user: any,
  isSelf: boolean,
  onPress: (data: any) => void,
  addCoworkMsg: (data: any) => void,
}

export default class TaskMessageItem extends MessageItem {

  path: string | undefined
  exist: boolean
  downloading: boolean
  downloadingPath: string

  constructor(props: Props) {
    super(props)
    this.path = ''
    this.exist = false
    this.downloading = false
    this.downloadingPath = ''
    this.state = this._getData(props)
  }

  async componentDidMount() {
    this.path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.message.task.resourceName

    this.downloadingPath =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      this.props.data.id

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
  }

  _getData = (props: Props) => {
    let state = {}
    state = {
      // title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY_TITLE,
      content: [{
        title: getLanguage(GLOBAL.language).Friends.TASK_TITLE,
        value: props.data.message.task.resourceName.replace('.zip', ''),
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_CREATOR,
        value: props.data.message.task.nickname,
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_TYPE,
        value: props.data.message.task.sourceSubtype,
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_MODULE,
        value: props.data.message.module.title,
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_SEND_TIME,
        value: new Date(props.data.time).Format("yyyy-MM-dd hh:mm:ss"),
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_UPDATE_TIME,
        value: new Date(props.data.message.task.updateTime).Format("yyyy-MM-dd hh:mm:ss"),
      }],
      isSelf: props.isSelf,
      data: props.data,
      progress: '',
    }
    return state
  }

  _onPress = () => {
    this.props.onPress(this.props.data)
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

      let dataId = this.props.data.message.task.resourceId
      // let dataId = 1037429552
      let dataUrl =
        'https://www.supermapol.com/web/datas/' + dataId + '/download'

      const downloadOptions = {
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
              progress: getLanguage(GLOBAL.language).Prompt.IMPORTING,
              isDownloading: false,
            })
            let { result, path } = await this.unZipFile()

            let results: any[] = []
            if (result) {
              let dataList = await DataHandler.getExternalData(path)
              
              for (let i = 0; i < dataList.length; i++) {
                let importResult = await DataHandler.importWorkspace(dataList[i])
                if (importResult.length > 0) {
                  results = results.concat(importResult)
                }
              }
              // result = results.some(value => value === true)
              FileTools.deleteFile(this.path)
            }

            if (results.length > 0) {
              let mapName = results[0]
              let mapPath = `${ConstPath.UserPath + this.props.user.currentUser.userName}/${ConstPath.RelativePath.Map + mapName}.xml`
              let mapExist = await FileTools.fileIsExistInHomeDirectory(
                mapPath,
              )
              if (mapExist) {
                let _data = Object.assign({}, this.props.data)
                _data.message.map = {
                  name: mapName,
                  path: mapPath
                }
                this.props.addCoworkMsg(_data)
              }
            }

            this.setState({
              progress: getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY, 
              isDownloading: false,
            })  

            // if (result === false) {
            if (result.length === 0) {
              Toast.show(getLanguage(GLOBAL.language).Prompt.ONLINE_DATA_ERROR)
            } else {
              this.exist = true
            }
            FileTools.deleteFile(this.downloadingPath)
            RNFS.writeFile(this.downloadingPath + '_', '100%', 'utf8')
          })
          .catch((e) => {
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

  _renderButtons = () => {
    if (this.state.isSelf) {
      if (this.props.data.checkStatus === 'WAITING') {
        return (
          <View style={styles.buttons}>
            <Button style={styles.button} title={getLanguage(GLOBAL.language).Friends.GROUP_APPLY_DISAGREE} onPress={this._disAgreeAction} />
            <Button style={[styles.button, {marginLeft: 20}]} title={getLanguage(GLOBAL.language).Friends.GROUP_APPLY_AGREE} onPress={this._agreeAction} />
          </View>
        )
      } else {
        return (
          <Button
            disabled={true}
            style={styles.button}
            title={
              this.props.data.checkStatus === 'ACCEPTED'
                ? getLanguage(GLOBAL.language).Friends.GROUP_APPLY_ALREADY_AGREE
                : getLanguage(GLOBAL.language).Friends.GROUP_APPLY_ALREADY_DISAGREE
            }
          />
        )
      }
    } else {
      return null
    }
  }

  _renderDownload = () => {
    return (
      <View
        style={{
          width: 100,
          // height: '100%',
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
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this._onPress}
        style={styles.rowContainer}
      >
        <View
          style={{flex: 1, flexDirection: 'column'}}
        >
          {
            this.state.title &&
            <Text style={styles.title}>{this.state.title}</Text>
          }
          {this._renderContentView()}
          {this._renderButtons()}
        </View>
        {this._renderDownload()}
      </TouchableOpacity>
    )
  }
}


