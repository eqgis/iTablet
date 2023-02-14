import React, { Component } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ImageSourcePropType } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container } from '../../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { getPublicAssets } from "@/assets"
import { color } from "@/styles"
import MapToolbar from "@/containers/workspace/components/MapToolbar"
import settingData from "./settingData"
import NavigationService from "@/containers/NavigationService"
import { getImage } from "../../assets/Image"
import { setLangchaoUserInfo, setServerUserId } from "../../reduxModels/langchao"
import Toast from "@/utils/Toast"


interface settingDataType {
	title: string,
	leftImage: ImageSourcePropType,
	action?: () => unknown,
}

interface Props extends ReduxProps {
	navigation: any,
	mapModules: any,
  device: any,
  language: string,
  userId: string,
}

interface State {
	data: Array<settingDataType>
}

class SettingPage extends Component<Props, State> {

  container: typeof Container | undefined | null = null
  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount = async (): Promise<void> => {
    this.getData()
  }

  componentDidUpdate = (prevProps: Readonly<Props>): void => {
    if(this.props.language !== prevProps.language ||
      this.props.userId !== prevProps.userId
    ) {
      this.getData()
    }
  }

  getData = () => {
    const data = settingData.getThematicMapSettings(this.props.userId !== "")
    this.setState({
      data,
    })
  }


  loginAction = () => {
    if(this.props.userId === "") {
      NavigationService.navigate('LangChaoLogin',{
        type: 'setting'
      })
    } else {

      global.SimpleDialog.set({
        // text: getLanguage(global.language).Map_Layer.WHETHER_UPLOAD_DATA,
        text: "是否退出登录",
        confirmText: getLanguage(global.language).Prompt.YES,
        cancelText: getLanguage(global.language).Prompt.NO,
        confirmAction: async () => {
          // 登出
          this.props.setServerUserId("")
          this.props.setLangchaoUserInfo(null)
          this.getData()
          Toast.show("已退出登录")
        },
        cancelAction: () => {
          global.SimpleDialog.setVisible(false)
        },
      })
      global.SimpleDialog.setVisible(true)
    }

  }

  renderHeaderRight = () => {
    return (
      <View
      >
        <TouchableOpacity
          onPress={this.loginAction}
        >
          <Image
            style={[{
              width: dp(30),
              height: dp(30),
            }]}
            source={getImage().login}
          />
        </TouchableOpacity>
      </View>
    )
  }


  _renderItem(item: settingDataType, index: number) {
    return (
      <TouchableOpacity
        style={[{
          flex: 1,
          height: dp(50),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: dp(5),
          marginHorizontal: dp(15),
          paddingVertical: dp(10),
          borderBottomColor: color.colorEF,
          borderBottomWidth: dp(1),
        }]}
        onPress={() => {
          if(item.action && typeof(item.action) === 'function') {
            item.action()
          } else {
            //根据title跳转
            NavigationService.navigate('SecondMapSettings', {
              title: item.title,
              language: this.props.language,
              device: this.props.device,
            })
          }

        }}
      >
        <Image
          style={[{
            width: dp(24),
            height: dp(24),
            marginRight: dp(20),
          }]}
          source={item.leftImage}
        />
        <View
          style={[{
            flex: 1,
            height: dp(20),
          }]}
        >
          <Text
            style={[{
              fontSize: dp(16),
              color: '#000'
            }]}
          >{item.title}</Text>
        </View>
        <Image
          style={[{
            width: dp(20),
            height: dp(20),
          }]}
          source={getPublicAssets().common.icon_move}
        />
      </TouchableOpacity>
    )
  }

  renderList = () => {
    if(this.state.data.length <= 0) {
      return null
    }
    return (
      <FlatList
        renderItem={({item, index}) => this._renderItem(item, index)}
        data={this.state.data}
        keyExtractor={(item, index) => index + ''}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        initIndex={2}
        type={"langchao"}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: getLanguage(global.language).Map_Settings.SETTING,
          withoutBack: true,
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
          isResponseHeader: false,
        }}
        bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        {/* <Text>{"我是浪潮设置页面"}</Text> */}
        {this.renderList()}

      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  userId: state.langchao.toJS().userId,
})

const mapDispatch = {
  setServerUserId,
  setLangchaoUserInfo,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(SettingPage)

const styles = StyleSheet.create({
})