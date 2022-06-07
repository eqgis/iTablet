import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Container, PopMenu } from '../../../../components'
import { SOnlineService, SIPortalService,RNFS } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import { color } from '../../../../styles'
import { UserType, ConstPath } from '../../../../constants'
import { getLanguage } from '../../../../language/index'
import LocalDataItem from './LocalDataItem'
import { getOnlineData } from './Method'
import LocalDtaHeader from './LocalDataHeader'
import OnlineDataItem from './OnlineDataItem'
import { scaleSize, FetchUtils, OnlineServicesUtils } from '../../../../utils'
import DataHandler from '../../../../utils/DataHandler'
import NavigationService from '../../../NavigationService'
import Directory from './Directory'
// import { downloadFile } from '../../../../native/RNFS'
let JSIPortalService, JSOnlineservice

export default class MyLocalData extends Component {
  props: {
    language: string,
    user: Object,
    navigation: Object,
    down: Object,
    importItem: Object,
    device: Object,
    setImportItem: () => {},
    importPlotLib: () => {},
    importWorkspace: () => {},
    importSceneWorkspace: () => {},
    updateDownList: () => {},
    removeItemOfDownList: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      sectionData: [],
      userName: this.props.route.params.userName,
      isRefreshing: false,
      activityShow: false,
      itemInfo: {},
    }
    this.pageSize = 100
    this.dataListTotal = null
    this.currentPage = 1
    this.deleteDataing = false
    this.itemInfo = {}
    JSIPortalService = new OnlineServicesUtils('iportal')
    JSOnlineservice = new OnlineServicesUtils('online')
    this.totalPage = 0

    // 文件夹数组，主要存放文件夹数组索引
    this.directoryArray = [] 
    // 存放最终构造成的外部数据的对象
    this.externalDataObj = {}

    // 给删除文件夹的方法绑定this
    this.directoryOnpress = this.directoryOnpress.bind(this)
    this.directoryItemOnPress = this.directoryItemOnPress.bind(this)
  }
  componentDidMount() {
    this.getData()
    if (Platform.OS === 'android') {
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        SOnlineService.getAndroidSessionID().then(cookie => {
          this.cookie = cookie
        })
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        SIPortalService.getIPortalCookie().then(cookie => {
          this.cookie = cookie
        })
      }
    }
  }

  getData = async (str = '') => {
    try {
      let loadText = getLanguage(this.props.language).Prompt.LOADING
      if(str === 'del'){
        loadText =  getLanguage(this.props.language).Prompt.DELETING_DATA
      }
      this.container.setLoading(
        true,
        loadText,
      )
      let sectionData = []
      let cacheData = []
      let userData = []
      let externalData = []
      let onlineData = []
      let homePath = global.homePath
      let cachePath = homePath + ConstPath.CachePath2
      let externalPath =
        homePath +
        ConstPath.ExternalData
      let userPath = await FileTools.appendingHomeDirectory(
        `${ConstPath.UserPath + this.props.user.currentUser.userName}/${
          ConstPath.RelativePath.UserData
        }`,
      )

      let cachePromise = DataHandler.getExternalData(cachePath)
      let externalPromise = DataHandler.getExternalData(externalPath)
      let userPromise = DataHandler.getExternalData(userPath)
      this.currentPage = 1
      let onlineDataPromise = getOnlineData(
        this.props.user.currentUser,
        this.currentPage,
        this.pageSize,
        ['WORKSPACE', 'UDB', 'COLORSCHEME', 'FILLSYMBOL', 'LINESYMBOL', 'MARKERSYMBOL'],
        result => {
          this.dataListTotal = result
        },
      )
      let result = await new Promise.all([
        cachePromise,
        userPromise,
        externalPromise,
        onlineDataPromise,
      ])
      cacheData = result[0]
      userData = result[1]
      externalData = result[2]
      onlineData = result[3]
      if (cacheData.length > 0) {
        sectionData.push({
          title: getLanguage(global.language).Profile.SAMPLEDATA,
          data: cacheData,
          isShowItem: true,
          dataType: 'cache',
        })
      }
      if (userData.length > 0) {
        sectionData.push({
          title: getLanguage(global.language).Profile.USER_DATA,
          data: userData,
          isShowItem: true,
          dataType: 'user',
        })
      }
      if (externalData.length > 0) {
        // 重新构造外部数据
        // 先清空一下文件夹数组,刷新的时候需要将文件夹数组的值清空
        this.directoryArray = []
        // 调用构造外部数据新对象的方法
        this.externalDataObj = await this.createExternalData(externalData)
        sectionData.push({
          title: getLanguage(global.language).Profile.ON_DEVICE,
          // data: externalData,
          data: this.externalDataObj.children,
          isShowItem: true,
          dataType: 'external',
        })
      }
      this.totalPage = onlineData.totalPage
      if (onlineData.content.length > 0) {
        sectionData.push({
          title: getLanguage(global.language).Profile.ONLINE_DATA,
          data: onlineData.content,
          isShowItem: true,
          dataType: 'online',
        })
      }
      this.setState({ sectionData })
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
    }
  }

  changeHearShowItem = title => {
    let sectionData = [...this.state.sectionData]
    for (let i = 0; i < sectionData.length; i++) {
      let data = sectionData[i]
      if (data.title === title) {
        data.isShowItem = !data.isShowItem
      }
    }
    this.setState({ sectionData: sectionData })
  }

  itemOnpress = (info, event) => {
    this.itemInfo = info
    this.LocalDataPopupModal &&
      this.LocalDataPopupModal.setVisible(true, {
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      })
  }

  onlineItemOnPress = (item = {}, event) => {
    this.itemInfo = item
    this.LocalDataPopupModal &&
      this.LocalDataPopupModal.setVisible(true, {
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      })
  }

  _renderSectionHeader = info => {
    // if (
    //   info.section.dataType === 'online' &&
    //   ((this.state.sectionData.length === 2 &&
    //     this.state.sectionData[0].dataType === 'external') ||
    //     this.state.sectionData.length === 3)
    // ) {
    //   return <View />
    // }
    return (
      <LocalDtaHeader
        info={info}
        changeHearShowItem={this.changeHearShowItem}
      />
    )
  }

  _renderItem = info => {
    if (info.section.dataType === 'online') {
      if (info.section.isShowItem) {
        return (
          <OnlineDataItem
            user={this.props.user}
            item={info.item}
            itemOnPress={this.onlineItemOnPress}
            down={this.props.down}
            updateDownList={this.props.updateDownList}
            index={info.index}
            removeItemOfDownList={this.props.removeItemOfDownList}
          />
        )
      } else {
        return null
      }
    } else if(info.section.dataType === 'external'){
      return this.renderExternalData(info.item, info.section)

    }else {
      return (
        <LocalDataItem
          info={info}
          itemOnpress={this.itemOnpress}
          isImporting={
            this.props.importItem !== '' &&
            JSON.stringify(info.item) ===
              JSON.stringify(this.props.importItem.item)
          }
        />
      )
    }
  }

  _keyExtractor = (section, index) => {
    return 'id:' + index
  }

  _closeModal = () => {
    this.LocalDataPopupModal && this.LocalDataPopupModal.setVisible(false)
  }

  _onDeleteData = async (str = '') => {
    try {
      this._closeModal()
      if (
        this.props.importItem !== '' &&
        JSON.stringify(this.itemInfo.item) ===
          JSON.stringify(this.props.importItem.item)
      ) {
        Toast.show(getLanguage(global.language).Prompt.DATA_BEING_IMPORT)
        return
      }
      this.setLoading(
        true,
        //'删除数据中...'
        getLanguage(this.props.language).Prompt.DELETING_DATA,
      )
      
      let exportDir =
        global.homePath +
        ConstPath.ExternalData

      let delDirs = []
      if (this.itemInfo.item.fileType === 'plotting') {
        delDirs = this.itemInfo.item.relatedFiles
      } else if (
        //todo 关联所有二三维工作空间的文件，直接删除关联文件而不是文件夹
        (this.itemInfo.item.fileType === 'workspace' ||
          this.itemInfo.item.fileType === 'workspace3d') &&
        this.itemInfo.item.directory !== exportDir
      ) {
        delDirs = [this.itemInfo.item.directory]
      } else {
        delDirs = [this.itemInfo.item.filePath]
        if (
          this.itemInfo.item.relatedFiles !== undefined &&
          this.itemInfo.item.relatedFiles.length !== 0
        ) {
          delDirs = delDirs.concat(this.itemInfo.item.relatedFiles)
        }
      }

      let result
      for (let i = 0; i < delDirs.length; i++) {
        if (await FileTools.fileIsExist(delDirs[i])) {
          result = await FileTools.deleteFile(delDirs[i])
          if (!result) {
            break
          }
        }
      }

      if (result || result === undefined) {
        
        if (await FileTools.fileIsExist(this.itemInfo.item.directory)) {
          let contents = await FileTools.getDirectoryContent(
            this.itemInfo.item.directory,
          )
          if (contents.length === 0) {
            await FileTools.deleteFile(this.itemInfo.item.directory)
          }
        }
        let sectionData = [...this.state.sectionData]
        for (let i = 0; i < sectionData.length; i++) {
          let data = sectionData[i]
          if (data.title === this.itemInfo.section.title) {
            if(this.itemInfo.section.title === getLanguage(global.language).Profile.ON_DEVICE){
              // 当是外部数据的时候的处理方式
              data.data[this.directoryIndex - 1]?.children.splice(this.itemInfo.index, 1)
              // 删除数据之后，检查文件夹是否应该删除
              if( data.data[this.directoryIndex - 1].children.length === 0){
                this.directoryArray.splice(this.directoryIndex, 1)
                data.data.splice(this.directoryIndex - 1, 1)
              }
            } else {
              data.data.splice(this.itemInfo.index, 1)
            }
          }
        }
        this.setState({ sectionData: sectionData }, () => {
          this.LocalDataPopupModal && this.LocalDataPopupModal.setVisible(false)
        })
        if(str != 'directory'){
          Toast.show(
            //'删除成功'
            getLanguage(this.props.language).Prompt.DELETED_SUCCESS,
          )
        }
        
      } else {
        Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_DELETE)
      }
    } catch (e) {
      Toast.show(
        //'删除失败')
        getLanguage(this.props.language).Prompt.FAILED_TO_DELETE,
      )
      this._closeModal()
    } finally {
      if(str != 'directory'){
        this.setLoading(false)
      }
    }
  }

  _onImportExternalData = async item => {
    try {
      this.onImportStart()
      let user = this.props.user.currentUser
      let result = await DataHandler.importExternalData(user, item)
      Toast.show(
        result
          ? getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS
          : getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT,
      )
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
    } finally {
      this.onImportEnd()
    }
  }

  _onImportDataset = async type => {
    let importDataset = async (datasourceItem, importParams = {}) => {
      try {
        this.onImportStart()
        let result = await DataHandler.importDataset(
          type,
          this.itemInfo.item.filePath,
          datasourceItem,
          importParams,
        )
        Toast.show(
          result
            ? getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS
            : getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT,
        )
      } catch (error) {
        Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
      } finally {
        this.onImportEnd()
      }
    }

    NavigationService.navigate('MyDatasource', {
      title: getLanguage(this.props.language).Profile.DATA,
      getItemCallback: async ({ item }) => {
        NavigationService.goBack()
        if (type === 'tif' || type === 'img') {
          global.SimpleDialog.set({
            text: getLanguage(global.language).Profile.IMPORT_BUILD_PYRAMID,
            confirmText: getLanguage(global.language).Prompt.YES,
            cancelText: getLanguage(global.language).Prompt.NO,
            confirmAction: async () => {
              try {
                global.Loading.setLoading(
                  true,
                  getLanguage(global.language).Prompt.IMPORTING,
                )
                await importDataset(item, { buildPyramid: true })
                global.Loading.setLoading(false)
              } catch (error) {
                global.Loading.setLoading(false)
              }
            },
            cancelAction: () => {
              importDataset(item)
            },
          })
          global.SimpleDialog.setVisible(true)
        } else {
          importDataset(item)
        }
      },
    })
  }

  onImportStart = () => {
    this.props.setImportItem(this.itemInfo)
  }

  onImportEnd = () => {
    this.props.setImportItem('')
  }

  importData = async () => {
    this._closeModal()
    if (this.props.importItem !== '') {
      Toast.show(getLanguage(global.language).Prompt.IMPORTING_DATA)
      return
    }
    if (this.itemInfo && this.itemInfo.id) {
      this._onImportOnlineData()
    } else {
      let fileType = this.itemInfo.item.fileType
      if (
        fileType === 'plotting' ||
        fileType === 'workspace' ||
        fileType === 'workspace3d' ||
        fileType === 'datasource' ||
        fileType === 'sci' ||
        fileType === 'color' ||
        fileType === 'symbol' ||
        fileType === 'aimodel' ||
        fileType === 'armap' ||
        fileType === 'armodel' ||
        fileType === 'areffect' ||
        fileType === 'sandtable' ||
        fileType === 'xml_template'
      ) {
        this._onImportExternalData(this.itemInfo.item)
      } else if (
        fileType === 'tif' ||
        fileType === 'shp' ||
        fileType === 'mif' ||
        fileType === 'kml' ||
        fileType === 'kmz' ||
        fileType === 'dwg' ||
        fileType === 'dxf' ||
        fileType === 'gpx' ||
        fileType === 'img'
      ) {
        this._onImportDataset(fileType)
      } else {
        Toast.show('暂不支持此数据的导入')
      }
    }
  }

  _onImportOnlineData = async () => {
    try {
      let currentUser = this.props.user.currentUser
      let down = this.props.down
      let itemInfo = this.itemInfo
      if (down.length > 0) {
        for (let index = 0; index < down.length; index++) {
          const element = down[index]
          if (
            element.id &&
            itemInfo.id === element.id &&
            element.progress > 0
          ) {
            Toast.show(getLanguage(global.language).Prompt.IMPORTING_DATA)
            return
          }
        }
      }
      let temPath = await FileTools.appendingHomeDirectory(
        `${ConstPath.UserPath + currentUser.userName}/${
          ConstPath.RelativePath.Temp
        }`,
      )
      let filePath = temPath + itemInfo.fileName
      let url
      if (UserType.isOnlineUser(currentUser)) {
        url = 'https://www.supermapol.com/web'
      } else if (UserType.isIPortalUser(currentUser)) {
        url = currentUser.serverUrl
        if (url.indexOf('http') !== 0) {
          url = 'http://' + url
        }
      }
      let dataUrl = `${url}/datas/${itemInfo.id}/download`
      let headers = {}
      if (this.cookie) {
        headers = {
          Cookie: this.cookie,
          'Cache-Control': 'no-cache',
        }
      }
      const downloadOptions = {
        fromUrl: dataUrl,
        toFile: filePath,
        background: true,
        headers,
        progressDivider: 2,
        begin: () => {
          Toast.show(getLanguage(global.language).Prompt.IMPORTING_DATA)
        },
        progress: res => {
          const value = ~~res.progress.toFixed(0)
          this.props.updateDownList({
            id: itemInfo.id,
            progress: value,
            downed: false,
          })
        },
      }
      await RNFS.downloadFile(downloadOptions).promise

      this.props.updateDownList({
        id: itemInfo.id,
        progress: 0,
        downed: true,
      })

      let name = itemInfo.fileName
      let type = ''
      let index = itemInfo.fileName.lastIndexOf('.')
      if (index !== -1) {
        name = itemInfo.fileName.substring(0, index)
        type = itemInfo.fileName.substring(index + 1).toLowerCase()
      }
      let result = false
      this.onImportStart()
      if (type === 'zip') {
        let toPath = temPath + name
        const unzipRes = await FileTools.unZipFile(filePath, toPath)
        if (unzipRes) {
          let dataList = await DataHandler.getExternalData(toPath)
          let results = []
          for (let i = 0; i < dataList.length; i++) {
            results.push(
              await DataHandler.importExternalData(currentUser, dataList[i]),
            )
          }
          result = results.some(value => value === true)
          FileTools.deleteFile(toPath)
        }
      } else if (
        this.itemInfo.type === 'MARKERSYMBOL' ||
        this.itemInfo.type === 'LINESYMBOL' ||
        this.itemInfo.type === 'FILLSYMBOL'
      ) {
        result = await DataHandler.importSymbol({
          fileName: itemInfo.fileName,
          filePath: filePath,
        })
      } else if (this.itemInfo.type === 'COLORSCHEME') {
        result = await DataHandler.importColor({
          fileName: itemInfo.fileName,
          filePath: filePath,
        })
      }

      FileTools.deleteFile(filePath)
      Toast.show(
        result
          ? getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS
          : getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT,
      )
    } catch (error) {
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
    } finally {
      this.onImportEnd()
    }
  }

  deleteData = async () => {
    this._closeModal()
    if (this.itemInfo && this.itemInfo.id) {
      this.deleteDataOfOnline()
    } else {
      this._onDeleteData()
    }
  }

  _onPublishService = async () => {
    // this.setLoading(true, '发布服务中...')
    Toast.show(getLanguage(this.props.language).Prompt.PUBLISHING)
    //'发布服务中...')
    this.LocalDataPopupModal && this.LocalDataPopupModal.setVisible(false)
    try {
      let dataId = this.itemInfo.id + ''
      let publishResults
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        publishResults = await JSOnlineservice.publishService(dataId, this.itemInfo.type)
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        publishResults = await JSIPortalService.publishService(dataId, this.itemInfo.type)
      }
      if (publishResults instanceof Array && typeof publishResults[0].succeed === 'boolean' && publishResults[0].succeed) {
        let sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
        let oldOnline = sectionData[sectionData.length - 1]
        let oldData = oldOnline.data
        let objContent = oldData[this.itemInfo.index]
        objContent.serviceStatus = 'PUBLISHED'
        let arrDataItemServices = objContent.dataItemServices
        let dataItemServices = { serviceType: 'RESTMAP', serviceName: '' }
        arrDataItemServices.push(dataItemServices)
        this.setState({ sectionData: sectionData })
        Toast.show(getLanguage(this.props.language).Prompt.PUBLISH_SUCCESS)
      } else {
        if (publishResults.error?.errorMsg?.indexOf('已发布') === 0) {
          Toast.show(getLanguage(this.props.language).Prompt.PUBLISH_FAILED_INFO_1)
        } else if (publishResults.error?.errorMsg?.indexOf('正在发布中') >= 0) {
          Toast.show(getLanguage(this.props.language).Prompt.PUBLISH_FAILED_INFO_2)
        } else {
          Toast.show(getLanguage(this.props.language).Prompt.PUBLISH_FAILED)
        }
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    } finally {
      this.setLoading(false)
    }
  }

  //发布服务后可以通过id获取item发布服务状态
  addListenOfPublish = async id => {
    let dataUrl = 'https://www.supermapol.com/web/datas/' + id + '.json'
    let objDataJson = await FetchUtils.getObjJson(dataUrl)
    if (objDataJson) {
      if (objDataJson.serviceStatus === 'PUBLISHED') {
        Toast.show(getLanguage(this.props.language).Prompt.PUBLISH_SUCCESS)
        return true
      } else if (objDataJson.serviceStatus === 'PUBLISH_FAILED') {
        Toast.show(getLanguage(this.props.language).Prompt.PUBLISH_FAILED)
        return false
      }
    }
  }

  _onDeleteService = async () => {
    // this.setLoading(true, '删除服务中...')
    Toast.show(getLanguage(this.props.language).Prompt.DELETING_SERVICE)
    //'删除服务中...')
    this.LocalDataPopupModal && this.LocalDataPopupModal.setVisible(false)
    try {
      let result = await SOnlineService.deleteServiceWithDataName(
        this.itemInfo.fileName,
      )
      if (typeof result === 'boolean' && result) {
        let sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
        let oldOnline = sectionData[sectionData.length - 1]
        let oldData = oldOnline.data
        let objContent = oldData[this.itemInfo.index]
        let dataItemServices = objContent.dataItemServices
        for (let i = 0; i < dataItemServices.length; i++) {
          let serviceType = dataItemServices[i].serviceType
          if (serviceType === 'RESTMAP') {
            dataItemServices.splice(i, 1)
          }
        }
        this.setState({ sectionData: sectionData })
        Toast.show(
          this.itemInfo.fileName +
            '  ' +
            getLanguage(this.props.language).Prompt.DELETED_SUCCESS,
        )
        //服务删除成功')
      } else {
        Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_DELETE)
        //'服务删除失败')
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    } finally {
      // this.setLoading(false)
    }
  }

  deleteDataOfOnline = async () => {
    this.setLoading(true, getLanguage(this.props.language).Prompt.DELETING_DATA, {
      timeout: 20000,
      // timeoutMsg: getLanguage(this.props.language).Prompt.REQUEST_TIMEOUT,
    })
    // if (this.deleteDataing) return
    // Toast.show(getLanguage(this.props.language).Prompt.DELETING_DATA)
    this.LocalDataPopupModal && this.LocalDataPopupModal.setVisible(false)
    // this.deleteDataing = true
    try {
      let objContent = this.itemInfo
      let dataId = objContent.id + ''
      let result
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        result = await SOnlineService.deleteDataWithDataId(dataId)
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        result = await SIPortalService.deleteMyData(dataId)
      }
      if (typeof result === 'boolean' && result) {
        let sectionData = JSON.parse(JSON.stringify(this.state.sectionData)) // [...this.state.sectionData]
        let oldOnline = sectionData[sectionData.length - 1]
        oldOnline.data.splice(this.itemInfo.index, 1)
        this.setState({ sectionData: sectionData }, () => {
          this.setLoading(false)
          Toast.show(getLanguage(this.props.language).Prompt.DELETED_SUCCESS)
          //'数据删除成功')
          // this.deleteDataing = false
        })
      } else {
        this.setLoading(false)
        // this.deleteDataing = false
        Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_DELETE)
        //'数据删除失败')
      }
    } catch (e) {
      // this.deleteDataing = false
      this.setLoading(false)
      this.getData()
      Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
    } finally {
      // this.setLoading(false)
    }
  }

  _onChangeDataVisibility = async () => {
    //this.setLoading(true, getLanguage(this.props.language).Prompt.FAILED_TO_DELETE)
    //'改变数据可见性中...')
    this.LocalDataPopupModal && this.LocalDataPopupModal.setVisible(false)
    try {
      let sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
      let oldOnline = sectionData[sectionData.length - 1]
      let objContent = oldOnline.data[this.itemInfo.index]
      let authorizeSetting = objContent.authorizeSetting
      let isPublish = false
      let splice = 0
      for (let i = 0; i < authorizeSetting.length; i++) {
        let dataPermissionType = authorizeSetting[i].dataPermissionType
        if (dataPermissionType === 'DOWNLOAD') {
          isPublish = true
          splice = i
          break
        }
      }
      let result
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        result = await SOnlineService.changeDataVisibilityWithDataId(
          this.itemInfo.id,
          !isPublish,
        )
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        result = await JSIPortalService.setDatasShareConfig(
          this.itemInfo.id,
          !isPublish,
        )
      }
      if (typeof result === 'boolean' && result) {
        if (isPublish) {
          authorizeSetting.splice(splice, 1)
          Toast.show(getLanguage(this.props.language).Prompt.SETTING_SUCCESS)
          //'成功设置为私有数据')
        } else {
          let dataPermissionType = { dataPermissionType: 'DOWNLOAD' }
          authorizeSetting.push(dataPermissionType)
          Toast.show(getLanguage(this.props.language).Prompt.SETTING_SUCCESS)
          //'成功设置为公有数据')
        }
        this.setState({ sectionData: sectionData })
      } else {
        if (result === undefined || result === '') {
          result = getLanguage(this.props.language).Prompt.SETTING_FAILED
          //'设置失败'
        }
        Toast.show(getLanguage(this.props.language).Prompt.SETTING_FAILED)
        //'设置失败')
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    } finally {
      this.setLoading(false)
    }
  }

  setLoading = (visible, info, extra = {}) => {
    this.container && this.container.setLoading(visible, info, extra)
  }

  _onLoadData = async () => {
    try {
      //防止data为空时调用
      //数据删除时不调用
      if (this.state.activityShow || this.currentPage >= this.totalPage) return
      if (this.state.sectionData && this.state.sectionData.length === 0) return
      let section = this.state.sectionData[this.state.sectionData.length - 1]
      if (section.dataType !== 'online') return
      if (
        section.dataType &&
        section.dataType === 'online' &&
        section.data.length < 10
      )
        return
      if (
        this.dataListTotal &&
        this.state.sectionData[this.state.sectionData.length - 1].data.length >=
          this.dataListTotal
      )
        return
      //构建新数据

      this.setState({ activityShow: true })
      let sectionData = [...this.state.sectionData]
      let oldOnlineData = sectionData[sectionData.length - 1]
      let oldData = oldOnlineData.data
      this.currentPage = this.currentPage + 1
      let onlineData = await getOnlineData(
        this.props.user.currentUser,
        this.currentPage,
        10,
        ['WORKSPACE'],
      )
      let data = onlineData.content
      this.totalPage = onlineData.totalPage
      if (data.length > 0) {
        let newData = oldData.concat(data)
        oldOnlineData.data = newData
        this.setState({ sectionData: sectionData, activityShow: false })
      } else {
        this.currentPage = this.currentPage - 1
        this.setState({ activityShow: false })
        // this.currentPage=this.currentPage-1
        // this._onLoadData()
      }
    } catch (error) {
      this.setState({ activityShow: false })
      Toast.show('网络异常')
    }
  }

  renderItemSeparatorComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  renderActivityIndicator = () => {
    if (this.state.activityShow) {
      return (
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            marginTop: scaleSize(10),
            alignItems: 'center',
          }}
        >
          <ActivityIndicator animating={true} color="#4680DF" size="large" />
          <Text style={{ fontSize: scaleSize(20) }}>
            {getLanguage(this.props.language).Prompt.LOADING}
            {/* {'数据加载中...'} */}
          </Text>
        </View>
      )
    } else {
      return <View style={{height: 8}} />
    }
  }

  getPopMenuData = () => {
    let data = []
    let item = this.itemInfo
    const fileType = item.item && item.item.fileType
    if (item) {
      data = []
      // 文件夹的删除选项
      if(item.obj && item.obj?.type === 'directory'){
        data.push({
          title: getLanguage(this.props.language).Profile.DELETE_DATA,
          action: this.directoryOnpress,
        })
      }  else {
        // 专题制图导出的xml不用导入到用户目录
        if(fileType !== 'xml_template'){
          data.push({
            title: getLanguage(this.props.language).Profile.IMPORT_DATA,
            action: this.importData,
          })
        }
        if (item.dataItemServices) {
          if (
            item.serviceStatus !== 'PUBLISHED' &&
            item.serviceStatus !== 'PUBLISHING' &&
            item.serviceStatus !== 'DOES_NOT_INVOLVE'
          ) {
            data.push({
              title: getLanguage(this.props.language).Profile.PUBLISH_SERVICE,
              action: this._onPublishService,
            })
          }
        }

        data.push({
          title: getLanguage(this.props.language).Profile.DELETE_DATA,
          action: this.deleteData,
        })

        if (item.authorizeSetting) {
          let isPublish = false
          let authorizeSetting = item.authorizeSetting
          for (let i = 0; i < authorizeSetting.length; i++) {
            let dataPermissionType = authorizeSetting[i].dataPermissionType
            if (dataPermissionType === 'DOWNLOAD') {
              isPublish = true
              break
            }
          }
          let title
          if (isPublish) {
            title = getLanguage(global.language).Profile.SET_AS_PRIVATE_DATA
          } else {
            title = getLanguage(global.language).Profile.SET_AS_PUBLIC_DATA
          }
          data.push({
            title: title,
            action: this._onChangeDataVisibility,
          })
        }
      }
    }
    return data
  }

  renderPopupMenu = () => {
    return (
      <PopMenu
        ref={ref => (this.LocalDataPopupModal = ref)}
        getData={this.getPopMenuData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  render() {
    // console.log(this.state.sectionData)
    let sectionData = this.state.sectionData
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          // '导入'
          title: getLanguage(this.props.language).Profile.IMPORT,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <SectionList
          style={{
            flex: 1,
          }}
          sections={sectionData}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          // ItemSeparatorComponent={this.renderItemSeparatorComponent}
          renderItem={this._renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.getData}
              colors={['orange', 'red']}
              titleColor={'orange'}
              tintColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
          onEndReached={this._onLoadData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderActivityIndicator()}
        />
        {this.renderPopupMenu()}
      </Container>
    )
  }

  /**
   * 根据已经获取到的数据，构造新的数据
   * 在getData里调用，注意将externalDataObj的数据保存起来（放到this里）
   * @param {Array<Object>} data 前面获取到的外部数据
   * @return 构造的数据
   */
  async createExternalData (data) {
    let rootPath = global.homePath + ConstPath.ExternalData
    // 用于存放最终构造的数据结果对象
    let externalDataObj = {
    	type: 'directory',
      index: 0,
      name: 'ExternalData',
      path: rootPath,
      children: [],
    }

    // 构造根文件夹的索引对象并将其放入文件夹数组
    let directoryIndexObj = {
      address: externalDataObj,
      name: externalDataObj.name
    }
    this.directoryArray.push(directoryIndexObj)
  
    // 遍历数组构造新的数据
    for(let i = 0, len = data.length; i < len; i ++){
      // 去掉前面到外部数据这一段的路径
      let strPath = rootPath + '/'
      let path = data[i].filePath.replace(strPath, "")
   
      // 当路径与文件名不同时，才需要对路径做拆分
      let paths = (path !== data[i].fileName) ? path.split('/') : [path]
   
      try {
        // 构造外部数据根目录下的子项
        await this.typeIsDirectory(data[i], paths, 0, externalDataObj.children)
      } catch (error) {
        console.log("error : " + error.message)
      }
      
    }

    // 将构造好的数据返回出去
    return externalDataObj
  }



  /**
   * 具体的构造数据的地方,完成判断当前路径是否是文件夹，以及他们改添加到哪个文件夹下
   * @param {Object} data 数据的对象
   * @param {Array<String>} paths 数据的路径所拆分成的数组
   * @param {Number} index 当前文件夹，所在paths里的索引位置
   * @param {Array<Object>} arr 是此文件夹所在的父文件夹的子项数组
   * @return 用于递归的回归过程
   */
  async typeIsDirectory(data, paths, index, arr){
    // 当路径与文件名不同时，
    if(paths[index] !== data.fileName){
      // 拼接此文件夹的路径，一直到此文件夹这里
      let pathStr = paths[0]
      for(let i = 1; i <= index; i ++) {
        pathStr += '/' + paths[i]
      }
     
      // 文件夹对象
      let obj = {
        type: 'directory',
        index: index + 1,
        name: paths[index],
        path: pathStr,
        children: [],
      }
      
      let tempDataObj = this.directoryIsExist(obj.name, obj.path, obj)
      // 是否添加进文件夹数组里的标识，true为添加(文件夹不存在)，false为不添加(文件夹存在)
      let isAdd = tempDataObj.flag
      
     
      // 当是否添加标识为true时，即此文件夹不存在，需要添加
      if(isAdd){
        // 为新的文件夹构建文件夹索引对象，并放入文件夹数组
        let directoryIndexObj = {
          address: obj,
          name: obj.name
        }
        this.directoryArray.push(directoryIndexObj)
        // 是新数组就直接添加进传入的子项数组就可以了
        arr.push(obj)
       

      } else {
        // 如果该文件夹已经存在的话,对obj进行重新赋值,将obj的值换为找到的已存在的文件夹的值
        obj = tempDataObj.obj
      }
      // 当文件夹找到或创建后，直接就将数据放进此文件夹
      obj.children.push(data)
    }
    return 
  }

  /**
   * 文件夹或文件所在文件夹是否已经存在于文件夹数组里了
   * @param {String} directoryName 文件夹或文件所在文件夹的名字
   * @param {String} directoryPath 文件夹或文件所在文件夹的路径
   * @param {Object} obj 文件夹或文件的对象
   * @return 一个对象，flag： 布尔类型，返回一个标识，true表示文件夹已经存在，false表示文件夹不存在 ；obj： 找到的已存在的文件夹的对象；
   */
   directoryIsExist(directoryName, directoryPath, obj){
    let tempArray = this.directoryArray
    // 用于标识是否找到了相同的文件夹 
    let flag = true

    // 先看文件夹的名字是否相同，再看路径是否相同，查看某一个文件夹是否已经存在了
    for(let i = 0, len = tempArray.length; i < len; i ++){
      // 次循环里名字不相同，直接下一循环
      if(tempArray[i].name !== directoryName) { continue }
      // 名字相同但路径不同，直接下一循环
      if(tempArray[i].address.path !== directoryPath) { continue }
      // 名字相同且路径相同,将是否添加标识设为false（文件夹已经存在了）
      flag = false

      // 判断obj是否是文件夹类型
      if(obj.type === 'directory'){
        // 当obj是文件夹时，就将obj的地址指向已存在的文件夹
        obj = tempArray[i].address

      } else {
        // 当obj是文件时，因为前面对比的是其所在的文件夹是否存在，存在时，可以直接把此文件放入所在文件夹的子项里
        tempArray[i].address.children.push(obj)
      }
      // 当找到名字相同且路径相同的文件夹且所有的处理操作都完成后，直接退出循环
      break
    }
    return {flag, obj}
  }

  /**
   * 外部数据新建对象的数据结构
    let externalDataObj = {
      type: 'directory', // 用于类型判断是渲染什么组件
      index: xxx,        // 文件夹层级，最外层外部数据根目录为0
      name: 'xxx',       // 名字
      path: 'xxx',       // 在数据构成时记录当前文件或当前文件夹的路径
      children: [        // 当前文件的子项，如果不是文件夹类型就渲染为文件的数据
        {
          type: 'dictory',
          index: xxx,
          name: 'xxx',
          path: 'xxx',
          children: [{},...] 
        },
        ...
      ]
    }
  */

  /**
   * 拿去构造好的数据，用递归实现外部数据的嵌套渲染  (在_renderItem里调用)
   * @param {Object} obj 外部数据新建对象
   * @param {Object} section 外部数据的头部信息对象
   * @return 返回一个组件实例
   */
  renderExternalData(obj, section){
    let that = this
    // 判断是否是文件夹类型
    if(obj.type === 'directory'){
      // 文件夹组件
      let content = <Directory 
        obj = {obj}
        section = {section}
        directoryOnpress = {(event)=>{
          this.directoryItemOnPress && this.directoryItemOnPress({obj, section}, event)
        }}
      >
        {
         Array.isArray(obj.children) &&
            obj.children.map((data, index) => (
              <LocalDataItem
                info = {{index, item: data, section}}
                itemOnpress = {(info, event)=>{
                  let len = that.directoryArray.length
                  for(let i = 0; i < len; i++ ){
                    if(obj.name === that.directoryArray[i].name){
                      // 记录当前文件夹在文件夹数组中的索引
                      that.directoryIndex = i
                      break
                    }
                  }
                  that.itemOnpress(info, event)
                }}
                isImporting = {
                  that.props.importItem !== '' &&
                  JSON.stringify(data) === JSON.stringify(that.props.importItem.item)
                }
              />
            ))
          
        }
      </Directory>
      return content

    } 
  

  }
/**
 * 点击文件夹后面的更多按钮触发的菜单
 * @param {Object} item 
 * @param {Component} event 
 */
  directoryItemOnPress = (item, event) => {
    // 记录删除文件夹内的子项数组和所属的分类
    this.directoryItem = item.obj.children
    this.directorySection = item.section
    let len = this.directoryArray.length
    for(let i = 0; i < len; i++ ){
      if(item.obj.name === this.directoryArray[i].name){
        // 记录当前文件夹在文件夹数组中的索引
        this.directoryIndex = i
        break
      }
    }
    
    // 重置this.itemInfo
    this.itemInfo = item
    // 设置菜单位置，并让菜单显示
    try {
      this.LocalDataPopupModal &&
      this.LocalDataPopupModal.setVisible(true, {
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 删除文件夹
   */
  async directoryOnpress(){
    // 获取要删啊除的文件夹的子项数组和分类
    let arr = this.directoryItem
    let section = this.directorySection
    // 循环删除每一个文件夹下的数据
    for(let i = arr.length - 1; i >= 0; i--){
      // 重置this.itemInfo
      this.itemInfo = {index: i, item: arr[i], section}
      await this._onDeleteData('directory')
    }
    this.setLoading(false)
    Toast.show(getLanguage(this.props.language).Prompt.DELETED_SUCCESS)
    
    // 清空
    this.directoryItem = []
    this.directorySection = null
  }

}