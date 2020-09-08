/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native'
import NavigationService from '../../../../NavigationService'
import { UserType } from '../../../../../constants'
import { screen, scaleSize, fixedSize } from '../../../../../utils'
import { getLanguage } from '../../../../../language/index'
import { getPublicAssets, getThemeAssets } from '../../../../../assets'
import logos from '../../../../../assets/custom/logo'
import styles from './styles'
const Customer = 'Customer'

export default class MineHeader extends Component {
  props: {
    language: string,
    user: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
    }
    this.searchText = ''
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    ) {
      return true
    }
    return false
  }

  goToLogin = () => {
    NavigationService.navigate('Login')
  }

  goToPersonal = () => {
    NavigationService.navigate('Personal')
  }

  _onPressAvatar = () => {
    this.goToPersonal()
  }

  _onPressMore = () => {
    this.goToLogin()
  }

  _onPressSwitch = () => {
    NavigationService.navigate('ToggleAccount')
  }

  /**
   * 定制logo
   * 如果assets/custom/logo中存在logo1，logo2，logo3，则会一次显示在'我的'顶部图片
   * logo2会代替原本的用户头像
   */
  _renderLogo = () => {
    let isPro = !UserType.isProbationUser(this.props.user.currentUser)
    let logo
    if (logos.logo2) {
      logo = logos.logo2
    } else {
      logo = isPro
        ? {
            uri:
              'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
          }
        : require('../../../../../assets/home/system_default_header_image.png')
    }
    return (
      <View style={styles.logoView}>
        {logos.logo1 && (
          <Image
            style={[
              styles.logoImagStyle,
              {
                width: fixedSize(190),
                height: fixedSize(70),
              },
            ]}
            source={logos.logo1}
          />
        )}
        <Image
          resizeMode={'contain'}
          style={styles.logoImagStyle}
          source={logo}
        />
        {logos.logo3 && (
          <Image
            style={[
              styles.logoImagStyle,
              {
                width: fixedSize(190),
              },
            ]}
            source={logos.logo3}
          />
        )}
      </View>
    )
  }

  _renderMyProfile = () => {
    let isPro = !UserType.isProbationUser(this.props.user.currentUser)
    let headerTitle = isPro
      ? this.props.user.currentUser.userName
        ? this.props.user.currentUser.userName
        : Customer
      : getLanguage(this.props.language).Profile.LOGIN_NOW
    let statusText
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      statusText = 'Online'
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      statusText = 'iPortal'
    } else {
      statusText = null
    }
    let headerImage = !isPro
      ? require('../../../../../assets/home/system_default_header_image.png')
      : {
          uri:
            'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
        }
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let myProfileStyle, avatarContainer, profileTextStyle
    if (isLandscape) {
      myProfileStyle = styles.MyProfileStyleL
      avatarContainer = styles.profileAvatarStyleL
      profileTextStyle = styles.profileTextStyleL
    } else {
      myProfileStyle = styles.MyProfileStyleP
      avatarContainer = styles.profileAvatarStyleP
      profileTextStyle = styles.profileTextStyleP
    }
    return (
      <View style={myProfileStyle}>
        <TouchableOpacity
          disabled={!isPro}
          activeOpacity={0.7}
          onPress={this._onPressAvatar}
          style={avatarContainer}
        >
          <Image style={styles.headImgStyle} source={headerImage} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._onPressMore}
          disabled={isPro}
          style={[
            profileTextStyle,
            isLandscape && {
              flex: 1,
              marginLeft: GLOBAL.isPad ? fixedSize(30) : fixedSize(30),
            },
          ]}
        >
          <Text numberOfLines={1} style={styles.userNameStyle}
                ellipsizeMode={'tail'}>
            {headerTitle}
          </Text>
          <Text style={styles.statusTextStyle}>{statusText}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSearch = () => {
    let searchViewStyle
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      searchViewStyle = styles.searchViewStyleL
    } else {
      searchViewStyle = styles.searchViewStyleP
    }
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate('SearchMine')
        }}
        activeOpacity={1}
        style={searchViewStyle}
      >
        <Image
          style={styles.searchImgStyle}
          source={getPublicAssets().common.icon_search_a0}
        />
        {/* <TextInput
          ref={ref => (this.searchBar = ref)}
          style={styles.searchInputStyle}
          placeholder={getLanguage(this.props.language).Profile.SEARCH}
          placeholderTextColor={'#A7A7A7'}
          returnKeyType={'search'}
          onSubmitEditing={this._onSearch}
          onChangeText={value => {
            this.searchText = value
          }}
        /> */}
        <Text style={styles.searchInputStyle}>
          {getLanguage(this.props.language).Profile.SEARCH}
        </Text>
      </TouchableOpacity>
    )
  }

  _renderSideItem = () => {
    if (UserType.isProbationUser(this.props.user.currentUser)) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this._onPressSwitch}
        style={[
          styles.sideItemStyle,
          logos.logo1 && {
            top: fixedSize(150),
          },
        ]} // 判断是否包含定制logo
      >
        <Text style={styles.SideTextStyle}>
          {getLanguage(this.props.language).Profile.SWITCH_ACCOUNT}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    let hasCustomLogo = logos.logo1 || logos.logo2 || logos.logo3
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') >= 0
    if (isLandscape) {
      return (
        <View style={styles.profileContainerL}>
          <ImageBackground
            resizeMode={'stretch'}
            source={getThemeAssets().mine.bg_my_transverse}
            style={[
              styles.profileContainerBgL,
              isLandscape && {
                marginTop: GLOBAL.isPad ? fixedSize(86) : fixedSize(50),
                marginBottom: GLOBAL.isPad ? scaleSize(60) : 0,
              },
            ]}
          >
            {/*<View style={styles.profileContainerL}>*/}
              {hasCustomLogo && this._renderLogo()}
              {!hasCustomLogo && this._renderMyProfile()}
              {/*{!hasCustomLogo && this._renderSideItem()}*/}
              
            {/*</View>*/}
          </ImageBackground>
          {
            isLandscape &&
            <View style={[
              isLandscape && styles.searchContainerL,
              { marginLeft: GLOBAL.isPad ? fixedSize(72) : fixedSize(30) }
            ]}>
              {this._renderSearch()}
            </View>
          }
        </View>
      )
    } else {
      return (
        <View style={styles.profileContainerP}>
          <ImageBackground
            resizeMode={'stretch'}
            source={getThemeAssets().mine.bg_my}
            style={styles.profileContainerBgP}
          >
            {hasCustomLogo && this._renderLogo()}
            {!hasCustomLogo && this._renderMyProfile()}
            {/*{!hasCustomLogo && this._renderSideItem()}*/}
          </ImageBackground>
          {this._renderSearch()}
        </View>
      )
    }
  }
}
