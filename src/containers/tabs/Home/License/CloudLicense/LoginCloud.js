import React, { Component } from 'react'
import { NetInfo } from 'react-native'
import { Container } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { Toast } from '../../../../../utils'
import OnlineLoginView from '../../../Mine/Login/component/OnlineLoginView'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../../NavigationService'

export default class LoginCloud extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      onEmailTitleFocus: true,
    }
  }

  componentDidMount() {
    SMap.logoutCloudLicense()
  }

  login = async ({ isEmail, email, emailPwd, phone, phonePwd }) => {
    let result
    let userName = ''
    let password = ''

    try {
      if (isEmail) {
        if (!email) {
          Toast.show(
            getLanguage(global.language).Profile.ENTER_EMAIL_OR_USERNAME,
          )
          return
        }
        if (!emailPwd) {
          Toast.show(getLanguage(global.language).Profile.ENTER_PASSWORD)
          return
        }
        userName = email
        password = emailPwd
      } else {
        if (!phone) {
          Toast.show(getLanguage(global.language).Profile.ENTER_MOBILE)
          return
        }
        if (!phonePwd) {
          Toast.show(getLanguage(global.language).Profile.ENTER_PASSWORD)
          return
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
        return
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
        return
      } else {
        result = res
      }
      if (result === true) {
        let result = await SMap.queryCloudLicense()
        NavigationService.navigate('LicenseJoinCloud', {
          licenseInfo: result,
        })
      } else {
        Toast.show(getLanguage(global.language).Prompt.FAILED_TO_LOG)
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_LOG)
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
        {this.renderLogin()}
      </Container>
    )
  }
}
