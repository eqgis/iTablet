/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/

import * as React from 'react'
import { NetInfo } from 'react-native'
import { Toast, OnlineServicesUtils } from '../../../../utils/index'
import { Container } from '../../../../components'
import { FileTools } from '../../../../native'
import { SOnlineService } from 'imobile_for_reactnative'
import styles from './Styles'
import ConstPath from '../../../../constants/ConstPath'
import NavigationService from '../../../NavigationService'
import UserType from '../../../../constants/UserType'
import { getLanguage } from '../../../../language/index'
import { setUser } from '../../../../redux/models/user'
import { connect } from 'react-redux'
import FriendListFileHandle from '../../Friend/FriendListFileHandle'
import OnlineLoginView from './component/OnlineLoginView'

const JSOnlineService = new OnlineServicesUtils('online')
class Login extends React.Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    setUser: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isFirstLogin: this.props.navigation === undefined,
    }
  }

  // 初始用户化文件目录
  initUserDirectories = async userName => {
    try {
      let paths = Object.keys(ConstPath.RelativePath)
      let isCreate = true,
        absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        let path =
          ConstPath.UserPath + userName + '/' + ConstPath.RelativePath[paths[i]]
        absolutePath = await FileTools.appendingHomeDirectory(path)
        let exist = await FileTools.fileIsExistInHomeDirectory(path)
        let fileCreated =
          exist || (await FileTools.createDirectory(absolutePath))
        isCreate = fileCreated && isCreate
      }
      if (isCreate) {
        FileTools.initUserDefaultData(userName).then(result => {
          !result && Toast.show('初始化用户数据失败')
        })
      } else {
        Toast.show('创建用户目录失败')
      }
    } catch (e) {
      Toast.show('创建用户目录失败')
    }
  }
  /**试用*/
  _probation = () => {
    this.props.setUser({
      userName: 'Customer',
      userType: UserType.PROBATION_USER,
    })
    if (!this.state.isFirstLogin) {
      // NavigationService.navigate('Mine')
      NavigationService.popToTop('Tabs')
    }
  }

  _login = async ({ isEmail, email, emailPwd, phone, phonePwd }) => {
    let result
    let userName = ''
    let password = ''

    try {
      if (isEmail) {
        if (!email) {
          //请输入邮箱或昵称
          Toast.show(
            getLanguage(this.props.language).Profile.ENTER_EMAIL_OR_USERNAME,
          )
          return
        }
        if (!emailPwd) {
          //请输入密码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
          return
        }
        userName = email
        password = emailPwd
      } else {
        if (!phone) {
          //请输入手机号
          Toast.show(getLanguage(this.props.language).Profile.ENTER_MOBILE)
          return
        }
        if (!phonePwd) {
          //请输入密码
          Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
          return
        }
        userName = phone
        password = phonePwd
      }

      let userInfo
      let isConnected = await NetInfo.isConnected.fetch()
      if (isConnected) {
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.LOG_IN,
        )
        userInfo = await JSOnlineService.getUserInfo(userName, isEmail)
        if (
          userInfo !== false &&
          userInfo.userId === this.props.user.currentUser.userId
        ) {
          Toast.show(getLanguage(global.language).Profile.LOGIN_CURRENT)
          return
        }
        let startLogin = async () => {
          let loginResult
          if (isEmail) {
            loginResult = await JSOnlineService.login(
              userName,
              password,
              'EMAIL_TYPE',
            )
            if (loginResult === true) {
              loginResult = await SOnlineService.login(userName, password)
            }
          } else {
            loginResult = await JSOnlineService.login(
              userName,
              password,
              'PHONE_TYPE',
            )
            if (loginResult === true) {
              loginResult = await SOnlineService.loginWithPhoneNumber(
                userName,
                password,
              )
            }
          }
          return loginResult
        }
        result = startLogin()
      } else {
        Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK)
        return
      }

      let timeout = sec => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('timeout')
          }, 1000 * sec)
        })
      }

      let res = await new Promise.race([result, timeout(40)])
      if (res === 'timeout') {
        Toast.show(getLanguage(this.props.language).Profile.LOGIN_TIMEOUT)
        return
      } else {
        result = res
      }

      userInfo = await JSOnlineService.getUserInfo(userName, isEmail)

      if (typeof result === 'boolean' && result && userInfo !== false) {
        await this.initUserDirectories(userName)

        let user = {
          userName: userName,
          password: password,
          nickname: userInfo.nickname,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          userId: userInfo.userId,
          isEmail: isEmail,
          userType: UserType.COMMON_USER,
        }
        let friendListResult = FriendListFileHandle.initFriendList(user)
        result = await new Promise.race([friendListResult, timeout(15)])
        if (result === 'timeout') {
          Toast.show(getLanguage(this.props.language).Profile.LOGIN_TIMEOUT)
        } else if (result) {
          global.isLogging = true
          this.props.setUser(user)
          if (!this.state.isFirstLogin) {
            NavigationService.popToTop('Tabs')
          }
        } else {
          Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
        }
      } else {
        if (
          result === '用户名或用户密码错误' ||
          result === 'account not exist or password error'
        ) {
          Toast.show(
            getLanguage(this.props.language).Prompt.INCORRECT_USER_INFO,
          )
        } else if (
          result === '无网络连接' ||
          result === 'The Internet connection appears to be offline.'
        ) {
          Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK)
        } else Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
        //'登录失败')
      }
    } catch (e) {
      //console.warn(e)
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
      //'登录异常')
    } finally {
      this.container && this.container.setLoading(false)
    }
  }

  renderLogin = () => {
    return <OnlineLoginView language={global.language} login={this._login} />
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          //登录
          title: getLanguage(this.props.language).Profile.LOGIN + ' Online',
          withoutBack: this.state.isFirstLogin,
          navigation: this.props.navigation,
        }}
      >
        {this.renderLogin()}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
