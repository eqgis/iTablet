import * as React from 'react'
import { SMSceneARView ,SSceneAR} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import { ToolBar } from '../workspace/components'
import { getToolbarModule } from '../workspace/components/ToolBar/modules/ToolbarModule'
import arSceneModule from './arSceneModule'

let ToolbarModule
export default class ARSceneView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
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
    this.toolbar.setVisible(true, 'SM_ARSCENEMODULE', {
      type: 'table',
    })
  }

  componentWillUnmount() {
 
  }

  back = () => {
    SSceneAR.close()
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
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_PIPELINE,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
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
