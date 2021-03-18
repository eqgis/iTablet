import * as React from 'react'
import { SMARVideoView, SARVideoView, SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import { ToolBar } from '../workspace/components'
import { getToolbarModule } from '../workspace/components/ToolBar/modules/ToolbarModule'
import arVideoModule from './arVideoModule'
import DatumPointCalibration from '../arDatumPointCalibration'

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
    ToolbarModule.add(arVideoModule)
    ToolbarModule.setToolBarData('SM_ARVIDEOMODULE')
    // this.toolbar.setVisible(true, 'SM_ARVIDEOMODULE', {
    //   type: 'table',
    // })
    // setTimeout(async () => {
    //   if (this.point) {
    //     await SARVideoView.setPosition(this.point.x, this.point.y)
    //   }
    // }, 1000)
  }

  componentWillUnmount() {}

  back = () => {
    if (this.clickAble) {
      this.clickAble = false
      SARVideoView.onDestroy()
      NavigationService.goBack('ARVideoView')
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
      GLOBAL.toolBox.switchAr()
    }
  }

  renderToolbar = () => {
    return <ToolBar ref={ref => (this.toolbar = ref)} toolbarModuleKey={'AR'} />
  }

  _onDatumPointClose = () => {
    const point = this.datumPointRef.getPositionData()
    // 关闭时进行位置校准
    SARVideoView.setPosition(Number(point.x), Number(point.y), Number(point.h))
    GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE = point
    this.setState({
      showDatumPoint: false,
    }, () => {
      this.toolbar.setVisible(true, 'SM_ARVIDEOMODULE', {
        type: 'table',
      })
    })
  }

  _startScan = () => {
    // 开始扫描二维码
    return SARVideoView.startScan()
  }

  renderDatumPointCalibration = () => {
    const { showDatumPoint } = this.state
    return <>
      {showDatumPoint ? <DatumPointCalibration routeName={'ARVideoView'} ref={ref => this.datumPointRef = ref} onClose={this._onDatumPointClose}
        startScan={this._startScan}/> : null}
    </>
  }

  render() {
    return (
      <>
        <Container
          ref={ref => (this.Container = ref)}
          headerProps={{
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_VIDEO,
            navigation: this.props.navigation,
            backAction: this.back,
            type: 'fix',
          }}
          bottomProps={{ type: 'fix' }}
        >
          <SMARVideoView style={{ flex: 1 }} />
          {this.renderToolbar()}
        </Container>
        {this.renderDatumPointCalibration()}
      </>
    )
  }
}
