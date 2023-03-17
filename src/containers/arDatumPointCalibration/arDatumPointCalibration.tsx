import React, { Component } from 'react'
import { SARMap} from 'imobile_for_reactnative'
import { ChunkType } from '../../constants'
import AREnhancePosition from './AREnhancePosition'
import LocationCalibration from './LocationCalibration'
import { RootState } from '@/redux/types'
import { connect, ConnectedProps } from 'react-redux'
import SinglePointPositionPage from './SinglePointPositionPage'
import TwoPointPositionPage from './TwoPointPositionPage'

interface IState {
  close: boolean,
  showStatus: 'main' | 'arEnhance' | 'twoPoint' | 'singlePoint',
  activeBtn: number,
}

interface IProps extends ReduxProps {
  onClose: () => void, // 选点结束回调
  onConfirm: (param: {x: string, y: string, h: string}) => void, // 选点确认
}

class DatumPointCalibration extends Component<IProps,IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      close: false,
      showStatus: 'main',
      activeBtn: 2,
    }
  }


  _onClose = async () => {
    // 点击关闭使用当前定位
    const { onClose } = this.props
    onClose && onClose()
    this.setState({
      close: true,
    })
  }


  /** ar增强定位的扫描界面的渲染 */
  _renderEnhanceScan = () => {
    if(global.Type === ChunkType.MAP_AR_MAPPING){
      SARMap.measuerPause(true)
    }
    return (
      <AREnhancePosition
        onBack = {() => {
          SARMap.stopAREnhancePosition()
          this.setState({
            showStatus: 'main'
          })

        }}
        onSuccess = {() => {
          // 定位成功走的方法
          // 关闭校准界面
          this._onClose()
        }}
      />
    )
  }

  /** 单点定位页面 */
  _renderSinglePointPage = () => {
    return (
      <SinglePointPositionPage
        onBack = {() => {
          this.setState({
            showStatus: 'main'
          })
        }}
        onSubmit = {(param: {x: string, y: string, z: string}) => {
          // 单点定位点击了提交按钮
          this.props.onConfirm?.({
            x: param.x + '',
            y: param.y + '',
            h: param.z + '',
          })
          // 关闭校准界面
          this.setState({
            close: true,
          })
        }}
        windowSize={this.props.windowSize}
      />
    )
  }

  /** 两点定位页面 */
  _renderTwoPointPage = () => {
    return (
      <TwoPointPositionPage
        onBack = {() => {
          this.setState({
            showStatus: 'main'
          })
        }}
        onSubmit = {() => {
          // 两点定位点击了提交按钮
          // 关闭校准界面
          this.setState({
            close: true,
          })
        }}
        windowSize={this.props.windowSize}
      />
    )
  }

  renderMain = () => {
    return (
      <LocationCalibration
        visible
        close={this._onClose}
        onConfirm={() => {
          this.setState({
            close: true,
          })
        }}
        onEnhance={() => {
          // 调用ar增强定位的方法获取定位
          SARMap.setAREnhancePosition()
          // 跳转到扫描界面
          this.setState({
            showStatus: 'arEnhance',
          })
        }}
        gotoSinglePointPage={() => {
          this.setState({
            showStatus: 'singlePoint'
          })
        }}
        gotoTwoPointPage={async () => {
          // await SARMap.setCenterHitTest(true)
          this.setState({
            showStatus: 'twoPoint'
          })
        }}
      />
    )
  }

  render() {
    const { close, showStatus } = this.state
    let content = null
    switch(showStatus){
      case 'main': content = this.renderMain()
        break
      case 'arEnhance' : content = this._renderEnhanceScan()
        break
      case 'singlePoint':
        content = this._renderSinglePointPage()
        break
      case 'twoPoint':
        content = this._renderTwoPointPage()
        break
    }
    return (
      <>{close ? null : content}</>
    )
  }
}


const mapStateToProp = (state: RootState) => ({
  windowSize: state.device.toJS().windowSize,
})


type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp)

export default connector(DatumPointCalibration)
