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
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
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
import DataHandler from '../DataHandler'
import NavigationService from '../../../NavigationService'
import { downloadFile } from 'react-native-fs'
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
      userName: this.props.navigation.getParam('userName', ''),
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

  getData = async () => {
    try {
      this.container.setLoading(
        true,
        getLanguage(this.props.language).Prompt.LOADING,
      )
      let sectionData = []
      let cacheData = []
      let userData = []
      let onlineData = []
      let homePath = GLOBAL.homePath
      let cachePath = homePath + ConstPath.CachePath2
      let userPath =
        homePath +
        ConstPath.ExternalData

      let cachePromise = DataHandler.getExternalData(cachePath)
      let userPromise = DataHandler.getExternalData(userPath)
      this.currentPage = 1
      let onlineDataPromise = getOnlineData(
        this.props.user.currentUser,
        this.currentPage,
        this.pageSize,
        result => {
          this.dataListTotal = result
        },
      )
      let result = await new Promise.all([
        cachePromise,
        userPromise,
        onlineDataPromise,
      ])
      cacheData = result[0]
      userData = result[1]
      onlineData = result[2]
      if (cacheData.length > 0) {
        sectionData.push({
          title: getLanguage(GLOBAL.language).Profile.SAMPLEDATA,
          data: cacheData,
          isShowItem: true,
          dataType: 'cache',
        })
      }
      if (userData.length > 0) {
        sectionData.push({
          title: getLanguage(GLOBAL.language).Profile.ON_DEVICE,
          data: userData,
          isShowItem: true,
          dataType: 'external',
        })
      }
      if (onlineData.length > 0) {
        sectionData.push({
          title: getLanguage(GLOBAL.language).Profile.ON_DEVICE,
          data: onlineData,
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
    if (
      info.section.dataType === 'online' &&
      ((this.state.sectionData.length === 2 &&
        this.state.sectionData[0].dataType === 'external') ||
        this.state.sectionData.length === 3)
    ) {
      return <View />
    }
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
    } else {
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

  _onDeleteData = async () => {
    try {
      this._closeModal()
      if (
        this.props.importItem !== '' &&
        JSON.stringify(this.itemInfo.item) ===
          JSON.stringify(this.props.importItem.item)
      ) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.DATA_BEING_IMPORT)
        return
      }
      this.setLoading(
        true,
        //'删除数据中...'
        getLanguage(this.props.language).Prompt.DELETING_DATA,
      )

      let exportDir =
        GLOBAL.homePath +
        ConstPath.ExternalData

      let delDirs = []
      if (this.itemInfo.item.fileType === 'plotting') {
        delDirs = [this.itemInfo.item.directory]
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
        Toast.show(
          //'删除成功'
          getLanguage(this.props.language).Prompt.DELETED_SUCCESS,
        )
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
            data.data.splice(this.itemInfo.index, 1)
          }
        }
        this.setState({ sectionData: sectionData }, () => {
          this.LocalDataPopupModal && this.LocalDataPopupModal.setVisible(false)
        })
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
      this.setLoading(false)
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
          GLOBAL.SimpleDialog.set({
            text: getLanguage(GLOBAL.language).Profile.IMPORT_BUILD_PYRAMID,
            confirmText: getLanguage(GLOBAL.language).Prompt.YES,
            cancelText: getLanguage(GLOBAL.language).Prompt.NO,
            confirmAction: async () => {
              try {
                GLOBAL.Loading.setLoading(
                  true,
                  getLanguage(GLOBAL.language).Prompt.IMPORTING,
                )
                await importDataset(item, { buildPyramid: true })
                GLOBAL.Loading.setLoading(false)
              } catch (error) {
                GLOBAL.Loading.setLoading(false)
              }
            },
            cancelAction: () => {
              importDataset(item)
            },
          })
          GLOBAL.SimpleDialog.setVisible(true)
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
      Toast.show(getLanguage(GLOBAL.language).Prompt.IMPORTING_DATA)
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
        fileType === 'xmltemplate'
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
            Toast.show(getLanguage(GLOBAL.language).Prompt.IMPORTING_DATA)
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
          Toast.show(getLanguage(GLOBAL.language).Prompt.IMPORTING_DATA)
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
      await downloadFile(downloadOptions).promise

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
        result = await DataHandler.importSymbol(currentUser, {
          fileName: itemInfo.fileName,
          filePath: filePath,
        })
      } else if (this.itemInfo.type === 'COLORSCHEME') {
        result = await DataHandler.importColor(currentUser, {
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
      let result
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        result = await JSOnlineservice.publishService(dataId, this.itemInfo.type)
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        result = await JSIPortalService.publishService(dataId, this.itemInfo.type)
      }
      if (typeof result === 'boolean' && result) {
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
        Toast.show(getLanguage(this.props.language).Prompt.PUBLISH_FAILED)
      }
    } catch (e) {
      Toast.show('网络错误')
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
      Toast.show('网络错误')
    } finally {
      // this.setLoading(false)
    }
  }

  deleteDataOfOnline = async () => {
    this.setLoading(true, getLanguage(this.props.language).Prompt.DELETING_DATA, {
      timeout: 10000,
      timeoutMsg: getLanguage(this.props.language).Prompt.REQUEST_TIMEOUT,
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
      Toast.show('网络错误')
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
      if (this.state.activityShow) return
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
      let data = await getOnlineData(
        this.props.user.currentUser,
        this.currentPage,
        10,
      )
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
      return <View />
    }
  }

  getPopMenuData = () => {
    let data = []
    let item = this.itemInfo
    const fileType = item.item && item.item.fileType
    if (item) {
      data = []
      // 专题制图导出的xml不用导入到用户目录
      if(fileType !== 'xmltemplate'){
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
          title = getLanguage(GLOBAL.language).Profile.SET_AS_PRIVATE_DATA
        } else {
          title = getLanguage(GLOBAL.language).Profile.SET_AS_PUBLIC_DATA
        }
        data.push({
          title: title,
          action: this._onChangeDataVisibility,
        })
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
}
