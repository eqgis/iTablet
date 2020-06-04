import React, { Component } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  NetInfo,
  // NativeModules,
  // PermissionsAndroid,
} from 'react-native'
import { ConstPath, ChunkType } from '../../../../constants'
import { fixedSize, screen } from '../../../../utils'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import FetchUtils from '../../../../utils/FetchUtils'
import { SMap } from 'imobile_for_reactnative'
import { downloadFile, deleteDownloadFile } from '../../../../redux/models/down'
import { setOldMapModule } from '../../../../redux/models/appConfig'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'

import { connect } from 'react-redux'
import { getLanguage } from '../../../../language'
import ModuleItem from './ModuleItem'
import { TAB_BAR_HEIGHT_P } from '../../TabBar'
// let AppUtils = NativeModules.AppUtils

let isWaiting = false // 防止重复点击

async function composeWaiting(action) {
  if (isWaiting) return
  isWaiting = true
  if (action && typeof action === 'function') {
    await action()
  }
  isWaiting = false
}

class ModuleList extends Component {
  props: {
    language: string,
    device: Object,
    currentUser: Object,
    latestMap: Object,
    downloads: Array,
    mapModules: Object,
    oldMapModules: Array,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    downloadFile: () => {},
    deleteDownloadFile: () => {},
    setCurrentMapModule: () => {},
    setOldMapModule: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isShowProgressView: false,
    }
    this.moduleItems = []
  }

  async componentDidMount() {
    this.homePath = await FileTools.appendingHomeDirectory()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    )
  }

  _showAlert = (ref, downloadData, currentUserName) => {
    (async function() {
      // TODO 获取
      let keyword
      if (downloadData.fileName.indexOf('_示范数据') !== -1) {
        keyword = downloadData.fileName
      } else {
        keyword = downloadData.fileName + '_示范数据'
      }
      let isConnected = await NetInfo.isConnected.fetch() // 检测网络，有网的时候再去检查数据
      if (!isConnected) return
      if (!downloadData.url) {
        let downloadInfo = await FetchUtils.getDataInfoByUrl(
          downloadData,
          keyword,
          '.zip',
        )
        downloadData.size = downloadInfo.size
        downloadData.url = downloadInfo.url
      }

      this.props.getModuleItem &&
        this.props.getModuleItem(
          ref,
          this.sureDown,
          this.cancelDown,
          downloadData,
          currentUserName,
          ref.getDialogCheck(),
        )
      setTimeout(() => {
        this.props.showDialog && this.props.showDialog(true)
      }, 1500)
    }.bind(this)())
  }

  _downloadModuleData = async (ref, downloadData) => {
    ref.setDownloading(true)
    // let keyword
    // if (downloadData.fileName.indexOf('_示范数据') !== -1) {
    //   keyword = downloadData.fileName
    // } else {
    //   keyword = downloadData.fileName + '_示范数据'
    // }
    // let dataUrl = await FetchUtils.getFindUserDataUrl(
    //   'xiezhiyan123',
    //   keyword,
    //   '.zip',
    // )
    let cachePath = downloadData.cachePath
    let fileDirPath = cachePath + downloadData.fileName
    try {
      let fileCachePath = fileDirPath + '.zip'
      let downloadOptions = {
        // fromUrl: dataUrl,
        fromUrl: downloadData.url,
        toFile: fileCachePath,
        background: true,
        fileName: downloadData.fileName,
        progressDivider: 1,
        key: downloadData.key,
      }
      this.props
        .downloadFile(downloadOptions)
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, cachePath)
          let arrFile = await FileTools.getFilterFiles(fileDirPath)
          await this.props.importWorkspace(
            arrFile[0].filePath,
            // downloadData.copyFilePath,
          )
          FileTools.deleteFile(fileDirPath + '_')
          FileTools.deleteFile(fileDirPath + '.zip')
          this.props.deleteDownloadFile({ id: downloadData.key })
          ref.setDownloading(false)
        })
        .catch(() => {
          Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
          FileTools.deleteFile(fileCachePath)
          this.props.deleteDownloadFile({ id: downloadData.key })
        })
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
      //'网络错误，下载失败')
      FileTools.deleteFile(fileDirPath + '.zip')
      ref.setNewState({ isShowProgressView: false, disabled: false })
      ref.setDownloading(false)
    }
  }

  sureDown = (ref, downloadData, dialogCheck) => {
    // 判断是否在下载
    if (this.getCurrentDownloadData(downloadData)) {
      return
    }
    this._downloadModuleData(ref, downloadData)
    ref.setNewState({
      disabled: false,
      dialogCheck: dialogCheck,
    })
    this.props.showDialog && this.props.showDialog(false)
  }

  cancelDown = (ref, dialogCheck) => {
    // let item = downloadData.itemData
    ref.setNewState({
      disabled: false,
      dialogCheck: dialogCheck,
    })
    // item.action && item.action(downloadData.tmpCurrentUser)
    this.props.showDialog && this.props.showDialog(false)
  }

  getDownloadData = (language, item, index) => {
    let example = this.props.mapModules.modules[index].example
    let moduleKey = item.key
    let getNameFromConfig = function(example) {
      if (example) {
        if (example.name) {
          return example.name
        }
        if (language === 'CN' && example.name_cn) {
          return example.name_cn
        } else if (example.name_en) {
          return example.name_en
        }
        if (Platform.OS === 'ios' && example.name_ios) {
          return example.name_ios
        } else if (Platform.OS === 'android' && example.name_android) {
          return example.name_android
        }
      }
      return ''
    }
    let fileName = getNameFromConfig(example)

    let tmpCurrentUser = this.props.currentUser

    let toPath = this.homePath + ConstPath.CachePath + fileName

    let cachePath = this.homePath + ConstPath.CachePath
    let defaultExample = {}
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
    return {
      key: moduleKey,
      fileName: fileName,
      cachePath: cachePath,
      copyFilePath: toPath,
      itemData: item,
      tmpCurrentUser: tmpCurrentUser,
      ...example,
      ...defaultExample,
    }
  }

  itemAction = async (language, { item, index }) => {
    try {
      let tmpCurrentUser = this.props.currentUser
      let currentUserName = tmpCurrentUser.userName
        ? tmpCurrentUser.userName
        : 'Customer'

      let module = item.key
      let latestMap
      if (
        this.props.latestMap[currentUserName] &&
        this.props.latestMap[currentUserName][module] &&
        this.props.latestMap[currentUserName][module].length > 0
      ) {
        latestMap = this.props.latestMap[currentUserName][module][0]
      }

      let licenseStatus = await SMap.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
      if (!global.isLicenseValid) {
        this.props.setCurrentMapModule(index).then(() => {
          item.action && composeWaiting(item.action(tmpCurrentUser, latestMap))
        })
        return
      }

      if (item.key === ChunkType.MAP_AR) {
        this.props.setCurrentMapModule(index).then(() => {
          item.action && composeWaiting(item.action(tmpCurrentUser, latestMap))
        })
        return
      }

      let downloadData = this.getDownloadData(language, item, index)

      // let keyword
      // if (downloadData.fileName.indexOf('_示范数据') !== -1) {
      //   keyword = downloadData.fileName
      // } else {
      //   keyword = downloadData.fileName + '_示范数据'
      // }
      // let isConnected = await NetInfo.isConnected.fetch() // 检测网络，有网的时候再去检查数据
      // if (isConnected && !downloadData.url) {
      //   let downloadInfo = await FetchUtils.getDataInfoByUrl(
      //     downloadData,
      //     keyword,
      //     '.zip',
      //   )
      //   downloadData.size = downloadInfo.size
      //   downloadData.url = downloadInfo.url
      // }
      let currentDownloadData = this.getCurrentDownloadData(downloadData)
      // let toPath = this.homePath + ConstPath.CachePath + downloadData.fileName

      let cachePath = this.homePath + ConstPath.CachePath
      let fileDirPath = cachePath + downloadData.fileName
      let arrFile = await FileTools.getFilterFiles(fileDirPath)
      if (arrFile.length === 0) {
        if (
          downloadData.fileName &&
          !(
            this.moduleItems &&
            this.moduleItems[index] &&
            (this.moduleItems[index].getDialogCheck() ||
              this.moduleItems[index].getDownloading())
          ) &&
          !currentDownloadData
        ) {
          this._showAlert(this.moduleItems[index], downloadData, tmpCurrentUser)
        }
        this.props.setCurrentMapModule(index).then(() => {
          item.action && composeWaiting(item.action(tmpCurrentUser, latestMap))
        })
      } else {
        let filePath2
        let filePath = arrFile[0].filePath
        let fileType = filePath.substr(filePath.lastIndexOf('.')).toLowerCase()
        let fileName = filePath.substring(
          filePath.lastIndexOf('/') + 1,
          filePath.lastIndexOf('.'),
        )
        if (fileType === '.sxwu') {
          filePath2 =
            this.homePath +
            ConstPath.UserPath +
            currentUserName +
            '/Data/Scene/' +
            fileName +
            '.pxp'
        } else {
          let maps = await SMap.getMapsByFile(filePath)
          let mapName = maps[0]
          filePath2 =
            this.homePath +
            ConstPath.UserPath +
            currentUserName +
            '/Data/Map/' +
            mapName +
            '.xml'
        }
        let isExist = await FileTools.fileIsExist(filePath2)
        if (!isExist) {
          // await this.props.importWorkspace(filePath, toPath, true)
          await this.props.importWorkspace(filePath)
        }
        this.moduleItems[index].setNewState({
          disabled: false,
          isShowProgressView: false,
        })
        await this.props.setCurrentMapModule(index)
        item.action &&
          (await composeWaiting(item.action(tmpCurrentUser, latestMap)))
      }
    } catch (e) {
      this.moduleItems[index].setNewState({
        disabled: false,
        isShowProgressView: false,
      })
    }
  }

  getRef = (data, ref) => {
    this.moduleItems[data.index] = ref
  }

  getCurrentDownloadData = downloadData => {
    if (this.props.downloads.length > 0) {
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (this.props.downloads[i].id === downloadData.key) {
          return this.props.downloads[i]
        }
      }
    }
    return null
  }

  _renderItem = ({ item, index }) => {
    let downloadData = this.getDownloadData(global.language, item, index)
    return (
      <ModuleItem
        item={item}
        device={this.props.device}
        oldMapModules={this.props.oldMapModules}
        downloadData={this.getCurrentDownloadData(downloadData)}
        ref={ref => this.getRef({ item, index }, ref)}
        importWorkspace={this.props.importWorkspace}
        showDialog={this.props.showDialog}
        getModuleItem={this.props.getModuleItem}
        setOldMapModule={this.props.setOldMapModule}
        itemAction={async _item => {
          await this.itemAction(this.props.language, { item: _item, index })
          ;(await this.props.setOldMapModule) &&
            this.props.setOldMapModule(_item.key)
        }}
      />
    )
  }

  render() {
    let data = []
    for (let item of this.props.mapModules.modules) {
      if (item && item.getChunk) {
        data.push(item.getChunk(this.props.language))
      } else {
        data = []
        break
      }
    }
    //模块个数为单数时高度处理
    let heightNum = data.length % 2 === 0 ? data.length : data.length + 1
    let height = (fixedSize(220) * heightNum) / 2
    let windowHeight
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      windowHeight = Math.min(screen.getScreenHeight(), screen.getScreenWidth())
    } else {
      windowHeight = Math.max(screen.getScreenHeight(), screen.getScreenWidth())
    }
    let contentH = windowHeight - screen.getHeaderHeight() - TAB_BAR_HEIGHT_P
    let scrollEnabled = false
    if (height >= contentH) {
      height = contentH
      scrollEnabled = true
    }
    let spaceHeight =
      (windowHeight - fixedSize(157) * 2 - screen.getHeaderHeight()) / 3 -
      fixedSize(70)
    if (spaceHeight < 0) {
      spaceHeight = 0
    }
    return (
      <View style={styles.container}>
        {this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? (
          <View style={{ width: '100%' }}>
            <FlatList
              key={'landscapeList'}
              data={data}
              ItemSeparatorComponent={() => {
                return <View style={{ height: spaceHeight }} />
              }}
              contentContainerStyle={{
                justifyContent: 'center',
              }}
              downloads={this.props.downloads}
              renderItem={this._renderItem}
              numColumns={4}
              keyboardShouldPersistTaps={'always'}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={{ width: '100%', height: height }}>
            <FlatList
              key={'list'}
              style={styles.flatList}
              data={data}
              renderItem={this._renderItem}
              scrollEnabled={scrollEnabled}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}
            />
          </View>
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  downloads: state.down.toJS().downloads,
})
const mapDispatchToProps = {
  downloadFile,
  deleteDownloadFile,
  setCurrentMapModule,
  setOldMapModule,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModuleList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  flatList: {
    alignSelf: 'center',
    flex: 1,
  },
  flatListView: {
    height: fixedSize(220),
  },
})
