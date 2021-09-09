import * as React from 'react'
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Animated,
  Dimensions,
  Image,
} from 'react-native'
import { Toast, scaleSize, dataUtil  } from '../../../../../utils'
import styles from './styles'
import { getLanguage } from '../../../../../language'
import Input from '../../../../../components/Input'
import { getThemeAssets } from '../../../../../assets'
import SMessageServiceHTTP from '../../../Friend/SMessageServiceHTTP'
export default class IPortalLoginView extends React.Component {
  props: {
    language: string,
    appConfig: any,
    login: () => {},
    connect: () => {},
    setMessageService: () => void,
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
      showMessageServiceSettings: false,
      showFileServiceSettings: false,
    }

    this.iportalAddress = this.props.appConfig.messageServer.MSG_ADDRESS
    // this.iportalMQIP = '116.196.115.69'
    this.iportalMQIP = this.props.appConfig.messageServer.MSG_IP
    this.iportalMQPort = this.props.appConfig.messageServer.MSG_Port
    this.iportalMQManagePort = this.props.appConfig.messageServer.MSG_HTTP_Port
    this.iportalHostName = this.props.appConfig.messageServer.MSG_HostName
    this.iportalMQAdminName = this.props.appConfig.messageServer.MSG_UserName
    this.iportalMQAdminPassword = this.props.appConfig.messageServer.MSG_Password
    this.iportalFileUploadURL = this.props.appConfig.messageServer.FILE_UPLOAD_SERVER_URL
    this.iportalFileDownloadURL = this.props.appConfig.messageServer.FILE_DOWNLOAD_SERVER_URL
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
      this.props.setMessageService({
        MSG_ADDRESS: this.iportalAddress,
        MSG_IP: this.iportalMQIP,
        MSG_Port: this.iportalMQPort,
        MSG_HTTP_Port: this.iportalMQManagePort,
        MSG_HostName: this.iportalHostName,
        MSG_UserName: this.iportalMQAdminName,
        MSG_Password: this.iportalMQAdminPassword,
        FILE_UPLOAD_SERVER_URL: this.iportalFileUploadURL,
        FILE_DOWNLOAD_SERVER_URL: this.iportalFileDownloadURL,
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

  /**
   * 检查消息服务配置
   * @returns
   */
  checkMessageSettings = () => {
    if (
      this.iportalMQIP === '' || this.iportalMQIP === undefined ||
      this.iportalMQPort === '' || this.iportalMQPort === undefined ||
      this.iportalMQManagePort === '' || this.iportalMQManagePort === undefined ||
      this.iportalHostName === '' || this.iportalHostName === undefined ||
      this.iportalMQAdminName === '' || this.iportalMQAdminName === undefined ||
      this.iportalMQAdminPassword === '' || this.iportalMQAdminPassword === undefined
    ) {
      Toast.show('请检查消息服务配置')
      return false
    }
    return true
  }

  /**
   * 检查消息服务配置
   * @returns
   */
  checkFileSettings = async () => {
    try {
      if (
        this.iportalFileUploadURL === '' || this.iportalFileUploadURL === undefined ||
        this.iportalFileDownloadURL === '' || this.iportalFileDownloadURL === undefined
      ) {
        Toast.show('请检查文件服务配置')
        return false
      }
      let iportalFileUploadURL, iportalFileDownloadURL
      if (this.iportalFileUploadURL.indexOf('http') !== 0) {
        iportalFileUploadURL = 'http://' + this.iportalFileUploadURL
      }
      if (this.iportalFileDownloadURL.indexOf('http') !== 0) {
        iportalFileDownloadURL = 'http://' + this.iportalFileDownloadURL
      }

      // let extraData = {
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   method: 'POST',
      // }
      // let response = await Promise.race([
      //   fetch(iportalFileUploadURL, extraData),
      //   new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       reject(new Error('request timeout'))
      //     }, 10000)
      //   }),
      // ])
      // let response2 = await Promise.race([
      //   fetch(iportalFileDownloadURL),
      //   new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       reject(new Error('request timeout'))
      //     }, 10000)
      //   }),
      // ])
      // let status = response.status
      // let status2 = response2.status
      // console.warn(JSON.stringify(status))
      // console.warn(JSON.stringify(status2))
      // return status && status2
      return dataUtil.isLegalURL(iportalFileUploadURL) && dataUtil.isLegalURL(iportalFileDownloadURL)
    } catch(e) {
      Toast.show('文件服务配置错误')
      console.warn('checkFileSettings error:' + e)
      return false
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
        setTimeout(async () => {
          // GLOBAL.Loading.setLoading(false)
          this.props.connect(false)
          if (!await this.checkMessageSettings() || !await this.checkFileSettings()) {
            this.setState({connectTouch: true,nextText:getLanguage(GLOBAL.language).Profile.NEXT})
            return
          }
          this.setState({ showServer: false ,connectTouch: true,nextText:getLanguage(GLOBAL.language).Profile.NEXT})
          Animated.timing(this.state.left, {
            toValue: -this.screenWidth,
            duration: 500,
          }).start()
        }, 1000)
      } else {
        setTimeout(() => {
         
          this.props.connect(false)
          this.setState({connectTouch: true,nextText:getLanguage(GLOBAL.language).Profile.NEXT}, () => {
            Toast.show(getLanguage(GLOBAL.language).Profile.CONNECT_SERVER_FAIL)
          })
          // GLOBAL.Loading.setLoading(false)
        }, 1000)
      }
    } else {
      Toast.show(getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS)
    }
  }

  _renderInput = ({
    placeholder,
    defaultValue,
    onChangeText = () => {},
    secureTextEntry = false,
    showClear = true,
    tips = '',
    inputStyle,
  }) => {
    return (
      <View style={[styles.inpuViewStyle, inputStyle]}>
        <Text style={styles.textStyle}>
          {placeholder + ': ' + tips}
        </Text>
        <View style={[styles.inputBackgroud, {backgroundColor: 'white'}]}>
          <Input
            keyboardType={'default'}
            placeholder={placeholder}
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            defaultValue={defaultValue || ''}
            style={[styles.textInputStyle, {backgroundColor: 'transparent'}]}
            onChangeText={text => {
              if (onChangeText && typeof onChangeText === 'function') {
                onChangeText(text)
              }
            }}
            showClear={showClear}
            secureTextEntry={secureTextEntry}
            inputStyle={styles.customInputStyle}
          />
        </View>
      </View>
    )
  }

  /** 消息服务配置 */
  _renderMessageServiceSettings = () => {
    let image = this.state.showMessageServiceSettings
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    return (
      <View style={styles.settingsView}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.settingHeader}
          onPress={() => {
            this.setState({
              showMessageServiceSettings: !this.state.showMessageServiceSettings,
            })
          }}
        >
          <Text style={styles.sectionTitleStyle}>
            {getLanguage(this.props.language).Profile.MESSAGE_SERVICE_SETTING}
          </Text>
          <Image resizeMode={'contain'} source={image} style={styles.arrowImg} />
        </TouchableOpacity>
        {
          this.state.showMessageServiceSettings &&
          <>
            {this._renderInput({
              placeholder: getLanguage(this.props.language).Profile.MESSAGE_SERVICE_IP,
              defaultValue: this.iportalMQIP || '',
              onChangeText: text => {
                this.iportalMQIP = text
              },
              tips: 'e.g. 127.0.0.1',
              inputStyle: {width: '90%'},
            })}
            {/* <View
              style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            > */}
              {this._renderInput({
                placeholder: getLanguage(this.props.language).Profile.MESSAGE_SERVICE_PORT,
                defaultValue: this.iportalMQPort || '',
                onChangeText: text => {
                  this.iportalMQPort = text
                },
                tips: 'e.g. 5672',
                inputStyle: {width: '90%'},
              })}
              {this._renderInput({
                placeholder: getLanguage(this.props.language).Profile.MESSAGE_SERVICE_MANAGE_PORT,
                defaultValue: this.iportalMQManagePort || '',
                onChangeText: text => {
                  this.iportalMQManagePort = text
                },
                tips: 'e.g. 15672',
                inputStyle: {width: '90%'},
              })}
            {/* </View> */}
            {this._renderInput({
              placeholder: getLanguage(this.props.language).Profile.MESSAGE_SERVICE_HOST_NAME,
              defaultValue: this.iportalHostName || '',
              onChangeText: text => {
                this.iportalHostName = text
              },
              tips: 'e.g. /',
              inputStyle: {width: '90%'},
            })}
            {this._renderInput({
              placeholder: getLanguage(this.props.language).Profile.MESSAGE_SERVICE_ADMIN_NAME,
              defaultValue: this.iportalMQAdminName || '',
              onChangeText: text => {
                this.iportalMQAdminName = text
              },
              // tips: 'e.g. 127.0.0.1',
              inputStyle: {width: '90%'},
            })}
            {this._renderInput({
              placeholder: getLanguage(this.props.language).Profile.MESSAGE_SERVICE_ADMIN_PASSWORD,
              // defaultValue: '**********************',
              defaultValue: '',
              onChangeText: text => {
                this.iportalMQAdminPassword = text
              },
              secureTextEntry: true,
              // tips: 'e.g. 127.0.0.1',
              inputStyle: {width: '90%'},
            })}
          </>
        }
      </View>
    )
  }

  /** 文件服务配置 */
  _renderFileServiceSettings = () => {
    let image = this.state.showFileServiceSettings
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    return (
      <View style={styles.settingsView}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.settingHeader}
          onPress={() => {
            this.setState({
              showFileServiceSettings: !this.state.showFileServiceSettings,
            })
          }}
        >
          <Text style={styles.sectionTitleStyle}>
            {getLanguage(this.props.language).Profile.FILE_SERVICE_SETTING}
          </Text>
          <Image resizeMode={'contain'} source={image} style={styles.arrowImg} />
        </TouchableOpacity>
        {
          this.state.showFileServiceSettings &&
          <>
            {this._renderInput({
              placeholder: getLanguage(this.props.language).Profile.FILE_SERVICE_UPLOAD_URL,
              defaultValue: this.iportalFileUploadURL || '',
              onChangeText: text => {
                this.iportalFileUploadURL = text
              },
              tips: 'e.g. http://ip:port/upload',
              inputStyle: {width: '90%'},
            })}
            {this._renderInput({
              placeholder: getLanguage(this.props.language).Profile.FILE_SERVICE_UPLOAD_DOWNLOAD,
              defaultValue: this.iportalFileDownloadURL || '',
              onChangeText: text => {
                this.iportalFileDownloadURL = text
              },
              tips: 'e.g. http://ip:port/download',
              inputStyle: {width: '90%'},
            })}
          </>
        }
      </View>
    )
  }

  _renderServer = () => {
    return (
      <ScrollView
        style={[styles.sectionViewStyle]}
        contentContainerStyle={{paddingBottom: scaleSize(30)}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inpuViewStyle}>
          <View style={styles.inputBackgroud}>
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
            {'e.g. http://ip:port/iportal/web'}
          </Text>
        </View>
        {this._renderMessageServiceSettings()}
        {this._renderFileServiceSettings()}
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
      </ScrollView>
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
