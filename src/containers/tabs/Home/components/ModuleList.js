import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  NetInfo,
  ScrollView,
  Platform,
} from 'react-native'
import { ConstPath, ChunkType } from '../../../../constants'
import { scaleSize, Toast, FetchUtils } from '../../../../utils'
import { color } from '../../../../styles'
import { FileTools } from '../../../../native'
import { SMap } from 'imobile_for_reactnative'
import { downloadFile, deleteDownloadFile, setIgnoreDownload } from '../../../../redux/models/down'
import { setOldMapModule } from '../../../../redux/models/appConfig'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'

import { connect } from 'react-redux'
import { getLanguage } from '../../../../language'
import ModuleItem, { itemWidth_P, itemWidth_L, itemGap } from './ModuleItem'

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
    ignoreDownloads: Array,
    mapModules: Object,
    oldMapModules: Array,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    downloadFile: () => {},
    deleteDownloadFile: () => {},
    setCurrentMapModule: () => {},
    setOldMapModule: () => {},
    setIgnoreDownload: () => {},
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
          // ref.getDialogCheck(),
          this.props.ignoreDownloads.indexOf(downloadData.key) >= 0,
        )
      setTimeout(() => {
        this.props.showDialog && this.props.showDialog(true)
      }, 1500)
    }.bind(this)())
  }

  _downloadModuleData = async (ref, downloadData) => {
    ref.setDownloading(true)
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
    // 若不需要下次再提醒，则记录到redux
    dialogCheck && downloadData && this.props.setIgnoreDownload({ id: downloadData.key })
    this.props.showDialog && this.props.showDialog(false)
  }

  cancelDown = (ref, downloadData, dialogCheck) => {
    // let item = downloadData.itemData
    ref.setNewState({
      disabled: false,
      dialogCheck: dialogCheck,
    })
    // 若不需要下次再提醒，则记录到redux
    dialogCheck && downloadData && this.props.setIgnoreDownload({ id: downloadData.key })
    this.props.showDialog && this.props.showDialog(false)
  }

  getDownloadData = (language, item, index) => {
    let module = this.props.mapModules.modules[index]
    let example = module.example
    if (!example) return null
    let moduleKey = item.key
    let fileName = module.getExampleName(language).name

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

      let currentDownloadData = this.getCurrentDownloadData(downloadData)

      let cachePath = this.homePath + ConstPath.CachePath
      let fileDirPath = cachePath + downloadData.fileName
      let arrFile = await FileTools.getFilterFiles(fileDirPath)
      if (arrFile.length === 0) {
        if (
          downloadData.fileName &&
          this.props.ignoreDownloads.filter(_item => _item.id === downloadData.key).length === 0 &&
          (!currentDownloadData || currentDownloadData && currentDownloadData.downloaded === undefined)
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
    if (!downloadData) return null
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
        key={item.key}
        item={item}
        showStar={item.key === ChunkType.MAP_AR}
        style={item.key === ChunkType.MAP_AR && {
          width: (
            this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? itemWidth_L : itemWidth_P
          ) * 2 + itemGap,
          backgroundColor: color.itemColorGray3,
        }}
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
  
  /** 获取竖屏数据 **/
  _renderPortraitRows = data => {
    let _list = [], _row = [], column = 2
    let arIndex = -1
    for (let index = 0; index < data.length; index++) {
      if (data[index].key === ChunkType.MAP_AR) arIndex = index
      let itemView = this._renderItem({item: data[index], index})
      if (index === arIndex) {
        _list.push(itemView)
      } else {
        _row.push(itemView)
        if (_row.length === column) {
          let row = <View style={styles.row}>{_row}</View>
          _list.push(row)
          _row = []
        } else if (index === data.length - 1) {
          _list.push(itemView)
        }
      }
    }
    return _list
  }
  
  /** 获取横屏数据 **/
  _renderLandscapeColumns = data => {
    let _list = [], _column = [], row = 2
    let _subRow = []
    let arIndex = -1
    for (let index = 0; index < data.length; index++) {
      if (data[index].key === ChunkType.MAP_AR) arIndex = index
      let itemView = this._renderItem({item: data[index], index})
      if (arIndex >= 0 && ((index === arIndex + 1) || (index === arIndex + 2))) {
        _subRow.push(itemView)
        if (_subRow.length === row) {
          let rowView = <View style={styles.row}>{_subRow}</View>
          _column.push(rowView)
        } else if (index === data.length - 1) {
          _column.push(_subRow)
        }
      } else {
        _column.push(itemView)
      }
      if (_column.length === row) {
        let column = <View style={styles.column}>{_column}</View>
        _list.push(column)
        _column = []
      } else if (index === data.length - 1) {
        _list.push(itemView)
      }
    }
    return _list
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
    return (
      <View style={[
        styles.container,
        { marginTop: scaleSize(20) },
        this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
          paddingBottom: Platform.isPad ? scaleSize(64) : 0,
          marginTop: Platform.isPad ? scaleSize(20) : 0
        }
      ]}>
        {this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? (
          <View style={{ width: '100%' }}>
            <ScrollView
              horizontal={true}
              keyboardShouldPersistTaps={'always'}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {this._renderLandscapeColumns(data)}
            </ScrollView>
          </View>
        ) : (
          <ScrollView
            style={{ width: '100%' }}
            keyboardShouldPersistTaps={'always'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {this._renderPortraitRows(data)}
          </ScrollView>
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  downloads: state.down.toJS().downloads,
  ignoreDownloads: state.down.toJS().ignoreDownloads,
})
const mapDispatchToProps = {
  downloadFile,
  deleteDownloadFile,
  setCurrentMapModule,
  setOldMapModule,
  setIgnoreDownload,
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
  flatListView: {
    height: scaleSize(224),
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
})
