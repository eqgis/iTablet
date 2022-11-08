import React, { Component } from 'react'
import { SMap, SARMap} from 'imobile_for_reactnative'
import NavigationService from '../../containers/NavigationService'
import { ChunkType } from '../../constants'
import AREnhancePosition from './AREnhancePosition'
import LocationCalibration from './LocationCalibration'
import QRScan from './QRScan'
import { RootState } from '@/redux/types'
import { connect, ConnectedProps } from 'react-redux'

interface IState {
  close: boolean,
  showStatus: 'main' | 'scan' | 'arEnhance',
  activeBtn: number,
  latitude: string,
  longitude: string,
  height: string,
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
      longitude: '',
      latitude: '',
      height: "1.5",
    }
  }

  async componentDidMount(){
    let position
    if (global.SELECTPOINTLATITUDEANDLONGITUDE) {
      position = global.SELECTPOINTLATITUDEANDLONGITUDE
    }else {
      position = await SMap.getCurrentPosition()
    }
    this.setState({
      longitude: position.x + '',
      latitude: position.y + '',
    })
  }

  _onClose = async () => {
    // 点击关闭使用当前定位
    const { onClose } = this.props
    onClose && onClose()
    this.setState({
      close: true,
    })
  }

  // 地图选点
  _mapSelectPoint = async () => {
    const { longitude, latitude } = this.state
    this.setState({
      activeBtn: 1,
    })
    NavigationService.navigate('SelectLocation', {
      cb: () => {
        this.setState({
          longitude: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.x + '',
          latitude: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.y + '',
        })
      },
    })
    global.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(longitude), y: Number(latitude) }
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

  renderMain = () => {
    return (
      <LocationCalibration
        visible
        param={{
          x: this.state.longitude + '',
          y: this.state.latitude + '',
          z: this.state.height + ''}}
        close={this._onClose}
        onConfirm={param => {
          this.props.onConfirm?.({
            x: param.x + '',
            y: param.y + '',
            h: param.z + '',
          })
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
        onSelectPoint={this._mapSelectPoint}
        onScan={() => {
          this.setState({
            showStatus: 'scan',
          })
        }}
      />
    )
  }

  renderScan = () => {
    if(global.Type === ChunkType.MAP_AR_MAPPING){
      SARMap.measuerPause(true)
    }
    return (
      <QRScan
        onBack={() => {
          this.setState({
            showStatus: 'main',
          })
        }}
        onSuccess={point => {
          this.setState({
            showStatus: 'main',
            longitude: point.x +'',
            latitude: point.y + '',
            height: point.h + '',
          })
        }}
        windowSize={this.props.windowSize}
      />
    )
  }

  render() {
    const { close, showStatus } = this.state
    let content = null
    switch(showStatus){
      case 'main': content = this.renderMain()
        break
      case 'scan': content = this.renderScan()
        break
      case 'arEnhance' : content = this._renderEnhanceScan()
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
