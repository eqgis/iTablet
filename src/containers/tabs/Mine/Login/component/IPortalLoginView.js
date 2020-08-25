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
import { Toast } from '../../../../../utils/index'
import styles from './styles'
import { getLanguage } from '../../../../../language/index'

export default class IPortalLoginView extends React.Component {
  props: {
    language: string,
    login: () => {},
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
    }
  }

  goNext = async () => {
    if (this.iportalAddress) {
      global.Loading.setLoading(
        true,
        getLanguage(global.language).Profile.CONNECTING,
      )
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
          global.Loading.setLoading(false)
          this.setState({ showServer: false })
          Animated.timing(this.state.left, {
            toValue: -this.screenWidth,
            duration: 500,
          }).start()
        }, 1000)
      } else {
        setTimeout(() => {
          Toast.show(getLanguage(global.language).Profile.CONNECT_SERVER_FAIL)
          global.Loading.setLoading(false)
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
            <TextInput
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
            />
          </View>
          <Text style={styles.textStyle}>
            {'Example: http://ip:port/iportal/web'}
          </Text>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={'NEXT'}
          style={styles.loginStyle}
          onPress={() => {
            Keyboard.dismiss()
            this.goNext()
          }}
        >
          <Text style={[styles.buttonText]}>
            {getLanguage(global.language).Profile.NEXT}
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
            <TextInput
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
            />
          </View>
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
              defaultValue={this.iportalPassword || ''}
              onChangeText={text => {
                this.iportalPassword = text
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={getLanguage(this.props.language).Profile.LOGIN}
          style={styles.loginStyle}
          onPress={() => {
            Keyboard.dismiss()
            this.props.login({
              url: this.iportalAddress,
              userName: this.iportalUser,
              password: this.iportalPassword,
            })
          }}
        >
          <Text style={[styles.buttonText]}>
            {/* 登录 */}
            {getLanguage(this.props.language).Profile.LOGIN}
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
