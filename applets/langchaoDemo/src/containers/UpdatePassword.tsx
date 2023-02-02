import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { getPublicAssets } from "@/assets"
import { setServerUserId, setPassword, setServerUserName } from '../reduxModels/langchao'
import { dateFormat, getToken, login, setSysOrgid, setUserId, setUserName, updatePassword, users } from "../utils/langchaoServer"
import { Toast } from "@/utils"
import { color } from "@/styles"
import NavigationService from "@/containers/NavigationService"
import { Picker } from '@react-native-picker/picker'
import { getJson } from "../assets/data"
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
	oldPassword: string,

}

class UpdatePassword extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      userId: this.props.userId || "",
      password: "",
      oldPassword: "",
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

  oldPasswordChange = (text: string) => {
    this.setState({
      oldPassword: text,
    })
  }

  confirmAction = async () => {
    if(this.state.userId !== "" && this.state.password !== "" && this.state.oldPassword !== "") {
      const result = await updatePassword(this.state.userId, this.state.oldPassword, this.state.password)

      if(result) {
        // await this.props.setServerUserId(this.state.userId)
        // await this.props.setPassword(this.state.password)
        // NavigationService.goBack()
        // Toast.show("设置成功")
        Toast.show(getLanguage(global.language).Map_Settings.UPDATE_PASSWORD_SUCCESS)
      } else {
        // Toast.show("设置失败")
        Toast.show(getLanguage(global.language).Map_Settings.UPDATE_PASSWORD_FAILED)
      }

    }


  }

  renderInputItem = (title: string, value: string, changeTextAction: (text: string) => void, type?:inputType, isRequired = false, placeholder = "") => {
    return (
      <View
        style={[styles.itemContainerStyle]}
      >
        <View
          style={[styles.itemTitleView]}
        >
          <Text
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
          )}
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

  renderContentView = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {this.renderInputItem(getLanguage(global.language).Map_Settings.USER_ID, this.state.userId, this.userIdChange, undefined, true, getLanguage(global.language).Map_Settings.USER_ID)}
        {this.renderInputItem(getLanguage(global.language).Map_Settings.OLD_PASSWORD, this.state.oldPassword, this.oldPasswordChange, 'password', true, getLanguage(global.language).Map_Settings.OLD_PASSWORD)}
        {this.renderInputItem(getLanguage(global.language).Map_Settings.NEW_PASSWORD, this.state.password, this.passwordChange, 'password', true, getLanguage(global.language).Map_Settings.NEW_PASSWORD)}
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
            width: '80%',
            height: dp(50),
            backgroundColor: '#0B82FF',
            justifyContent: 'center',
            alignItems: 'center',
          }]}
          onPress={this.confirmAction}
        >
          <Text
            style={[{
              color: '#fff',
            }]}
          >{getLanguage(global.language).Map_Settings.CONFIRM}</Text>
        </TouchableOpacity>
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
          title: getLanguage(global.language).Map_Settings.UPDATE_PASSWORD,
          // title: "密码修改",
          withoutBack: false,
          // headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: dp(1),
            backgroundColor: color.containerHeaderBgColor,
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
          backgroundColor: 'rgba(245, 245, 245, 1)',
        }}
      >
        {/* <Text>{"我是用户登录页面"}</Text> */}
        {this.renderContentView()}
        {this.renderBtn()}

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
})

const mapDispatch = {
  setCurrentSymbol,
  setServerUserId,
  setPassword,
  setServerUserName,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(UpdatePassword)

const styles = StyleSheet.create({
  addStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partViewStyle:{
    width: '100%',
    backgroundColor: '#fff',
    marginTop: dp(10),
    paddingLeft: dp(20),
    paddingRight: dp(10),
  },
  itemContainerStyle: {
    width: '100%',
    height: dp(50),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: color.colorEF,
    borderBottomWidth: dp(1),
  },
  itemTitleView: {
    width: dp(140),
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
    borderColor: '#fff',
    borderWidth: dp(1),
  },
  dialogInput: {
    flex: 1,
    height: dp(40),
    paddingVertical: dp(5),
    marginLeft: dp(-5),
    textAlign: 'left',
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
  }
})