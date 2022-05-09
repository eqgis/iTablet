import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Platform} from 'react-native'
import { Container, PopMenu } from '../../../../components'
import { color, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import Toast from '../../../../utils/Toast'
import { OnlineServicesUtils, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import UserType from '../../../../constants/UserType'
import { MineItem } from '../component'
import FriendListFileHandle from '../../Friend/FriendListFileHandle'
import CoworkFileHandle from '../../Find/CoworkManagePage/CoworkFileHandle'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'
import { getPublicAssets } from '../../../../assets'

export default class ToggleAccount extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
    deleteUser: () => {},
    device: Object,
    openWorkspace: () => {},
    closeWorkspace: () => {},
  }

  constructor(props) {
    super(props)
  }

  toggleAccount = async item => {
    let userName = item.userName
    let password = item.password
    let userType = item.userType
    try {
      if (
        this.props.user.currentUser.userType === userType &&
        this.props.user.currentUser.userName === userName &&
        this.props.user.currentUser.password === password
      ) {
        Toast.show(getLanguage(global.language).Profile.SWITCH_CURRENT)
        return
      }
      if (this.containerRef) {
        this.containerRef.setLoading(
          true,
          getLanguage(global.language).Profile.SWITCHING,
        )
      }
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        await SOnlineService.logout()
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        await SIPortalService.logout()
      }
      await global.getFriend?.().disconnectService()
      global.isLogging = true
      let result
      let newUser
      if (userType === UserType.COMMON_USER) {
        //使用昵称登录online zhangxt
        result = await SOnlineService.login(item.nickname, password)
        if (result) {
          global.getFriend().onUserLoggedin()
          FriendListFileHandle.initFriendList(item)
        }
        // if (result) {
        //   // 初始化协作文件
        //   CoworkFileHandle.initCoworkList(item)
        // }
        if(result){
          let JSOnlineservice = new OnlineServicesUtils('online')
          let userInfo = await JSOnlineservice.getUserInfo(item.nickname, true)
          newUser = {
            userName: userInfo.userId,
            password: password,
            nickname: userInfo.nickname,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            userId: userInfo.userId,
            isEmail: true,
            userType: UserType.COMMON_USER,
          }
        }
      } else if (userType === UserType.IPORTAL_COMMON_USER) {
        let url = item.serverUrl
        result = await SIPortalService.login(url, userName, password, true)
        if (typeof result === 'boolean' && result) {
          let info = await SIPortalService.getMyAccount()
          if (info) {
            let userInfo = JSON.parse(info)
            newUser = {
              serverUrl: url,
              userName: userInfo.name,
              userId: userInfo.name,
              password: password,
              nickname: userInfo.nickname,
              email: userInfo.email,
              userType: UserType.IPORTAL_COMMON_USER,
              roles: userInfo.roles,
            }
            global.getFriend().onUserLoggedin()
            FriendListFileHandle.initFriendList(newUser) // iportal初始化好友列表信息,防止之前online用户留存信息的存在,把online的好友文件下载到iportal用户中
          }
        }
      }

      if (this.containerRef) {
        this.containerRef.setLoading(false)
      }
      if (result && newUser) {
        this.props.setUser(newUser)
        NavigationService.popToTop()
      } else {
        Toast.show(getLanguage(global.language).Profile.SWITCH_FAIL)
      }
    } catch (e) {
      if (this.containerRef) {
        this.containerRef.setLoading(false)
      }
    }
  }

  deleteAccount = async () => {
    let item = this.item
    let userName = item.userName
    let password = item.password
    let userType = item.userType
    try {
      if (
        this.props.user.currentUser.userType === userType &&
        this.props.user.currentUser.userName === userName &&
        this.props.user.currentUser.password === password
      ) {
        this.showDeleteSelfDialog()
      } else {
        this.props.deleteUser(item)
      }
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    }
  }

  /** 删除自己时弹出对话框 确定后退出并回退到首页*/
  showDeleteSelfDialog = () => {
    global.SimpleDialog.set({
      text: getLanguage(global.language).Prompt.LOG_OUT,
      confirmAction: () => {
        this.logout()
        NavigationService.popToTop()
      },
    })
    global.SimpleDialog.setVisible(true)
  }

  logout = async () => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      SOnlineService.logout()
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
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
      this.props.openWorkspace({ server: customPath })
    })
  }

  _renderItem = info => {
    let nickname = info.item.nickname
    let password = info.item.password
    if (nickname && password) {
      // let imageSource = require('../../../../assets/home/system_default_header_image.png')
      let imageSource = getPublicAssets().common.icon_avatar_logining
      let imageStyle
      if (Platform.OS === 'ios') {
        imageStyle = { width: scaleSize(70), height: scaleSize(70),    borderRadius: scaleSize(35)}
      } else{
        imageStyle = { width: scaleSize(70), height: scaleSize(70),    borderRadius: scaleSize(100)}
      }
      // let imageSource = {
      //   uri:
      //     'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      // }
      return (
        <MineItem
          item={info.item}
          image={imageSource}
          text={nickname}
          onPress={this.toggleAccount}
          onPressMore={event => {
            this.item = info.item
            this.ItemPopup.setVisible(true, {
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            }) 
          }}
          showSeperator={false}
          contentStyle={{ paddingLeft: scaleSize(30) }}
          imageStyle={imageStyle}
        />
      )
    }
  }

  renderItemPopup = () => {
    let data
    data = [
      {
        title: getLanguage(global.language).Profile.DELETE_ACCOUNT,
        action: this.deleteAccount,
      },
    ]
    return (
      <PopMenu
        ref={ref => (this.ItemPopup = ref)}
        data={data}
        device={this.props.device}
      />
    )
  }

  _keyExtractor = (item, index) => {
    return 'id' + index
  }

  _renderAddAccount = () => {
    let itemHeight = scaleSize(80)
    let fontSize = size.fontSize.fontSizeXl
    return (
      <View
        style={{
          height: 4 + itemHeight,
          width: '100%',
        }}
      >
        <View
          style={{
            height: 4,
            width: '100%',
            backgroundColor: color.item_separate_white,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate('Login')
          }}
          style={{
            height: itemHeight,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.content_white,
          }}
        >
          <Text style={{ fontSize: fontSize, color: color.fontColorBlack }}>
            {getLanguage(global.language).Profile.ADD_ACCOUNT}
            {/* 添加账号 */}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.containerRef = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.MANAGE_ACCOUNT,
          //'账号管理',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          style={{ flex: 1, backgroundColor: color.content_white }}
          data={this.props.user.users}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListFooterComponent={this._renderAddAccount()}
        />
        {this.renderItemPopup()}
      </Container>
    )
  }
}
