import * as React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { SMSceneARView ,SSceneAR,SMap} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container, Dialog } from '../../components'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import { ToolBar } from '../workspace/components'
import { getToolbarModule } from '../workspace/components/ToolBar/modules/ToolbarModule'
import arSceneModule from './arSceneModule'
import { scaleSize,Toast, screen } from '../../utils'
import { FileTools } from '../../native'
import { ConstPath} from '../../constants'

interface IProps {
  navigation: Object,
  language: String,
  user: Object,
  nav: Object,
}

let ToolbarModule
export default class ARSceneView extends React.Component<IProps> {
  toolbar: any;
  constructor(props: IProps) {
    super(props)
    this._trackListener = null
    this.state = {
      firstDialog: true, // 第一次用于渲染提示，后面渲染超时
      showPlaceholderView: true,
      visibleInfo:{},
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
  }

  async componentDidMount() {
    Orientation.lockToLandscapeLeft()
    ToolbarModule = getToolbarModule('AR')
    ToolbarModule.add(arSceneModule)
    ToolbarModule.setToolBarData('SM_ARSCENEMODULE')
    this.toolbar.setVisible(true, 'SM_ARSCENEMODULE_NOMAL', {
      type: 'table',
    })
    SSceneAR.setFileExistsListener({
      callback: async result => {
        if (!result) {
          Toast.show(getLanguage(global.language).Prompt.FILE_NOT_EXISTS)
        }
      },
    })
    SSceneAR.setSceneOpenListener({
      callback: async result => {
        if (result) {
          global.isSceneOpen = true
          this.toolbar && this.toolbar.setVisible(true, 'SM_ARSCENEMODULE', {
            type: 'table',
          })
          global.Loading.setLoading(false)
          setTimeout(()=>{
            Toast.show(getLanguage(global.language).Prompt.SUCCESS)
          },1000)
        }else{
          global.isSceneOpen = false
        }
      },
    })

    this._trackListener = SSceneAR.setImageTrackingCallback(this._trackCb)
    this.customerPath()
    // Toast.show(getLanguage(global.language).Prompt.MOVE_PHONE_ADD_SCENE)


    let vis = await SMap.getMapLayerVisible()
    this.setState({visibleInfo:vis})
  }

  componentWillUnmount() {
    SSceneAR.removeImageTrackingCallback(this._trackListener)
  }

  // 图片识别回调
  _trackCb = result => {
    // 成功
    if(result){
      global.Loading.setLoading(false)
    }else{
      // 超时
      global.Loading.setLoading(false)
      setTimeout(()=>{
        this.dialog && this.dialog.setDialogVisible(true)
      },1000)
    }
  }

  customerPath = async() => {
    const user = global.currentUser
    const path = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + user.userName}/${ConstPath.RelativeFilePath.Scene}`,
    )
    SSceneAR.setCustomerPath(path)
  }

  back = async () => {
    SMap.setMapLayerVisible(this.state.visibleInfo)
    this.setState({showPlaceholderView:false})
    await SSceneAR.close()
    // Orientation.lockToPortrait()
    global.Loading.setLoading(true,"Loading")
    NavigationService.goBack()
    setTimeout(() => {
      global.Loading.setLoading(false)
      // NavigationService.goBack()
      global.toolBox && global.toolBox.removeAIDetect(false)
      global.toolBox.switchAr()
    }, 500)
  }

  onDialogConfirm = async () => {
    const { firstDialog } = this.state
    this.dialog.setDialogVisible(false)
    // 超时继续识别
    if(firstDialog){
      this.setState({ firstDialog:false })
    }else{
      // SSceneAR.setLoadModelState(false)
      await SSceneAR.imageTrack()
      global.Loading.setLoading(true,getLanguage(global.language).Prompt.TRACKING_LOADING)
    }

  }

  onDialogCancel = () => {
    const { firstDialog } = this.state
    this.dialog.setDialogVisible(false)
    // 超时取消继续识别
    if(firstDialog){
      this.setState({ firstDialog:false })
    }else{
      SSceneAR.setLoadModelState(true)
    }
  }

  renderToolbar = () => {
    return <ToolBar ref={ref => (this.toolbar = ref)} toolbarModuleKey={'AR'} />
  }

  renderDialog = () =>{
    const { firstDialog } = this.state
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        cancelBtnVisible={!firstDialog}
        confirmBtnTitle={firstDialog ? getLanguage(global.language).Prompt.CONFIRM
          : getLanguage(global.language).Prompt.YES}
        cancelBtnTitle={getLanguage(global.language).Prompt.NO}
        confirmAction={async ()=>{
          this.dialog && this.onDialogConfirm()
        }}
        cancelAction={async ()=>{
          this.dialog && this.onDialogCancel()
        }}
        opacity={1}
        defaultVisible={true}
        style={{height: scaleSize(300),backgroundColor: "#fff"}}
      >
        <View style={styles.content}>
          <Image source={require('../../assets/home/Frenchgrey/icon_prompt.png')} style={styles.titleImg}/>
          <Text style={styles.titleText}>{
            firstDialog ?
              getLanguage(global.language).Prompt.MOVE_PHONE_ADD_SCENE
              : getLanguage(global.language).Prompt.IDENTIFY_TIMEOUT
          }</Text>
        </View>
      </Dialog>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Container
          ref={ref => (global.ARContainer = ref)}
          headerProps={{
            title: getLanguage(global.language).Map_Main_Menu.MAP_AR_PIPELINE,
            navigation: this.props.navigation,
            backAction: this.back,
            type: 'fix',
            headerStyle: {
              marginRight: scaleSize(96),
            },
          }}
          showFullInMap = {true}
          bottomProps={{ type: 'fix' }}
        >
          <SMSceneARView style={{ flex: 1}} />
          {this.renderDialog()}
          {this.renderToolbar()}
        </Container>
        {/* AR管线界面在打开toolbar时，系统兼容问题导致container左侧部分不渲染
            这里在container外使用一个View来避免，这个view必须可见，不能使用透明背景 by zcj */}
        {this.state.showPlaceholderView && <View style={styles.placeholderView}></View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: scaleSize(30),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleText: {
    fontSize: scaleSize(24),
    // color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  titleImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  placeholderView: {
    position: 'absolute',
    width: 1,
    height: screen.deviceWidth,
    backgroundColor: '#000',
  },
})