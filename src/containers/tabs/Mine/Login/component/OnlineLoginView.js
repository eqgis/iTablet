import * as React from 'react'
import { TextInput, Text, View, TouchableOpacity, Keyboard } from 'react-native'
import styles from './styles'
import NavigationService from '../../../../NavigationService'
import { getLanguage } from '../../../../../language/index'
import { scaleSize } from '../../../../../utils'

export default class OnlineLoginView extends React.Component {
  props: {
    language: string,
    login: () => {},
    showRegister: Boolean,
  }

  static defaultProps = {
    showRegister: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      behavior: 'padding',
      loginText:getLanguage(this.props.language).Profile.LOGIN,
      canTouch: true,//登录按钮点击判断 add jiakai
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
    if(this.state.canTouch){
      Keyboard.dismiss()
      let reg = /^[0-9]+$/
      let isEmail = !reg.test(this.userName)
      this.props.login({
        isEmail: isEmail,
        userName: this.userName,
        password: this.password,
      })
    }else{
      return
    }
  }

  renderInput = () => {
    return (
      <View>
        <View style={styles.inputBackgroud}>
          <TextInput
            clearButtonMode={'while-editing'}
            keyboardType={'email-address'}
            placeholder={getLanguage(this.props.language).Profile.USERNAME_ALL}
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            defaultValue={this.userName || ''}
            style={styles.textInputStyle}
            onChangeText={text => {
              this.userName = text
            }}
          />
        </View>
        {GLOBAL.isPad && <View style={{ width: '100%', height: 15 }} />}
        <View style={styles.inputBackgroud}>
          <TextInput
            clearButtonMode={'while-editing'}
            secureTextEntry={true}
            placeholder={
              getLanguage(this.props.language).Profile.ENTER_PASSWORD
            }
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            password={true}
            style={styles.textInputStyle}
            defaultValue={this.password || ''}
            onChangeText={text => {
              this.password = text
            }}
          />
        </View>
      </View>
    )
  }

  renderRegister = () => {
    return (
      <View style={styles.registerContainerStyle}>
        <Text
          style={styles.registetrText}
          onPress={() => {
            NavigationService.navigate('Register')
            // NavigationService.navigate('Protocol', { type: 'Register' })
          }}
        >
          {getLanguage(this.props.language).Profile.REGISTER}
        </Text>
        <Text
          style={styles.registetrText}
          onPress={() => {
            NavigationService.navigate('GetBack')
          }}
        >
          {getLanguage(GLOBAL.language).Profile.FORGET_PASSWORD}
        </Text>
      </View>
    )
  }

  renderLogin = () => {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={this.state.loginText}
        style={styles.loginStyle}
        onPress={() => {
          this.loginTouch()
        }}
      >
        <Text style={[styles.buttonText]}>
          {this.state.loginText}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      // <KeyboardAvoidingView
      //   enabled={true}
      //   keyboardVerticalOffset={0}
      //   // style={{ flex: 1 }}
      //   // contentContainerStyle={{
      //   //   flex: 1,
      //   //   alignItems: 'center',
      //   //   flexDirection: 'column',
      //   // }}
      //   behavior={this.state.behavior}
      // >
      <View style={{ flex: 1, alignItems: 'center', marginTop: scaleSize(10) }}>
        <View
          style={{
            width: '75%',
            alignItems: 'center',
          }}
        >
          {this.renderInput()}
          {this.renderLogin()}
        </View>
        {this.props.showRegister && this.renderRegister()}
      </View>
      // </KeyboardAvoidingView>
    )
  }
}
