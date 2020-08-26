import React, { Component } from 'react'
import {
  View,
  AppState,
  StyleSheet,
  Platform,
  Image,
  Text,
  BackHandler,
  NativeModules,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import { setNav } from './src/redux/models/nav'
import { setUser, setUsers } from './src/redux/models/user'
import { setAgreeToProtocol, setLanguage, setMapSetting ,setMap2Dto3D} from './src/redux/models/setting'
import {
  setEditLayer,
  setSelection,
  setCurrentLayer,
} from './src/redux/models/layers'
import {
  openWorkspace,
  closeMap,
  setCurrentMap,
  saveMap,
} from './src/redux/models/map'
import {
  setCurrentTemplateInfo,
  setCurrentTemplateList,
  setTemplate,
} from './src/redux/models/template'
import { setModules } from './src/redux/models/appConfig'
import { setMapModule } from './src/redux/models/mapModules'
import { Dialog, Loading } from './src/components'
import { setAnalystParams } from './src/redux/models/analyst'
import { setCollectionInfo } from './src/redux/models/collection'
import { setShow }  from './src/redux/models/device'
import { setLicenseInfo } from './src/redux/models/license'
import { FileTools }  from './src/native'
import ConfigStore from './src/redux/store'
import { SaveView } from './src/containers/workspace/components'
import { scaleSize, Toast, screen } from './src/utils'
import RootNavigator from './src/containers/RootNavigator'
import { color } from './src/styles'
import { ConstPath, ConstInfo, ConstToolType, ThemeType, ChunkType, UserType } from './src/constants'
import * as PT from './src/customPrototype'
import NavigationService from './src/containers/NavigationService'
import Orientation from 'react-native-orientation'
import { SOnlineService, SScene, SMap, SIPortalService ,SpeechManager, SSpeechRecognizer, SLocation, ConfigUtils, AppInfo } from 'imobile_for_reactnative'
import SplashScreen from 'react-native-splash-screen'
import { getLanguage } from './src/language/index'
import { ProtocolDialog } from './src/containers/tabs/Home/components'
import constants from './src/containers/workspace/constants'
import FriendListFileHandle from './src/containers/tabs/Friend/FriendListFileHandle'
import { SimpleDialog } from './src/containers/tabs/Friend'
import DataHandler from './src/containers/tabs/Mine/DataHandler'
let AppUtils = NativeModules.AppUtils
import config from './configs/config'
import _mapModules, { mapModules } from './configs/mapModules'
import { BackHandlerUtil } from './src/containers/workspace/util'

//字体不随系统字体变化
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false})
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {defaultProps: false})

const {persistor, store} = ConfigStore()

const styles = StyleSheet.create({
  map: {
    flex: 1,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 64 : 44,
    left: 0,
    right: 0,
    bottom: scaleSize(100),
    alignSelf: 'stretch',
    backgroundColor: 'yellow',
  },
  invisibleMap: {
    width: 1,
    height: 1,
  },
  dialogHeaderView: {
    paddingTop:scaleSize(30),
    flex: 1,
    //  backgroundColor:"pink",
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
    // marginLeft:scaleSize(145),
    // marginTop:scaleSize(21),
  },
  promptTtile: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  dialogBackground: {
    height: scaleSize(300),
  },
  opacityView: {
    height: scaleSize(300),
  },
  btnStyle: {
    height: scaleSize(80),
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  btnTextStyle: {
    fontSize: scaleSize(24),
    color: color.blue1,
  },
})

class AppRoot extends Component {
  static propTypes = {
    language: PropTypes.string,
    autoLanguage: PropTypes.bool,
    configLangSet: PropTypes.bool,
    peripheralDevice: PropTypes.string,
    nav: PropTypes.object,
    backActions: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    map: PropTypes.object,
    collection: PropTypes.object,
    layers: PropTypes.array,
    isAgreeToProtocol: PropTypes.bool,
    device: PropTypes.object,
    appConfig: PropTypes.object,

    setNav: PropTypes.func,
    setUser: PropTypes.func,
    setUsers: PropTypes.func,
    openWorkspace: PropTypes.func,
    setShow: PropTypes.func,
    closeMap: PropTypes.func,
    setCurrentMap: PropTypes.func,

    setEditLayer: PropTypes.func,
    setSelection: PropTypes.func,
    setCollectionInfo: PropTypes.func,
    setCurrentTemplateInfo: PropTypes.func,
    setCurrentTemplateList: PropTypes.func,
    setTemplate: PropTypes.func,
    setMapSetting: PropTypes.func,
    saveMap: PropTypes.func,
    setCurrentAttribute: PropTypes.func,
    setAttributes: PropTypes.func,
    setAnalystParams: PropTypes.func,
    setAgreeToProtocol: PropTypes.func,
    setLanguage: PropTypes.func,
    setMap2Dto3D: PropTypes.func,
    setCurrentLayer: PropTypes.func,
    setModules: PropTypes.func,
    setMapModule: PropTypes.func,
    setLicenseInfo: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
      import: null,
      isInit: false,
    }
    this.props.setModules(config) // 设置模块
    this.initGlobal()
    PT.initCustomPrototype()
    // this.login = this.login.bind(this)
    this.reCircleLogin = this.reCircleLogin.bind(this)

    if(config.language && !this.props.configLangSet) {
      this.props.setLanguage(config.language, true)
    } else if(this.props.autoLanguage) {
      this.props.setLanguage('AUTO')
    } else {
      this.props.setLanguage(this.props.language)
    }
    SMap.setModuleListener(this.onInvalidModule)
    SMap.setLicenseListener(this.onInvalidLicense)
  }

  UNSAFE_componentWillMount(){
    SOnlineService.init()
    // this.initOrientation()
  }

  /** 初始化用户数据 **/
  initUser = async () => {
    try {
      // 获取用户登录记录
      let users = await ConfigUtils.getUsers()
      let userName = 'Customer'
      if (users.length === 0) {
        // 若没有任何用户登录，则默认Customer登录
        this.props.setUser({
          userName: userName,
          userType: UserType.PROBATION_USER,
        })
      } else {
        await this.props.setUsers(users)
        userName = users[0].userName
      }
      await this.getUserApplets(userName)
    } catch (e) {

    }
  }

  getUserApplets = async userName => {
    try {
      // 获取当前用户的小程序
      let applets = await ConfigUtils.getApplets(userName)
      let myMapModules = []
      if (applets === null || userName === 'Customer' && applets.length === 0) {
        await ConfigUtils.recordApplets(userName, _mapModules)
        applets = _mapModules
      } else {
        // APP默认模块不能改动
        let defaultValues = Object.values(ChunkType)
        let tempArr = defaultValues.concat(applets)
        applets = Array.from(new Set(tempArr))
      }
      let needToUpdate = false
      applets.map(key => {
        for (let item of mapModules) {
          needToUpdate = this.props.appConfig.oldMapModules.indexOf(item.key) < 0
          if (item.key === key || needToUpdate) {
            myMapModules.push(item)
            break
          }
        }
      })
      // 添加新的小程序后，直接显示在首页，并记录到本地文件
      if (needToUpdate) {
        await ConfigUtils.recordApplets(userName, _mapModules)
      }
      await this.props.setMapModule(myMapModules)
    } catch (e) {
      await ConfigUtils.recordApplets(userName, _mapModules)
    }
  }

  initGlobal = () => {
    GLOBAL.AppState = AppState.currentState
    GLOBAL.isBackHome = true
    GLOBAL.loginTimer = undefined
    GLOBAL.STARTX = undefined  //离线导航起点
    GLOBAL.ENDX = undefined  //离线导航终点
    GLOBAL.HASCHOSE = false  //离线数据选择
    this.props.setMap2Dto3D(false) //release版没有重置为false
    // TODO 动态切换主题，将 GLOBAL.ThemeType 放入Redux中管理
    GLOBAL.ThemeType = ThemeType.LIGHT_THEME
    GLOBAL.TaggingDatasetName = ''
    GLOBAL.BaseMapSize = 1
    //地图比例尺
    GLOBAL.scaleView = null
    GLOBAL.SelectedSelectionAttribute = null // 框选-属性-关联对象 {layerInfo, index, data}
    this.setIsPad()
    this._getIs64System()
    GLOBAL.isDownload = true //目标分类默认文件下载判断
    GLOBAL.isProjectModelDownload = true //ar沙盘模型文件下载判断
    GLOBAL.getDevice = this.getDevice
    GLOBAL.back = this.back // 全局返回事件，根据不同界面有不同返回事件
  }

  getDevice = () => {
    return this.props.device
  }

  _getIs64System = async () =>{
    try {
      global.SYSTEM_VERSION = "x64"
      if (Platform.OS === 'android') {
        let b64 = await AppUtils.is64Bit()
        if(b64 === false){
          global.SYSTEM_VERSION = "x32"
        }
      }
    }catch (e) {
    }
  }

  setIsPad = async () => {
    let isPad
    if(Platform.OS === 'ios') {
      isPad = Platform.isPad
    } else {
      isPad = await AppUtils.isPad()
    }
    GLOBAL.isPad = isPad
  }

  loginOnline = async () => {
    let isEmail = this.props.user.currentUser.isEmail
    let userName = this.props.user.currentUser.userName
    let password = this.props.user.currentUser.password
    let bLogin = false
    if (isEmail === true) {
      bLogin = await SOnlineService.login(userName, password)
    } else if (isEmail === false) {
      bLogin = await SOnlineService.loginWithPhoneNumber(userName, password)
    }
    return bLogin
  }

  login = async () => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      let result
      result = await this.loginOnline()
      if(result){
        result = await FriendListFileHandle.initFriendList(this.props.user.currentUser)
      }
      if(result){
        global.getFriend().onUserLoggedin()
      } else {
        global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
      }
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      let url = this.props.user.currentUser.serverUrl
      let userName = this.props.user.currentUser.userName
      let password = this.props.user.currentUser.password
      SIPortalService.init()
      SIPortalService.login(url, userName, password, true)
    }
  }

  reCircleLogin(){
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      if(GLOBAL.loginTimer !== undefined){
        clearInterval(GLOBAL.loginTimer)
        GLOBAL.loginTimer = undefined
      }
      GLOBAL.loginTimer = setInterval(this.loginOnline,60000 )
    }
  }

  componentDidMount () {
    this.inspectEnvironment()
    this.reCircleLogin()
    if(this.props.peripheralDevice !== 'local') {
      SLocation.changeDevice(this.props.peripheralDevice)
    }
    if(Platform.OS === 'android') {
    //  this.initSpeechManager()
      SSpeechRecognizer.init('5dafb910')
    } else {
      SSpeechRecognizer.init('5b63b509')
    }
    AppState.addEventListener('change', this.handleStateChange)
    ;(async function () {
      await this.initDirectories()
      await FileTools.initUserDefaultData(this.props.user.currentUser.userName || 'Customer')
      await this.initUser()
      SOnlineService.init()
      // SOnlineService.removeCookie()
      SIPortalService.init()
      await this.getVersion()
      await this.getImportState()
      await this.addImportExternalDataListener()
      await this.addGetShareResultListener()
      await this.openWorkspace()
      await this.initOrientation()

      // 显示界面，之前的为预加载
      this.setState({isInit: true}, () => {
        this.login()
      })
    }).bind(this)()

    GLOBAL.clearMapData = () => {
      this.props.setEditLayer(null) // 清空地图图层中的数据
      this.props.setSelection(null) // 清空地图选中目标中的数据
      this.props.setMapSetting(null) // 清空地图设置中的数据
      this.props.setAnalystParams(null) // 清空分析中的数据
      this.props.setCollectionInfo() // 清空Collection中的数据
      this.props.setCurrentTemplateInfo() // 清空当前模板
      this.props.setCurrentTemplateList() // 清空当前模板
      this.props.setTemplate() // 清空模板
      this.props.setCurrentMap() // 清空当前地图
      this.props.setCurrentLayer() // 清空当前图层
    }
    Platform.OS === 'android' && SplashScreen.hide()

    Platform.OS === 'android' &&
    BackHandler.addEventListener('hardwareBackPress', this.back)
  }

  componentDidUpdate(prevProps) {
    // 切换用户，重新加载用户配置文件
    if (JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
      this.getUserApplets(this.props.user.currentUser.userName)
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.back)
  }
  
  getVersion = async () => {
    global.language = 'CN'
    let appInfo = await AppInfo.getAppInfo()
    let bundleInfo = await AppInfo.getBundleVersion()
    global.APP_VERSION = 'V' + appInfo.versionName + '_' + appInfo.versionCode
      + '_' + bundleInfo.BundleVersion + '_' + bundleInfo.BundleBuildVersion
  }

  openWorkspace = async () => {
    let wsPath = ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace[this.props.language === 'CN' ? 'CN' : 'EN'], path = ''
    if (
      this.props.user.currentUser.userType !== UserType.PROBATION_USER ||
      (this.props.user.currentUser.userName !== '' && this.props.user.currentUser.userName !== 'Customer')
    ) {
      let userWsPath = ConstPath.UserPath + this.props.user.currentUser.userName + '/' + ConstPath.RelativeFilePath.Workspace[this.props.language === 'CN' ? 'CN' : 'EN']
      if (await FileTools.fileIsExistInHomeDirectory(userWsPath)) {
        path = await FileTools.appendingHomeDirectory(userWsPath)
      } else {
        path = await FileTools.appendingHomeDirectory(wsPath)
      }
    } else {
      path = await FileTools.appendingHomeDirectory(wsPath)
    }
    // let customerPath = ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace[this.props.language === 'CN' ? 'CN' : 'EN']
    // path = await FileTools.appendingHomeDirectory(customerPath)

    this.props.openWorkspace({server: path})
  }

  back = () => {
    return BackHandlerUtil.backHandler(this.props.nav, this.props.backActions)
  }

  onInvalidModule = () => {
    global.SimpleDialog.set({
      text: getLanguage(this.props.language).Profile.INVALID_MODULE,
      confirmText: getLanguage(this.props.language).Profile.GO_ACTIVATE,
      confirmAction: () => {
        NavigationService.navigate('LicensePage')
      },
    })
    global.SimpleDialog.setVisible(true)
  }

  onInvalidLicense = () => {
    global.SimpleDialog.set({
      text: getLanguage(this.props.language).Profile.INVALID_LICENSE,
      confirmText: getLanguage(this.props.language).Profile.GO_ACTIVATE,
      confirmAction: () => {
        NavigationService.navigate('LicensePage')
      },
    })
    global.SimpleDialog.setVisible(true)
  }

  handleStateChange = appState => {
    if (appState === 'active') {
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        this.reCircleLogin()
      }
      Orientation.getOrientation((e, orientation) => {
        this.props.setShow({orientation: orientation})
      })
    }

  }

  inspectEnvironment = async () => {

    //todo 初始化云许可，私有云许可状态
    let serialNumber =await SMap.initSerialNumber('')
    if(serialNumber!==''){
      await SMap.reloadLocalLicense()
    }

    let status = await SMap.getEnvironmentStatus()
    this.props.setLicenseInfo(status)
    if (!status || !status.isLicenseValid) {
      GLOBAL.LicenseValidDialog.setDialogVisible(true)
    }
    // else if(serialNumber === '' && !status.isTrailLicense)
    // {
    //   GLOBAL.isNotItableLicenseDialog.setDialogVisible(true)
    // }

    // if(serialNumber!==''&&!status.isTrailLicense){
    //   let licenseInfo = await SMap.getSerialNumberAndModules()
    //   if(licenseInfo!=null&&licenseInfo.modulesArray){
    //     let modules=licenseInfo.modulesArray
    //     let size = modules.length
    //     let number = 0
    //     for (let i = 0; i < size; i++) {
    //       let modultCode = Number(modules[i])
    //       if(modultCode == 0){
    //         continue
    //       }
    //       number = number + (1<<(modultCode%100))
    //     }
    //     GLOBAL.modulesNumber=number
    //   }

    // }

  }

  showStatusBar = async orientation => {
    let result = await AsyncStorage.getItem('StatusBarVisible')
    let visible = result === 'true'
    if(orientation.indexOf('LANDSCAPE') === 0) {
      StatusBar.setHidden(true, 'slide')
    } else {
      StatusBar.setHidden(visible, 'slide')
    }
  }

  orientation = o => {
    this.showStatusBar(o)
    // iOS横屏时为LANDSCAPE-LEFT 或 LANDSCAPE-RIGHT，此时平放，o为LANDSCAPE，此时不做处理
    if (Platform.OS === 'ios' && o !== 'LANDSCAPE' || Platform.OS === 'android') {
      this.props.setShow({
        orientation: o,
      })
    }
  }
  //初始化横竖屏显示方式
  initOrientation = async () => {
    if (Platform.OS === 'ios') {
      Orientation.getSpecificOrientation((e, orientation) => {
        this.showStatusBar(orientation)
        this.props.setShow({orientation: orientation})
      })
      Orientation.removeSpecificOrientationListener(this.orientation)
      Orientation.addSpecificOrientationListener(this.orientation)
    } else {
      Orientation.getOrientation((e, orientation) => {
        this.showStatusBar(orientation)
        this.props.setShow({orientation: orientation})
      })
      Orientation.removeOrientationListener(this.orientation)
      Orientation.addOrientationListener(this.orientation)
    }
  }

  // 初始化文件目录
  initDirectories = async () => {
    try {
      let paths = Object.keys(ConstPath)
      let isCreate = true, absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        let path = ConstPath[paths[i]]
        if (typeof path !== 'string') continue
        absolutePath = await FileTools.appendingHomeDirectory(path)
        let exist = await FileTools.fileIsExistInHomeDirectory(path)
        let fileCreated = exist || await FileTools.createDirectory(absolutePath)
        isCreate = fileCreated && isCreate
      }
      isCreate = this.initCustomerDirectories() && isCreate
      if (!isCreate) {
        Toast.show('创建文件目录失败')
      }
    } catch (e) {
      Toast.show('创建文件目录失败')
    }
  }

  // 初始化游客用户文件目录
  initCustomerDirectories = async () => {
    try {
      let paths = Object.keys(ConstPath.RelativePath)
      let isCreate = true, absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        let path = ConstPath.RelativePath[paths[i]]
        if (typeof path !== 'string') continue
        absolutePath = await FileTools.appendingHomeDirectory(ConstPath.CustomerPath + path)
        let exist = await FileTools.fileIsExistInHomeDirectory(ConstPath.CustomerPath + path)
        let fileCreated = exist || await FileTools.createDirectory(absolutePath)
        isCreate = fileCreated && isCreate
      }
      return isCreate
    } catch (e) {
      return false
    }
  }

  addImportExternalDataListener = async () => {
    await FileTools.addImportExternalData({
      callback: result => {
        result && this.import.setDialogVisible(true)
      },
    })
  }

  addGetShareResultListener = async () => {
    await FileTools.getShareResult({
      callback: () => {
        if(GLOBAL.shareFilePath&&GLOBAL.shareFilePath.length>1){
          // FileTools.deleteFile(GLOBAL.shareFilePath)
        }
        // result && this.import.setDialogVisible(true)
      },
    })
  }

  getImportState = async () => {
    let result = await FileTools.getImportState()
    if (result === null)return
    result && this.import.setDialogVisible(true)
  }

  // 初始化录音
  initSpeechManager = async () => {
    try {
      GLOBAL.SpeechManager = new SpeechManager()
      await GLOBAL.SpeechManager.init()
    } catch (e) {
      Toast.show('语音初始化失败')
    }
  }

  // 初始化游客工作空间
  // initCustomerWorkspace = async () => {
  //   try {
  //     const customerPath = ConstPath.CustomerPath
  //     let exist = await FileTools.fileIsExistInHomeDirectory(customerPath + ConstPath.RelativePath.CustomerWorkspace)
  //     !exist && FileTools.appendingHomeDirectory(customerPath).then(path => {
  //       SMap.saveWorkspace({
  //         caption: 'Customer',
  //         type: WorkspaceType.SMWU,
  //         server: path,
  //       })
  //     })
  //   } catch (e) {
  //     Toast.show('游客工作空间初始化失败')
  //   }
  // }

  map3dBackAction = async () => {
    try {
      this.container && this.container.setLoading(true, '正在关闭')
      if (GLOBAL.openWorkspace) {
        // this.SaveDialog && this.SaveDialog.setDialogVisible(true)
        // await SScene.saveWorkspace()
        await SScene.closeWorkspace()
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      } else {
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      }
      // this.props.setCurrentAttribute({})
      // this.props.setAttributes({})
    } catch (e) {
      this.container && this.container.setLoading(false)
      NavigationService.goBack()
    }
  }

  saveMap = async () => {
    if (GLOBAL.Type === constants.MAP_NAVIGATION) {
      await SMap.stopGuide()
      await SMap.clearPoint()
      // await SMapSuspension.closeMap()
      // GLOBAL.SMMapSuspension&&GLOBAL.SMMapSuspension.setVisible(false)
      this.props.setMap2Dto3D(false)
    }
    if (GLOBAL.Type === ConstToolType.MAP_3D) {
      this.map3dBackAction()
      GLOBAL.openWorkspace && Toast.show(ConstInfo.SAVE_SCENE_SUCCESS)
      return
    }
    let mapName = ''
    if (this.props.map.currentMap.name) { // 获取当前打开的地图xml的名称
      mapName = this.props.map.currentMap.name
      mapName = mapName.substr(0, mapName.lastIndexOf('.')) || this.props.map.currentMap.name
    } else {
      let mapInfo = await SMap.getMapInfo()
      if (mapInfo && mapInfo.name) { // 获取MapControl中的地图名称
        mapName = mapInfo.name
      } else if (this.props.layers.length > 0) { // 获取数据源名称作为地图名称
        mapName = this.props.collection.datasourceName
      }
    }
    let addition = {}
    if (this.props.map.currentMap.Template) {
      addition.Template = this.props.map.currentMap.Template
    }

    return await this.saveMapName(mapName, '', addition, this.closeMapHandler)
  }

  // 导出(保存)工作空间中地图到模块
  saveMapName = async (mapName = '', nModule = '', addition = {}, cb = () => {}) => {
    try {
      this.setSaveMapViewLoading(true,getLanguage(this.props.language).Prompt.SAVING)
      //'正在保存地图')
      let result = await this.props.saveMap({mapName, nModule, addition})
      //   .then(result => {
      //   this.setSaveMapViewLoading(false)
      //   Toast.show(
      //     result ? ConstInfo.SAVE_MAP_SUCCESS : ConstInfo.SAVE_MAP_FAILED,
      //   )
      //   cb && cb()
      // }, () => {
      //   this.setSaveMapViewLoading(false)
      // })
      if (result || result === '') {
        this.setSaveMapViewLoading(false)
        Toast.show(
          result || result === '' ?
            getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
            : getLanguage(this.props.language).Prompt.SAVE_FAILED,
        )
        cb && cb()
        return true
      } else {
        this.setSaveMapViewLoading(false)
        return false
      }
    } catch (e) {
      this.setSaveMapViewLoading(false)
      return false
    }
  }

  setSaveMapViewLoading = (loading = false, info, extra) => {
    GLOBAL.Loading && GLOBAL.Loading.setLoading(loading, info, extra)
  }

  closeMapHandler = async () => {
    if (GLOBAL.Type === constants.MAP_NAVIGATION) {
      await SMap.stopGuide()
      await SMap.clearPoint()
      // await SMapSuspension.closeMap()
      // GLOBAL.SMMapSuspension&&GLOBAL.SMMapSuspension.setVisible(false)
      this.props.setMap2Dto3D(false)
    }
    if (GLOBAL.Type === ConstToolType.MAP_3D) {
      this.map3dBackAction()
      return
    }
    if (GLOBAL.isBackHome) {
      try {
        this.setSaveMapViewLoading(true,
          getLanguage(this.props.language).Prompt.CLOSING,
          //'正在关闭地图'
        )
        await this.props.closeMap()
        GLOBAL.clearMapData()
        this.setSaveMapViewLoading(false)
        NavigationService.goBack()
      } catch (e) {
        this.setSaveMapViewLoading(false)
      }
    } else {
      GLOBAL.isBackHome = true // 默认是true
    }
  }

  renderLicenseDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Text style={styles.promptTtile}>
          {getLanguage(this.props.language).Profile.LICENSE_CURRENT_EXPIRE}
          {/* 试用许可已过期,请更换许可后重启 */}
        </Text>
        <View style={{marginTop: scaleSize(30),width: '100%',height: 1,backgroundColor: color.item_separate_white}}></View>
        <TouchableOpacity style={styles.btnStyle}
          onPress={this.inputOfficialLicense}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Profile.LICENSE_OFFICIAL_INPUT}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle}
          onPress={this.applyTrialLicense}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Profile.LICENSE_TRIAL_APPLY}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle}
          onPress={()=>GLOBAL.LicenseValidDialog.setDialogVisible(false)}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Profile.LICENSE_CLEAN_CANCLE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  //退出app
  exitApp= async () => {
    try {
      await AppUtils.AppExit()
    } catch (error) {
      Toast.show(getLanguage(this.props.language).Profile.LICENSE_EXIT_FAILED)
    }
  }
  //接入正式许可
  inputOfficialLicense=async () =>{

    // if(Platform.OS === 'ios'){
    //   GLOBAL.Loading.setLoading(
    //     true,
    //     this.props.language === 'CN' ? '许可申请中...' : 'Applying',
    //   )

    //   let activateResult = await SMap.activateNativeLicense()
    //   if(activateResult === -1){
    //     //没有本地许可文件
    //     GLOBAL.noNativeLicenseDialog.setDialogVisible(true)
    //   }else if(activateResult === -2){
    //     //本地许可文件序列号无效
    //     Toast.show(
    //       getLanguage(this.props.language).Profile
    //         .LICENSE_NATIVE_EXPIRE,
    //     )
    //   }else {
    //     AsyncStorage.setItem(constants.LICENSE_OFFICIAL_STORAGE_KEY, activateResult)
    //     let modules = await SMap.licenseContainModule(activateResult)
    //     let size = modules.length
    //     let number = 0
    //     for (let i = 0; i < size; i++) {
    //       let modultCode = Number(modules[i])
    //       number = number + modultCode
    //     }
    //     GLOBAL.modulesNumber = number

    //     GLOBAL.LicenseValidDialog.setDialogVisible(false)
    //     GLOBAL.getLicense && GLOBAL.getLicense()
    //     Toast.show(
    //       getLanguage(this.props.language).Profile
    //         .LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS,
    //     )
    //   }
    //   GLOBAL.Loading.setLoading(
    //     false,
    //     this.props.language === 'CN' ? '许可申请中...' : 'Applying...',
    //   )
    //   return
    // }

    GLOBAL.LicenseValidDialog.setDialogVisible(false)
    NavigationService.navigate('LicenseTypePage')
  }
  //申请试用许可
  applyTrialLicense =async () => {

    GLOBAL.LicenseValidDialog.setDialogVisible(false)
    //if(Platform.OS === 'ios')
    {
      SMap.applyTrialLicense().then(async value => {
        if(value){
          Toast.show(global.language === 'CN' ? '试用成功' : 'Successful trial')
        }else{
          // Toast.show(getLanguage(this.props.language).Prompt.COLLECT_SUCCESS)
          Toast.show(
            global.language === 'CN'
              ? '您已经申请过试用许可,请接入正式许可'
              : 'You have applied for trial license, please access the formal license',
          )
        }
        let status = await SMap.getEnvironmentStatus()
        this.props.setLicenseInfo(status)
        GLOBAL.LicenseValidDialog.callback&&GLOBAL.LicenseValidDialog.callback()
      })
      return
    }


    // GLOBAL.Loading.setLoading(
    //   true,
    //   this.props.language==='CN'?"许可申请中...":"Applying"
    // )
    // try{
    //   let fileCachePath = await FileTools.appendingHomeDirectory('/iTablet/license/Trial_License.slm')
    //   let bRes = await RNFS.exists(fileCachePath)
    //   if(bRes){
    //     await RNFS.unlink(fileCachePath)
    //   }
    //   let dataUrl = undefined
    //   setTimeout(()=>{
    //     if(dataUrl === undefined){
    //       GLOBAL.Loading.setLoading(
    //         false,
    //         this.props.language==='CN'?"许可申请中...":"Applying..."
    //       )
    //       Toast.show(this.props.language==='CN'?"许可申请失败,请检查网络连接":'License application failed.Please check the network connection')
    //     }
    //   }, 10000 )
    //   dataUrl = await FetchUtils.getFindUserDataUrl(
    //     'xiezhiyan123',
    //     'Trial_License',
    //     '.geojson',
    //   )
    //   let downloadOptions = {
    //     fromUrl: dataUrl,
    //     toFile: fileCachePath,
    //     background: true,
    //     fileName: 'Trial_License.slm',
    //     progressDivider: 1,
    //   }

    //   const ret =  RNFS.downloadFile(downloadOptions)

    //   ret.promise
    //     .then(async () => {
    //       GLOBAL.Loading.setLoading(
    //         false,
    //         this.props.language==='CN'?"许可申请中...":"Applying"
    //       )
    //       SMap.initTrailLicensePath()
    //       this.openWorkspace()
    //       Toast.show(this.props.language==='CN'?"试用成功":'Successful trial')
    //       GLOBAL.LicenseValidDialog.callback&&GLOBAL.LicenseValidDialog.callback()
    //     })
    // }catch (e) {
    //   GLOBAL.Loading.setLoading(
    //     false,
    //     this.props.language==='CN'?"许可申请中...":"Applying"
    //   )
    //   Toast.show(this.props.language==='CN'?"许可申请失败,请检查网络连接":'License application failed.Please check the network connection')
    //   GLOBAL.LicenseValidDialog.callback&&GLOBAL.LicenseValidDialog.callback()
    // }
    // NavigationService.navigate('Protocol', { type: 'ApplyLicense' })
  }
  renderDialog = () => {
    return (<Dialog
      ref={ref => (GLOBAL.LicenseValidDialog = ref)}
      showBtns={false}
      type={Dialog.Type.NON_MODAL}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
      confirmBtnTitle={this.props.language==='CN' ? '试用' : 'The trial'}
      cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
    >
      {this.renderLicenseDialogChildren()}
    </Dialog>
    )
  }
  renderLicenseNotModuleChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Text style={styles.promptTtile}>
          {getLanguage(this.props.language).Profile.LICENSE_NOT_CONTAIN_CURRENT_MODULE}
          {/* 试用许可已过期,请更换许可后重启 */}
        </Text>
        <View style={{marginTop: scaleSize(30),width: '100%',height: 1,backgroundColor: color.item_separate_white}} />
        <View
          style={{height: scaleSize(200),
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center'}}
          onPress={this.inputOfficialLicense}
        >
          <Text style={{fontSize: scaleSize(20),marginLeft:scaleSize(30),marginRight:scaleSize(30)}}>
            {getLanguage(this.props.language).Profile.LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB}
          </Text>
        </View>
        <View style={{width: '100%',height: 1,backgroundColor: color.item_separate_white}} />
        <TouchableOpacity
          style={{height: scaleSize(80),
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}
          onPress={()=>{ GLOBAL.licenseModuleNotContainDialog.setDialogVisible(false)}}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Prompt.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  renderLicenseNotModuleDialog = () => {
    return (
      <Dialog
        ref={ref => (GLOBAL.licenseModuleNotContainDialog = ref)}
        showBtns={false}
        opacity={1}
        opacityStyle={[styles.opacityView, { height: scaleSize(340) }]}
        style={[styles.dialogBackground, { height: scaleSize(340) }]}
      >
        {this.renderLicenseNotModuleChildren()}
      </Dialog>
    )
  }

  renderImportDialog = () => {
    return (
      <Dialog
        ref={ref => (this.import = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.YES}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        confirmAction={async () => {
          try {
            this.import.setDialogVisible(false)
            GLOBAL.Loading.setLoading(
              true,
              getLanguage(this.props.language).Friends.IMPORT_DATA,
            )
            let homePath = global.homePath
            let importPath = homePath + '/iTablet/Import'
            let filePath = importPath + '/import.zip'
            let isImport = false
            if(await FileTools.fileIsExist(filePath)) {
              await FileTools.unZipFile(filePath, importPath)
              let dataList = await DataHandler.getExternalData(importPath)
              let results = []
              for(let i = 0; i < dataList.length; i++) {
                results.push(await DataHandler.importExternalData(this.props.user.currentUser, dataList[i]))
              }
              isImport = results.some(value => value === true)
            }
            FileTools.deleteFile(importPath)
            isImport
              ? Toast.show(getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS)
              : Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
            GLOBAL.Loading.setLoading(false)
          } catch (error) {
            Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
            GLOBAL.Loading.setLoading(false)
          }
        }}
        cancelAction={ async () => {
          let homePath = global.homePath
          let importPath = homePath + ConstPath.Import
          await FileTools.deleteFile(importPath)
          this.import.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderImportDialogChildren()}
      </Dialog>
    )
  }

  _renderProtocolDialog = () => {
    return (
      <ProtocolDialog
        ref={ref => (this.protocolDialog = ref)}
        language={this.props.language}
        device={this.props.device}
        setLanguage={this.props.setLanguage}
        confirm={isAgree => {
          this.props.setAgreeToProtocol && this.props.setAgreeToProtocol(isAgree)
          this.protocolDialog.setVisible(false)
        }}
      />
    )
  }

  renderImportDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('./src/assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>{'是否导入外部数据'}</Text>
      </View>
    )
  }

  //提示没有本地许可文件
  renderNoNativeOfficialLicenseDialog = () => {
    return (<Dialog
      ref={ref => (GLOBAL.noNativeLicenseDialog = ref)}
      showBtns={false}
      type={Dialog.Type.NON_MODAL}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
    >
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('./src/assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>
          {getLanguage(GLOBAL.language).Profile.LICENSE_NO_NATIVE_OFFICAL}
        </Text>
        <View style={{width: '100%',height: 1,backgroundColor: color.item_separate_white ,marginTop:scaleSize(40)}}></View>
        <TouchableOpacity
          style={{height: scaleSize(60),
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}
          onPress={()=>{ GLOBAL.noNativeLicenseDialog.setDialogVisible(false)}}
        >
          <Text style={{ fontSize: scaleSize(24), color: color.fontColorBlack }}>
            {getLanguage(this.props.language).Prompt.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    </Dialog>
    )

  }

  //提示正式许可不是itablet app激活的许可
  renderIsNotItabletLicenseDialog = () => {
    return (<Dialog
      ref={ref => (GLOBAL.isNotItableLicenseDialog = ref)}
      showBtns={false}
      type={Dialog.Type.NON_MODAL}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
    >
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('./src/assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={{fontSize: scaleSize(24),
          height: scaleSize(120),
          color: color.theme_white,
          marginTop: scaleSize(5),
          marginLeft: scaleSize(10),
          marginRight: scaleSize(10),
          textAlign: 'center'}}>
          {getLanguage(GLOBAL.language).Profile.LICENSE_NOT_ITABLET_OFFICAL}
        </Text>
        <View style={{width: '100%',height: 1,backgroundColor: color.item_separate_white }}></View>
        <TouchableOpacity
          style={{height: scaleSize(60),
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}
          onPress={()=>{ GLOBAL.isNotItableLicenseDialog.setDialogVisible(false)}}
        >
          <Text style={{ fontSize: scaleSize(24), color: color.fontColorBlack }}>
            {getLanguage(this.props.language).Prompt.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    </Dialog>
    )

  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => global.SimpleDialog = ref}/>
  }

  render () {
    if (!this.state.isInit) {
      return <Loading info="Loading"/>
    }
    return (
      <View style={{flex: 1}}>
        <View style={[
          {flex: 1},
          screen.isIphoneX() && // GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') >= 0 && // GLOBAL.getDevice() &&
          {
            backgroundColor: '#201F20',
          },
          {
            paddingTop:
              screen.isIphoneX() &&
              this.props.device.orientation.indexOf('PORTRAIT') >= 0
                ? screen.X_TOP
                : 0,
            paddingBottom: screen.getIphonePaddingBottom(),
            ...screen.getIphonePaddingHorizontal(
              this.props.device.orientation,
            ),
          },
        ]}>
          <RootNavigator
            appConfig={this.props.appConfig}
            setModules={this.props.setModules}
            setNav={this.props.setNav}
          />
        </View>
        <SaveView
          ref={ref => GLOBAL.SaveMapView = ref}
          language={this.props.language}
          save={this.saveMap}
          device={this.props.device}
          notSave={this.closeMapHandler}
          cancel={() => {
            // this.backAction = null
            this.props.setMap2Dto3D(true)
          }}
        />
        {this.renderDialog()}
        {this.renderSimpleDialog()}
        {this.renderImportDialog()}
        {this.renderLicenseNotModuleDialog()}
        {this.renderNoNativeOfficialLicenseDialog()}
        {this.renderIsNotItabletLicenseDialog()}
        {!this.props.isAgreeToProtocol && this._renderProtocolDialog()}
        <Loading ref={ref => GLOBAL.Loading = ref} initLoading={false}/>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.setting.toJS().language,
    autoLanguage: state.setting.toJS().autoLanguage,
    configLangSet: state.setting.toJS().configLangSet,
    peripheralDevice: state.setting.toJS().peripheralDevice,
    user: state.user.toJS(),
    nav: state.nav.toJS(),
    editLayer: state.layers.toJS().editLayer,
    device: state.device.toJS().device,
    map: state.map.toJS(),
    collection: state.collection.toJS(),
    layers: state.layers.toJS().layers,
    backActions: state.backActions.toJS(),
    isAgreeToProtocol: state.setting.toJS().isAgreeToProtocol,
    appConfig: state.appConfig.toJS(),
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setNav,
  setUser,
  setUsers,
  openWorkspace,
  setShow,
  closeMap,
  setCurrentMap,
  setCurrentLayer,
  setEditLayer,
  setSelection,
  setCollectionInfo,
  setCurrentTemplateInfo,
  setCurrentTemplateList,
  setTemplate,
  setMapSetting,
  setAnalystParams,
  saveMap,
  setAgreeToProtocol,
  setLanguage,
  setMap2Dto3D,
  setModules,
  setMapModule,
  setLicenseInfo,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    {/*<PersistGate loading={<Loading info="Loading"/>} persistor={persistor}>*/}
    <PersistGate loading={null} persistor={persistor}>
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
