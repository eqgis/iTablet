import React, { Component } from 'react'
import { View, StyleSheet, ScrollView ,  PermissionsAndroid ,NativeModules ,Platform, Permission} from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import { ConstPath, ChunkType } from '../../../../constants'
import { scaleSize, Toast, FetchUtils } from '../../../../utils'
import { Module } from '../../../../class'
import { color } from '../../../../styles'
import { FileTools } from '../../../../native'
import { SMap ,SARMap, SLocation, SData } from 'imobile_for_reactnative'
import {
  downloadFile,
  deleteDownloadFile,
  setIgnoreDownload,
  setSampleDataShow,
} from '../../../../redux/models/down'
import { setOldMapModule } from '../../../../redux/models/appConfig'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { AppletAdd } from '../../../../customModule/mapModules'
import DataHandler from '../../../../utils/DataHandler'

import { connect } from 'react-redux'
import { getLanguage } from '../../../../language'
import ModuleItem from './ModuleItem'
import SizeUtil from '../SizeUtil'
import { addNetworkChangeEventListener } from '@/utils/NetworkHandler'
import { requestAllPermission } from '@/utils/PermissionAndroidUtils'
const AppUtils = NativeModules.AppUtils

async function composeWaiting(action) {
  if (global.clickWait) return
  global.clickWait = true
  if (action && typeof action === 'function') {
    await action()
  }
  setTimeout(() => (global.clickWait = false), 2000)
}

const STAR_MODULE = ChunkType.MAP_AR_MAPPING

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
    laboratory: Object,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    downloadFile: () => {},
    deleteDownloadFile: () => {},
    setCurrentMapModule: () => {},
    setOldMapModule: () => {},
    setIgnoreDownload: () => {},
    setSampleDataShow: () => {},
    itemAction: () =>{},
  }

  constructor(props) {
    super(props)
    this.state = {
      isShowProgressView: false,
      data: this.getData(),
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

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.mapModules) !==
        JSON.stringify(this.props.mapModules) ||
      JSON.stringify(prevProps.language) !== JSON.stringify(this.props.language)
    ) {
      this.setState({
        data: this.getData(),
      })
    }
  }

  getData = () => {
    const data = []
    const modules = this.props.mapModules.modules[this.props.currentUser.userName] || []
    for (const item of modules) {
      if (item && item.getChunk) {
        data.push(item.getChunk(this.props.language))
      } else {
        continue
      }
    }
    if (
      (data.length > 0 && data[data.length - 1].key !== AppletAdd.key) ||
      data.length === 0
    ) {
      data.push(new AppletAdd().getChunk(this.props.language))
    }

    //市场不允许出现添加小插件，在审核期间把标去掉 add xiezhy
    // if(global.isAudit){
    //   data.splice(data.length-1, 1)
    // }
    return data
  }

  _showAlert = (ref, downloadData, currentUserName) => {
    (async function() {
      if (!downloadData.example || downloadData.example.length === 0) return
      const item = downloadData.example[0] // 默认下载第一个EXAMPLE
      const keyword = item.name.endsWith('_EXAMPLE')
        ? item.name
        : item.name + '_EXAMPLE'
      const isConnected = (await NetInfo.fetch()).isConnected // 检测网络，有网的时候再去检查数据
      if (!isConnected) return
      if (!downloadData.url) {
        const result = await FetchUtils.getDataInfoByUrl(
          downloadData,
          keyword,
          '.zip',
        )
        // TODO 测试模块下载
        const downloadInfo = result.content[0]
        item.size = downloadInfo.size
        item.url = downloadInfo.url
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
      // this.props.showDialog && this.props.showDialog(true)
      this.props.setSampleDataShow(true)
    }.bind(this)())
  }

  _downloadModuleData = async (ref, downloadData) => {
    ref.setDownloading(true)
    const cachePath = downloadData.cachePath
    const item = downloadData.example[0] // 默认下载第一个EXAMPLE
    const fileDirPath =
      cachePath +
      (item.name.endsWith('_EXAMPLE') ? item.name : item.name + '_EXAMPLE')
    try {
      const fileCachePath = fileDirPath + '.zip'
      const downloadOptions = {
        // fromUrl: dataUrl,
        fromUrl: item.url,
        toFile: fileCachePath,
        background: true,
        fileName: item.name,
        progressDivider: 1,
        key: downloadData.key,
        module: global.Type,
      }
      this.props
        .downloadFile(downloadOptions)
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, cachePath)
          const tempData = await DataHandler.getExternalData(fileDirPath) || []
          if (downloadData.itemData.mapType === Module.MapType.SCENE || downloadData.itemData.mapType === Module.MapType.AR) {
            await DataHandler.importWorkspace3D(tempData[0])
          } else if (downloadData.itemData.mapType === Module.MapType.MAP) {
            await DataHandler.importWorkspace(tempData[0])
          }
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
    dialogCheck &&
      downloadData &&
      this.props.setIgnoreDownload({ id: downloadData.key })
    this.props.showDialog && this.props.showDialog(false)
  }

  cancelDown = (ref, downloadData, dialogCheck) => {
    // let item = downloadData.itemData
    ref.setNewState({
      disabled: false,
      dialogCheck: dialogCheck,
    })
    // 若不需要下次再提醒，则记录到redux
    dialogCheck &&
      downloadData &&
      this.props.setIgnoreDownload({ id: downloadData.key })
    this.props.showDialog && this.props.showDialog(false)
  }

  getDownloadData = (language, item, index) => {
    const modules = this.props.mapModules.modules[this.props.currentUser.userName] || []
    if (index > modules.length - 1) return {}
    const module = modules[index]
    // let example = module.example
    const example = module?.getExampleName?.(language)
    if (!example || example.length === 0) return {}
    const moduleKey = item.key

    const tmpCurrentUser = this.props.currentUser

    // let toPath = this.homePath + ConstPath.CachePath + fileName

    const cachePath = this.homePath + ConstPath.CachePath
    const defaultExample = {}
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
      cachePath: cachePath,
      itemData: item,
      tmpCurrentUser: tmpCurrentUser,
      example,
      defaultExample,
    }
  }

  /**
   * 检测数据在online上是否存在
   * @param index
   * @returns {Promise.<*>}
   */
  checkData = async index => {
    let moduleKey
    const module = this.props.mapModules.modules[this.props.currentUser.userName][index]
    const examples =
      module &&
      module.getExampleName &&
      module.getExampleName(this.props.language)
    if (!examples || examples.length === 0) return ''
    let fileName = examples[0].name
    if (!fileName.endsWith('_EXAMPLE')) fileName += '_EXAMPLE'
    const result = await FetchUtils.getDataInfoByUrl(
      {
        nickname: 'xiezhiyan123',
      },
      fileName,
      '.zip',
    )
    if (result.content.length > 0) {
      for (const _item of result.content) {
        const _itemFileName = _item.fileName.replace('.zip', '')
        if (_itemFileName === fileName) {
          moduleKey = _item.id
          break
        }
      }
    }
    return moduleKey
  }


  itemAction = async (language, { item, index }) => {
    try {
      if (Platform.OS === 'android') {
        //申请 android权限
        const permisson11 = await requestAllPermission()
        if (permisson11) {
          await SData.setPermission(true)
          addNetworkChangeEventListener()
          // 重新设置权限后，重新打开定位
          await SLocation.openGPS()

        } else {
          this.props.itemAction()
          item.key !== ChunkType.APPLET_ADD && item.spin && item.spin(false) // 停止转圈
          return
        }
      }

      if (item.key === ChunkType.MAP_AR_MAPPING || item.key === ChunkType.MAP_AR || item.key === ChunkType.MAP_AR_ANALYSIS) {
        const isSupportedARCore = await SARMap.isSupportAR()
        if (isSupportedARCore != 1) {
          global.ARServiceAction = isSupportedARCore
          global.ARDeviceListDialog.setVisible(true)
          return
        }
      }

      item.key !== ChunkType.APPLET_ADD && item.spin && item.spin(true)
      const tmpCurrentUser = this.props.currentUser
      const currentUserName = tmpCurrentUser.userName
        ? tmpCurrentUser.userName
        : 'Customer'

      let latestMap
      if (
        this.props.latestMap[currentUserName] &&
        this.props.latestMap[currentUserName][item.key] &&
        this.props.latestMap[currentUserName][item.key].length > 0
      ) {
        latestMap = this.props.latestMap[currentUserName][item.key][0]
      }

      // let licenseStatus = await SData.getEnvironmentStatus()
      // global.isLicenseValid = licenseStatus.isLicenseValid
      // if (!global.isLicenseValid) {
      //   this.props.setCurrentMapModule(index).then(async () => {
      //     item.action && (await item.action(tmpCurrentUser, latestMap))
      //     item.key !== ChunkType.APPLET_ADD && item.spin && item.spin(false) // 停止转圈
      //   })
      //   return
      // }

      const downloadData = this.getDownloadData(language, item, index)

      // let moduleKey = await this.checkData(index)
      // if (moduleKey) {
      //   downloadData.key = moduleKey
      // } else {
      //   downloadData = {}
      // }

      const currentDownloadData = this.getCurrentDownloadData(downloadData)

      const cachePath = this.homePath + ConstPath.CachePath
      let arrFile = []
      if (downloadData && downloadData.example) {
        for (let i = 0; i < downloadData.example.length; i++) {
          let fileDirPath = cachePath + downloadData.example[i].name
          if (!fileDirPath.endsWith('_EXAMPLE')) {
            fileDirPath += '_EXAMPLE'
          }
          let tempArr = []
          tempArr = await FileTools.getFilterFiles(fileDirPath)
          if (tempArr.length > 0) {
            arrFile = arrFile.concat(tempArr)
          }
        }
      }
      if (arrFile.length === 0) {
        this.props.setCurrentMapModule(index).then(async() => {
          const result = item.action && await item.action(tmpCurrentUser, latestMap)
          item.key !== ChunkType.APPLET_ADD && item.spin && item.spin(false) // 停止转圈
          if (
            result &&
            downloadData.example &&
            downloadData.example.length > 0 &&
            this.props.ignoreDownloads.filter(
              _item => _item.id === downloadData.key,
            ).length === 0 &&
            (
              !currentDownloadData ||
              (currentDownloadData && currentDownloadData.downloaded === undefined)
            )
          ) {
            this._showAlert(this.moduleItems[index], downloadData, tmpCurrentUser)
          }
        })
      } else {
        let filePath2
        const filePath = arrFile[0].filePath
        const fileType = filePath.substr(filePath.lastIndexOf('.')).toLowerCase()
        const fileName = filePath.substring(
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
          const maps = await SMap._getMapsByFile(filePath)
          const mapName = maps[0]
          filePath2 =
            this.homePath +
            ConstPath.UserPath +
            currentUserName +
            '/Data/Map/' +
            mapName +
            '.xml'
        }
        const isExist = await FileTools.fileIsExist(filePath2)
        if (!isExist) {
          await this.props.importWorkspace(filePath)
        }
        this.moduleItems[index] &&
          this.moduleItems[index].setNewState({
            disabled: false,
            isShowProgressView: false,
          })
        await this.props.setCurrentMapModule(index)
        item.action && (await item.action(tmpCurrentUser, latestMap))
        item.key !== ChunkType.APPLET_ADD && item.spin && item.spin(false) // 停止转圈
      }
    } catch (e) {
      this.moduleItems[index] &&
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
    if (!downloadData || !downloadData.key) return null
    if (this.props.downloads.length > 0) {
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (
          this.props.downloads[i].id &&
          (this.props.downloads[i].id === downloadData.key ||
            this.props.downloads[i].params.module === downloadData.key)
        ) {
          return this.props.downloads[i]
        }
      }
    }
    return null
  }

  _renderItem = ({ item, index }) => {
    const downloadData = this.getDownloadData(global.language, item, index)
    return (
      <ModuleItem
        key={item.key}
        item={item}
        // showStar={index === 0}
        showStar={item.key === STAR_MODULE}
        style={
          item.key === STAR_MODULE && {
            width:
              SizeUtil.getItemWidth(
                this.props.device.orientation,
                global.isPad,
              ) *
                2 +
              SizeUtil.getItemGap(),
            backgroundColor: color.itemColorGray3,
          }
        }
        device={this.props.device}
        isNew={
          this.props.oldMapModules.indexOf(item.key) < 0 &&
          item.key !== ChunkType.APPLET_ADD
        }
        isBeta={
          //市场不允许出现beta标志，在审核期间把标去掉 add xiezhy
          //去掉beta标识吧，一年了，继续加油！！！
          /*!global.isAudit*/ false && (
            item.key === ChunkType.MAP_AR ||
          item.key === ChunkType.MAP_AR_MAPPING ||
          item.key === ChunkType.MAP_AR_ANALYSIS)
        }
        downloadData={this.getCurrentDownloadData(downloadData)}
        ref={ref => this.getRef({ item, index }, ref)}
        showDialog={this.props.showDialog}
        getModuleItem={this.props.getModuleItem}
        setOldMapModule={this.props.setOldMapModule}
        itemAction={async _item => {
          await composeWaiting(async () => {
            // InteractionManager.runAfterInteractions(async () => {
            _item.key !== ChunkType.APPLET_ADD &&
              this.props.setOldMapModule &&
              this.props.setOldMapModule(_item.key)
            this.itemAction(this.props.language, { item: _item, index })
            // })
          })
        }}
      />
    )
  }

  /** 获取竖屏数据 **/
  _renderPortraitRows = () => {
    const data = this.state.data
    const width =
      SizeUtil.getItemWidth(this.props.device.orientation, global.isPad) * 2 +
      SizeUtil.getItemGap() * 2
    const rowStyle = [styles.row, { width }]
    let _list = [],
      _row = [],
      column = 2
    let arIndex = -1
    for (let index = 0; index < data.length; index++) {
      if (data[index].key === STAR_MODULE) arIndex = index
      const itemView = this._renderItem({ item: data[index], index })
      if (index === arIndex) {
        const row = (
          <View key={'r_' + index} style={rowStyle}>
            {itemView}
          </View>
        )
        _list.push(row)
      } else {
        _row.push(itemView)
        if (_row.length === column) {
          const row = (
            <View key={'r_' + index} style={rowStyle}>
              {_row}
            </View>
          )
          _list.push(row)
          _row = []
        } else if (index === data.length - 1) {
          const row = (
            <View key={'r_' + index} style={rowStyle}>
              {itemView}
            </View>
          )
          _list.push(row)
        }
      }
    }
    return _list
  }

  /** 获取横屏数据 **/
  _renderLandscapeColumns = () => {
    const data = this.state.data
    const height =
      SizeUtil.getItemHeight(this.props.device.orientation, global.isPad) * 2 +
      SizeUtil.getItemGap() * 2
    const columnStyle = [styles.column, { height }]
    let _list = [],
      _column = [],
      row = 2
    const _subRow = []
    let arIndex = -1
    for (let index = 0; index < data.length; index++) {
      if (data[index].key === STAR_MODULE) arIndex = index
      const itemView = this._renderItem({ item: data[index], index })
      if (arIndex >= 0 && (index === arIndex + 1 || index === arIndex + 2)) {
        _subRow.push(itemView)
        if (_subRow.length === row) {
          const rowView = (
            <View key={'c_r_' + index} style={styles.row}>
              {_subRow}
            </View>
          )
          _column.push(rowView)
        } else if (index === data.length - 1) {
          _column.push(_subRow)
        }
      } else {
        _column.push(itemView)
      }
      if (_column.length === row) {
        const column = (
          <View key={'c_' + index} style={columnStyle}>
            {_column}
          </View>
        )
        _list.push(column)
        _column = []
      } else if (index === data.length - 1) {
        const column = (
          <View key={'c_' + index} style={columnStyle}>
            {itemView}
          </View>
        )
        _list.push(column)
      }
    }
    return _list
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? {
              paddingLeft: global.isPad ? scaleSize(88) : scaleSize(28),
            }
            : { marginTop: scaleSize(20) },
        ]}
      >
        {this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? (
          <View style={{ width: '100%' }}>
            <ScrollView
              style={{ height: '100%' }}
              horizontal={true}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps={'always'}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {this._renderLandscapeColumns()}
            </ScrollView>
          </View>
        ) : (
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps={'always'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {this._renderPortraitRows()}
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
  laboratory: state.setting.toJS().laboratory,
})
const mapDispatchToProps = {
  downloadFile,
  deleteDownloadFile,
  setCurrentMapModule,
  setOldMapModule,
  setIgnoreDownload,
  setSampleDataShow,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModuleList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  flatListView: {
    height: scaleSize(224),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
})