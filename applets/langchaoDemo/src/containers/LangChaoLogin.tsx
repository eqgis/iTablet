import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ImageSourcePropType } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { getPublicAssets } from "@/assets"
import { setServerUserId, setPassword, setServerUserName, setServerPubkey } from '../reduxModels/langchao'
import { dateFormat, getServerPubKeyUtil, getToken, login, setSysOrgid, setUserId, setUserName, users } from "../utils/langchaoServer"
import { Toast } from "@/utils"
import { color } from "@/styles"
import NavigationService from "@/containers/NavigationService"
import { Picker } from '@react-native-picker/picker'
import { getJson } from "../assets/data"
import { getImage } from "../assets/Image"
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
	navigation: any,
  device: any,
  language: string,

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

  loginAction = async () => {
    if(this.state.userId !== "" && this.state.password !== "") {
      const pubkey = await getServerPubKeyUtil()
      if(pubkey !== "") {
        this.props.setServerPubkey(pubkey)
        const result = await login(this.state.userId, this.state.password)

        if(result) {
          await this.props.setServerUserId(this.state.userId)
          await this.props.setPassword(this.state.password)
          await this.props.setServerUserName(result.UserName)
          NavigationService.goBack()
        }
      }
    }


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
            backgroundColor: 'rgba(80, 80, 255, 1)',
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
          bottom: dp(16),
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
          // headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: dp(0),
            // backgroundColor: color.containerHeaderBgColor,
            backgroundColor: '#add8e6',
          },
          responseHeaderTitleStyle: {
            color: color.containerTextColor,
            textAlign: 'center',
          },
          isResponseHeader: false,
        }}
        // bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          // backgroundColor: 'rgba(245, 245, 245, 1)',
          backgroundColor: '#add8e6',
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
})

const mapDispatch = {
  setCurrentSymbol,
  setServerUserId,
  setPassword,
  setServerUserName,
  setServerPubkey,
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