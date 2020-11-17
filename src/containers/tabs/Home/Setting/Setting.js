/* global GLOBAL */
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native'
import { scaleSize, Toast } from '../../../../utils'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import RenderSettingItem from './RenderSettingItem'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import { SMap } from 'imobile_for_reactnative'

export default class Setting extends Component {
  props: {
    navigation: Object,
    appConfig: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.user = params && params.user
    this.System = 'x64'
    this.state = {
      bOpenLicense: false,
      isRefresh: false,
    }
  }

  componentDidMount() {
    this._checkOpenLicense()
  }

  _checkOpenLicense = async () => {
    try {
      //市场不允许出现许可，在审核期间把标去掉 add xiezhy
      let bOpen = GLOBAL.isAudit
      bOpen = !bOpen
      
      this.setState({
        bOpenLicense: bOpen,
        isRefresh: false,
      })
      return
    } catch (e) {
      this.setState({
        bOpenLicense: false,
        isRefresh: false,
      })
      Toast.show(
        GLOBAL.language === 'CN'
          ? '请检查网络连接'
          : 'Please check the network connection',
      )
    }
  }
  _renderItem = label => {
    return <RenderSettingItem label={label} />
  }

  //定位设置
  onLocation = () => {
    NavigationService.navigate('LocationSetting')
  }

  //关于
  onAbout = () => {
    NavigationService.navigate('AboutITablet')
  }

  //许可
  onLicense = () => {
    NavigationService.navigate('LicensePage', {
      user: this.user,
    })
  }
  //检查更新
  onCheckUpdate = () => {
    Toast.show(GLOBAL.APP_VERSION + '_' + GLOBAL.SYSTEM_VERSION)
  }
  //意见反馈
  suggestionFeedback = () => {
    NavigationService.navigate('SuggestionFeedback')
  }
  renderItems() {
    return (
      <View style={{ flex: 1, backgroundColor: color.content_white }}>
        {/* {this._renderItem(getLanguage(GLOBAL.language).Profile.STATUSBAR_HIDE)} */}
        {this.state.bOpenLicense === true
          ? this.renderItemView(
            this.onLicense,
            getLanguage(GLOBAL.language).Profile.SETTING_LICENSE,
          )
          : null}
        {this.renderItemView(
          this.onLocation,
          getLanguage(GLOBAL.language).Profile.SETTING_LOCATION_DEVICE,
        )}
        {this.renderItemCheckVersion(
          this.onCheckUpdate,
          getLanguage(GLOBAL.language).Profile.SETTING_CHECK_VERSION,
        )}
        {this.renderItemView(
          this.suggestionFeedback,
          getLanguage(GLOBAL.language).Profile.SETTING_SUGGESTION_FEEDBACK,
        )}
        {/** 关于放在最后 */}
        {this.props.appConfig.about &&
          this.props.appConfig.about.isShow &&
          this.renderItemView(
            this.onAbout,
            getLanguage(GLOBAL.language).Profile.SETTING_ABOUT +
              this.props.appConfig.alias +
              getLanguage(GLOBAL.language).Profile.SETTING_ABOUT_AFTER,
          )}
      </View>
    )
  }

  renderItemView(action, label) {
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity style={{ width: '100%' }} onPress={action}>
          <View
            style={{
              width: '100%',
              height: scaleSize(80),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: scaleSize(24), marginLeft: 15 }}>
              {label}
            </Text>

            <View
              style={{ marginRight: 15, alignItems: 'center' }}
              // onPress={action}
            >
              <Image
                source={require('../../../../assets/Mine/mine_my_arrow.png')}
                style={{ height: scaleSize(28), width: scaleSize(28) }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.item_separate_white,
          }}
        />
      </View>
    )
  }

  renderItemCheckVersion(action, label) {
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity style={{ width: '100%' }} onPress={action}>
          <View
            style={{
              width: '100%',
              height: scaleSize(80),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: scaleSize(24), marginLeft: 15 }}>
              {label}
            </Text>

            <View style={{ marginRight: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: scaleSize(24), marginLeft: 15 }}>
                {GLOBAL.APP_VERSION + '_' + GLOBAL.SYSTEM_VERSION}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.item_separate_white,
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Profile.SETTINGS,
          //'设置',
          navigation: this.props.navigation,
        }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this._checkOpenLicense}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              enabled={true}
            />
          }
        >
          {this.renderItems()}
        </ScrollView>
      </Container>
    )
  }
}
