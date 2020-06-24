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
        {global.isPad && <View style={{ width: '100%', height: 15 }} />}
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
            // NavigationService.navigate('Register')
            NavigationService.navigate('Protocol', { type: 'Register' })
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
          {getLanguage(global.language).Profile.FORGET_PASSWORD}
        </Text>
      </View>
    )
  }

  renderLogin = () => {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={getLanguage(this.props.language).Profile.LOGIN}
        style={styles.loginStyle}
        onPress={() => {
          Keyboard.dismiss()
          let reg = /^[0-9]{11}$/
          let isEmail = !reg.test(this.userName)
          this.props.login({
            isEmail: isEmail,
            userName: this.userName,
            password: this.password,
          })
        }}
      >
        <Text style={[styles.buttonText]}>
          {getLanguage(this.props.language).Profile.LOGIN}
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
