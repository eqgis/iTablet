/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/

import * as React from 'react'
import {
  TextInput,
  Text,
  Image,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native'
import { Toast, scaleSize, OnlineServicesUtils, screen } from '../../../../utils'
import { getPublicAssets } from '../../../../assets'
import { Container } from '../../../../components'
import NavigationService from '../../../NavigationService'
import styles, { fontSize } from './Styles'
import { getLanguage } from '../../../../language/index'
import { color } from '../../../../styles'
import Input from '../../../../components/Input/index'
let JSOnlineService = undefined
export default class Register extends React.Component {
  props: {
    language: string,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      verifyTime: 0,
      readProtocal: false,
      behavior: 'padding',
    }
    this.telArea = '86'
    JSOnlineService = new OnlineServicesUtils('online')
    JSOnlineService.loadPhoneRegisterPage()
  }

  componentDidMount() {
    if (!global.isPad && !global.ORIENTATIONLOCKED) {
      screen.lockToPortrait()
    }
  }

  componentWillUnmount() {
    if (!global.ORIENTATIONLOCKED) {
      screen.unlockAllOrientations()
    }
  }

  _goMine = () => {
    NavigationService.goBack()
  }

  _register = async () => {
    try {
      let result
      if (!this.txtPhoneNumberNickname) {
        //请输入昵称
        Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME)
        return
      }
      // if (!this.txtPhoneNumberRealName) {
      //   //请输入真实姓名
      //   Toast.show(getLanguage(this.props.language).Profile.ENTER_REALNAME)
      //   return
      // }
      // if (!this.txtPhoneNumberCompany) {
      //   //请输入工作机构
      //   Toast.show(getLanguage(this.props.language).Profile.ENTER_COMPANY)
      //   return
      // }
      // if (!this.txtPhoneNumberEmail) {
      //   //请输入个人邮箱
      //   Toast.show(getLanguage(this.props.language).Profile.ENTER_EMAIL)
      //   return
      // }
      if (!this.txtPhoneNumberPassword) {
        //请输入密码
        Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
        return
      }
      if (!this.passwordconfirm) {
        //确认密码
        Toast.show(getLanguage(this.props.language).Profile.RE_ENTER_PASSWORD)
        return
      }
      if (this.txtPhoneNumberPassword !== this.passwordconfirm) {
        //密码不一致
        Toast.show(getLanguage(this.props.language).Profile.PASSWORD_DISMATCH)
        return
      }
      if (!this.txtPhoneNumber) {
        //请输入手机号
        Toast.show(getLanguage(this.props.language).Profile.ENTER_MOBILE)
        return
      }
      if (!this.txtVerifyCode) {
        //请输入验证码
        Toast.show(getLanguage(this.props.language).Profile.ENTER_CODE)
        return
      }
      this.container.setLoading(
        true,
        getLanguage(this.props.language).Prompt.REGISTERING,
      )
      //'注册中...')
      result = await JSOnlineService.register('phone', {
        nickname: this.txtPhoneNumberNickname,
        password: this.txtPhoneNumberPassword,
        confirmpassword: this.confirmpassword,
        telArea: this.telArea,
        phoneNumber: this.txtPhoneNumber,
        SMSVerifyCode: this.txtVerifyCode,
      })

      let info
      if (typeof result === 'boolean' && result === true) {
        info = getLanguage(this.props.language).Prompt.REGIST_SUCCESS
        //'注册成功'
        Toast.show(info)
        this.container.setLoading(false)
        this._goMine()
        return
      } else {
        if (typeof result === 'string') {
          info = result
        } else {
          info = getLanguage(this.props.language).Prompt.REGIST_FAILED
        }
        Toast.show(info)
      }
      this.container.setLoading(false)
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
      //'网络错误')
      this.container.setLoading(false)
    }
  }

  renderRegister() {
    const inputStyle = { textAlign: 'left'}
    return (
      <View key={'phone'} style={{ width: '70%' }}>
        <Input
          keyboardType={'email-address'}
          placeholder={getLanguage(this.props.language).Profile.ENTER_USERNAME}
          placeholderTextColor={'#A7A7A7'}
          style={styles.textInputStyle}
          inputStyle={inputStyle}
          showClear={true}
          defaultValue={this.txtPhoneNumberNickname}
          onChangeText={text => {
            this.txtPhoneNumberNickname = text
          }}/>
        {/* <TextInput
          keyboardType={'email-address'}
          //'请输入真实姓名'
          placeholder={getLanguage(this.props.language).Profile.ENTER_REALNAME}
          placeholderTextColor={'#A7A7A7'}
          clearButtonMode={'while-editing'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberRealName}
          onChangeText={text => {
            this.txtPhoneNumberRealName = text
          }}
        /> */}
        {/* <TextInput
          keyboardType={'email-address'}
          //'请输入工作机构'
          placeholder={getLanguage(this.props.language).Profile.ENTER_COMPANY}
          placeholderTextColor={'#A7A7A7'}
          clearButtonMode={'while-editing'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberCompany}
          onChangeText={text => {
            this.txtPhoneNumberCompany = text
          }}
        /> */}
        {/* <TextInput
          keyboardType={'email-address'}
          clearButtonMode={'while-editing'}
          //'请输入邮箱'
          placeholder={getLanguage(this.props.language).Profile.ENTER_EMAIL}
          placeholderTextColor={'#A7A7A7'}
          style={styles.textInputStyle}
          defaultValue={this.txtPhoneNumberEmail}
          onChangeText={text => {
            this.txtPhoneNumberEmail = text
          }}
        /> */}
        <Input
          secureTextEntry={true}
          //'请输入密码'
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          placeholderTextColor={'#A7A7A7'}
          style={styles.textInputStyle}
          inputStyle={inputStyle}
          showClear={true}
          defaultValue={this.txtPhoneNumberPassword}
          onChangeText={text => {
            this.txtPhoneNumberPassword = text
          }}
        />
        <Input
          secureTextEntry={true}
          //'确认密码'
          placeholder={
            getLanguage(this.props.language).Profile.RE_ENTER_PASSWORD
          }
          placeholderTextColor={'#A7A7A7'}
          style={styles.textInputStyle}
          inputStyle={inputStyle}
          showClear={true}
          defaultValue={this.passwordconfirm}
          onChangeText={text => {
            this.passwordconfirm = text
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextInput
            keyboardType={'numeric'}
            maxLength={3}
            clearButtonMode={'never'}
            //国家区号
            placeholder={''}
            placeholderTextColor={'#A7A7A7'}
            style={[styles.textInputStyle, { width: scaleSize(60) }]}
            defaultValue={this.telArea}
            value={this.state.telArea}
            onBlur={() => {
              if (this.state.telArea === '') {
                this.setState({ telArea: '86' })
                this.telArea = '86'
              }
            }}
            onChangeText={text => {
              this.telArea = text
              this.setState({ telArea: text })
            }}
          />
          <Input
            keyboardType={'phone-pad'}
            //'请输入手机号'
            placeholder={getLanguage(this.props.language).Profile.ENTER_MOBILE}
            placeholderTextColor={'#A7A7A7'}
            style={[styles.textInputStyle, { flex: 1 }]}
            clearButtonMode={'while-editing'}
            defaultValue={this.txtPhoneNumber}
            onChangeText={text => {
              this.txtPhoneNumber = text
            }}
            inputStyle={inputStyle}
            showClear={true}
          />
        </View>
        <View style={styles.verifyCodeViewStyle}>
          <Input
            keyboardType={'phone-pad'}
            //'请输入验证码'
            placeholder={getLanguage(this.props.language).Profile.ENTER_CODE}
            placeholderTextColor={'#A7A7A7'}
            style={{
              flex: 1,
              fontSize: scaleSize(fontSize),
              padding: 0,
              color: 'black',
              backgroundColor: 'transparent',
              height: scaleSize(60),
            }}
            defaultValue={this.txtVerifyCode}
            onChangeText={text => {
              this.txtVerifyCode = text
            }}
            inputStyle={inputStyle}
            showClear={true}
          />
          <TouchableOpacity
            onPress={() => {
              if (!this.txtPhoneNumber && this.txtPhoneNumber === undefined) {
                //'请输入手机号'
                Toast.show(
                  getLanguage(this.props.language).Profile.ENTER_MOBILE,
                )
                return
              }
              Toast.show(
                getLanguage(this.props.language).Prompt.VERIFICATION_CODE_SENT,
              )
              this.setAvaiable(60)
              JSOnlineService.sendSMSVerifyCode(
                this.txtPhoneNumber,
                this.telArea,
              )
            }}
            disabled={this.state.verifyTime !== 0}
          >
            <Text
              style={[
                styles.verifyCodeRTextStyle,
                this.state.verifyTime !== 0 && { color: 'grey' },
              ]}
            >
              {/* 获取验证码 */}
              {getLanguage(this.props.language).Profile.GET_CODE}
              {this.state.verifyTime !== 0 && '(' + this.state.verifyTime + ')'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  setAvaiable = sec => {
    this.setState({ verifyTime: sec })
    this.verifyInterval = setInterval(() => {
      let time = this.state.verifyTime
      this.setState({ verifyTime: --time })
      if (time === 0) {
        clearInterval(this.verifyInterval)
      }
    }, 1000)
  }

  renderServiceProtocal = () => {
    let icon = this.state.readProtocal
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.protocalView}>
        <TouchableOpacity
          style={styles.protocalCheck}
          onPress={() =>
            this.setState({ readProtocal: !this.state.readProtocal })
          }
        >
          <Image
            source={icon}
            style={{ width: scaleSize(45), height: scaleSize(45) }}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.protocalTextView,
            { flexDirection: global.language === 'EN' ? 'column' : 'row' },
          ]}
        >
          <Text style={styles.protocalText}>
            {getLanguage(global.language).Profile.REGISTER_READ_PROTOCAL}
          </Text>
          <TouchableOpacity
            onPress={() =>
              NavigationService.navigate('Protocol', {
                type: 'SuperMapOnlineProtocal',
              })
            }
          >
            <Text style={[styles.protocalText, { color: '#4680DF' }]}>
              {getLanguage(global.language).Profile.REGISTER_ONLINE_PROTOCAL}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          //'注册'
          title: getLanguage(this.props.language).Profile.REGISTER + ' Online',
          navigation: this.props.navigation,
          headerStyle: {
            backgroundColor: color.contentColorWhite,
            borderBottomWidth: 0,
          },
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={0}
          style={{ flex: 1 }}
          contentContainerStyle={styles.keyboardAvoidingStyle}
          behavior={this.state.behavior}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              alignItems: 'center',
              width: '100%',
            }}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: 'center', width: '100%' }}>
              {this.renderRegister()}
              {this.renderServiceProtocal()}

              <TouchableOpacity
                style={[
                  styles.registerStyle,
                  !this.state.readProtocal && { backgroundColor: 'grey' },
                ]}
                disabled={!this.state.readProtocal}
                onPress={() => {
                  Keyboard.dismiss()
                  this._register()
                }}
              >
                <Text style={styles.titleContainerStyle}>
                  {/* 注册 */}
                  {getLanguage(this.props.language).Profile.REGISTER}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
