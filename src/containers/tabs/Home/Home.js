import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  NativeModules,
  InteractionManager,
  Platform,
  NetInfo,
} from 'react-native'
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
import { getPublicAssets } from '../../../assets'
import color from '../../../styles/color'
import { scaleSize } from '../../../utils'
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
    importSceneWorkspace: () => {},
    importWorkspace: () => {},
    closeWorkspace: () => {},
    openWorkspace: () => {},
    setUser: () => {},
    deleteUser: () => {},
    setDownInformation: () => {},
    setBackAction: () => {},
    removeBackAction: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isDownloaded: false,
      dialogCheck: false,
      downloadData: null,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (Platform.OS === 'android') {
        this.props.setBackAction({ action: this.showMorePop })
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
        key: this.props.navigation.state.routeName,
      })
    }
  }

  _onImportWorkspace = async filePath => {
    try {
      if (filePath !== undefined) {
        let index = filePath.lastIndexOf('/')
        let path = filePath.substring(0, index)
        let snmFiles = await FileTools.getPathListByFilterDeep(path, 'snm')
        await SMap.copyNaviSnmFile(snmFiles)
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
            Toast.show(getLanguage(GLOBAL.language).Prompt.IMPORTED_SUCCESS)
          }
          result = await SMap.importWorkspaceInfo({
            server: filePath,
            type: 9,
          })

          // if (result.length === 0) {
          //   Toast.show(
          //     getLanguage(GLOBAL.language).Prompt.FAILED_TO_IMPORT,
          //   )
          // }
        } else {
          let result = await SMap.importWorkspaceInfo({
            server: filePath,
            type: 9,
          })

          if (result.length === 0) {
            Toast.show(getLanguage(GLOBAL.language).Prompt.FAILED_TO_IMPORT)
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
              GLOBAL.language === 'CN' ? 'CN' : 'EN'
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
        NavigationService.popToTop('Tabs')
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
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected) {
        let confirm = this.dialogConfirm ? this.dialogConfirm : () => {}
        confirm &&
          confirm(this.moduleItemRef, this.downloadData, this.state.dialogCheck)
      } else {
        Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK)
      }
    })
  }

  cancel = () => {
    let cancel = this.dialogCancel ? this.dialogCancel : () => {}
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
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  renderHeader = () => {
    let avatar = !UserType.isProbationUser(this.props.user.currentUser)
      ? {
        uri:
            'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
      : getPublicAssets().common.icon_avatar
    return (
      <View
        style={[
          styles.header,
          this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? {
              paddingLeft: GLOBAL.isPad ? scaleSize(88) : scaleSize(28),
              paddingRight: GLOBAL.isPad ? scaleSize(72) : scaleSize(24),
              paddingTop: GLOBAL.isPad ? scaleSize(64) : scaleSize(10),
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

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        withoutHeader
        headerProps={{
          backAction: this.showMorePop,
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
            setDownInformation={this.props.setDownInformation}
            currentUser={this.props.currentUser}
            device={this.props.device}
            showDialog={this.showDialog}
            getModuleItem={this.getModuleItem}
            latestMap={this.props.latestMap}
            oldMapModules={this.props.appConfig.oldMapModules}
            mapModules={this.props.mapModules}
          />
          {this.renderPopMenu()}
          {this.renderDialog()}
          {this.renderExitDialog()}
          {this._renderSimpleDialog()}
        </View>
      </Container>
    )
  }
}
