import * as React from 'react'
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Animated,
  Dimensions,
} from 'react-native'
import { Toast, scaleSize  } from '../../../../../utils/index'
import styles from './styles'
import { getLanguage } from '../../../../../language/index'
import Input from '../../../../../components/Input'
export default class IPortalLoginView extends React.Component {
  props: {
    language: string,
    login: () => {},
    connect: () => {},
  }

  static defaultProps = {
    showRegister: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      behavior: 'padding',
      left: new Animated.Value(0),
      showServer: true,
      loginText:getLanguage(this.props.language).Profile.LOGIN,
      nextText:getLanguage(GLOBAL.language).Profile.NEXT,
      canTouch: true,//登录按钮点击判断 add jiakai
      connectTouch: true,//下一步按钮点击判断 add jiakai
    }
  }

  //登录结果按钮状态及提示 add jiakai
  loginResult = () => {
    this.setState({loginText:getLanguage(this.props.language).Profile.LOGIN,canTouch:true})
  }

  //登录中按钮状态及提示 add jiakai
  logining = () => {
    this.setState({loginText:getLanguage(this.props.language).Profile.LOGINING,canTouch:false})
  }

  //登录按钮点击事件处理 add jiakai
  loginTouch = () => {
    if (this.state.canTouch) {
      Keyboard.dismiss()
      this.props.login({
        url: this.iportalAddress,
        userName: this.iportalUser,
        password: this.iportalPassword,
      })
    } else {
      return
    }
  }

  //下一步按钮点击事件处理 add jiakai
  connecting = () => {
    if(this.state.connectTouch){
      Keyboard.dismiss()
      this.goNext()
    }else{
      return
    }
  }

  goNext = async () => {
    if (this.iportalAddress) {
      //下一步点击后按钮及提示状态 add jiakai
      this.setState({nextText:getLanguage(GLOBAL.language).Profile.CONNECTING,connectTouch:false})
      this.props.connect(true)
      // GLOBAL.Loading.setLoading(
      //   true,
      //   getLanguage(GLOBAL.language).Profile.CONNECTING,
      // )
      let url = this.iportalAddress + '/login.rjson'
      if (this.iportalAddress.indexOf('http') !== 0) {
        url = 'http://' + url
      }
      let status = undefined
      try {
        let response = await Promise.race([
          fetch(url),
          new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error('request timeout'))
            }, 10000)
          }),
        ])
        status = response.status
      } catch (error) {
        // console.log(error)
      }
      if (status === 405) {
        setTimeout(() => {
          // GLOBAL.Loading.setLoading(false)
          this.props.connect(false)
          this.setState({ showServer: false ,connectTouch: true,nextText:getLanguage(GLOBAL.language).Profile.NEXT})
          Animated.timing(this.state.left, {
            toValue: -this.screenWidth,
            duration: 500,
          }).start()
        }, 1000)
      } else {
        setTimeout(() => {
          Toast.show(getLanguage(GLOBAL.language).Profile.CONNECT_SERVER_FAIL)
          this.props.connect(false)
          this.setState({connectTouch: true,nextText:getLanguage(GLOBAL.language).Profile.NEXT})
          // GLOBAL.Loading.setLoading(false)
        }, 1000)
      }
    } else {
      Toast.show(getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS)
    }
  }

  _renderServer = () => {
    return (
      <View style={styles.sectionViewStyle}>
        <View style={styles.inpuViewStyle}>
          <View style={styles.inputBackgroud}>
            {/* <TextInput
              clearButtonMode={'while-editing'}
              keyboardType={'default'}
              placeholder={
                getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS
              }
              placeholderTextColor={'#A7A7A7'}
              multiline={false}
              defaultValue={this.iportalAddress || ''}
              style={styles.textInputStyle}
              onChangeText={text => {
                this.iportalAddress = text
              }}
              ref = {ref => this.inputRef = ref}
            /> */}
            <Input
              keyboardType={'default'}
              placeholder={
                getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS
              }
              placeholderTextColor={'#A7A7A7'}
              multiline={false}
              defaultValue={this.iportalAddress || ''}
              style={[styles.textInputStyle, {backgroundColor: 'transparent'}]}
              onChangeText={text => {
                this.iportalAddress = text
              }}
              showClear={true}
              inputStyle={styles.customInputStyle}
            />
          </View>
          <Text style={styles.textStyle}>
            {'Example: http://ip:port/iportal/web'}
          </Text>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={this.state.nextText}
          style={styles.loginStyle}
          onPress={() => {
            this.connecting()
          }}
        >
          <Text style={[styles.buttonText]}>
            {this.state.nextText}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderUser = () => {
    return (
      <View style={styles.sectionViewStyle}>
        <View style={styles.inpuViewStyle}>
          <View style={styles.inputBackgroud}>
            {/* <TextInput
              clearButtonMode={'while-editing'}
              keyboardType={'default'}
              placeholder={
                getLanguage(this.props.language).Profile.ENTER_USERNAME2
              }
              placeholderTextColor={'#A7A7A7'}
              multiline={false}
              defaultValue={this.iportalUser || ''}
              style={styles.textInputStyle}
              onChangeText={text => {
                this.iportalUser = text
              }}
            /> */}
            <Input
              keyboardType={'default'}
              placeholder={
                getLanguage(this.props.language).Profile.ENTER_USERNAME2
              }
              placeholderTextColor={'#A7A7A7'}
              multiline={false}
              defaultValue={this.iportalUser || ''}
              style={[styles.textInputStyle, {backgroundColor: 'transparent'}]}
              onChangeText={text => {
                this.iportalUser = text
              }}
              showClear={true}
              inputStyle={styles.customInputStyle}
            />
          </View>
          <View style={styles.inputBackgroud}>
            {/* <TextInput
              clearButtonMode={'while-editing'}
              secureTextEntry={true}
              placeholder={
                getLanguage(this.props.language).Profile.ENTER_PASSWORD
              }
              placeholderTextColor={'#A7A7A7'}
              multiline={false}
              password={true}
              style={styles.textInputStyle}
              defaultValue={this.iportalPassword || ''}
              onChangeText={text => {
                this.iportalPassword = text
              }}
            /> */}
            <Input
              clearButtonMode={'while-editing'}
              secureTextEntry={true}
              placeholder={
                getLanguage(this.props.language).Profile.ENTER_PASSWORD
              }
              placeholderTextColor={'#A7A7A7'}
              multiline={false}
              password={true}
              style={[styles.textInputStyle, {backgroundColor: 'transparent'}]}
              defaultValue={this.iportalPassword || ''}
              onChangeText={text => {
                this.iportalPassword = text
              }}
              showClear={true}
              inputStyle={styles.customInputStyle}
            />
          </View>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={this.state.loginText}
          style={styles.loginStyle}
          onPress={() => {
            this.loginTouch()
          }}
        >
          <Text style={[styles.buttonText]}>
            {/* 登录 */}
            {this.state.loginText}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderLoginSection = () => {
    // let left = this.state.left
    return (
      <Animated.View
        style={[
          styles.loginSectionView,
          // { left: left._value === 0 ? left : -this.screenWidth },
        ]}
      >
        {this.state.showServer && this._renderServer()}
        {!this.state.showServer && this._renderUser()}
      </Animated.View>
    )
  }

  render() {
    this.screenWidth = Dimensions.get('window').width
    return (
      // <KeyboardAvoidingView
      //   enabled={true}
      //   keyboardVerticalOffset={0}
      //   behavior={this.state.behavior}
      // >
      this.renderLoginSection()
      // </KeyboardAvoidingView>
    )
  }
}
