/*global global*/
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
  Permission,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import NetInfo from "@react-native-community/netinfo"
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import { setNav } from './redux/models/nav'
import { setUser, setUsers, deleteUser, setExpireDate } from './redux/models/user'
import { setAgreeToProtocol, setLanguage, setMapSetting } from './redux/models/setting'
import { setPointStateText, setDeviceConnectionMode, setPositionGGA } from './redux/models/location'
import {
  setEditLayer,
  setSelection,
  setCurrentLayer,
} from './redux/models/layers'
import {
  openWorkspace,
  closeMap,
  setCurrentMap,
  saveMap,
  closeWorkspace,
} from './redux/models/map'
import {
  setCurrentTemplateInfo,
  setCurrentTemplateList,
  setTemplate,
} from './redux/models/template'
import { setModules } from './redux/models/appConfig'
import { setMapModule, addMapModule, loadAddedModule } from './redux/models/mapModules'
import { Dialog, Loading, MyToast, InputDialog, Dialog2, InputDialog2 } from './components'
import { setAnalystParams } from './redux/models/analyst'
import { setCollectionInfo } from './redux/models/collection'
import { setShow, setNetInfo } from './redux/models/device'
import { setLicenseInfo } from './redux/models/license'
import { FileTools, SplashScreen } from './native'
import ConfigStore from './redux/store'
import { scaleSize, Toast, screen, DialogUtils, GetUserBaseMapUtil, AppEvent } from './utils'
import * as OnlineServicesUtils from './utils/OnlineServicesUtils'
import RootNavigator from './containers/RootNavigator'
import { color } from './styles'
import { ConstPath, ThemeType, UserType } from './constants'
import * as PT from './customPrototype'
import NavigationService from './containers/NavigationService'
import Orientation from 'react-native-orientation'
import { BundleTools, RNFS as fs, SOnlineService, SScene, SIPortalService, SSpeechRecognizer, SLocation, ConfigUtils, AppInfo ,SARMap, SData} from 'imobile_for_reactnative'
// import SplashScreen from 'react-native-splash-screen'
import { getLanguage } from './language/index'
import { ProtocolDialog } from './containers/tabs/Home/components'
import FriendListFileHandle from './containers/tabs/Friend/FriendListFileHandle'
import { SimpleDialog } from './containers/tabs/Friend'
import DataHandler from './utils/DataHandler'
let AppUtils = NativeModules.AppUtils
import config from '../configs/config'
import _mapModules, { mapModules } from '../configs/mapModules'
import { BackHandlerUtil } from './containers/workspace/util'
import {
  setGuideShow,
  setVersion,
  setMapAnalystGuide,
} from './redux/models/home'

import {
  setMapArGuide,
  setMapArMappingGuide,
} from './redux/models/ar'

import LaunchGuidePage from './components/guide'
import LaunchGuide from '../configs/guide'
// import CoworkInfo from './src/containers/tabs/Friend/Cowork/CoworkInfo'

import { setBaseMap } from './redux/models/map'
// import AppNavigator from './containers'
import AppDialog from '@/utils/AppDialog'
import AppInputDialog from '@/utils/AppInputDialog'
import BundleUtils from './utils/BundleUtils'
import { addNetworkChangeEventListener } from '@/utils/NetworkHandler'
import { RTKFixType } from 'imobile_for_reactnative/NativeModule/interfaces/SLocation'
import { checkAllPermission } from './utils/PermissionAndroidUtils'

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
    netInfo: PropTypes.object,
    appConfig: PropTypes.object,
    version: PropTypes.string,

    setNav: PropTypes.func,
    setUser: PropTypes.func,
    deleteUser: PropTypes.func,
    setUsers: PropTypes.func,
    setExpireDate: PropTypes.func,
    openWorkspace: PropTypes.func,
    setShow: PropTypes.func,
    setNetInfo: PropTypes.func,
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
    addMapModule: PropTypes.func,
    setLicenseInfo: PropTypes.func,
    setGuideShow: PropTypes.func,
    setVersion: PropTypes.func,
    setMapArGuide: PropTypes.func,
    setMapArMappingGuide: PropTypes.func,
    setMapAnalystGuide: PropTypes.func,
    loadAddedModule: PropTypes.func,
    setPointStateText: PropTypes.func,
    setDeviceConnectionMode: PropTypes.func,
    setPositionGGA: PropTypes.func,
  }

  /** 是否是华为设备 */
  isHuawei = false

  /** app是否初始化 */
  // isAppInit = false
  /** 记录app状态,是否活跃 */
  appState = ''

  /** 登录状态断网,退出登录Timer */
  logoutTimer = null

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

    AppEvent.addListener('network_change', this.handleNetworkState)

    // 初始化bundle工具,用于加载小插件
    BundleUtils.init({
      addMapModule: this.props.addMapModule,
    })
    global.coworkMode = false // 初始化协作模块标识
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
    if(Platform.OS === 'android'){
      SplashScreen.hide()
      AppEvent.addListener("androidPremissionRequstCallback",this.initUser)
    }
    this.initOrientation()
    if (!this.state.showLaunchGuide) {
      this.showUserProtocol()
    } else {
      this.login()
    }
  }

  componentDidUpdate(prevProps) {
    // 切换用户，重新加载用户配置文件
    if (
      JSON.stringify(prevProps.user.currentUser) !== JSON.stringify(this.props.user.currentUser) ||
      JSON.stringify(prevProps.user.users) !== JSON.stringify(this.props.user.users)
    ) {
      this.initDirectories(this.props.user.currentUser.userName)
      this.getUserApplets(this.props.user.currentUser.userName)
      this.reCircleLogin()
    }

    // 登录状态,断网,添加重新登录监听
    if (
      (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)) &&
      prevProps.user.expireDate !== this.props.user.expireDate
    ) {
      SData.getEnvironmentStatus().then(status => {
        // 若无许可,则不需要添加重新登录提示监听
        if (!status.isLicenseValid) return

        if (this.props.user.expireDate && !this.logoutTimer) {
          // 若有离线登录过期时间,则新增心跳
          this.logoutTimer = setInterval(this.checkNetAndLicenseValid, 15 * 1000)
        } else if (!this.props.user.expireDate){
          // 若无离线登录过期时间,则删除心跳
          this.logoutTimer && clearInterval(this.logoutTimer)
          this.logoutTimer = null
        }
      })
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.back)
    SLocation.removeChangeDeviceSuccessListener()
    // 移除蓝牙状态变化监听
    SLocation.setBluetoothStateListener()
    // NetInfo.removeEventListener('connectionChange', this.handleNetworkState)
  }

  handleNetworkState = async state => {
    this.props.setNetInfo(state)
    // TODO 网络状态发生变化,wifi切换为移动网络,判断内网服务是否可用
    if (state.isConnected && (UserType.isIPortalUser(this.props.user.currentUser) || UserType.isOnlineUser(this.props.user.currentUser))) {
      const isConnected = await OnlineServicesUtils.getService()?.checkConnection()
      if (isConnected) {
        // 网络连接,重启登录,并开启心跳
        await this.login()
        this.reCircleLogin()
        Toast.show(getLanguage().Prompt.NETWORK_RECONNECT)
        global.getFriend()?.restartService()
        return
      } else {
        // 无法连接内网, 退出登录
        // global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
        await this.checkNetAndLicenseValid()
        Toast.show(getLanguage().Prompt.NO_NETWORK)
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
    if (this.props.isAgreeToProtocol) {
      this.prevLoad()
    } else {
      this.protocolDialog?.setVisible(true)
    }
  }

  prevLoad = async () => {
    if (Platform.OS === 'android') {
      this.checkPermission()
    } else {
      global.Loading.setLoading(true, 'Loading')
      await this.init(true)
      global.Loading.setLoading(false)
    }
  }

  checkPermission = async () => {
    global.Loading.setLoading(true, 'Loading')
    const permission = await checkAllPermission()
    if(permission){
      await SData.setPermission(true)
      await this.init(true)
      global.Loading.setLoading(false)
    }else{
      await this.init(false)
      global.Loading.setLoading(false)
    }
    // if(Platform.OS === 'android') {
    //   const sdkVesion = Platform.Version
    //   // android 12 的版本api编号 31 32 android 13的版本api编号 33
    //   if(sdkVesion >= 31) {
    //     permissionList.push('android.permission.BLUETOOTH_CONNECT')
    //     permissionList.push('android.permission.BLUETOOTH_SCAN')
    //     permissionList.push("android.permission.RECEIVE_BOOT_COMPLETED")
    //     permissionList.push('android.permission.BLUETOOTH_ADVERTISE')
    //   }
    // }
    // const results = await PermissionsAndroid.requestMultiple(permissionList)
    // let isAllGranted = true
    // for (let key in results) {
    //   isAllGranted = results[key] === 'granted' && isAllGranted
    // }
    //申请 android 11 读写权限
    // let permisson11 = await AppUtils.requestStoragePermissionR()
    // if (isAllGranted && permisson11) {
    //   await SData.setPermission(true)
    //   await this.init(true)
    //   global.Loading.setLoading(false)
    // } else {
    //   global.SimpleDialog.set({
    //     text: getLanguage(this.props.language).Prompt.NO_PERMISSION_ALERT,
    //     cancelText: getLanguage(this.props.language).Prompt.CONTINUE,
    //     cancelAction: /*AppUtils.AppExit*/ async () =>{
    //       await this.init(false)
    //       global.Loading.setLoading(false)
    //     },
    //     confirmText: getLanguage(this.props.language).Prompt.REQUEST_PERMISSION,
    //     confirmAction: this.requestPermission,
    //   })
    //   global.SimpleDialog.setVisible(true)
    // }
  }

  initBluetooth = async () => {
    // 进入app，同步到系统的蓝牙状态
    if(Platform.OS === 'android') {
      const isOpen = await SLocation.bluetoothIsOpen()
      this.props.setDeviceConnectionMode(isOpen)
    }

    // 监听蓝牙状态变化
    SLocation.setBluetoothStateListener((bluetoothState: SLocation.bluetoothStateType) => {
      switch(bluetoothState){
        case 1:
          this.props.setDeviceConnectionMode(true)
          break
        case 2:
          this.props.setDeviceConnectionMode(false)
          break
      }
    })
  }

  init = async (hasPermission) => {

    await this.initEnvironment()
    await this.initLocation()
    await this.initUser()
    await this.openWorkspace()
    this.checkImportData()
    // this.initOrientation()
    this.reCircleLogin()
    await this.initBluetooth()

    if(hasPermission) {
      addNetworkChangeEventListener()
    }

    // 显示界面，之前的为预加载
    this.setState({ isInit: true }, () => {
      global.isLogging = true
      this.login()
    })

  }

  initEnvironment = async () => {
    AppUtils.initApp()
    // await SMap.initEnvironment('iTablet')
    await AppInfo.setRootPath('/' + config.alias.replace(/\//g, ''))
    // await AppInfo.setRootPath('/' + ConstPath.AppPath.replace(/\//g, ''))
    SOnlineService.init()
    SIPortalService.init(this.props.user.currentUser.serverUrl)
    await this.initLicense()
    SData.setModuleListener(this.onInvalidModule)
    SData.setLicenseListener(this.onInvalidLicense)
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
    // SLocation.addSlocationStateListener((type) => {
    //   let text = ''
    //   switch (type) {
    //     case 0:
    //       text = "Invalid"
    //       break
    //     case 1:
    //       text = "GPS"
    //       break
    //     case 2:
    //       text = "DGPS"
    //       break
    //     case 3:
    //       text = "PPS"
    //       break
    //     case 4:
    //       text = "RTK"
    //       break
    //     case 5:
    //       text = "FloatRTK"
    //       break
    //     case 6:
    //       text = "Estimated"
    //       break
    //     case 7:
    //       text = "Manual"
    //       break
    //     case 8:
    //       text = "Simulation"
    //       break
    //     case 9:
    //       text = "WAAS"
    //       break
    //     default:
    //       text = 'No data'
    //       break
    //   }
    //   // Toast.show(getLanguage().SLOCATION_STATE_CURRENT + ":( " + type + " )")
    //   if(type === RTKFixType.invalid || type === -1) {
    //     text = getLanguage().UNKONW
    //   }
    //   // console.warn("state text: " + JSON.stringify(text))
    //   // this.props.setPointStateText(getLanguage().SLOCATION_STATE_CURRENT + ": "+ text)
    //   this.props.setPointStateText(text)

    // })

    // 差分信息
    SLocation.setNMEAGGAListener((gga: SLocation.GGA) =>{
      // console.warn("gga: " + JSON.stringify(gga))
      gga && this.props?.setPositionGGA(gga)
    })
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
  async loadUserBaseMaps() {
    let curUserBaseMaps = []
    // 根据当前用户id获取当前用户的底图数组
    if (this.props.user.currentUser.userId) {
      curUserBaseMaps = this.props.baseMaps[this.props.user.currentUser.userId]
    }

    // 如果当前用户底图数组没有值或不存在就，设置为系统默认的底图数组
    if (!curUserBaseMaps) {
      curUserBaseMaps = this.props.baseMaps['default']
    }
    const listResult = await GetUserBaseMapUtil.getUserBaseMaps(this.props.user.currentUser, curUserBaseMaps)
    // 将更改完成后的当前用户的底图数组，进行持久化存储，此处会触发页面刷新（是其他地方能够拿到用户底图的关键）
    this.props.setBaseMap &&
    this.props.setBaseMap({
      userId: this.props.user.currentUser.userId,
      baseMaps: listResult,
    })

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
        console.error('创建文件目录失败')
      }
    } catch (e) {
      console.error('创建文件目录失败')
    }
  }

  initUserDirectories = async (userName = 'Customer') => {
    if (!(await FileTools.fileIsExist(ConstPath.UserPath + userName))) {
      await FileTools.initUserDefaultData(userName)
    }
  }

  createXmlTemplate = async () => {
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
    } catch (e) {
      //
    }
  }

  /** 检查本地离线许可 */
  inspectEnvironment = async () => {
    //todo 初始化云许可，私有云许可状态
    let serialNumber = await SData.initSerialNumber()
    if (serialNumber !== '') {
      await SData.reloadLocalLicense()
    }

    let status = await SData.getEnvironmentStatus()
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

  /**
   * 检查网络和许可,是否支持登录成功或使用离线模式
   * @returns
   *    网络正常,返回true
   *    网络断开,返回false
   *    网络断开,许可无效,退出登录 返回false
   */
  checkNetAndLicenseValid = async () => {
    try {
      // 检查网络状态
      if (!this.props.netInfo.isConnected) {
        const status = await SData.getEnvironmentStatus()
        const currentDate = new Date().getTime()
        // 查看许可是否存在,否则退出
        if (
          (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)) &&
          (!status.isLicenseValid || this.props.user.expireDate && this.props.user.expireDate < currentDate)
        ) {
          if (!status.isLicenseValid) {
            // 退出
            this.logout()
            return false
          }
          // 如果在地图界面,需要提示保存后退出
          let inMap = false
          if (this.props.nav.routes.length > 0) {
            for (const route of this.props.nav.routes) {
              if (route.name === 'MapStack') {
                inMap = true
                break
              }
            }
          }
          if (inMap) {
            global.SimpleDialog.set({
              text: getLanguage().LOGIN_INVALID,
              cancelText: getLanguage().LOG_OUT,
              cancelAction: async () =>{
                // 退出
                this.logout()
              },
              confirmText: getLanguage().SAVE_LOGOUT,
              confirmAction: async () => {
                // 保存
                await this.props.saveMap({ mapName: this.props.map.currentMap.name || 'DefaultMap' })
                // 退出
                this.logout()
              },
            })
            global.SimpleDialog.setVisible(true)
          }

          // if (UserType.isOnlineUser(this.props.user.currentUser)) {
          //   this.logoutOnline()
          // } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
          //   global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
          //   // 退出登录成功后,移除过期时间
          //   this.props.setExpireDate({
          //     date: undefined,
          //   })
          // }
        } else if (this.props.user.expireDate === undefined) {
          const expireDate = currentDate + config.offlineExpireDate
          // 有许可状态,则记录需要重新登录时间(断网时间 + 24h)
          // 若已经记录有重新登录时间,则跳过
          // 若在重新登录时间之前连上网络,则删除重新登录时间
          this.props.setExpireDate({
            date: expireDate,
          })
        }
        return false
      }
      return true
    } catch(e) {
      return false
    }
  }

  reCircleLogin = async () => {
    if (!(await this.checkNetAndLicenseValid())) {
      if (this.loginTimer !== undefined) {
        clearInterval(this.loginTimer)
        this.loginTimer = undefined
      }
      return
    }
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

      SIPortalService.init(this.props.user.currentUser.serverUrl)
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

    if (userType === UserType.COMMON_USER) {
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
        // NavigationService.popToTop('Tabs')
        NavigationService.navigate('Tabs', { screen: 'Home' })
        this.props.openWorkspace({ server: customPath })
        Toast.show(getLanguage(this.props.language).Profile.LOGIN_INVALID)
        // 退出登录成功后,移除过期时间
        this.props.setExpireDate({
          date: undefined,
        })
      })
    } catch (e) {
      //
    }
  }

  login = async bResetMsgService => {
    if (!(await this.checkNetAndLicenseValid())) {
      return
    }
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
      if (result === true) {
        let userType = this.props.user.currentUser.userType
        // let JSOnlineservice = new OnlineServicesUtils(userType === UserType.COMMON_USER ? 'online' : 'OnlineJP')
        let JSOnlineservice = OnlineServicesUtils.getService(userType === UserType.COMMON_USER ? 'online' : 'OnlineJP')
        //登录后更新用户信息 zhangxt
        let userInfo = await JSOnlineservice.getUserInfo(this.props.user.currentUser.nickname, true)
        // 防止获取用户信息错误,导致用户为Customer,且为登录状态 ysl
        if (userInfo.userId !== undefined) {
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
        }
        // 登录成功后,移除过期时间
        this.props.setExpireDate({
          date: undefined,
        })
        //这里如果是前后台切换，就不处理了，friend里面处理过 add xiezhy
        if (bResetMsgService !== true) {
          //TODO 处理app加载流程，确保登录后再更新消息服务
          global.getFriend?.().onUserLoggedin()
        }
      } else {
        //这里如果是前后台切换，就不处理了，friend里面处理过 add xiezhy
        if (bResetMsgService !== true) {
          // this.logoutOnline()
          SData.getEnvironmentStatus(status => {
            if (!status.isLicenseValid) {
              this.logoutOnline()
            }
          })
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
          // 防止获取用户信息错误,导致用户为Customer,且为登录状态 ysl
          if (userInfo.name !== undefined){
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
          // 登录成功后,移除过期时间
          this.props.setExpireDate({
            date: undefined,
          })
        }
        global.getFriend().onUserLoggedin()
      } else {
        if (bResetMsgService !== true) {
          SData.getEnvironmentStatus(status => {
            if (!status.isLicenseValid) {
              global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
              // 退出登录成功后,移除过期时间
              this.props.setExpireDate({
                date: undefined,
              })
            }
          })
        }
      }
    }
  }

  logout = async() => {
    try {
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        this.logoutOnline()
        this.logoutTimer && clearInterval(this.logoutTimer)
        this.logoutTimer = null
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
        // 退出登录成功后,移除过期时间
        this.props.setExpireDate({
          date: undefined,
        })
        this.logoutTimer && clearInterval(this.logoutTimer)
        this.logoutTimer = null
      }
    } catch (e) {
      console.warn(e)
    }
  }

  getUserApplets = async userName => {
    try {
      // 获取当前用户的小插件
      // let applets = await ConfigUtils.getApplets(userName)
      // let myMapModules = []
      // if (applets === null || userName === 'Customer' && applets.length === 0) {
      //   await ConfigUtils.recordApplets(userName, _mapModules)
      //   applets = _mapModules
      // } else {
      //   // APP默认模块不能改动
      //   let defaultValues = Object.values(ChunkType)
      //   let tempArr = defaultValues.concat(applets)
      //   applets = Array.from(new Set(tempArr))
      // }
      // let needToUpdate = false
      // applets.map(key => {
      //   if (key !== 'APPLET_ADD') {
      //     for (let item of mapModules) {
      //       needToUpdate = this.props.appConfig.oldMapModules.indexOf(item.key) < 0
      //       if (item.key === key || needToUpdate) {
      //         myMapModules.push(item)
      //         break
      //       }
      //     }
      //   }
      // })

      let applets = await BundleTools.getBundles(this.props.user.currentUser.userName)
      let myMapModules = []
      // 系统自带模块
      for (let item of mapModules) {
        myMapModules.push(item)
      }
      await this.props.setMapModule(myMapModules, () => {
        // 加载用户小插件
        for (let item of applets) {
          this.props.loadAddedModule(item.name)
        }
      })
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
    global.isAudit = await SData._isAudit()
    global.GUIDE_VERSION = appInfo.GuideVersion
  }

  back = () => {
    if (this.state.showLaunchGuide || !this.props.isAgreeToProtocol) {
      return false
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
    if (this.appState !== 'active' && appState === 'active') {
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

    this.appState = appState
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
    // 适配iOS,判断如果是锁屏,不修改orientation
    if (screen.getLockScreen() && o.toLowerCase().indexOf(screen.getLockScreen().toLowerCase()) < 0) return
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
              getLanguage(this.props.language).Friends.IMPORTING_DATA,
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
        cancel={() => {
          this.protocolDialog.setVisible(false)
          global.SimpleDialog.set({
            renderCustomeView: () => {
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
            cancelAction: () => { this.protocolDialog.setVisible(true), this.protocolDialog.setconfirmBtnDisable(true) },
            confirmText: getLanguage(this.props.language).Protocol.EXIT_APP,
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
          source={require('./assets/home/Frenchgrey/icon_prompt.png')}
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
        confirmText={getLanguage(this.props.language).Prompt.GET_SUPPORTED_DEVICE_LIST}
        installText={getLanguage(global.language).Prompt.INSTALL}
        confirmAction={() => {
          NavigationService.navigate('Protocol', {
            type: this.isHuawei ? 'AREngineDevice' : 'ARDevice',
          })
        }}
        installBtnVisible={global.ARServiceAction === -1 ? true : false}
        text={
          global.ARServiceAction === 0
            ? getLanguage(this.props.language).Prompt.DEVICE_DOES_NOT_SUPPORT_AR
            : getLanguage(this.props.language).Prompt.DONOT_SUPPORT_ARCORE
        }
        installAction={() => { SARMap.installARCore() }}
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
            backgroundColor: '#FFFFFF',
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
            currentUser={this.props.user.currentUser}
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
        {this.state.isInit && global.ARServiceAction !== undefined && this.renderARDeviceListDialog()}
        {this._renderProtocolDialog()}
        <Loading ref={ref => global.Loading = ref} initLoading={false} />
        <MyToast ref={ref => global.Toast = ref} />
        {this.renderSimpleDialog()}
        {this.renderInputDialog()}
        <Dialog2 ref={ref => AppDialog.setDialog(ref)} />
        <InputDialog2 ref={ref => AppInputDialog.setDialog(ref)} />
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
    netInfo: state.device.toJS().netInfo,
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
  setExpireDate,
  openWorkspace,
  setShow,
  setNetInfo,
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
  addMapModule,
  setLicenseInfo,
  setGuideShow,
  setVersion,
  setMapArGuide,
  setMapArMappingGuide,
  setMapAnalystGuide,
  deleteUser,
  closeWorkspace,
  setBaseMap,
  loadAddedModule,
  setPointStateText,
  setDeviceConnectionMode,
  setPositionGGA,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    {/*<PersistGate loading={<Loading info="Loading"/>} persistor={persistor}>*/}
    <PersistGate loading={null} persistor={persistor}>
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
