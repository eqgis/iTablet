import * as React from 'react'
import { SARWebView, SMARWebView, SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import { ToolBar } from '../workspace/components'
import { getToolbarModule } from '../workspace/components/ToolBar/modules/ToolbarModule'
import arWebViewModule from './arWebViewModule'
import DatumPointCalibration from '../arDatumPointCalibration'

let ToolbarModule
export default class ARWebView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let params = this.props.route.params || {}
    this.point = params.point
    this.clickAble = true // 防止重复点击
    this.datumPointRef = null
    this.state = {
      showDatumPoint: true,
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    ToolbarModule = getToolbarModule('AR')
    ToolbarModule.add(arWebViewModule)
    ToolbarModule.setToolBarData('SM_ARWEBVIEWMODULE')
    // this.toolbar.setVisible(true, 'SM_ARWEBVIEWMODULE', {
    //   type: 'table',
    // })
    // setTimeout(async () => {
    //   if (this.point) {
    //     await SARWebView.setPosition(this.point.x, this.point.y)
    //   }
    // }, 1000)
  }

  componentWillUnmount() {}

  back = () => {
    if (this.clickAble) {
      SARWebView.onDestroy()
      NavigationService.goBack('ARWebView')
      global.toolBox && global.toolBox.removeAIDetect(false)
      global.toolBox.switchAr()
      this.clickAble = false
    }
  }

  renderToolbar = () => {
    return <ToolBar ref={ref => (this.toolbar = ref)} toolbarModuleKey={'AR'} />
  }

  _onDatumPointClose = point => {
    // 关闭时进行位置校准
    SARWebView.setPosition(Number(point.x), Number(point.y), Number(point.h))
    global.SELECTPOINTLATITUDEANDLONGITUDE = point
    this.setState({
      showDatumPoint: false,
    }, () => {
      this.toolbar.setVisible(true, 'SM_ARWEBVIEWMODULE', {
        type: 'table',
      })
    })
  }

  _startScan = () => {
    // 开始扫描二维码
    return SARWebView.startScan()
  }

  renderDatumPointCalibration = () => {
    const { showDatumPoint } = this.state
    return <>
      {showDatumPoint ? <DatumPointCalibration routeName={'ARWebView'} ref={ref => this.datumPointRef = ref} onClose={this._onDatumPointClose}
        startScan={this._startScan}/> : null}
    </>
  }

  render() {
    const { showDatumPoint } = this.state
    return (
      <>
        <Container
          ref={ref => (this.Container = ref)}
          headerProps={{
            title: getLanguage(global.language).Map_Main_Menu.MAP_AR_WEBVIEW,
            navigation: this.props.navigation,
            backAction: this.back,
            type: 'fix',
          }}
          bottomProps={{ type: 'fix' }}
          withoutHeader={showDatumPoint}
        >
          <SMARWebView style={{ flex: 1 }} />
          {this.renderToolbar()}
        </Container>
        {this.renderDatumPointCalibration()}
      </>
    )
  }
}
