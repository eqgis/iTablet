import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { getPublicAssets } from "@/assets"
import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId } from '../reduxModels/langchao'
import { dateFormat, getToken, setSysOrgid, setUserId, setUserName, users } from "../utils/langchaoServer"
import { Toast } from "@/utils"
import { color } from "@/styles"
// import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId } from "@/redux/models/langchao"


interface Props extends ReduxProps {
	navigation: any,
  device: any,
  language: string,
  serverIP: string,
  userId: string,
  userName: string,
  departmentId: string,
  setServerIP: (url: string) => Promise<void>
}

interface State {
	serverUrl: string,
  userId:string,
  userName: string,
  sysOrgId: string,
}

class InputServer extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      serverUrl: props.serverIP || "",
      userId: props.userId || "",
      userName: props.userName || "",
      sysOrgId: props.departmentId || "",
    }
  }

  componentDidMount = async (): Promise<void> => {
  }

  componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>): void => {

  }

  confirm = async () => {
    // console.warn("33333:" + this.state.serverUrl)
    await this.props.setServerIP(this.state.serverUrl)
    // await this.props.setServerIP1(this.state.serverUrl)
    // setUserId(this.state.userId)
    // setUserName(this.state.userName)
    // setSysOrgid(this.state.sysOrgId)
    await this.props.setServerUserId(this.state.userId)
    await this.props.setServerUserName(this.state.userName)
    await this.props.setServerDepartmentId(this.state.sysOrgId)
    await getToken()

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
      UserId: this.state.userId,
      UserName: this.state.userName,
      BeginTime: formDateBeijing,
      EndTime: formDateBeijing,
      SysOrgid: this.state.sysOrgId,
    }
    await users(params)
    Toast.show(getLanguage(global.language).Map_Settings.SETTING_SUCCESS)
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity
        style={styles.addStyle}
        onPress={this.confirm}
      >
        {/* <Image style={styles.imgStyle} source={getImage().add_round} /> */}
        <Text>{getLanguage(global.language).Map_Settings.CONFIRM}</Text>
      </TouchableOpacity>
    )
  }

  renderInputView = () => {
    return (
      <View
        style={[{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: dp(20),
        }]}
      >
        <View style={[{
          width: '100%',
          height: dp(40),
          backgroundColor: "#f3f3f3",
          justifyContent: 'center',
        }]}>
          <View style={[styles.titleStyle]}>
            <Text style={[styles.titleText]}>{getLanguage(global.language).Map_Settings.SERVICE_ADDRESS}</Text>
          </View>
        </View>
        <View style={[styles.dialogInputContainer]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.SERVICE_ADDRESS}
            // placeholder={"服务地址"}
            value = {this.state.serverUrl}
            onChangeText = {(text:string) => {
              this.setState({
                serverUrl: text,
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                serverUrl: '',
              })
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>

        <View style={[{
          width: '100%',
          height: dp(40),
          backgroundColor: "#f3f3f3",
          justifyContent: 'center',
        }, {
          marginTop: dp(10),
        }]}>
          <View style={[styles.titleStyle]}>
            <Text style={[styles.titleText]}>{getLanguage(global.language).Map_Settings.USER_INFO}</Text>
          </View>
        </View>

        <View style={[styles.dialogInputContainer]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.USER_ID}
            // placeholder={"用户id"}
            value = {this.state.userId}
            onChangeText = {(text:string) => {
              this.setState({
                userId: text,
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                userId: '',
              })
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.dialogInputContainer]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.USER_NAME}
            // placeholder={"用户姓名"}
            value = {this.state.userName}
            onChangeText = {(text:string) => {
              this.setState({
                userName: text,
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                userName: '',
              })
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.dialogInputContainer]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.DEPARTMENT_ID}
            // placeholder={"部门id"}
            value = {this.state.sysOrgId}
            onChangeText = {(text:string) => {
              this.setState({
                sysOrgId: text,
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                sysOrgId: '',
              })
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

  render() {
    return (
      <Container
        // ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: getLanguage(global.language).Map_Settings.SERVICE_ADDRESS_SETTING,
          // title: "设置服务地址",
          withoutBack: false,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: color.containerHeaderBgColor,
          },
          responseHeaderTitleStyle: {color: color.containerTextColor},
          isResponseHeader: true,
        }}
        // bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        {/* <Text>{"我是通讯录页面"}</Text> */}
        {this.renderInputView()}

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
  departmentId: state.langchao.toJS().departmentId
})

const mapDispatch = {
  setCurrentSymbol,
  setServerIP,
  // setServerIP1,
  setServerUserId,
  setServerUserName,
  setServerDepartmentId,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(InputServer)

const styles = StyleSheet.create({
  addStyle: {
    // marginTop: dp(50),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '90%',
    height: dp(40),
    flexDirection: 'row',
    // backgroundColor: '#f3f3f3',
    borderRadius: dp(30),
    marginVertical: dp(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: "#999",
    borderBottomWidth: dp(1),
  },
  dialogInput: {
    flex: 1,
    height: dp(40),
    paddingVertical: dp(5),
    paddingHorizontal: dp(10),
    // backgroundColor: '#f3f3f3',
    borderRadius: dp(30),
    textAlign: 'center',
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