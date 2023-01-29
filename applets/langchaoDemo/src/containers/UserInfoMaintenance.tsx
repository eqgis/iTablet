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
import { Picker } from '@react-native-picker/picker'
import { getJson } from "../assets/data"
// import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId } from "@/redux/models/langchao"


interface countryDataType {
  name: string,
  codeId: number
}

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
      country: this.props.country || "阿富汗",
      city: this.props.city || "",
      organization: '',
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
        project: '项目',
      })
    }
  }

  confirm = async () => {
    if(this.state.country !== "" && this.state.city !== "") {
      this.props.setCountry(this.state.country)
      this.props.setCity(this.state.city)
      Toast.show(getLanguage(global.language).Map_Settings.MAP_AR_AI_SAVE_SUCCESS)
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
        <Text
          style={[{
            color:'#0B82FF',
          }]}
        >{getLanguage(global.language).Map_Settings.SAVE}</Text>
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

  renderInputItem = (title: string, placeholder:string, value: string, changeTextAction: (text: string) => void, clearAction: () => void, isRequired = false) => {
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
            placeholder = {placeholder || ''}
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

  // {this.renderInputItem(getLanguage(global.language).Map_Settings.TARGET_COUNTRY, this.state.country, this.countryChange, this.countryClear)}
  renderPickerItem = () => {
    console.warn(getJson().contryCode)
    return (
      <View
        style={[styles.itemContainerStyle]}
      >
        <View
          style={[styles.itemTitleView]}
        >
          <Text
            style={[styles.itemTitleText]}
          >{getLanguage(global.language).Map_Settings.TARGET_COUNTRY}</Text>
        </View>
        <View
          style={[styles.dialogInputContainer,
            {
              justifyContent: 'flex-start',
            }
          ]}
        >
          <Picker
            selectedValue={this.state.country}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              this.setState({country: value})
            } }
          >
            {getJson().contryCode.map((item: countryDataType, index: number) => {
              return <Picker.Item
                label={item.name} value={item.name}
                key={item.codeId + index}
              />
            })}

          </Picker>
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
        {this.renderItem(getLanguage(global.language).Map_Settings.USER_CODE, this.state.userId)}
      </View>
    )
  }

  renderUserInfo = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {this.renderItem(getLanguage(global.language).Map_Settings.USER_NAME, this.state.userName)}
        {this.renderItem(getLanguage(global.language).Map_Settings.USER_GENDER, this.state.gender)}
        {this.renderItem(getLanguage(global.language).Map_Settings.CONTACT_NUMBER, this.state.phoneNumber)}
      </View>
    )
  }

  renderOtherInfo = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {this.renderPickerItem()}
        {/* {this.renderInputItem(getLanguage(global.language).Map_Settings.TARGET_COUNTRY, this.state.country, this.countryChange, this.countryClear)} */}
        {this.renderInputItem(getLanguage(global.language).Map_Settings.TARGET_CITY, getLanguage(global.language).Map_Settings.TARGET_CITY, this.state.city, this.cityChange, this.cityClear, true)}
        {this.renderItem(getLanguage(global.language).Map_Settings.ORGANIZATION, this.state.organization)}
        {this.renderItem(getLanguage(global.language).Map_Settings.PROJECT, this.state.project)}
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
          title: getLanguage(global.language).Map_Settings.USER_INFO_MAINTENANCE,
          // title: "用户信息维护",
          withoutBack: false,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: dp(1),
            backgroundColor: color.containerHeaderBgColor,
          },
          responseHeaderTitleStyle: {
            color: color.containerTextColor,
            textAlign: 'center',
          },
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