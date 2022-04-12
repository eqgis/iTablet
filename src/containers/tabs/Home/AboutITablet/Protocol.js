import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { Container, MTBtn } from '../../../../components'
import { Toast, OnlineServicesUtils } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { getPublicAssets } from '../../../../assets'
import { FileTools } from '../../../../native'
import { RNFS } from 'imobile_for_reactnative'
class Protocol extends Component {
  props: {
    navigation: Object,
    device: Object,
  }
  constructor(props) {
    super(props)
    const params = this.props.route.params
    this.type = params.type
    this.knownItem = params.knownItem || {}
    this.state = {
      progressWidth: Dimensions.get('window').width * 0.4,
      isLoadWebView: false,
      backButtonEnabled: false,
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  _renderLoading = () => {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          ref={ref => (this.progressViewRef = ref)}
          style={{
            height: 2,
            width: this.state.progressWidth,
            backgroundColor: '#1c84c0',
          }}
        />
      </View>
    )
  }

  componentDidMount() {
    this.preLoad()
  }

  userHelpPath = '/iTablet/Common/iTablet_help_11i(2021)/SuperMap iTablet 11i(2021) help.html'

  preLoad = async () => {
    if (this.type === 'userHelp') {
      const homePath = await FileTools.getHomeDirectory()
      if (await RNFS.exists(homePath + this.userHelpPath)) {
        this.setState({ isLoadWebView: true })
      } else {
        let result = await this.downloadUserGuide()
        this._onLoadStart()
        if (result) {
          this.setState({ isLoadWebView: true })
        } else {
          Toast.show(getLanguage(global.language).Prompt.NETWORK_REQUEST_FAILED)
        }
      }
    } else {
      this.setState({ isLoadWebView: true })
    }
  }

  downloadUserGuide = async () => {
    try {
      let commonPath = await FileTools.appendingHomeDirectory(
        '/iTablet/Common/',
      )
      let JSOnlineService = new OnlineServicesUtils('online')
      let data = await JSOnlineService.getPublicDataByName(
        '927528',
        'iTablet_help_11i(2021).zip',
      )
      let url = `https://www.supermapol.com/web/datas/${data.id}/download`

      let filePath = commonPath + data.fileName

      if (await RNFS.exists(filePath)) {
        await RNFS.unlink(filePath)
      }

      let downloadOptions = {
        fromUrl: url,
        toFile: filePath,
        background: true,
        fileName: data.fileName,
        progressDivider: 1,
      }

      await RNFS.downloadFile(downloadOptions).promise
      let result = false
      if (await RNFS.exists(filePath)) {
        result = await FileTools.unZipFile(filePath, commonPath)

        await RNFS.unlink(filePath)
      }
      return result
    } catch (error) {
      // console.log(error)
    }
  }

  _onLoadStart = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.scaleX,
      },
      update: {
        type: LayoutAnimation.Types.linear,
      },
    })
    this.progressViewWidth = this.state.progressWidth
    let screenWidth = Dimensions.get('window').width
    this.objProgressWidth = setInterval(() => {
      if (this.progressViewRef) {
        let prevProgressWidth = this.progressViewWidth
        let currentPorWidth
        if (prevProgressWidth >= screenWidth - 250) {
          currentPorWidth = prevProgressWidth + 1
          if (currentPorWidth >= screenWidth - 50) {
            currentPorWidth = screenWidth - 50
            this.progressViewWidth = currentPorWidth
            return
          }
        } else {
          currentPorWidth = prevProgressWidth * 1.01
        }
        this.progressViewWidth = currentPorWidth
        this.progressViewRef.setNativeProps({
          style: {
            height: 2,
            width: currentPorWidth,
            backgroundColor: '#1c84c0',
            borderBottomRightRadius: 1,
            borderTopRightRadius: 1,
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          },
        })
      }
    }, 150)
  }

  render() {
    let source, title
    switch (this.type) {
      case 'offcial':
        source = { uri: `https://www.supermap.com` }
        title = 'SuperMap'
        break
      case 'protocol':
        if (Platform.OS === 'android') {
          source =
            global.language === 'CN'
              ? {
                uri:
                    'file:///android_asset/SuperMapUserServiceAgreement_CN.html',
              }
              : {
                uri:
                    'file:///android_asset/SuperMapUserServiceAgreement_EN.html',
              }
        } else {
          source =
            global.language === 'CN'
              ? require('../../../../assets/Protocol/SuperMapUserServiceAgreement_CN.html')
              : require('../../../../assets/Protocol/SuperMapUserServiceAgreement_EN.html')
        }
        title = getLanguage(global.language).Profile.SERVICE_AGREEMENT
        break
      case 'Privacy':
        if (Platform.OS === 'android') {
          source =
            global.language === 'CN'
              ? {
                uri:
                    'file:///android_asset/SuperMapUserPrivacyPolicy_CN.html',
              }
              : {
                uri:
                    'file:///android_asset/SuperMapUserPrivacyPolicy_EN.html',
              }
        } else {
          source =
            global.language === 'CN'
              ? require('../../../../assets/Protocol/SuperMapUserPrivacyPolicy_CN.html')
              : require('../../../../assets/Protocol/SuperMapUserPrivacyPolicy_EN.html')
        }
        title = getLanguage(global.language).Profile.PRIVACY_POLICY
        break
      case 'superMapForum':
        source = {
          uri: `http://ask.supermap.com/`,
        }
        title = getLanguage(global.language).Prompt.SUPERMAP_FORUM
        //'超图论坛'
        break
      case 'SuperMapGroup':
        // source = {
        //   uri: `http://mp.weixin.qq.com/profile?src=3&timestamp=1552115539&ver=1&signature=Woh7VGjhtLXAgNTVx1F50zmUmCsLKoHFVbmqPbIG9A8hHc0dRRkEY*lxVbf-sH5ULhQ6jonrW-AHDvub42uzsw==`,
        // }
        // title = '超图集团'
        source = {
          uri:
            // 'http://111.202.121.144:8088/officialAccount/SuperMapGroup/html/' +
            'https://mp.weixin.qq.com/s/' + this.knownItem.id,
          //  +
          // '.html',
        }
        title = getLanguage(global.language).Prompt.SUPERMAP_GROUP
        //'超图集团'
        break
      case 'superMapKnown':
        source = {
          uri:
            // 'http://111.202.121.144:8088/officialAccount/zhidao/html/' +
            'https://mp.weixin.qq.com/s/' + this.knownItem.id,
          // +
          // '.html',
        }
        title = getLanguage(global.language).Prompt.SUPERMAP_KNOW
        //'超图知道'
        break
      case 'userHelp':
        if (Platform.OS === 'android') {
          source = {
            uri:
              'file:///' +
              global.homePath +
              this.userHelpPath,
          }
        } else {
          source = {
            uri:
              global.homePath +
              this.userHelpPath,
          }
        }
        title = getLanguage(global.language).Prompt.INSTRUCTION_MANUAL
        break
      case 'ApplyLicense':
        source = {
          uri: `https://www.supermapol.com/web/pricing/triallicense`,
        }
        title = getLanguage(global.language).Prompt.APPLY_LICENSE
        //'申请许可'
        break
      case 'Register':
        source = {
          uri: `https://sso.supermap.com/phoneregister?service=http://www.supermapol.com`,
        }
        title = getLanguage(global.language).Profile.REGISTER
        break
      case 'SuperMapOnlineProtocal':
        if (global.language === 'CN') {
          source = {
            uri:
              'https://sso.supermap.com/agreement.jsp?service=https://www.supermapol.com',
          }
        } else {
          source = {
            uri:
              'https://sso.supermap.com/agreement_en.jsp?service=http://www.supermapol.com',
          }
        }
        title = getLanguage(global.language).Profile.SERVICE_AGREEMENT
        break
      case 'GISAcademy':
        source = { uri: `https://edu.supermap.com` }
        title = getLanguage(global.language).Find.GIS_ACADEMY
        break
      case 'ARDevice':
        source = {
          uri: `https://developers.google.cn/ar/discover/supported-devices`,
        }
        break
      case 'AREngineDevice':
        source = {
          uri: 'https://developer.huawei.com/consumer/cn/doc/development/graphics-Guides/introduction-0000001050130900',
        }
        break
      default:
        break
    }

    let size =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50
    let webBackOpacity = this.state.backButtonEnabled ? 1 : 0
    let headerLeft = [
      <MTBtn
        key={'backTo'}
        image={getPublicAssets().common.icon_back}
        style={{
          height: size,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          this.props.navigation.goBack()
        }}
      />,
      <MTBtn
        key={'webClose'}
        image={getPublicAssets().common.icon_nav_close}
        style={{
          opacity: webBackOpacity,
          height: size,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          this.webView.goBack()
        }}
      />,
    ]
    return (
      <Container
        headerProps={{
          title: title,
          headerLeft: headerLeft,
          navigation: this.props.navigation,
          headerOnTop: true,
        }}
      >
        {this.state.isLoadWebView ? (
          <WebView
            ref={ref => (this.webView = ref)}
            style={{ flex: 1, paddingTop: 0}}
            source={source}
            /** 保证release版本时，可加载到html*/
            originWhitelist={['*']}
            automaticallyAdjustContentInsets={true}
            scalesPageToFit={true}
            startInLoadingState={true}
            renderLoading={this._renderLoading}
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
              Toast.show('加载失败')
            }}
            onLoadStart={this._onLoadStart}
            onLoadEnd={() => {
              // this.setState({isLoadingEnd:true,headerType:''})
              if (this.objProgressWidth !== undefined) {
                clearInterval(this.objProgressWidth)
              }
            }}
            onNavigationStateChange={navState => {
              this.setState({
                backButtonEnabled: navState.canGoBack,
              })
            }}
          />
        ) : (
          <View style={{ flex: 1, paddingTop: 0 }}>
            {this._renderLoading()}
          </View>
        )}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Protocol)
