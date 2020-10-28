import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { Container, PopMenu } from '../../../../components'
import { color, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import Toast from '../../../../utils/Toast'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import UserType from '../../../../constants/UserType'
import { MineItem } from '../component'
import FriendListFileHandle from '../../Friend/FriendListFileHandle'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'

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
        Toast.show(getLanguage(GLOBAL.language).Profile.SWITCH_CURRENT)
        return
      }
      if (this.containerRef) {
        this.containerRef.setLoading(
          true,
          getLanguage(GLOBAL.language).Profile.SWITCHING,
        )
      }
      let result
      if (userType === UserType.COMMON_USER) {
        result = await SOnlineService.login(userName, password)
        if (result) {
          result = await FriendListFileHandle.initFriendList(item)
        }
      } else if (userType === UserType.IPORTAL_COMMON_USER) {
        let url = item.serverUrl
        result = await SIPortalService.login(url, userName, password, true)
      }

      if (this.containerRef) {
        this.containerRef.setLoading(false)
      }
      if (result) {
        this.props.setUser(item)
        NavigationService.popToTop()
      } else {
        Toast.show(getLanguage(GLOBAL.language).Profile.SWITCH_FAIL)
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
        this.logout()
      } else {
        this.props.deleteUser(item)
      }
    } catch (error) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.FAILED_TO_DELETE)
    }
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
            GLOBAL.language === 'CN' ? 'CN' : 'EN'
          ],
      )
      this.props.deleteUser(this.props.user.currentUser)
      this.props.setUser({
        userName: 'Customer',
        userType: UserType.PROBATION_USER,
      })
      this.props.openWorkspace({ server: customPath })
    })
  }

  _renderItem = info => {
    let userName = info.item.userName
    let password = info.item.password
    if (userName && password) {
      let imageSource = {
        uri:
          'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
      return (
        <MineItem
          item={info.item}
          image={imageSource}
          text={userName}
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
          imageStyle={{ width: scaleSize(70), height: scaleSize(70) }}
        />
      )
    }
  }

  renderItemPopup = () => {
    let data
    data = [
      {
        title: getLanguage(GLOBAL.language).Profile.DELETE_ACCOUNT,
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
            {getLanguage(GLOBAL.language).Profile.ADD_ACCOUNT}
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
          title: getLanguage(GLOBAL.language).Profile.MANAGE_ACCOUNT,
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
