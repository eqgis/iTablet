import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  NativeModules,
  InteractionManager,
  Platform,
  ScrollView,
  PermissionsAndroid,
} from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import { Container, Dialog, PopMenu, Button } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import Toast from '../../../utils/Toast'
import {
  SScene,
  SMap,
  SOnlineService,
  SIPortalService,
} from 'imobile_for_reactnative'
import FileTools from '../../../native/FileTools'
import ConstPath from '../../../constants/ConstPath'
import NavigationService from '../../NavigationService'
import UserType from '../../../constants/UserType'
import { getLanguage } from '../../../language'
import { getPublicAssets, getThemeAssets } from '../../../assets'
import color from '../../../styles/color'
import { scaleSize, screen } from '../../../utils'
import { SimpleDialog } from '../Friend'
import TabBar from '../TabBar'
import ImageButton from '../../../components/ImageButton'

const appUtilsModule = NativeModules.AppUtils
export default class Home extends Component {
  props: {
    navigation: Object,
    language: string,
    setLanguage: () => {},
    nav: Object,
    latestMap: Object,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    user: Object,
    appConfig: Object,
    mapModules: Object,
    guideshow: Object,
    mineModules: Array,
    version: Object,
    isAgreeToProtocol: Object,
    importSceneWorkspace: () => {},
    importWorkspace: () => {},
    closeWorkspace: () => {},
    openWorkspace: () => {},
    setUser: () => {},
    deleteUser: () => {},
    setBackAction: () => {},
    removeBackAction: () => {},
    setGuideShow: () => {},
    setVersion: () => {},
    setMapArGuide: () => {},
    setMapArMappingGuide: () => {},
    setMapAnalystGuide: () => {},
    setThemeGuide: () => {},
    setCollectGuide: () => {},
    setMapEditGuide: () => {},
    setMapSceneGuide: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isDownloaded: false,
      dialogCheck: false,
      downloadData: null,
      mineguide: true,
      slide: false,
    }
  }

  componentDidMount() {
    if (this.props.version !== global.GUIDE_VERSION) {
      if (this.props.isAgreeToProtocol) {
        this.props.setVersion(global.GUIDE_VERSION)
        this.props.setGuideShow(true)
        this.props.setMapArGuide(true)
        this.props.setMapArMappingGuide(true)
        this.props.setMapAnalystGuide(true)
        this.props.setThemeGuide(true)
        this.props.setCollectGuide(true)
        this.props.setMapEditGuide(true)
        this.props.setMapSceneGuide(true)
      }
    }
    InteractionManager.runAfterInteractions(() => {
      if (Platform.OS === 'android') {
        this.props.setBackAction({ action: this.showExitPop })
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.route.name,
      })
    }
  }

  _onImportWorkspace = async filePath => {
    try {
      if (filePath !== undefined) {
        // if (isFirstImportWorkspace === true) {
        //   this.container && this.container.setLoading(true, '导入数据中...')
        // }
        let is3D = await SScene.is3DWorkspace({ server: filePath })
        if (is3D === true) {
          let result = await this.props.importSceneWorkspace({
            server: filePath,
          })
          if (result === true) {
            // Toast.show('导入3D成功')
          } else {
            Toast.show(getLanguage(global.language).Prompt.IMPORTED_SUCCESS)
          }
          result = await SMap.importWorkspaceInfo({
            server: filePath,
            type: 9,
          })

          // if (result.length === 0) {
          //   Toast.show(
          //     getLanguage(global.language).Prompt.FAILED_TO_IMPORT,
          //   )
          // }
        } else {
          let result = await SMap.importWorkspaceInfo({
            server: filePath,
            type: 9,
          })

          if (result.length === 0) {
            Toast.show(getLanguage(global.language).Prompt.FAILED_TO_IMPORT)
          }
        }
      }
    } catch (e) {
      Toast.show('导入失败')
    } finally {
      // if (isFirstImportWorkspace === true) {
      //   this.container && this.container.setLoading(false)
      // }
    }
  }
  // headRender() {
  //   let userImg = require('../../../assets/home/icon_mine_select.png')
  //   let moreImg = getPublicAssets().common.icon_nav_imove
  //   const title = 'SuperMap iTablet'
  //   return (
  //     <View style={styles.header}>
  //       <View style={{ flex: 1 }} />
  //       <TouchableOpacity style={styles.userView}>
  //         <Image source={userImg} style={styles.userImg} />
  //       </TouchableOpacity>
  //       <Text style={styles.headTitle}>{title}</Text>
  //       <TouchableOpacity>
  //         <Image
  //           resizeMode={'contain'}
  //           source={moreImg}
  //           style={styles.moreImg}
  //         />
  //       </TouchableOpacity>
  //       <View style={{ flex: 1 }} />
  //     </View>
  //   )
  // }
  _closeModal = () => {
    this.popup.setVisible(false)
  }

  _onLogin = () => {
    this._closeModal()
    NavigationService.navigate('Login')
    // NavigationService.navigate('Mine')
  }
  _onRegister = () => {
    this._closeModal()
    NavigationService.navigate('Register')
  }

  _onSetting = () => {
    this._closeModal()
    // StatusBar.setHidden(true,'slide')
    NavigationService.navigate('Setting', {
      user: this.props.user,
    })
  }

  _onSettingLanguage = () => {
    this._closeModal()
    NavigationService.navigate('LanguageSetting')
  }

  _onAbout = () => {
    this._closeModal()
    NavigationService.navigate('AboutITablet')
  }

  _onToggleAccount = () => {
    this._closeModal()
    NavigationService.navigate('ToggleAccount')
  }

  _logoutConfirm = () => {
    this._closeModal()
    this.SimpleDialog.set({
      text: getLanguage(this.props.language).Prompt.LOG_OUT,
      confirmAction: () => {
        this._onLogout()
      },
    })
    this.SimpleDialog.setVisible(true)
  }

  _onLogout = () => {
    if (this.container) {
      //this.container.setLoading(true, '注销中...')
    }
    try {
      if (UserType.isOnlineUser(this.props.currentUser)) {
        SOnlineService.logout()
      } else if (UserType.isIPortalUser(this.props.currentUser)) {
        SIPortalService.logout()
      }
      this.props.closeWorkspace(async () => {
        SOnlineService.removeCookie()
        let customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath +
          ConstPath.RelativeFilePath.Workspace[
          global.language === 'CN' ? 'CN' : 'EN'
          ],
        )
        this.props.deleteUser(this.props.user.currentUser)
        this.props.setUser({
          userName: 'Customer',
          nickname: 'Customer',
          userType: UserType.PROBATION_USER,
        })
        this._closeModal()
        if (this.container) {
          this.container.setLoading(false)
        }
        // NavigationService.navigate('Mine')
        // NavigationService.popToTop('Tabs')
        NavigationService.navigate('Tabs', {screen: 'Home'})
        this.props.openWorkspace({ server: customPath })
      })
    } catch (e) {
      if (this.container) {
        this.container.setLoading(false)
      }
    }
  }

  showDialog = value => {
    this.dialog && this.dialog.setDialogVisible(value)
  }

  getModuleItem = (
    ref,
    confirm,
    cancel,
    downloadData,
    currentUserName,
    dialogCheck,
  ) => {
    this.moduleItemRef = ref
    this.dialogConfirm = confirm
    this.dialogCancel = cancel
    this.downloadData = downloadData
    this.currentUserName = currentUserName
    this.setState({ dialogCheck: dialogCheck, downloadData: downloadData })
  }

  exitConfirm = async () => {
    try {
      // await this._onLogout()
      await appUtilsModule.AppExit()
    } catch (error) {
      Toast.show('退出失败')
    }
  }

  confirm = async () => {
    //先判断是否有网
    if ((await NetInfo.fetch()).isConnected) {
      let confirm = this.dialogConfirm ? this.dialogConfirm : () => { }
      confirm &&
        confirm(this.moduleItemRef, this.downloadData, this.state.dialogCheck)
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK)
    }
    // NetInfo.isConnected.fetch().done(isConnected => {
    //   if (isConnected) {
    //     let confirm = this.dialogConfirm ? this.dialogConfirm : () => { }
    //     confirm &&
    //       confirm(this.moduleItemRef, this.downloadData, this.state.dialogCheck)
    //   } else {
    //     Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK)
    //   }
    // })
  }

  cancel = () => {
    let cancel = this.dialogCancel ? this.dialogCancel : () => { }
    cancel &&
      cancel(this.moduleItemRef, this.downloadData, this.state.dialogCheck)
  }

  showUserPop = event => {
    this.side = 'left'
    this.popup.setVisible(true, {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    })
  }

  showMorePop = event => {
    this.side = 'right'
    if (event) {
      this.popup.setVisible(true, {
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      })
    } else {
      this.moreBtn.measure((x, y, width, height, pageX, pageY) => {
        this.popup.setVisible(true, {
          x: pageX,
          y: pageY,
        })
      })
    }
  }

  showExitPop = () => {
    this.exit.setDialogVisible(true)
  }

  renderExitDialogChildren = () => {
    return (
      <View style={styles.exitDialogHeaderView}>
        <Image
          source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.exitDialogHeaderImg}
        />
        <Text style={styles.exitDialogTile}>
          {getLanguage(this.props.language).Prompt.QUIT}
          {/* 确定退出SuperMap iTablet ？ */}
        </Text>
      </View>
    )
  }

  renderDialog = () => {
    let storage = null
    let fileName = null
    let downloadData = this.state.downloadData
    if (
      downloadData &&
      downloadData.example &&
      downloadData.example.length > 0
    ) {
      let item = downloadData.example[0]
      fileName = item.name
      storage =
        (item.size === undefined ? 0 : (item.size / 1024 / 1024).toFixed(2)) +
        'MB'
    }
    let Img = this.state.dialogCheck
      ? getPublicAssets().common.icon_select
      : getPublicAssets().common.icon_none
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        showBtns={false}
        opacity={1}
        style={styles.dialog}
      >
        <View style={styles.dialogHeader}>
          <Text style={styles.promptTitle}>
            {getLanguage(this.props.language).Prompt.DOWNLOAD_DATA}
          </Text>
          <ImageButton
            iconBtnStyle={styles.dialogHeaderBtnView}
            iconStyle={styles.dialogHeaderBtn}
            icon={getPublicAssets().common.icon_nav_imove}
            onPress={() => {
              this.showDialog(false)
              NavigationService.navigate('SampleMap')
            }}
          />
        </View>
        <View style={styles.dialogContent}>
          <Text style={styles.dialogInfo}>{fileName}</Text>
          <Text style={styles.dialogSize}>{storage}</Text>
        </View>
        <View style={styles.dialogButtons}>
          <Button
            title={getLanguage(this.props.language).Prompt.DOWNLOAD}
            onPress={this.confirm}
            style={[
              styles.dialogButton,
              { backgroundColor: color.itemColorGray },
            ]}
            titleStyle={{ color: color.white }}
          />
          <Button
            title={getLanguage(this.props.language).Prompt.CANCEL}
            onPress={this.cancel}
            style={[
              styles.dialogButton,
              {
                backgroundColor: color.itemColorGray2,
                marginTop: scaleSize(22),
              },
            ]}
            titleStyle={{ color: color.contentColorGray }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.checkView}
          onPress={() => {
            let newDialogCheck = !this.state.dialogCheck
            this.setState({ dialogCheck: newDialogCheck })
          }}
        >
          <Image source={Img} style={styles.checkImg} />
          <Text style={styles.dialogCheck}>
            {getLanguage(this.props.language).Prompt.NO_REMINDER}
            {/* 不再提示 */}
          </Text>
        </TouchableOpacity>
      </Dialog>
    )
  }

  renderExitDialog = () => {
    return (
      <Dialog
        ref={ref => (this.exit = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        confirmAction={this.exitConfirm}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderExitDialogChildren()}
      </Dialog>
    )
  }

  _getMenuData = () => {
    let data = []
    if (this.side === 'left') {
      if (UserType.isProbationUser(this.props.user.currentUser)) {
        data = [
          {
            title: getLanguage(this.props.language).Navigator_Label
              .LEFT_TOP_LOG,
            action: this._onLogin,
          },
          {
            title: getLanguage(this.props.language).Navigator_Label
              .LEFT_TOP_REG,
            action: this._onRegister,
          },
        ]
      } else {
        data = [
          {
            title: getLanguage(this.props.language).Profile.SWITCH_ACCOUNT,
            action: this._onToggleAccount,
          },
          {
            title: getLanguage(this.props.language).Profile.LOG_OUT,
            action: this._logoutConfirm,
          },
        ]
      }
    } else {
      data = [
        {
          title: getLanguage(this.props.language).Navigator_Label
            .RIGHT_TOP_SETTING,
          action: this._onSetting,
        },
        {
          title: getLanguage(this.props.language).Profile.SETTING_LANGUAGE,
          action: this._onSettingLanguage,
        },
        {
          title: getLanguage(this.props.language).Navigator_Label
            .RIGHT_TOP_EXIT,
          action: () => {
            this._closeModal()
            this.exit.setDialogVisible(true)
          },
        },
      ]
    }
    return data
  }

  renderPopMenu = () => {
    return (
      <PopMenu
        ref={ref => (this.popup = ref)}
        getData={this._getMenuData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  _renderSimpleDialog = () => {
    return (
      <SimpleDialog
        ref={ref => (this.SimpleDialog = ref)}
      />
    )
  }

  //首页新手引导 add jiakai
  renderGuide = () => {
    let mineStyle = {
      width: screen.getScreenWidth(this.props.device.orientation) / 4,
      height: scaleSize(120),
    }
    let mineViewStyle = {
      width: scaleSize(120),
      height: scaleSize(120),
      borderRadius: scaleSize(60),
    }
    let skipStyle = {
      right: scaleSize(40),
      top: scaleSize(30) + screen.getIphonePaddingTop(),
    }
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      mineStyle = {
        width: scaleSize(90),
        height: screen.getScreenHeight(this.props.device.orientation) / 4,
      }
      mineViewStyle = {
        width: scaleSize(120),
        height: scaleSize(120),
        borderRadius: scaleSize(60),
      }
      skipStyle = {
        right: scaleSize(20),
        top: scaleSize(30),
      }
    }
    return (
      <View
        style={{
          position: 'absolute',
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            position: 'absolute',
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            opacity: 0.8,
            borderColor: 'black',
            borderWidth: scaleSize(2),
          }}
        />
        {/* <TouchableOpacity
          style={[{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            opacity: 0.8,
          }, skipStyle]}
          onPress={this.skip}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(25),
              color: 'black',
              fontWeight: 'bold',
              padding: scaleSize(10),
            }}>
            {getLanguage(this.props.language).Profile.MY_GUIDE_SKIP}
          </Text>
        </TouchableOpacity> */}
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            width: this.width,
            height: this.height,
            bottom: this.bottom,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >

          {/* <Image
            style={
              {
                position: 'absolute',
                height: this.height,
                width: this.width,
                marginTop: scaleSize(20),
              }}
            source={getThemeAssets().home.map_bgboard01}
            resizeMode={'stretch'}
          /> */}

          <Text
            style={styles.titleText}
          >
            {getLanguage(this.props.language).Profile.MY_GUIDE}
          </Text>

          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              this.props.device.orientation.indexOf('LANDSCAPE') === 0
                ? styles.scrollContentStyleL
                : styles.scrollContentStyleP
            }
          >
            {this._renderItems()}
          </ScrollView> */}

          <View style={this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? styles.scrollContentStyleL
            : styles.scrollContentStyleP}>
            <Image
              style={
                {
                  height: this.imgheight,
                  width: this.width - scaleSize(50),
                }
              }
              source={getThemeAssets().home.map_my}
              resizeMode={'contain'}
            />
          </View>


          <TouchableOpacity
            style={styles.knowView}
            onPress={this.knowClick}
          >
            <Text
              style={styles.knowText}
            >
              {getLanguage(this.props.language).Profile.MY_GUIDE_KNOW}
            </Text>
          </TouchableOpacity>

        </View>

        <View
          style={[{
            position: 'absolute',
            bottom: 0,
            right: 0,
            // opacity: 0.1,
            justifyContent: 'center',
            alignItems: 'center',
          }, mineStyle]}
        >
          <View
            style={[{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }, mineViewStyle]}
          >
            <Image
              resizeMode="contain"
              source={
                getThemeAssets().tabBar.tab_mine_selected
              }
              style={{
                width: scaleSize(60),
                height: scaleSize(60),
              }}
            />
            <Text style={styles.tabText}>{getLanguage(global.language).Navigator_Label.PROFILE}</Text>
          </View>

        </View>

        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: this.skipbottom,
            width: scaleSize(60),
            height: scaleSize(60),
          }}
          onPress={this.skip}
        >
          <Image
            style={
              {
                width: scaleSize(50),
                height: scaleSize(50),
              }}
            source={getThemeAssets().home.icon_map_close}
            resizeMode={'stretch'}
          />
        </TouchableOpacity>

      </View>
    )
  }

  _renderItems = () => {
    let colNum =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 5 : 4
    let items = this._getItems()
    let renderItems = []
    let key = 0
    for (let i = 0; i < items.length; i++) {
      renderItems.push(this.renderItem(items[i], colNum, key++))
    }
    return renderItems
  }

  renderItem = (item, colNum, key) => {
    if (item.title === getLanguage(this.props.language).Profile.IMPORT) {
      return (
        <TouchableOpacity
          key={key}
          style={[
            styles.itemView,
            {
              width: this.width / colNum,
            },
          ]}
        >
          <View
            style={[{
              width: scaleSize(80),
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'nowrap',
              borderRadius: scaleSize(80) / 2,
              backgroundColor: '#ededed',
            }]}>
            <Image style={styles.itemImg} source={item.image} />
            <Text style={styles.itemText}>{item.title}</Text>
          </View>

        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          key={key}
          style={[
            styles.itemView,
            {
              width: this.width / colNum,
            },
          ]}
        >
          <Image style={styles.itemImg} source={item.image} />
          <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
      )
    }
  }

  _getItems = () => {
    let data = []
    for (let i = 0; i < this.props.mineModules.length; i++) {
      switch (this.props.mineModules[i].key) {
        case 'IMPORT':
          data.push({
            title: getLanguage(this.props.language).Profile.IMPORT,
            image: getThemeAssets().mine.my_import,
          })
          break
        case 'MY_SERVICE':
          data.push({
            title: getLanguage(this.props.language).Profile.MY_SERVICE,
            image: getThemeAssets().mine.my_service,
          })
          break
        case 'DATA':
          data.push({
            title: getLanguage(this.props.language).Profile.DATA,
            image: getThemeAssets().mine.my_data,
          })
          break
        case 'MARK':
          data.push({
            title: getLanguage(this.props.language).Profile.MARK,
            image: getThemeAssets().mine.my_plot,
          })
          break
        case 'MAP':
          data.push({
            title: getLanguage(this.props.language).Profile.MAP,
            image: getThemeAssets().mine.my_map,
          })
          break
        case 'SCENE':
          data.push({
            title: getLanguage(this.props.language).Profile.SCENE,
            image: getThemeAssets().mine.my_scene,
          })
          break
        case 'BASE_MAP':
          data.push({
            title: getLanguage(this.props.language).Profile.BASEMAP,
            image: getThemeAssets().mine.my_basemap,
          })
          break
        case 'SYMBOL':
          data.push({
            title: getLanguage(this.props.language).Profile.SYMBOL,
            image: getThemeAssets().mine.my_symbol,
          })
          break
        case 'TEMPLATE':
          data.push({
            title: getLanguage(this.props.language).Profile.TEMPLATE,
            image: getThemeAssets().mine.icon_my_template,
          })
          break
        case 'MyColor':
          data.push({
            title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
            image: getThemeAssets().mine.my_color,
          })
          break
        case 'MyApplet':
          data.push({
            title: getLanguage(this.props.language).Find.APPLET,
            image: getThemeAssets().mine.my_applets,
          })
          break
        case 'AIModel':
          data.push({
            title: getLanguage(this.props.language).Profile.AIMODEL,
            image: getThemeAssets().mine.my_ai,
          })
          break
      }
    }
    return data
  }

  knowClick = () => {
    this.setState({ mineguide: false, slide: true })
  }

  SlideClick = () => {
    this.props.setGuideShow(false)
    this.setState({ slide: false, mineguide: true })
  }

  skip = () => {
    this.props.setGuideShow(false)
    this.setState({ slide: false, mineguide: true })
  }

  //首页新手引导 add jiakai
  renderSlide = () => {
    let slideLand = false
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      slideLand = true
    }
    return (
      <View
        style={{
          position: 'absolute',
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            position: 'absolute',
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            opacity: 0.5,
          }}
          onPress={this.SlideClick}
        />

        {!slideLand && <TouchableOpacity
          style={{
            backgroundColor: '#a7a7a7',
            borderRadius: scaleSize(150),
            width: scaleSize(150),
            height: scaleSize(300),
            alignItems: 'center',
            opacity: 0.8,
            marginTop: scaleSize(500),
          }}
          onPress={this.SlideClick}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: scaleSize(50),
              width: scaleSize(100),
              height: scaleSize(100),
              marginTop: scaleSize(20),
            }}
          />
          <Image
            style={{
              position: 'absolute',
              width: scaleSize(120),
              height: scaleSize(120),
              top: scaleSize(60),
              left: scaleSize(70),
            }}
            source={getThemeAssets().mine.icon_gesture} />
        </TouchableOpacity>}

        {slideLand && <TouchableOpacity
          style={{
            backgroundColor: '#a7a7a7',
            borderRadius: scaleSize(150),
            width: scaleSize(300),
            height: scaleSize(150),
            justifyContent: 'center',
            opacity: 0.8,
          }}
          onPress={this.SlideClick}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: scaleSize(50),
              width: scaleSize(100),
              height: scaleSize(100),
              marginLeft: scaleSize(20),
            }}
          />
          <Image
            style={{
              position: 'absolute',
              width: scaleSize(120),
              height: scaleSize(120),
              top: scaleSize(50),
              left: scaleSize(80),
            }}
            source={getThemeAssets().mine.icon_gesture} />
        </TouchableOpacity>}

        {!slideLand && <Text
          style={{
            textAlign: 'center',
            fontSize: scaleSize(25),
            color: color.white,
            marginTop: scaleSize(20),
          }}>
          {getLanguage(this.props.language).Profile.MY_GUIDE_SLIDE}
        </Text>}

        {slideLand && <Text
          style={{
            textAlign: 'center',
            fontSize: scaleSize(25),
            color: color.white,
            marginTop: scaleSize(20),
          }}>
          {getLanguage(this.props.language).Profile.MY_GUIDE_SLIDE_LAND}
        </Text>}

      </View>
    )
  }

  renderHeader = () => {
    let avatar = UserType.isProbationUser(this.props.user.currentUser) ? getPublicAssets().common.icon_avatar : getPublicAssets().common.icon_avatar_logining
    // let avatar = !UserType.isProbationUser(this.props.user.currentUser)
    //   ? {
    //     uri:
    //         'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
    //   }
    //   : getPublicAssets().common.icon_avatar
    return (
      <View
        style={[
          styles.header,
          this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? {
              paddingLeft: global.isPad ? scaleSize(88) : scaleSize(28),
              paddingRight: global.isPad ? scaleSize(72) : scaleSize(24),
              paddingTop: global.isPad ? scaleSize(64) : scaleSize(10),
            }
            : {
              paddingHorizontal: scaleSize(40),
              paddingTop: scaleSize(50),
            },
        ]}
      >
        <TouchableOpacity
          style={styles.userView}
          onPress={event => this.showUserPop(event)}
        >
          <Image source={avatar} style={styles.userImg} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>{this.props.appConfig.name}</Text>
        <TouchableOpacity
          ref={ref => (this.moreBtn = ref)}
          onPress={event => this.showMorePop(event)}
          style={styles.moreView}
        >
          <Image
            resizeMode={'contain'}
            source={getPublicAssets().common.icon_more}
            style={styles.moreImg}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderTabBar = () => {
    return <TabBar navigation={this.props.navigation} />
  }

  requestPermission = async () => {
    const results = await PermissionsAndroid.requestMultiple([
      'android.permission.READ_PHONE_STATE',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
    ])
    let isAllGranted = true
    for (let key in results) {
      isAllGranted = results[key] === 'granted' && isAllGranted
    }
    //申请 android 11 读写权限
    let permisson11 = await appUtilsModule.requestStoragePermissionR()
    if (isAllGranted && permisson11) {
      SMap.setPermisson(true)
      // this.init()
    } else {
      this._closeModal()
      this.SimpleDialog.set({
        text: getLanguage(this.props.language).Prompt.NO_PERMISSION,
        cancelText: getLanguage(this.props.language).Prompt.CANCEL,
        cancelAction: this.SimpleDialog.setVisible(false),
        confirmText: getLanguage(this.props.language).Prompt.REQUEST_PERMISSION,
        confirmAction: this.requestPermission,
      })
      this.SimpleDialog.setVisible(true)
    }
  }

  render() {
    this.width = screen.getScreenWidth(this.props.device.orientation) - screen.getScreenWidth(this.props.device.orientation) / 6
    this.height = scaleSize(600)
    this.bottom = scaleSize(150)
    this.imgheight = this.height - scaleSize(350)
    this.skipbottom = scaleSize(45)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      this.height = scaleSize(500)
      this.width = scaleSize(550)
      this.bottom = scaleSize(100)
      this.imgheight = scaleSize(200)
      this.skipbottom = scaleSize(20)
    }

    return (
      <View style={{ flex: 1 }}>
        <Container
          ref={ref => (this.container = ref)}
          hideInBackground={false}
          showFullInMap={true}
          withoutHeader
          headerProps={{
            backAction: this.showExitPop,
          }}
          style={styles.container}
          bottomBar={this.renderTabBar()}
        >
          {this.renderHeader()}
          <View
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: color.white,
            }}
          >
            <ModuleList
              importWorkspace={this._onImportWorkspace}
              currentUser={this.props.currentUser}
              device={this.props.device}
              showDialog={this.showDialog}
              getModuleItem={this.getModuleItem}
              latestMap={this.props.latestMap}
              oldMapModules={this.props.appConfig.oldMapModules}
              mapModules={this.props.mapModules}
              itemAction={() => {
                this._closeModal()
                this.SimpleDialog.set({
                  text: getLanguage(this.props.language).Prompt.NO_PERMISSION,
                  confirmText: getLanguage(this.props.language).Prompt.CONFIRM,
                  confirmAction: this.SimpleDialog.setVisible(false),
                  cancelBtnVisible:false,
                })
                this.SimpleDialog.setVisible(true)
              }}
            />
            {this.renderPopMenu()}
            {this.renderDialog()}
            {this.renderExitDialog()}
            {this._renderSimpleDialog()}
          </View>
        </Container>
        {this.props.guideshow && this.state.mineguide && this.renderGuide()}
        {this.props.guideshow && this.state.slide && this.renderSlide()}
      </View>
    )
  }
}
