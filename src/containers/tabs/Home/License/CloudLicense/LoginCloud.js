import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import { Container, DropdownView } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { Toast, scaleSize, screen, AccountUtils } from '../../../../../utils'
import { color } from '../../../../../styles'
import OnlineLoginView from '../../../Mine/Login/component/OnlineLoginView'
import { SMap } from 'imobile_for_reactnative'
import { connect } from 'react-redux'
import {
  setCloudLicenseUser,
  setCloudLicenseSite,
} from '../../../../../redux/models/license'
import { Users } from '../../../../../redux/models/user'
import { getThemeAssets } from '../../../../../assets'

class LoginCloud extends Component {
  props: {
    navigation: Object,
    device: Object,
    user: Users,
    cloudLicenseUser: Object,
    cloudLicenseSite: String,
    setCloudLicenseUser: () => {},
    setCloudLicenseSite: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.state = {
      onEmailTitleFocus: true,
      reLogin: true,
    }
    this.cb = (params && params.callback) || null
    this.lockScreen = screen.getLockScreen() // 获取进入当前页面之前是否有锁屏
  }

  componentDidMount() {
    this.reLogin()
    if (!global.isPad) {
      screen.lockToPortrait()
    }
  }

  componentWillUnmount() {
    // 返回上一页面时,恢复之前是否锁屏的状态
    if (this.lockScreen.includes('PORTRAIT')) {
      screen.lockToPortrait()
    } else if (this.lockScreen.includes('LANDSCAPE')) {
      screen.lockToLandscape()
    } else {
      screen.unlockAllOrientations()
    }
  }

  reLogin = async () => {
    try {
      await SMap.setCloudLicenseSite(this.props.cloudLicenseSite)
      let user = this.props.cloudLicenseUser
      if (user.isEmail !== undefined) {
        await SMap.logoutCloudLicense()
        let result = await this._login(user)
        if (result) {
          this._queryLicense()
        } else {
          this.setState({ reLogin: false })
        }
      } else {
        this.setState({ reLogin: false })
      }
    } catch (error) {
      this.setState({ reLogin: false })
    }
  }

  login = async userInfo => {
    let result = await this._login(userInfo)
    if (result) {
      if (this.cb && typeof this.cb === 'function') {
        this.cb()
      } else {
        this._queryLicense()
      }
    }
  }

  _queryLicense = async () => {
    let result
    if(this.state.reLogin) {
      this.container && this.container.setLoading(true)
    } else {
      this.onlineLogin?.logining()
    }
    try {
      result = await SMap.queryCloudLicense()
    } catch (error) {
      result = {
        licenses: [],
        hasTrial: false,
      }
    }
    result.isStaff = false
    if(result.licenses.length === 0) {
      const queryResult = await SMap.queryCloudTrialLicense()
      result.isStaff = queryResult.staff
    }
    if(this.state.reLogin) {
      this.container && this.container.setLoading(false)
    } else {
      this.onlineLogin?.loginResult()
    }
    this.props.navigation.navigate('LicenseJoinCloud', {
      licenseInfo: result,
    })
  }

  _login = async ({ isEmail, userName, password }) => {
    let result

    try {
      if (!userName) {
        Toast.show(getLanguage(global.language).Profile.ENTER_USERNAME_ALL)
        return
      }
      if (!password) {
        Toast.show(getLanguage(global.language).Profile.ENTER_PASSWORD)
        return
      }

      let isConnected = true//(await NetInfo.fetch()).isConnected
      if (isConnected) {
        if(this.state.reLogin) {
          this.container.setLoading(
            true,
            getLanguage(global.language).Prompt.LOG_IN,
          )
        } else {
          this.onlineLogin?.logining()
        }
        let startLogin = async () => {
          let loginResult = SMap.loginCloudLicense(userName, password)
          return loginResult
        }
        result = startLogin()
      } else {
        Toast.show(getLanguage(global.language).Prompt.NO_NETWORK)
        return false
      }

      let timeout = sec => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('timeout')
          }, 1000 * sec)
        })
      }

      let res = await new Promise.race([result, timeout(20)])
      if (res === 'timeout') {
        Toast.show(getLanguage(global.language).Profile.LOGIN_TIMEOUT)
        return false
      } else {
        result = res
      }
      if (result === true) {
        this.props.setCloudLicenseUser({
          isEmail,
          userName,
          password,
        })
        // ios 登录云许可,需要重新登录账号,覆盖cookie,才能正常使用fetch请求
        await AccountUtils.login(this.props.user.currentUser)
        return true
      } else if (result.indexOf('Wrong user name and password') >= 0) {
        // Login Failed:Wrong user name and password
        Toast.show(getLanguage(global.language).Prompt.INCORRECT_USER_INFO)
        SMap.logoutCloudLicense()
      } else {
        Toast.show(getLanguage(global.language).Prompt.FAILED_TO_LOG)
        SMap.logoutCloudLicense()
        return false
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_LOG)
      SMap.logoutCloudLicense()
      return false
    } finally {
      if(this.state.reLogin) {
        this.container && this.container.setLoading(false)
      } else{
        this.onlineLogin?.loginResult()
      }
    }
  }

  renderItem = item => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: scaleSize(90),
          alignItems: 'center',
          marginRight: scaleSize(40),
        }}
        onPress={() => {
          SMap.setCloudLicenseSite(item.key)
          this.props.setCloudLicenseSite(item.key)
        }}
      >
        <View
          style={{
            width: scaleSize(60),
            marginHorizontal: scaleSize(15),
          }}
        >
          {item.key === this.props.cloudLicenseSite && (
            <Image
              source={require('../../../../../assets/public/settings_selected.png')}
              style={{ width: scaleSize(50), height: scaleSize(50) }}
            />
          )}
        </View>
        <Text style={{ fontSize: scaleSize(24), color: 'black' }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderList = () => {
    return (
      <View
        style={{
          marginTop: scaleSize(20),
          marginRight: scaleSize(20),
          alignSelf: 'flex-end',
          backgroundColor: '#FBFBFB',
          justifyContent: 'center',
          elevation: 10,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'grey',
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}
      >
        {this.renderItem({
          key: 'DEFAULT',
          title: getLanguage(global.language).Profile
            .LICENSE_CLOUD_SITE_DEFAULT,
        })}
        {this.renderItem({
          key: 'JP',
          title: getLanguage(global.language).Profile.LICENSE_CLOUD_SITE_JP,
        })}
      </View>
    )
  }

  renderPopMenu = () => {
    return (
      <DropdownView
        ref={ref => (this.Menu = ref)}
        backgrourdColor={'transparent'}
      >
        {this.renderList()}
      </DropdownView>
    )
  }

  renderRight = () => {
    let size =
      this.props.device.orientation.indexOf('LANDSCAPE') !== -1 ? 40 : 50
    return (
      <TouchableOpacity
        onPress={() => {
          this.Menu.setVisible(true)
        }}
      >
        <Image
          source={getThemeAssets().navigation.icon_increment_change_direction}
          style={{ width: scaleSize(size), height: scaleSize(size) }}
        />
      </TouchableOpacity>
    )
  }

  renderLoginType = () => {
    return (
      <View
        style={{
          marginTop: scaleSize(30),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#505050',
              borderRadius: scaleSize(75),
              width: scaleSize(150),
              height: scaleSize(150),
            },
          ]}
        >
          <Image
            style={[
              {
                width: scaleSize(100),
                height: scaleSize(100),
              },
            ]}
            source={require('../../../../../assets/Mine/online_white.png')}
          />
        </View>
        <Text style={{ fontSize: scaleSize(26), color: 'black' }}>
          {'Online'}
        </Text>
      </View>
    )
  }

  renderLogin = () => {
    return (
      <OnlineLoginView
        ref={ref => (this.onlineLogin = ref)}
        language={global.language}
        login={this.login}
        showRegister={false}
        useDefaultName={true}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          // title: getLanguage(global.language).Profile.LOGIN,
          backImg: require('../../../../../assets/public/left_arrow.png'),
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: color.containerHeaderBgColor,
          },
          responseHeaderTitleStyle: {color: color.containerTextColor},
          isResponseHeader: true,
          navigation: this.props.navigation,
          headerRight: !this.state.reLogin && this.renderRight(),
        }}
      >
        <View style={{ flex: 1, backgroundColor: color.bgW }}>
          {!this.state.reLogin && this.renderLoginType()}
          {!this.state.reLogin && this.renderLogin()}
          {this.renderPopMenu()}
        </View>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  cloudLicenseUser: state.license.toJS().cloudLicenseUser,
  cloudLicenseSite: state.license.toJS().cloudLicenseSite,
  device: state.device.toJS().device,
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setCloudLicenseUser,
  setCloudLicenseSite,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginCloud)
