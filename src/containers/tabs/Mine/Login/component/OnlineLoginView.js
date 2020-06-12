import * as React from 'react'
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native'
import { scaleSize } from '../../../../../utils/index'
import styles from '../Styles'
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
      behavior: 'padding',
    }
  }

  renderInput = () => {
    return (
      <View key={'email'} style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          keyboardType={'email-address'}
          placeholder={
            getLanguage(this.props.language).Profile.ENTER_USERNAME_ALL
          }
          placeholderTextColor={'#A7A7A7'}
          multiline={false}
          defaultValue={this.userName || ''}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.userName = text
          }}
        />
        <TextInput
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
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
    )
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
            // NavigationService.navigate('Register')
            NavigationService.navigate('Protocol', { type: 'Register' })
          }}
        >
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
        <Text style={[styles.titleContainerStyle]}>
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
      <ScrollView
        style={{ marginTop: scaleSize(50) }}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'handled'}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.keyboardAvoidingStyle}>
          {this.renderInput()}
          {this.props.showRegister && this.renderRegister()}
          {this.renderLogin()}
        </View>
      </ScrollView>
      // </KeyboardAvoidingView>
    )
  }
}
