import React, { Component } from 'react'
import { NetInfo } from 'react-native'
import { Container } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { Toast } from '../../../../../utils'
import OnlineLoginView from '../../../Mine/Login/component/OnlineLoginView'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../../NavigationService'
import { connect } from 'react-redux'
import { setCloudLicenseUser } from '../../../../../redux/models/license'

class LoginCloud extends Component {
  props: {
    navigation: Object,
    cloudLicenseUser: Object,
    setCloudLicenseUser: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      onEmailTitleFocus: true,
      reLogin: true,
    }
    this.cb = (params && params.callback) || null
  }

  componentDidMount() {
    this.reLogin()
  }

  reLogin = async () => {
    try {
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
    this.container && this.container.setLoading(true)
    try {
      result = await SMap.queryCloudLicense()
    } catch (error) {
      result = {}
    }
    this.container && this.container.setLoading(false)
    NavigationService.navigate('LicenseJoinCloud', {
      licenseInfo: result,
    })
  }

  _login = async ({ isEmail, email, emailPwd, phone, phonePwd }) => {
    let result
    let userName = ''
    let password = ''

    try {
      if (isEmail) {
        if (!email) {
          Toast.show(
            getLanguage(global.language).Profile.ENTER_EMAIL_OR_USERNAME,
          )
          return false
        }
        if (!emailPwd) {
          Toast.show(getLanguage(global.language).Profile.ENTER_PASSWORD)
          return false
        }
        userName = email
        password = emailPwd
      } else {
        if (!phone) {
          Toast.show(getLanguage(global.language).Profile.ENTER_MOBILE)
          return false
        }
        if (!phonePwd) {
          Toast.show(getLanguage(global.language).Profile.ENTER_PASSWORD)
          return false
        }
        userName = phone
        password = phonePwd
      }

      let isConnected = await NetInfo.isConnected.fetch()
      if (isConnected) {
        this.container.setLoading(
          true,
          getLanguage(global.language).Prompt.LOG_IN,
        )
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
          email,
          emailPwd,
          phone,
          phonePwd,
        })
        return true
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
      this.container && this.container.setLoading(false)
    }
  }

  renderLogin = () => {
    return (
      <OnlineLoginView
        language={global.language}
        login={this.login}
        showRegister={false}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.LOGIN,
          navigation: this.props.navigation,
        }}
      >
        {!this.state.reLogin && this.renderLogin()}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  cloudLicenseUser: state.license.toJS().cloudLicenseUser,
})

const mapDispatchToProps = {
  setCloudLicenseUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginCloud)
