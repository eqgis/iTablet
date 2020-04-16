import * as React from 'react'
import {
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native'
import { scaleSize } from '../../../../../utils/index'
import styles, {
  titleOnFocusBackgroundColor,
  titleOnBlurBackgroundColor,
} from '../Styles'
import NavigationService from '../../../../NavigationService'
import color from '../../../../../styles/color'
import { getLanguage } from '../../../../../language/index'

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
      onEmailTitleFocus: false,
      onPhoneTitleFocus: true,
      titleEmailDefaultBg: titleOnBlurBackgroundColor,
      titlePhoneBg: titleOnFocusBackgroundColor,
      behavior: 'padding',
    }
  }

  _renderEmail = () => {
    return (
      <View key={'email'} style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          keyboardType={'email-address'}
          // 请输入邮箱或昵称
          placeholder={
            getLanguage(this.props.language).Profile.ENTER_EMAIL_OR_USERNAME
          }
          placeholderTextColor={'#A7A7A7'}
          multiline={false}
          defaultValue={this.txtEmail || ''}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtEmail = text
          }}
        />
        <TextInput
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          // 请输入密码
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          placeholderTextColor={'#A7A7A7'}
          multiline={false}
          password={true}
          style={styles.textInputStyle}
          defaultValue={this.txtEmailPassword || ''}
          onChangeText={text => {
            this.txtEmailPassword = text
          }}
        />
      </View>
    )
  }
  _renderPhone = () => {
    return (
      <View key={'phone'} style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          //请输入手机号
          placeholder={getLanguage(this.props.language).Profile.ENTER_MOBILE}
          placeholderTextColor={'#A7A7A7'}
          defaultValue={this.txtPhoneNumber}
          keyboardType={'number-pad'}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtPhoneNumber = text
          }}
        />
        <TextInput
          secureTextEntry={true}
          multiline={false}
          textContentType={'password'}
          //请输入密码
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          placeholderTextColor={'#A7A7A7'}
          defaultValue={this.txtPhoneNumberPassword}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.txtPhoneNumberPassword = text
          }}
        />
      </View>
    )
  }
  _onEmailPress = () => {
    if (!this.state.onEmailTitleFocus) {
      this.setState({
        onEmailTitleFocus: true,
        onPhoneTitleFocus: false,
        titleEmailDefaultBg: titleOnFocusBackgroundColor,
        titlePhoneBg: titleOnBlurBackgroundColor,
      })
    }
  }
  _onPhonePress = () => {
    if (!this.state.onPhoneTitleFocus) {
      this.setState({
        onEmailTitleFocus: false,
        onPhoneTitleFocus: true,
        titleEmailDefaultBg: titleOnBlurBackgroundColor,
        titlePhoneBg: titleOnFocusBackgroundColor,
      })
    }
  }
  _onSelectTitle = () => {
    if (this.state.onEmailTitleFocus) {
      return this._renderEmail()
    } else {
      return this._renderPhone()
    }
  }

  renderRegister = () => {
    return (
      <View style={styles.viewStyle}>
        <Text
          style={{
            paddingLeft: 5,
            lineHeight: 40,
            textAlign: 'left',
            color: color.font_color_white,
            fontSize: scaleSize(20),
          }}
          onPress={() => {
            NavigationService.navigate('Register')
          }}
        >
          {/* 注册 */}
          {getLanguage(this.props.language).Profile.REGISTER}
        </Text>
        <Text
          style={{
            paddingRight: 5,
            lineHeight: 40,
            textAlign: 'right',
            color: color.font_color_white,
            fontSize: scaleSize(20),
          }}
          onPress={() => {
            NavigationService.navigate('GetBack')
          }}
        >
          {getLanguage(global.language).Profile.FORGET_PASSWORD}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView
        enabled={true}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'column',
        }}
        behavior={this.state.behavior}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ height: 500, alignItems: 'center' }}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'handled'}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.keyboardAvoidingStyle}>
            <View
              style={[
                styles.titleStyle,
                {
                  borderRadius: 6,
                  borderColor: color.itemColorBlack,
                  borderWidth: 2,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  this._onPhonePress()
                }}
                style={[
                  {
                    flex: 1,
                    height: '100%',
                    alignItems: 'center',
                    borderTopLeftRadius: 1,
                    borderBottomLeftRadius: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderColor: color.borderColorBlack,
                    justifyContent: 'center',
                    backgroundColor: this.state.titlePhoneBg,
                  },
                ]}
              >
                <Text style={[styles.titleContainerStyle]}>
                  {/* 手机登录 */}
                  {getLanguage(this.props.language).Profile.MOBILE_LOGIN}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this._onEmailPress()
                }}
                style={{
                  flex: 1,
                  height: '100%',
                  alignItems: 'center',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: 1,
                  borderBottomRightRadius: 1,
                  borderColor: color.borderColorBlack,
                  justifyContent: 'center',
                  backgroundColor: this.state.titleEmailDefaultBg,
                }}
              >
                <Text style={[styles.titleContainerStyle]}>
                  {/* 邮箱登录 */}
                  {getLanguage(this.props.language).Profile.EMAIL_LOGIN}
                </Text>
              </TouchableOpacity>
            </View>
            {this._onSelectTitle()}
            {this.props.showRegister && this.renderRegister()}

            {/* 登录 */}
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={
                getLanguage(this.props.language).Profile.LOGIN
              }
              style={styles.loginStyle}
              onPress={() => {
                Keyboard.dismiss()
                this.props.login({
                  isEmail: this.state.onEmailTitleFocus,
                  email: this.txtEmail,
                  emailPwd: this.txtEmailPassword,
                  phone: this.txtPhoneNumber,
                  phonePwd: this.txtPhoneNumberPassword,
                })
              }}
            >
              <Text style={[styles.titleContainerStyle]}>
                {/* 登录 */}
                {getLanguage(this.props.language).Profile.LOGIN}
              </Text>
            </TouchableOpacity>
            {/*<View style={{marginTop: 5}}/>*/}
            {/* <TouchableOpacity
                accessible={true}
                accessibilityLabel={'游客'}
                style={styles.probationStyle}
                onPress={() => {
                  this._probation()
                }}
              >
                <Text style={[styles.titleContainerStyle]}>游客</Text>
              </TouchableOpacity>*/}
            <View style={{ flex: 1, height: 200 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
