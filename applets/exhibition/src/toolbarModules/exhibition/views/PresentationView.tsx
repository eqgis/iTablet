import { AppEvent, AppStyle, AppToolBar, Toast } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Scan from '../components/Scan'
import { FileTools, SARMap, SExhibition } from 'imobile_for_reactnative'
import { ConstPath } from '@/constants'
import ARArrow from '../components/ARArrow'
import ScanWrap from '../components/ScanWrap'

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
}

class PresentationView extends React.Component<Props, State> {

  scanRef: Scan | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
    }
  }

  componentDidMount(): void {
    SARMap.setAREnhancePosition()
    this.openARMap('DefaultARMap')
    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})
        SExhibition.startTrackingTarget()
        SARMap.loadUnityScene()
      }
    })
  }

  openARMap = async (mapName: string) => {
    const homePath = await FileTools.getHomeDirectory()
    const mapPath = homePath + ConstPath.UserPath + 'Customer' + '/' + ConstPath.RelativePath.ARMap
    const path = mapPath + mapName + '.arxml'
    SARMap.open(path)
  }

  back = () => {
    if(this.state.showScan) {
      this.setState({showScan: false})
      return
    }
    AppEvent.removeListener('ar_image_tracking_result')
    if(this.state.showScan) {
      SARMap.stopAREnhancePosition()
    }
    SExhibition.stopTrackingTarget()
    SARMap.close()
    SARMap.unloadUnityScene()
    AppToolBar.goBack()
  }

  startScan = () => {
    this.scanRef?.scan()
    SARMap.setAREnhancePosition()
  }

  renderBack = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(20),
          left: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(25),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onPress={this.back}
      >
        <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_return}
        />
      </TouchableOpacity>
    )
  }

  renderScan = () => {
    return <ScanWrap windowSize={this.props.windowSize} hint={'请扫描演示台上的二维码加载展示内容'}/>
  }

  render() {
    return(
      <>
        {this.state.showScan && this.renderScan()}
        {this.renderBack()}
        <ARArrow
          arrowShowed={() => Toast.show('请按照箭头引导转动屏幕查看地图集')}
        />
      </>
    )
  }
}

export default PresentationView