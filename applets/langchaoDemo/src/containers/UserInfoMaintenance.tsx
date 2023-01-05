import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { getPublicAssets } from "@/assets"
import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId, setCountry, setCity } from '../reduxModels/langchao'
import { dateFormat, getToken, setSysOrgid, setUserId, setUserName, users } from "../utils/langchaoServer"
import { Toast } from "@/utils"
import { color } from "@/styles"
import NavigationService from "@/containers/NavigationService"
// import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId } from "@/redux/models/langchao"


interface Props extends ReduxProps {
	navigation: any,
  device: any,
  language: string,
  serverIP: string,
  userId: string,
  userName: string,
  departmentId: string,
	country: string,
	city: string,
  setServerIP: (url: string) => Promise<void>
	setCountry: (country: string) => Promise<void>
	setCity: (city: string) => Promise<void>
}

interface State {
  userId:string,
  userName: string,
	gender: string,
	phoneNumber: string,
	country: string,
	city: string,
	organization: string,
	department: string,
	project: string,
}

class UserInfoMaintenance extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      userId: "",
      userName: "",
      gender: '',
      phoneNumber: "",
      country: this.props.country || "",
      city: this.props.city || "",
      organization: '',
      department: '',
      project: '',
    }
  }

  componentDidMount = async (): Promise<void> => {
    await this.getData()
  }

  getData = async () => {
    const date = new Date()
    const timezone = 8 //目标时区时间，东八区(北京时间)   东时区正数 西市区负数
    const offset_GMT = date.getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const nowDate = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000)
    // const beijingTime = targetDate.getTime()
    // 格式化时间
    // const formDateLocal = await dateFormat("yyyy-MM-dd HH:mm:ss", date)
    const formDateBeijing = await dateFormat("yyyy-MM-dd HH:mm:ss", targetDate)

    const params = {
      UserId: this.props.userId,
      UserName: this.props.userName,
      BeginTime: formDateBeijing,
      EndTime: formDateBeijing,
      SysOrgid: this.props.departmentId,
    }
    const data = await users(params)
    if(data) {
      // to do
      this.setState({
        userId: data?.code || '',
        userName: data?.name || '',
        gender: '男',
        phoneNumber: data?.phone || data?.mobilePhone || "",
        organization: data?.SysOrgName || '',
        department: '部门',
        project: '项目',
      })
    }
  }

  confirm = async () => {
    if(this.state.country !== "" && this.state.city !== "") {
      this.props.setCountry(this.state.country)
      this.props.setCity(this.state.city)
      Toast.show(getLanguage(global.language).Map_Settings.SETTING_SUCCESS)
      NavigationService.goBack()
    }
  }

  countryChange = (text:string) => {
    this.setState({
      country: text,
    })
  }

  countryClear = () => {
    this.setState({
      country: '',
    })
  }

  cityChange = (text:string) => {
    this.setState({
      city: text,
    })
  }

  cityClear = () => {
    this.setState({
      city: '',
    })
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity
        style={styles.addStyle}
        onPress={this.confirm}
      >
        <Text>{getLanguage(global.language).Map_Settings.SAVE}</Text>
      </TouchableOpacity>
    )
  }

  renderItem = (title: string, value: string) => {
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
        </View>
        <View>
          <Text>{value}</Text>
        </View>
      </View>
    )
  }

  renderInputItem = (title: string, value: string, changeTextAction: (text: string) => void, clearAction: () => void) => {
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
        </View>
        <View style={[
          styles.dialogInputContainer,
          value === "" && {
            borderColor: '#f00',
          }
        ]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {''}
            value = {value}
            onChangeText = {changeTextAction}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={clearAction}
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

  renderUserCodeView = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {/* 用户编号 */}
        {this.renderItem("用户编号", this.state.userId)}
      </View>
    )
  }

  renderUserInfo = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {this.renderItem("姓名", this.state.userName)}
        {this.renderItem("性别", this.state.gender)}
        {this.renderItem("手机号", this.state.phoneNumber)}
      </View>
    )
  }

  renderOtherInfo = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {this.renderInputItem("去往国家", this.state.country, this.countryChange, this.countryClear)}
        {this.renderInputItem("去往城市", this.state.city, this.cityChange, this.cityClear)}
        {this.renderItem("所属单位", this.state.organization)}
        {this.renderItem("所属部门", this.state.department)}
        {this.renderItem("所属项目", this.state.project)}
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
          // title: getLanguage(global.language).Map_Settings.SERVICE_ADDRESS_SETTING,
          title: "用户信息维护",
          withoutBack: false,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: dp(1),
            backgroundColor: color.containerHeaderBgColor,
          },
          responseHeaderTitleStyle: {color: color.containerTextColor},
          isResponseHeader: true,
        }}
        // bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: 'rgba(245, 245, 245, 1)',
        }}
      >
        {/* <Text>{"我是用户信息维护页面"}</Text> */}
        {this.renderUserCodeView()}
        {this.renderUserInfo()}
        {this.renderOtherInfo()}

      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  serverIP: state.langchao.toJS().serverIP,
  userId: state.langchao.toJS().userId,
  userName: state.langchao.toJS().userName,
  departmentId: state.langchao.toJS().departmentId,
  country: state.langchao.toJS().country,
  city: state.langchao.toJS().city,
})

const mapDispatch = {
  setCurrentSymbol,
  setServerIP,
  // setServerIP1,
  setServerUserId,
  setServerUserName,
  setServerDepartmentId,
  setCountry,
  setCity,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(UserInfoMaintenance)

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
})