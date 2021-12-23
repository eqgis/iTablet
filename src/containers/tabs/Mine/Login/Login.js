import * as React from 'react'
import {
  NetInfo,
  View,
  TouchableOpacity,
  Text,
  Animated,
  FlatList,
} from 'react-native'
import { Toast, OnlineServicesUtils, scaleSize } from '../../../../utils/index'
import { Container } from '../../../../components'
import { FileTools } from '../../../../native'
import { SIPortalService, AppInfo } from 'imobile_for_reactnative'
import ConstPath from '../../../../constants/ConstPath'
import NavigationService from '../../../NavigationService'
import UserType from '../../../../constants/UserType'
import { getLanguage } from '../../../../language/index'
import FriendListFileHandle from '../../Friend/FriendListFileHandle'
import CoworkFileHandle from '../../Find/CoworkManagePage/CoworkFileHandle'
import OnlineLoginView from './component/OnlineLoginView'
import IPortalLoginView from './component/IPortalLoginView'
import Orientation from 'react-native-orientation'
import { color } from '../../../../styles'

const JSOnlineService = new OnlineServicesUtils('online')
export default class Login extends React.Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    setUser: () => {},
    setMessageService: (data: any) => void,
    appConfig: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.show =
      params && params.show && params.show.length > 0 ? params.show : []
    this.state = {
      data: [],
      type: '',
      covered:false,//登录过程中用来遮盖按钮 add jiakai
    }
    this.scaleL = new Animated.Value(1)
    this.scaleR = new Animated.Value(0.7)
  }

  componentDidMount() {
    this.getData()
    if (!GLOBAL.isPad) {
      Orientation.lockToPortrait()
      GLOBAL.ORIENTATIONLOCKED = true
    }
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations()
    GLOBAL.ORIENTATIONLOCKED = false
  }

  getData = () => {
    let online = {
      key: 'Online',
      image: require('../../../../assets/Mine/online_white.png'),
    }
    let iportal = {
      key: 'iPortal',
      image: require('../../../../assets/Mine/iportal_white.png'),
    }
    let data = []
    let type
    if (this.props.appConfig.login && this.props.appConfig.login.length > 0) {
      for (let i = 0; i < this.props.appConfig.login.length; i++) {
        switch (this.props.appConfig.login[i]) {
          case 'Online':
            if (this.show.length === 0 || this.show.indexOf('Online') > -1) {
              data.push(online)
              !type && (type = 'Online')
            }
            break
          case 'iPortal':
            if (this.show.length === 0 || this.show.indexOf('iPortal') > -1) {
              data.push(iportal)
              !type && (type = 'iPortal')
            }
            break
        }
      }
    } else {
      if (this.show.length === 0 || this.show.indexOf('Online') > -1) {
        data.push(online)
        !type && (type = 'Online')
      }
      if (this.show.length === 0 || this.show.indexOf('iPortal') > -1) {
        data.push(iportal)
        !type && (type = 'iPortal')
      }
    }
    data.unshift({ key: 'start' })
    data.push({ key: 'end' })
    this.setState({
      data: data,
      type: type ? type : '',
    })
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
        let result = await FileTools.initUserDefaultData(userName)
        !result && Toast.show('初始化用户数据失败')
      } else {
        Toast.show('创建用户目录失败')
      }
    } catch (e) {
      Toast.show('创建用户目录失败')
    }
  }

  _loginOnline = async ({ isEmail, userName, password }) => {
    try {
      if (!userName) {
        Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME_ALL)
        return
      }
      if (!password) {
        Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
        return
      }

      let isConnected = await NetInfo.isConnected.fetch()
      if(!isConnected) {
        Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK)
        return
      }

      this.onlineLogin.logining()
      this.setState({covered:true})
      let timeout = sec => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('timeout')
          }, 1000 * sec)
        })
      }

      //使用邮箱或昵称登录的用户可以在此处检查是否已经登录
      const userInfo = await JSOnlineService.getUserInfo(userName)
      if (
        userInfo !== false &&
          userInfo.userId === this.props.user.currentUser.userId
      ) {
        Toast.show(getLanguage().Profile.LOGIN_CURRENT)
        return
      }

      const loginResult = await JSOnlineService.login(userName, password)

      if (loginResult.userInfo) {
        const loginUser = loginResult.userInfo
        if(loginUser.userName === this.props.user.currentUser.userId) {
          Toast.show(getLanguage().Profile.LOGIN_CURRENT)
          return
        }
        await this.initUserDirectories(loginUser.userName)

        let user = {
          userName: loginUser.userName,
          password: password,
          nickname: loginUser.nickname,
          email: loginUser.email,
          phoneNumber: loginUser.phoneNumber,
          userId: loginUser.userName,
          isEmail: isEmail,
          userType: loginUser.userType,
          roles: loginUser.roles,
        }
        let friendListResult = FriendListFileHandle.initFriendList(user)
        // let coworkListResult = CoworkFileHandle.initCoworkList(user) // 初始化协作文件
        const result = await new Promise.race([friendListResult, timeout(30)])
        if (result === 'timeout') {
          Toast.show(getLanguage(this.props.language).Profile.LOGIN_TIMEOUT)
        } else if (result) {
          await this.props.setUser(user)
          GLOBAL.isLogging = true
          GLOBAL.getFriend?.().onUserLoggedin()
          AppInfo.setServiceUrl('https://www.supermapol.com/web/')
          NavigationService.popToTop('Tabs')
        } else {
          Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
        }
      } else {
        const errorInfo = loginResult.errorInfo
        if (
          errorInfo === '用户名或用户密码错误' ||
          errorInfo === 'account not exist or password error'
        ) {
          Toast.show(
            getLanguage(this.props.language).Prompt.INCORRECT_USER_INFO,
          )
        } else if (errorInfo === 'timeout') {
          Toast.show(getLanguage(this.props.language).Profile.LOGIN_TIMEOUT)
        } else Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
        //'登录失败')
      }
    } catch (e) {
      //console.warn(e)
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
      //'登录异常')
    } finally {
      this.setState({covered:false})
      this.onlineLogin.loginResult()
      // this.container && this.container.setLoading(false)
    }
  }

  _loginIPortal = async ({ url, userName, password }) => {
    try {
      if (!url) {
        Toast.show(
          getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS,
        )
        return
      }
      if (!userName) {
        Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME2)
        return
      }
      if (!password) {
        Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
        return
      }

      this.iportalLogin.logining()
      this.setState({covered:true})
      // this.container.setLoading(
      //   true,
      //   getLanguage(this.props.language).Prompt.LOG_IN,
      // )

      let result = await SIPortalService.login(url, userName, password, true)
      if (typeof result === 'boolean' && result) {
        let info = await SIPortalService.getMyAccount()
        if (info) {
          let userInfo = JSON.parse(info)
          await this.initUserDirectories(userInfo.name)
          const user = {
            serverUrl: url,
            userName: userInfo.name,
            userId: userInfo.name,
            password: password,
            nickname: userInfo.nickname,
            email: userInfo.email,
            userType: UserType.IPORTAL_COMMON_USER,
            roles: userInfo.roles,
          }
          await this.props.setUser(user)
          GLOBAL.isLogging = true
          GLOBAL.getFriend?.().onUserLoggedin()
          AppInfo.setServiceUrl(url)
          FriendListFileHandle.initFriendList(user) // iportal初始化好友列表信息,防止之前online用户留存信息的存在,把online的好友文件下载到iportal用户中
        }
        this.iportalLogin.loginResult()
        this.setState({covered:false})
        // this.container.setLoading(false)
        NavigationService.popToTop()
      } else {
        this.iportalLogin.loginResult()
        this.setState({covered:false})
        // this.container.setLoading(false)
        if (result === false) {
          Toast.show(
            getLanguage(this.props.language).Prompt.INCORRECT_IPORTAL_ADDRESS,
          )
        } else if (result === '登陆失败:请检查用户名和密码') {
          Toast.show(
            getLanguage(this.props.language).Prompt.INCORRECT_USER_INFO,
          )
        } else {
          Toast.show(result)
        }
      }
    } catch (e) {
      this.iportalLogin.loginResult()
      this.setState({covered:false})
      // this.container.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
    }
  }

  _connect = (value)  => {
    this.setState({covered:value})
  }

  renderItem = ({ item, index }) => {
    if (!item.key || !item.image) {
      return (
        <View
          style={{
            width: scaleSize(150),
            height: scaleSize(150),
          }}
        />
      )
    }
    let scale =
      index === 1
        ? this.scaleL.interpolate({
          inputRange: [0, 35, 70],
          outputRange: [1, 0.8, 0.6],
        })
        : this.scaleR.interpolate({
          inputRange: [0, 35, 70],
          outputRange: [0.6, 0.8, 1],
        })
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (index === 1) {
            this.list.scrollToOffset({ offset: 0 })
          } else {
            this.list.scrollToOffset({ offset: 80 })
          }
        }}
      >
        <Animated.View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#505050',
              borderRadius: scaleSize(75),
              width: scaleSize(150),
              height: scaleSize(150),
              transform: [{ scale: scale }],
            },
          ]}
        >
          <Animated.Image
            style={[
              {
                width: scaleSize(100),
                height: scaleSize(100),
              },
            ]}
            source={item.image}
          />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  renderLoginType = () => {
    let text = ''
    if (this.state.type === 'Online') {
      text = 'Online'
    } else if (this.state.type === 'iPortal') {
      text = 'iPortal'
    }
    return (
      <View
        style={{
          marginTop: scaleSize(30),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: scaleSize(450) }}>
          <FlatList
            ref={ref => (this.list = ref)}
            data={this.state.data}
            renderItem={this.renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={event => {
              this.offset = event.nativeEvent.contentOffset.x
              if (this.offset < 0) {
                this.offset = 0
              } else if (this.offset > 70) {
                this.offset = 70
              }
              Animated.parallel([
                Animated.timing(this.scaleL, {
                  toValue: this.offset,
                  duration: 0,
                }),
                Animated.timing(this.scaleR, {
                  toValue: this.offset,
                  duration: 0,
                }),
              ]).start()

              if (this.state.data.length > 3) {
                if (this.offset < 40) {
                  if (this.state.type !== this.state.data[1].key) {
                    this.setState({ type: this.state.data[1].key })
                  }
                } else if (this.offset > 40) {
                  if (this.state.type !== this.state.data[2].key) {
                    this.setState({ type: this.state.data[2].key })
                  }
                }
              }
            }}
          />
        </View>
        <Text style={{ fontSize: scaleSize(26), color: 'black' }}>{text}</Text>
      </View>
    )
  }

  renderLogin = () => {
    if (this.state.type === 'Online') {
      return (
        <OnlineLoginView language={GLOBAL.language} login={this._loginOnline} ref={ref => (this.onlineLogin = ref)}/>
      )
    } else if (this.state.type === 'iPortal') {
      return (
        <IPortalLoginView
          language={GLOBAL.language}
          login={this._loginIPortal}
          connect={this._connect}
          setMessageService={this.props.setMessageService}
          appConfig={this.props.appConfig}
          ref={ref => (this.iportalLogin = ref)}
        />
      )
    }
  }

  renderCovered = () => {
    return (
      <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'transparent' }} />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={{ backgroundColor: color.contentColorWhite }}
        headerProps={{
          // title: getLanguage(this.props.language).Profile.LOGIN,
          navigation: this.props.navigation,
          backImg: require('../../../../assets/public/left_arrow.png'),
          headerStyle: {
            backgroundColor: color.contentColorWhite,
            borderBottomWidth: 0,
          },
        }}
      >
        {this.renderLoginType()}
        {this.renderLogin()}
        {this.state.covered&&this.renderCovered()}
      </Container>
    )
  }
}
