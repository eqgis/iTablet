import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { getPublicAssets } from "@/assets"
import { setServerIP } from '../reduxModels/langchao'
import { getToken } from "../utils/langchaoServer"


interface Props extends ReduxProps {
	navigation: any,
  device: any,
  language: string,
  serverIP: string,
  setServerIP: (url: string) => Promise<void>
}

interface State {
	serverUrl: string,
}

class InputServer extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      serverUrl: props.serverIP || "",
    }
  }

  componentDidMount = async (): Promise<void> => {
  }

  componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>): void => {

  }

  confirm = async () => {
    // console.warn("33333:" + this.state.serverUrl)
    await this.props.setServerIP(this.state.serverUrl)
    getToken()
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
          marginTop: dp(20),
        }]}
      >
        <View style={[styles.dialogInputContainer]}>
          <TextInput
            style = {[styles.dialogInput]}
            // placeholder = {getLanguage(global.language).Map_Settings.CONTACT_NAME}
            placeholder={"服务地址"}
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
          // title: getLanguage(global.language).Map_Settings.ADDRESS_BOOK,
          title: "设置服务地址",
          withoutBack: false,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: { borderBottomWidth: 0 },
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
  serverIP: state.langchao.toJS().serverIP
})

const mapDispatch = {
  setCurrentSymbol,
  setServerIP,
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
    backgroundColor: '#f3f3f3',
    borderRadius: dp(30),
    marginVertical: dp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogInput: {
    flex: 1,
    height: dp(40),
    paddingVertical: dp(5),
    paddingHorizontal: dp(10),
    backgroundColor: '#f3f3f3',
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
})