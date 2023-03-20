import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ImageSourcePropType} from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { getPublicAssets } from "@/assets"
import { setServerUserId, setPassword, setServerUserName, setServerPubkey, setLangchaoUserInfo } from '../reduxModels/langchao'
import { dateFormat, getServerPubKeyUtil, getToken, login, printLog, setSysOrgid, setUserId, setUserInfo, setUserName, users } from "../utils/langchaoServer"
import { color } from "@/styles"
import NavigationService from "@/containers/NavigationService"
import { Picker } from '@react-native-picker/picker'
import { getJson } from "../assets/data"
import { getImage } from "../assets/Image"
import { Toast } from "@/utils"
import { SMap } from "imobile_for_reactnative"
// import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId } from "@/redux/models/langchao"


type inputType = 'none'
| 'URL'
| 'addressCity'
| 'addressCityAndState'
| 'addressState'
| 'countryName'
| 'creditCardNumber'
| 'emailAddress'
| 'familyName'
| 'fullStreetAddress'
| 'givenName'
| 'jobTitle'
| 'location'
| 'middleName'
| 'name'
| 'namePrefix'
| 'nameSuffix'
| 'nickname'
| 'organizationName'
| 'postalCode'
| 'streetAddressLine1'
| 'streetAddressLine2'
| 'sublocality'
| 'telephoneNumber'
| 'username'
| 'password'
| 'newPassword'
| 'oneTimeCode'


interface Props extends ReduxProps {
  route: MainStackScreenRouteProp<'LangChaoLogin'>
	navigation: any,
  device: any,
  language: string,
  serverIP: string,

}

interface State {
	userId: string,
	password: string,

}

class LangChaoLogin extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      userId: this.props.userId || "",
      password: this.props.password || "",
    }
  }

  componentDidMount = async (): Promise<void> => {

  }

  userIdChange = (text: string) => {
    this.setState({
      userId: text,
    })
  }

  passwordChange = (text: string) => {
    this.setState({
      password: text,
    })
  }
  backAction = () => {
    const type: string | undefined = this.props.route.params?.type
    if(type === "setting") {
      NavigationService.navigate('SettingPage')
    } else {
      NavigationService.goBack()
    }
  }

  loginAction = async () => {
    if(this.props.serverIP === "") {
      Toast.show(getLanguage(global.language).Map_Settings.FIRST_SETTING_SERVER_IP)
      return
    }
    if(this.state.userId !== "") {
      if(this.state.password !== "") {

        // 如果输入的是模拟账号，就跳过登录的步骤
        if(this.state.userId === 'test123' && this.state.password === "123456") {
          console.warn(`\n 登录成功模拟账号 loginAction : ${this.state.userId}  - pw: ${this.state.password}`)
          printLog(`\n 登录成功模拟账号 loginAction : ${this.state.userId}  - pw: ${this.state.password}`)
          // 1. 登录成功,主动归还许可
          const recycleResult = await SMap.recycleLicense()
          console.warn(`\n 登录成功,先归还许可 loginAction : ${recycleResult}`)
          printLog(`\n 登录成功,先归还许可 loginAction : ${recycleResult}`)

          await this.props.setServerUserId(this.state.userId)
          await this.props.setPassword(this.state.password)
          await this.props.setServerUserName('test123')
          // UserAuthCode 激活码
          // 2. 激活许可
          console.warn(`\n 登录成功,即将激活许可`)
          printLog(`\n 登录成功,即将激活许可`)
          const activeKey = '79B28-29Q19-71690-SM56W-NP5JP'
          const activeLicenseResult =  await SMap.activateLicense(activeKey)
          console.warn(`\n 登录成功,激活许可 ${activeLicenseResult}${activeKey}`)
          printLog(`\n 登录成功,激活许可 ${activeLicenseResult}`)

          await this.getUserData()
          const type: string | undefined = this.props.route.params?.type
          if(type === "setting") {
            NavigationService.navigate('SettingPage')
          } else {
            NavigationService.goBack()
          }
          return
        }

        const pubkey = await getServerPubKeyUtil()
        if(pubkey !== "") {
          this.props.setServerPubkey(pubkey)
          const result = await login(this.state.userId, this.state.password)

          if(result) {
            // 1. 登录成功,主动归还许可
            const recycleResult = await SMap.recycleLicense()
            printLog(`\n 登录成功,先归还许可 loginAction : ${recycleResult}`)

            await this.props.setServerUserId(this.state.userId)
            await this.props.setPassword(this.state.password)
            await this.props.setServerUserName(result.UserName)

            // UserAuthCode 激活码
            if (result.UserAuthCode) {
              // 2. 激活许可
              printLog(`\n 登录成功,激活许可 UserAuthCode: ${result.UserAuthCode}`)
              const activateResult = await SMap.activateLicense(result.UserAuthCode)
              printLog(`\n 登录成功,归还后,重新激活许可 loginAction : ${activateResult}`)
            }

            await this.getUserData()
            // NavigationService.goBack()
            const type: string | undefined = this.props.route.params?.type
            if(type === "setting") {
              NavigationService.navigate('SettingPage')
            } else {
              NavigationService.goBack()
            }
          }
        } else {
          Toast.show(getLanguage(global.language).Map_Settings.FAILED_TO_LOG)
        }
      } else {
        Toast.show(getLanguage(global.language).Map_Settings.ENTER_PASSWORD)
      }

    } else {
      Toast.show(getLanguage(global.language).Map_Settings.ENTER_USERNAME2)
    }


  }

  getUserData = async() => {
    // const date = new Date()
    // const timezone = 8 //目标时区时间，东八区(北京时间)   东时区正数 西市区负数
    // const offset_GMT = date.getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    // const nowDate = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    // const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000)
    // // const beijingTime = targetDate.getTime()
    // // 格式化时间
    // // const formDateLocal = await dateFormat("yyyy-MM-dd HH:mm:ss", date)
    // const formDateBeijing = await dateFormat("yyyy-MM-dd HH:mm:ss", targetDate)

    const params = {
      UserId: this.props.userId,
      UserName: this.props.userName,
      BeginTime: null,
      EndTime: null,
      SysOrgid: this.props.departmentId,
    }
    const dataInfo = await users(params)
    if(dataInfo) {
      const data = dataInfo[0]
      if(data) {
        this.props.setLangchaoUserInfo(data)
      }
    }
  }

  settingAction = () => {
    NavigationService.navigate('InputServer',{
      type: 'login'
    })
  }

  renderHeaderRight = () => {
    return (
      <View
      >
        <TouchableOpacity
          onPress={this.settingAction}
        >
          <Image
            style={[{
              width: dp(30),
              height: dp(30),
            }]}
            source={getImage().login_setting}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderInputItem = (imageSrc: ImageSourcePropType, value: string, changeTextAction: (text: string) => void, type?:inputType, placeholder = "") => {
    return (
      <View
        style={[styles.itemContainerStyle]}
      >
        <View
          style={[styles.itemTitleView]}
        >
          {/* <Text
            style={[styles.itemTitleText]}
          >{title}</Text>
          {isRequired && (
            <Text style = {[{
              color: '#f00',
              fontSize: dp(10),
              position: 'absolute',
              left: dp(-10),
              top: dp(5),
            }]}>{"*"}</Text>
          )} */}
          <Image
            source={imageSrc}
            style={[{
              width: dp(30),
              height: dp(30),
            }]}
          />
        </View>
        <View style={[
          styles.dialogInputContainer,
          // value === "" && {
          //   borderColor: '#f00',
          // }
        ]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {placeholder}
            placeholderTextColor={'rgba(255,255,255,.7)'}
            value = {value}
            textContentType={type}
            secureTextEntry={type === 'password'}
            onChangeText = {changeTextAction}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              changeTextAction("")
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLogo =() => {
    return(
      <View
        style={[{
          width: '100%',
          height: dp(100),
          marginTop: dp(70),
          justifyContent: 'center',
          alignItems: 'center',

        }]}
      >
        <Image
          source={getImage().icon_logo}
          style={[{
            width: dp(80),
            height: dp(80),
            borderRadius: dp(15),
            borderWidth: dp(3),
            borderColor: 'rgba(255,255,255,1)'
          }]}
        />
      </View>
    )
  }

  renderContentView = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {this.renderInputItem(getImage().icon_login_user, this.state.userId, this.userIdChange, undefined, getLanguage(global.language).Map_Settings.USER_ID)}
        {this.renderInputItem(getImage().icon_login_password, this.state.password, this.passwordChange, 'password', getLanguage(global.language).Map_Settings.PASSWORD)}
      </View>
    )
  }
  renderBtn = () => {
    return (
      <View
        style={[styles.partViewStyle, {
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <TouchableOpacity
          style={[{
            width: '70%',
            height: dp(50),
            backgroundColor: '#0B82FF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: dp(1),
            borderColor: '#fff',
          }]}
          onPress={this.loginAction}
        >
          <Text
            style={[{
              color: '#fff',
            }]}
          >{getLanguage(global.language).Map_Settings.LEFT_TOP_LOG}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderOther = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          bottom: dp(32),
          left: 0,
          width: '100%',
          alignItems: 'center',
        }]}
      >
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate("LangchaoProtocol")
          }}
        >
          <Text
            style={[styles.otherText]}
          >{getLanguage(global.language).Map_Settings.AGREE_PRIVACY_POLICY}</Text>
        </TouchableOpacity>
        {/* <View>
          <Text
            style={[styles.otherText]}
          >{"客服电话" + ": 400-211-121212"}</Text>
        </View> */}
      </View>
    )
  }

  render() {
    return (
      <Container
        // ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          // title: getLanguage(global.language).Map_Settings.USER_INFO_MAINTENANCE,
          // title: getLanguage(global.language).Map_Settings.LEFT_TOP_LOG,
          withoutBack: false,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: dp(0),
            // backgroundColor: color.containerHeaderBgColor,
            // backgroundColor: '#add8e6',
            backgroundColor: '#transparent',
          },
          responseHeaderTitleStyle: {
            color: color.containerTextColor,
            textAlign: 'center',
          },
          isResponseHeader: false,
          backAction:this.backAction,
        }}
        containerBgImage={getImage().bg_login}
        // bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
      >
        {/* <Text>{"我是用户登录页面"}</Text> */}
        {this.renderLogo()}
        {this.renderContentView()}
        {this.renderBtn()}
        {this.renderOther()}
      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  serverIP: state.langchao.toJS().serverIP,
  userId: state.langchao.toJS().userId,
  password: state.langchao.toJS().password,
  pubkey: state.langchao.toJS().pubkey,
  userName: state.langchao.toJS().userName,
  departmentId: state.langchao.toJS().departmentId,
})

const mapDispatch = {
  setCurrentSymbol,
  setServerUserId,
  setPassword,
  setServerUserName,
  setServerPubkey,
  setLangchaoUserInfo,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(LangChaoLogin)

const styles = StyleSheet.create({
  addStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partViewStyle:{
    width: '100%',
    // backgroundColor: '#fff',
    marginTop: dp(30),
    paddingLeft: dp(20),
    paddingRight: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainerStyle: {
    width: '80%',
    height: dp(50),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.3)',
    marginVertical: dp(8),
  },
  itemTitleView: {
    width: dp(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitleText: {
    fontSize: dp(16),
  },

  textStyle: {
    fontSize: dp(16),
  },
  imgStyle: {
    height: dp(30),
    width: dp(30),
  },
  // dialog
  dialogInputContainer: {
    flex:1,
    height: dp(40),
    flexDirection: 'row',
    marginVertical: dp(5),
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: '#fff',
    // borderWidth: dp(1),
  },
  dialogInput: {
    flex: 1,
    height: dp(40),
    paddingVertical: dp(5),
    marginLeft: dp(-5),
    textAlign: 'left',
    color: '#fff',
  },

  // 清空按钮
  clearBtn: {
    width: dp(26),
    height: dp(26),
    paddingRight: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  clearImg: {
    width: dp(26),
    height: dp(26),
  },
  titleStyle: {
    width: '90%',
    paddingHorizontal: dp(10),
  },
  titleText: {
    fontSize: dp(16),
    fontWeight: '400'
  },

  pickerSize: {
    width: '100%',
    height: dp(20),
    fontSize: dp(16),
    marginLeft: -dp(10),
  },
  otherText: {
    color: '#fff',
    fontSize: dp(10),
    lineHeight: dp(20)
  },
})