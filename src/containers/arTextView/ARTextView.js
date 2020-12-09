import * as React from 'react'
import { SARText, SMARTextView, SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import { ToolBar } from '../workspace/components'
import { getToolbarModule } from '../workspace/components/ToolBar/modules/ToolbarModule'
import arTextModule from './arTextModule'

let ToolbarModule
export default class ARTextView extends React.Component {
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
    this.clickAble = true // 防止重复点击
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    ToolbarModule = getToolbarModule('AR')
    ToolbarModule.add(arTextModule)
    ToolbarModule.setToolBarData('SM_ARTEXTMODULE')
    this.toolbar.setVisible(true, 'SM_ARTEXTMODULE', {
      type: 'table',
    })
    setTimeout(async () => {
      if (this.point) {
        await SARText.setPosition(this.point.x, this.point.y)
      }
    }, 1000)
  }

  componentWillUnmount() {}

  back = () => {
    if (this.clickAble) {
      this.clickAble = false
      SARText.onDestroy()
      NavigationService.goBack('ARTextView')
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
      GLOBAL.toolBox.switchAr()
    }
  }

  // renderBottom = () => {
  //   return <BottomBar getData={MenuData.getPage} />
  // }
  renderToolbar = () => {
    return <ToolBar ref={ref => (this.toolbar = ref)} toolbarModuleKey={'AR'} />
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_TEXT,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARTextView style={{ flex: 1 }} />
        {this.renderToolbar()}
      </Container>
    )
  }
}
