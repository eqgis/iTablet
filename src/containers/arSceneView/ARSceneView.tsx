import * as React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { SMSceneARView ,SSceneAR} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container, Dialog } from '../../components'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import { ToolBar } from '../workspace/components'
import { getToolbarModule } from '../workspace/components/ToolBar/modules/ToolbarModule'
import arSceneModule from './arSceneModule'
import { scaleSize,Toast } from '../../utils'
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
    this.state = {
      firstDialog: true, // 第一次用于渲染提示，后面渲染超时
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
  }

  componentDidMount() {
    Orientation.lockToLandscape()
    ToolbarModule = getToolbarModule('AR')
    ToolbarModule.add(arSceneModule)
    ToolbarModule.setToolBarData('SM_ARSCENEMODULE')
    this.toolbar.setVisible(true, 'SM_ARSCENEMODULE_NOMAL', {
      type: 'table',
    })
    SSceneAR.setFileExistsListener({
      callback: async result => {
        if (!result) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.FILE_NOT_EXISTS)
        }
      },
    })
    SSceneAR.setSceneOpenListener({
      callback: async result => {
        if (result) {
          GLOBAL.isSceneOpen = true
          this.toolbar.setVisible(true, 'SM_ARSCENEMODULE', {
            type: 'table',
          })
          GLOBAL.Loading.setLoading(false)
        }else{
          GLOBAL.isSceneOpen = false
        }
      },
    })
    SSceneAR.setImageTrackingCallback({
      onSuccess: () => {
        GLOBAL.Loading.setLoading(false)
      },
      onTimeout: () => {
        GLOBAL.Loading.setLoading(false)
        this.setState({ firstDialog:false })
        setTimeout(()=>{
          this.dialog.setDialogVisible(true)
        },1000)
      },
    })
    this.customerPath()
    // Toast.show(getLanguage(GLOBAL.language).Prompt.MOVE_PHONE_ADD_SCENE)
  }

  componentWillUnmount() {
 
  }

  customerPath = async() => {
    const user = GLOBAL.currentUser
    const path = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + user.userName}/${ConstPath.RelativeFilePath.Scene}`,
    )
    SSceneAR.setCustomerPath(path)
  }

  back = async () => {
    await SSceneAR.close()
    // Orientation.lockToPortrait()
    GLOBAL.Loading.setLoading(true,"Loading")
    NavigationService.goBack()
    setTimeout(() => {
      GLOBAL.Loading.setLoading(false)
      // NavigationService.goBack()
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
      GLOBAL.toolBox.switchAr()
    }, 500)

  }

  onDialogConfirm = async () => {
    const { firstDialog } = this.state
    this.dialog.setDialogVisible(false)
    if(!firstDialog){
      // SSceneAR.setLoadModelState(false)
      await SSceneAR.imageTrack()
      GLOBAL.Loading.setLoading(true,"识别中...")
    }

  }

  onDialogCancel = () => {
    const { firstDialog } = this.state
    this.dialog.setDialogVisible(false)
    if(firstDialog){
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
        // type={'modal'}
        cancelBtnVisible={!firstDialog}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.CONFIRM}
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
              getLanguage(GLOBAL.language).Prompt.MOVE_PHONE_ADD_SCENE
              : "识别超时，是否继续识别"
          }</Text>
        </View>
      </Dialog>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (GLOBAL.ARContainer = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_PIPELINE,
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
        <SMSceneARView style={{ flex: 1 }} />
        {this.renderDialog()}
        {this.renderToolbar()}
      </Container>
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
})