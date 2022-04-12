/*global GLOBAL*/
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
  // AsyncStorage,
  StatusBar,
  TextInput,
  PermissionsAndroid,
  // NetInfo,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo"
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import { setNav } from './src/redux/models/nav'
import { setUser, setUsers, deleteUser } from './src/redux/models/user'
import { setAgreeToProtocol, setLanguage, setMapSetting } from './src/redux/models/setting'
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
  closeWorkspace,
} from './src/redux/models/map'
import {
  setCurrentTemplateInfo,
  setCurrentTemplateList,
  setTemplate,
} from './src/redux/models/template'
import { setModules } from './src/redux/models/appConfig'
import { setMapModule } from './src/redux/models/mapModules'
import { Dialog, Loading, MyToast, InputDialog } from './src/components'
import { setAnalystParams } from './src/redux/models/analyst'
import { setCollectionInfo } from './src/redux/models/collection'
import { setShow } from './src/redux/models/device'
import { setLicenseInfo } from './src/redux/models/license'
import { RNFS as fs } from 'imobile_for_reactnative'
import { FileTools, SplashScreen} from './src/native'
import ConfigStore from './src/redux/store'
import { scaleSize, Toast, screen, DialogUtils, GetUserBaseMapUtil } from './src/utils'
import * as OnlineServicesUtils from './src/utils/OnlineServicesUtils'
import RootNavigator from './src/containers/RootNavigator'
import { color } from './src/styles'
import { ConstPath, ThemeType, ChunkType, UserType } from './src/constants'
import * as PT from './src/customPrototype'
import NavigationService from './src/containers/NavigationService'
import Orientation from 'react-native-orientation'
import { SOnlineService, SScene, SMap, SIPortalService, SSpeechRecognizer, SLocation, ConfigUtils, AppInfo ,SARMap} from 'imobile_for_reactnative'
// import SplashScreen from 'react-native-splash-screen'
import { getLanguage } from './src/language/index'
import { ProtocolDialog } from './src/containers/tabs/Home/components'
import FriendListFileHandle from './src/containers/tabs/Friend/FriendListFileHandle'
import { SimpleDialog } from './src/containers/tabs/Friend'
import DataHandler from './src/containers/tabs/Mine/DataHandler'
let AppUtils = NativeModules.AppUtils
import config from './configs/config'
import _mapModules, { mapModules } from './configs/mapModules'
import { BackHandlerUtil } from './src/containers/workspace/util'
import {
  setGuideShow,
  setVersion,
  setMapAnalystGuide,
} from './src/redux/models/home'

import {
  setMapArGuide,
  setMapArMappingGuide,
} from './src/redux/models/ar'

import LaunchGuidePage from './src/components/guide'
import LaunchGuide from './configs/guide'
// import CoworkInfo from './src/containers/tabs/Friend/Cowork/CoworkInfo'

import { setBaseMap } from './src/redux/models/map'
import AppNavigator from './src/containers'

//字体不随系统字体变化
Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false })
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { defaultProps: false })

const { persistor, store } = ConfigStore()

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
    paddingTop: scaleSize(30),
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
    version: PropTypes.string,

    setNav: PropTypes.func,
    setUser: PropTypes.func,
    deleteUser: PropTypes.func,
    setUsers: PropTypes.func,
    openWorkspace: PropTypes.func,
    setShow: PropTypes.func,
    closeMap: PropTypes.func,
    setCurrentMap: PropTypes.func,
    closeWorkspace: PropTypes.func,

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
    setCurrentLayer: PropTypes.func,
    setModules: PropTypes.func,
    setMapModule: PropTypes.func,
    setLicenseInfo: PropTypes.func,
    setGuideShow: PropTypes.func,
    setVersion: PropTypes.func,
    setMapArGuide: PropTypes.func,
    setMapArMappingGuide: PropTypes.func,
    setMapAnalystGuide: PropTypes.func,
  }

  /** 是否是华为设备 */
  isHuawei = false

  constructor(props) {
    super(props)
    const guidePages = LaunchGuide.getGuide(this.props.language) || []
    this.state = {
      sceneStyle: styles.invisibleMap,
      import: null,
      isInit: false,
      /**判断是否显示APP启动引导页，根据launchGuideVersion是否一致和是否有启动页 */
      showLaunchGuide: config.launchGuideVersion > (this.props.appConfig.launchGuideVersion || '0') && guidePages.length > 0,
    }
    // this.preLaunchGuideVersion = this.props.appConfig.launchGuideVersion
    this.props.setModules(config) // 设置模块
    this.props.setNav() // 清空导航记录
    this.initGlobal()
    PT.initCustomPrototype()

    if (config.language && !this.props.configLangSet) {
      this.props.setLanguage(config.language, true)
    } else if (this.props.autoLanguage) {
      this.props.setLanguage('AUTO')
    } else {
      this.props.setLanguage(this.props.language)
    }

    this.loginTimer = undefined

    AppState.addEventListener('change', this.handleStateChange)
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    NetInfo.addEventListener(this.handleNetworkState)

  }

  initGlobal = () => {
    // global.AppState = AppState.currentState
    global.STARTX = undefined  //离线导航起点
    global.ENDX = undefined  //离线导航终点
    // global.HASCHOSE = false  //离线数据选择
    // TODO 动态切换主题，将 global.ThemeType 放入Redux中管理
    global.ThemeType = ThemeType.LIGHT_THEME
    global.BaseMapSize = 1
    //地图比例尺
    global.scaleView = null
    // TODO 从GLOBAL中去除SelectedSelectionAttribute
    global.SelectedSelectionAttribute = null // 框选-属性-关联对象 {layerInfo, index, data}
    this.setIsPad()
    this._getIs64System()
    global.getDevice = this.getDevice
    global.back = this.back // 全局返回事件，根据不同界面有不同返回事件
    global.clickWait = false // 防止重复点击
    global.clearMapData = () => {
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
  }

  componentDidMount() {
    Platform.OS === 'android' && SplashScreen.hide()
    this.initOrientation()
    if(!this.state.showLaunchGuide) {
      this.showUserProtocol()
    }
  }

  componentDidUpdate(prevProps) {
    // 切换用户，重新加载用户配置文件
    if (JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
      this.initDirectories(this.props.user.currentUser.userName)
      this.getUserApplets(this.props.user.currentUser.userName)
      this.reCircleLogin()
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.back)
    // NetInfo.removeEventListener('connectionChange', this.handleNetworkState)
  }

  handleNetworkState = async state => {
    // TODO 网络状态发生变化,wifi切换为移动网络,判断内网服务是否可用
    if(UserType.isIPortalUser(this.props.user.currentUser) || UserType.isOnlineUser(this.props.user.currentUser)) {
      const isConnected = await OnlineServicesUtils.getService()?.checkConnection()
      if (isConnected) {
        Toast.show(getLanguage().Prompt.NETWORK_RECONNECT)
        global.getFriend()?.restartService()
        return
      } else {
        // 无法连接内网, 退出登录
        // global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
        Toast.show(getLanguage().Prompt.NETWORK_ERROR)
      }
    } else if (state.type === 'none' || state.type === 'unknown') {
      Toast.show(getLanguage().Prompt.NETWORK_ERROR)
      return
    }
  }

  onGuidePageEnd = () => {
    this.setState({
      showLaunchGuide: false,
    })
    this.showUserProtocol()
  }

  showUserProtocol = () => {
    if(this.props.isAgreeToProtocol) {
      this.prevLoad()
    } else {
      this.protocolDialog?.setVisible(true)
    }
  }

  prevLoad = async () => {
    if (Platform.OS === 'android') {
      this.requestPermission()
    } else {
      global.Loading.setLoading(true, 'Loading')
      await this.init()
      global.Loading.setLoading(false)
    }
  }

  requestPermission = async () => {
    global.Loading.setLoading(true, 'Loading')
    const results = await PermissionsAndroid.requestMultiple([
      'android.permission.READ_PHONE_STATE',
      // 'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      // 'android.permission.CAMERA',
      // 'android.permission.RECORD_AUDIO',
    ])
    let isAllGranted = true
    for (let key in results) {
      isAllGranted = results[key] === 'granted' && isAllGranted
    }
    //申请 android 11 读写权限
    let permisson11 = await AppUtils.requestStoragePermissionR()
    if (isAllGranted && permisson11) {
      await SMap.setPermisson(true)
      await this.init()
      global.Loading.setLoading(false)
    } else {
      global.SimpleDialog.set({
        text: getLanguage(this.props.language).Prompt.NO_PERMISSION_ALERT,
        cancelText: getLanguage(this.props.language).Prompt.CONTINUE,
        cancelAction: /*AppUtils.AppExit*/ async () =>{
          await this.init()
          global.Loading.setLoading(false)
        },
        confirmText: getLanguage(this.props.language).Prompt.REQUEST_PERMISSION,
        confirmAction: this.requestPermission,
      })
      global.SimpleDialog.setVisible(true)
    }
  }

  init = async () => {
    await this.initEnvironment()
    await this.initLocation()
    await this.initUser()
    await this.openWorkspace()
    this.checkImportData()
    // this.initOrientation()
    this.reCircleLogin()

    // 显示界面，之前的为预加载
    this.setState({ isInit: true }, () => {
      this.login()
    })

  }

  initEnvironment = async () => {
    await SMap.initEnvironment('iTablet')
    await AppInfo.setRootPath('/' + ConstPath.AppPath.replace(/\//g, ''))
    SOnlineService.init()
    SIPortalService.init(this.props.user.currentUser.serverUrl)
    await this.initLicense()
    SMap.setModuleListener(this.onInvalidModule)
    SMap.setLicenseListener(this.onInvalidLicense)
    if (Platform.OS === 'android') {
      //  this.initSpeechManager()
      SSpeechRecognizer.init('5dafb910')
    } else {
      SSpeechRecognizer.init('5b63b509')
    }
    await this.getVersion()
    this.isHuawei = await SARMap.isHuawei()
  }

  initLocation = async () => {
    await SLocation.openGPS()
    if (this.props.peripheralDevice !== 'local') {
      SLocation.changeDevice(this.props.peripheralDevice)
    }
  }

  initLicense = async () => {
    await this.inspectEnvironment()
  }

  /** 初始化用户数据 **/
  initUser = async () => {
    try {
      // 获取用户登录记录
      let users = await ConfigUtils.getUsers()
      let userName = 'Customer'
      if (users.length === 0 || UserType.isProbationUser(users[0])) {
        // 若没有任何用户登录，则默认Customer登录
        this.props.setUser({
          userName: userName,
          userId: userName,
          userType: UserType.PROBATION_USER,
        })
      } else {
        await this.props.setUsers(users)
        userName = users[0].userName

        // 加载用户底图
        await this.loadUserBaseMaps()
      }
      await this.initDirectories(userName)
      await AppInfo.setUserName(userName)
      await this.getUserApplets(userName)
      this.createXmlTemplate()
    } catch (e) {
      //
    }
  }

  /**
   * 加载当前用户的底图
   */
  async loadUserBaseMaps(){
    let curUserBaseMaps = []
    // 根据当前用户id获取当前用户的底图数组
    if(this.props.user.currentUser.userId){
      curUserBaseMaps = this.props.baseMaps[this.props.user.currentUser.userId]
    }
     
    // 如果当前用户底图数组没有值或不存在就，设置为系统默认的底图数组
    if (!curUserBaseMaps) {
      curUserBaseMaps = this.props.baseMaps['default']
    }
    let arrPublishServiceList = await GetUserBaseMapUtil.loadUserBaseMaps(this.props.user.currentUser, curUserBaseMaps)
    // 当公有服务列表数组有元素时，就遍历这个数组
    if (arrPublishServiceList.length > 0) {
      for (let i = 0, n = arrPublishServiceList.length; i < n; i++) {
        // 当公有服务列表的元素的地图名字和地图信息数组，以及地图信息数组的地图服务地址都存在时，更新当前用户的底图
        if (arrPublishServiceList[i].restTitle && arrPublishServiceList[i].mapInfos[0] && arrPublishServiceList[i].mapInfos[0].mapUrl){
          let list = await GetUserBaseMapUtil.addServer(arrPublishServiceList[i].restTitle, arrPublishServiceList[i].mapInfos[0].mapUrl)
          // 将更改完成后的当前用户的底图数组，进行持久化存储，此处会触发页面刷新（是其他地方能够拿到用户底图的关键）
          this.props.setBaseMap &&
            this.props.setBaseMap({
              userId: currentUser.userId,
              baseMaps: list,
            })
        }
      }
    }

  }

  // 初始化文件目录
  initDirectories = async (userName = 'Customer') => {
    try {
      global.homePath = await FileTools.appendingHomeDirectory()
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
      isCreate = this.initUserDirectories(userName) && isCreate
      if (!isCreate) {
        Toast.show('创建文件目录失败')
      }
    } catch (e) {
      Toast.show('创建文件目录失败')
    }
  }

   initUserDirectories = async (userName = 'Customer') => {
     if (!(await FileTools.fileIsExist(ConstPath.UserPath + userName))) {
       await FileTools.initUserDefaultData(userName)
     }
   }

  createXmlTemplate = async() =>{
    const fileDir = await FileTools.appendingHomeDirectory(ConstPath.ExternalData + '/' + ConstPath.Module.XmlTemplate)
    let exists = await fs.exists(fileDir)
    if (!exists) {
      await fs.mkdir(fileDir)
    }
  }

  openWorkspace = async () => {
    try {
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

      this.props.openWorkspace({ server: path })
    } catch(e) {
      //
    }
  }

  /** 检查本地离线许可 */
  inspectEnvironment = async () => {
    //todo 初始化云许可，私有云许可状态
    let serialNumber = await SMap.initSerialNumber('')
    if (serialNumber !== '') {
      await SMap.reloadLocalLicense()
    }

    let status = await SMap.getEnvironmentStatus()
    this.props.setLicenseInfo(status)
  }

  checkImportData = async () => {
    await FileTools.handleUriData()
    await this.getImportState()
    await this.addImportExternalDataListener()
    await this.addGetShareResultListener()
  }

  //初始化横竖屏显示方式
  initOrientation = async () => {
    if (Platform.OS === 'ios') {
      Orientation.getSpecificOrientation((e, orientation) => {
        this.showStatusBar(orientation)
        this.props.setShow({ orientation: orientation })
      })
      Orientation.removeSpecificOrientationListener(this.orientation)
      Orientation.addSpecificOrientationListener(this.orientation)
    } else {
      Orientation.getOrientation((e, orientation) => {
        this.showStatusBar(orientation)
        this.props.setShow({ orientation: orientation })
      })
      Orientation.removeOrientationListener(this.orientation)
      Orientation.addOrientationListener(this.orientation)
    }
  }

  reCircleLogin = () => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      if (this.loginTimer !== undefined) {
        clearInterval(this.loginTimer)
        this.loginTimer = undefined
      }
      this.loginTimer = setInterval(this.loginOnline, 60000 * 10)
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      if (this.loginTimer !== undefined) {
        clearInterval(this.loginTimer)
        this.loginTimer = undefined
      }
      this.loginTimer = setInterval(() => {
        let url = this.props.user.currentUser.serverUrl
        let userName = this.props.user.currentUser.userName
        let password = this.props.user.currentUser.password
        SIPortalService.login(url, userName, password, true)
      }, 60000 * 10)
    }
  }

  loginOnline = async () => {
    // let isEmail = this.props.user.currentUser.isEmail
    let nickname = this.props.user.currentUser.nickname
    let password = this.props.user.currentUser.password
    let userType = this.props.user.currentUser.userType

    if(userType === UserType.COMMON_USER) {
      await SOnlineService.setOnlineServiceSite('DEFAULT')
    } else {
      await SOnlineService.setOnlineServiceSite('JP')
    }

    let bLogin = false
    // if (isEmail === true) {
    bLogin = await SOnlineService.login(nickname, password)
    // } else if (isEmail === false) {
    //   bLogin = await SOnlineService.loginWithPhoneNumber(userName, password)
    // }
    return bLogin
  }

  logoutOnline = () => {
    try {
      if (this.props.user.userType !== UserType.PROBATION_USER) {
        SOnlineService.logout()
      }
      this.props.closeWorkspace(async () => {
        SOnlineService.removeCookie()
        let customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath +
          ConstPath.RelativeFilePath.Workspace[
            this.props.language === 'CN' ? 'CN' : 'EN'
          ],
        )
        this.props.deleteUser(this.props.user.currentUser)
        this.props.setUser({
          userName: 'Customer',
          nickname: 'Customer',
          userType: UserType.PROBATION_USER,
        })
        NavigationService.popToTop('Tabs')
        this.props.openWorkspace({ server: customPath })
        Toast.show(getLanguage(this.props.language).Profile.LOGIN_INVALID)
      })
    } catch (e) {
      //
    }
  }

  login = async bResetMsgService => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      let result
      result = await this.loginOnline()
      if (result === true) {
        result = await FriendListFileHandle.initFriendList(this.props.user.currentUser)
      } else {
        // iOS防止第一次登录timeout
        result = await this.loginOnline()
        result = result && await FriendListFileHandle.initFriendList(this.props.user.currentUser)
      }
      if(result === true){
        let userType = this.props.user.currentUser.userType
        // let JSOnlineservice = new OnlineServicesUtils(userType === UserType.COMMON_USER ? 'online' : 'OnlineJP')
        let JSOnlineservice = OnlineServicesUtils.getService(userType === UserType.COMMON_USER ? 'online' : 'OnlineJP')
        //登录后更新用户信息 zhangxt
        let userInfo = await JSOnlineservice.getUserInfo(this.props.user.currentUser.nickname, true)
        let user = {
          userName: userInfo.userId,
          password: this.props.user.currentUser.password,
          nickname: userInfo.nickname,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          userId: userInfo.userId,
          isEmail: true,
          userType: UserType.COMMON_USER,
          roles: userInfo.roles,
        }
        await this.props.setUser(user)
        //这里如果是前后台切换，就不处理了，friend里面处理过 add xiezhy
        if(bResetMsgService !== true){
          //TODO 处理app加载流程，确保登录后再更新消息服务
          global.getFriend?.().onUserLoggedin()
        }
      } else {
        //这里如果是前后台切换，就不处理了，friend里面处理过 add xiezhy
        if(bResetMsgService !== true){
          this.logoutOnline()
        }
      }
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      let url = this.props.user.currentUser.serverUrl
      let userName = this.props.user.currentUser.userName
      let password = this.props.user.currentUser.password
      SIPortalService.init(this.props.user.currentUser.serverUrl)
      let result = await SIPortalService.login(url, userName, password, true)
      if (typeof result === 'boolean' && result) {
        //登录后更新用户信息 zhangxt
        let info = await SIPortalService.getMyAccount()
        result = await FriendListFileHandle.initFriendList(this.props.user.currentUser)
        if (info) {
          let userInfo = JSON.parse(info)
          await this.props.setUser({
            serverUrl: url,
            userName: userInfo.name,
            userId: userInfo.name,
            password: password,
            nickname: userInfo.nickname,
            email: userInfo.email,
            userType: UserType.IPORTAL_COMMON_USER,
            roles: userInfo.roles,
          })
        }
        global.getFriend().onUserLoggedin()
      } else {
        global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
      }
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
        if (key !== 'APPLET_ADD') {
          for (let item of mapModules) {
            needToUpdate = this.props.appConfig.oldMapModules.indexOf(item.key) < 0
            if (item.key === key || needToUpdate) {
              myMapModules.push(item)
              break
            }
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

  getDevice = () => {
    return this.props.device
  }

  _getIs64System = async () => {
    try {
      global.SYSTEM_VERSION = "x64"
      // if (Platform.OS === 'android') 
      {
        let b64 = await AppUtils.is64Bit()
        if (b64 === false) {
          global.SYSTEM_VERSION = "x32"
        }
      }
    } catch (e) {
      //
    }
  }

  setIsPad = async () => {
    let isPad
    if (Platform.OS === 'ios') {
      isPad = Platform.isPad
    } else {
      isPad = await AppUtils.isPad()
    }
    global.isPad = isPad
  }

  getVersion = async () => {
    global.language = this.props.language
    let appInfo = await AppInfo.getAppInfo()
    let bundleInfo = await AppInfo.getBundleVersion()
    global.APP_VERSION = 'V' + appInfo.versionName + '_' + appInfo.versionCode
      + '_' + bundleInfo.BundleVersion + '_' + bundleInfo.BundleBuildVersion
    global.isAudit = await SMap.isAudit()
    global.GUIDE_VERSION = appInfo.GuideVersion
  }

  back = () => {
    if (this.state.showLaunchGuide) {
      // this.setState({
      //   showLaunchGuide: false,
      // }, () => {
      //   Orientation.unlockAllOrientations()
      // })
      return true
    } else {
      return BackHandlerUtil.backHandler(this.props.nav, this.props.backActions)
    }
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

  handleStateChange = async appState => {
    if (appState === 'active') {
      // if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.login(true)
      this.reCircleLogin()
      // }
      // if (!this.props.nav.key && this.props.map.currentMap.name) {
      //   // (async function() {
      //   try {
      //     await this.props.closeMap()
      //     // await this._removeGeometrySelectedListener()
      //     await this.props.setCurrentAttribute({})
      //     // this.setState({ showScaleView: false })
      //     //此处置空unmount内的判断会失效 zhangxt
      //     // global.Type = null
      //     global.clearMapData()

      //     // 移除协作时，个人/新操作的callout
      //     await SMap.removeUserCallout()
      //     await SMap.clearUserTrack()

      //     if (global.coworkMode) {
      //       CoworkInfo.setId('') // 退出任务清空任务ID
      //       global.coworkMode = false
      //       global.getFriend().setCurMod(undefined)
      //       // NavigationService.goBack('CoworkTabs')
      //     }
      //   } catch(e) {

      //   }
      // }.bind(this)())
      // }
      if (Platform.OS === 'ios') {
        Orientation.getSpecificOrientation((e, orientation) => {
          this.props.setShow({ orientation: orientation })
        })
      } else {
        Orientation.getOrientation((e, orientation) => {
          this.props.setShow({ orientation: orientation })
        })
      }
    }
  }

  showStatusBar = async orientation => {
    let result = await AsyncStorage.getItem('StatusBarVisible')
    let visible = result === 'true'
    if (orientation.indexOf('LANDSCAPE') === 0) {
      StatusBar.setHidden(true, 'slide')
    } else {
      StatusBar.setHidden(visible, 'slide')
    }
  }

  orientation = o => {
    this.showStatusBar(o)
    // iOS横屏时为LANDSCAPE-LEFT 或 LANDSCAPE-RIGHT，此时平放，o为LANDSCAPE，此时不做处理
    this.props.setShow({
      orientation: o,
    })
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
        // if(global.shareFilePath&&global.shareFilePath.length>1){
        // FileTools.deleteFile(global.shareFilePath)
        // }
        // result && this.import.setDialogVisible(true)
      },
    })
  }

  getImportState = async () => {
    let result = await FileTools.getImportState()
    if (result === null) return
    result && this.import.setDialogVisible(true)
  }

  // 初始化录音
  // initSpeechManager = async () => {
  //   try {
  //     global.SpeechManager = new SpeechManager()
  //     await global.SpeechManager.init()
  //   } catch (e) {
  //     Toast.show('语音初始化失败')
  //   }
  // }

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
      if (global.openWorkspace) {
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

  //退出app
  exitApp = async () => {
    try {
      await AppUtils.AppExit()
    } catch (error) {
      Toast.show(getLanguage(this.props.language).Profile.LICENSE_EXIT_FAILED)
    }
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
            global.Loading.setLoading(
              true,
              getLanguage(this.props.language).Friends.IMPORT_DATA,
            )
            let homePath = global.homePath
            let importPath = homePath + '/iTablet/Import'
            let filePath = importPath + '/import.zip'
            let isImport = false
            if (await FileTools.fileIsExist(filePath)) {
              await FileTools.unZipFile(filePath, importPath)
              let dataList = await DataHandler.getExternalData(importPath)
              let results = []
              for (let i = 0; i < dataList.length; i++) {
                results.push(await DataHandler.importExternalData(this.props.user.currentUser, dataList[i]))
              }
              isImport = results.some(value => value === true)
            }
            FileTools.deleteFile(importPath)
            isImport
              ? Toast.show(getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS)
              : Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
            global.Loading.setLoading(false)
          } catch (error) {
            Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
            global.Loading.setLoading(false)
          }
        }}
        cancelAction={async () => {
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
          this.prevLoad()
        }}
        cancel={() =>{
          this.protocolDialog.setVisible(false)
          global.SimpleDialog.set({
            renderCustomeView:()=>{
              return (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // height: scaleSize(200),
                    marginTop: scaleSize(10),
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontSize: scaleSize(35),
                      lineHeight: scaleSize(50),
                      marginTop: scaleSize(10),
                      color: color.theme_white,
                      marginHorizontal: scaleSize(10),
                      textAlign: 'center',
                    }}
                  >
                    {getLanguage(this.props.language).Protocol.REMINDER}
                  </Text>
                  <Text
                    style={{
                      fontSize: scaleSize(24),
                      lineHeight: scaleSize(32),
                      color: color.theme_white,
                      marginTop: scaleSize(20),
                      marginHorizontal: scaleSize(20),
                      textAlign: 'left',
                    }}
                  >
                    {getLanguage(this.props.language).Protocol.AGREEMENT}
                  </Text>
                </View>
              )

            },
            cancelText: getLanguage(this.props.language).Protocol.AGAIN,
            cancelAction: () => { this.protocolDialog.setVisible(true) ,this.protocolDialog.setconfirmBtnDisable(true)},
            confirmText: getLanguage(this.props.language).Protocol.CONFIRM_EXIT,
            confirmAction: () => { this.exitApp() },
          })
          global.SimpleDialog.setVisible(true)
        }
        }
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

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => global.SimpleDialog = ref} />
  }

  renderARDeviceListDialog = () => {
    return (
      <SimpleDialog
        ref={ref => global.ARDeviceListDialog = ref}
        buttonMode={'list'}
        text={this.isHuawei
          ? getLanguage(this.props.language).Prompt.DONOT_SUPPORT_ARENGINE
          : getLanguage(this.props.language).Prompt.DONOT_SUPPORT_ARCORE
        }
        confirmText={getLanguage(this.props.language).Prompt.GET_SUPPORTED_DEVICE_LIST}
        installText={getLanguage(global.language).Prompt.INSTALL}
        confirmAction={() => {
          NavigationService.navigate('Protocol', {
            type: this.isHuawei ? 'AREngineDevice' : 'ARDevice',
          })
        }}
        installBtnVisible={true}
        installAction={()=>{SARMap.installARCore()}}
        confirmTitleStyle={{ color: '#4680DF' }}
        cancelTitleStyle={{ color: '#4680DF' }}
      />
    )
  }

  renderGuidePage = () => {
    const guidePages = LaunchGuide.getGuide(this.props.language)
    return (
      <LaunchGuidePage
        ref={ref => this.guidePage = ref}
        defaultVisible={true}
        data={guidePages}
        device={this.props.device}
        getCustomGuide={LaunchGuide.getCustomGuide}
        dismissCallback={this.onGuidePageEnd}
      />
    )
  }

  renderInputDialog = () => {
    return (
      <InputDialog
        ref={ref => DialogUtils.setInputDialog(ref)}
        // title={
        //   getLanguage(this.props.language).Template.COLLECTION_TEMPLATE_NAME
        // }
        // confirmAction={async value => {
        //   await this.goBack({
        //     title: value,
        //   })
        //   this.dialog.setDialogVisible(false)
        // }}
        // confirmBtnTitle={getLanguage(global.language).Map_Settings.CONFIRM}
        // cancelBtnTitle={getLanguage(global.language).Map_Settings.CANCEL}
      />
    )
  }

  renderRoot = () => {
    return (this.state.isInit && (
      <View style={{ flex: 1 }}>
        <View style={[
          { flex: 1 },
          screen.isIphoneX() && // global.getDevice().orientation.indexOf('LANDSCAPE') >= 0 && // global.getDevice() &&
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
          {/* <AppNavigator /> */}
          <RootNavigator
            appConfig={this.props.appConfig}
            device={this.props.device}
            setModules={this.props.setModules}
            setNav={this.props.setNav}
          />
        </View>
      </View>
    ))
  }

  render() {
    return (
      <>
        {this.state.showLaunchGuide ? this.renderGuidePage() : this.renderRoot()}
        {this.renderImportDialog()}
        {this.state.isInit && this.renderARDeviceListDialog()}
        {this._renderProtocolDialog()}
        <Loading ref={ref => global.Loading = ref} initLoading={false} />
        <MyToast ref={ref => global.Toast = ref} />
        {this.renderSimpleDialog()}
        {this.renderInputDialog()}
      </>
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
    version: state.home.toJS().version,
    baseMaps: state.map.toJS().baseMaps,
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
  setModules,
  setMapModule,
  setLicenseInfo,
  setGuideShow,
  setVersion,
  setMapArGuide,
  setMapArMappingGuide,
  setMapAnalystGuide,
  deleteUser,
  closeWorkspace,
  setBaseMap,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    {/*<PersistGate loading={<Loading info="Loading"/>} persistor={persistor}>*/}
    <PersistGate loading={null} persistor={persistor}>
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
