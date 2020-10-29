import * as React from 'react'
import { SMARVideoView, SARVideoView, SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import { ToolBar } from '../workspace/components'
import { getToolbarModule } from '../workspace/components/ToolBar/modules/ToolbarModule'
import arVideoModule from './arVideoModule'

let ToolbarModule
export default class ARVideoView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params || {}
    this.point = params.point
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    ToolbarModule = getToolbarModule('AR')
    ToolbarModule.add(arVideoModule)
    ToolbarModule.setToolBarData('SM_ARVIDEOMODULE')
    this.toolbar.setVisible(true, 'SM_ARVIDEOMODULE', {
      type: 'table',
    })
    setTimeout(async () => {
      if (this.point) {
        await SARVideoView.setPosition(this.point.x, this.point.y)
      }
    }, 1000)
  }

  componentWillUnmount() {}

  back = () => {
    SARVideoView.onDestroy()
    NavigationService.goBack()
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
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_VIDEO,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARVideoView style={{ flex: 1 }} />
        {this.renderToolbar()}
      </Container>
    )
  }
}
