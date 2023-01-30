import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ImageSourcePropType, Platform } from "react-native"
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
import { getHtml, getJson } from "../assets/data"
import { getImage } from "../assets/Image"
import { WebView } from 'react-native-webview'




interface Props extends ReduxProps {
	navigation: any,
  device: any,
  language: string,

}

interface State {
	// to do
}

class LangchaoProtocol extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }

  renderWebView = () => {
    let source
    if (Platform.OS === 'android') {
      source =
        this.props.language === 'CN'
          ? {
            uri: 'file:///android_asset/SuperMapUserPrivacyPolicy_CN.html',
          }
          : {
            uri: 'file:///android_asset/SuperMapUserPrivacyPolicy_EN.html',
          }
    } else {
      source =
        this.props.language === 'CN'
          ? getHtml().LangchaoUserPrivacyPolicy_CN
          : getHtml().LangchaoUserPrivacyPolicy_EN
    }
    return (
      <WebView
        // ref={ref => (this.webView = ref)}
        style={{ flex: 1, paddingVertical: 0, backgroundColor: 'transparent' }}
        source={source}
        // source={{
        //   uri:
        //     this.props.language === 'CN'
        //       ? 'http://111.202.121.144:8088/iTablet/home/help/protocol.html'
        //       : 'http://111.202.121.144:8088/iTablet/home/help/protocol_en.html',
        // }}
        /** 保证release版本时，可加载到html*/
        originWhitelist={['*']}
        automaticallyAdjustContentInsets={true}
        scalesPageToFit={true}
        /**ios*/
        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
        /**android*/
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode={'always'}
        thirdPartyCookiesEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        onError={() => {
          Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
        }}
      />
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
          title: getLanguage(global.language).Map_Settings.PRIVACY_POLICY,
          withoutBack: false,
          // headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: dp(0),
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
        {/* <Text>{"我是隐私政策页面"}</Text> */}
        {this.renderWebView()}

      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  // serverIP: state.langchao.toJS().serverIP,
  // userId: state.langchao.toJS().userId,
  // password: state.langchao.toJS().password,
  // pubkey: state.langchao.toJS().pubkey,
})

const mapDispatch = {
  // setCurrentSymbol,
  // setServerUserId,
  // setPassword,
  // setServerUserName,
  // setServerPubkey,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(LangchaoProtocol)

const styles = StyleSheet.create({
})