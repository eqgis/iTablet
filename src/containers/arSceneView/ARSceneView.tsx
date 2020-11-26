import * as React from 'react'
import { SMSceneARView ,SSceneAR} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
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
  constructor(props: IProps) {
    super(props)
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
        }else{
          GLOBAL.isSceneOpen = false
        }
      },
    })
    this.customerPath()
    Toast.show(getLanguage(GLOBAL.language).Prompt.MOVE_PHONE_ADD_SCENE)
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
    NavigationService.goBack()
    // Orientation.lockToPortrait()
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    GLOBAL.toolBox.switchAr()
  }

  renderToolbar = () => {
    return <ToolBar ref={ref => (this.toolbar = ref)} toolbarModuleKey={'AR'} />
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
        {this.renderToolbar()}
      </Container>
    )
  }
}
