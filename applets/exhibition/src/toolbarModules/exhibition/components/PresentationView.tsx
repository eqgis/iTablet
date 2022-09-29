import { AppEvent, AppStyle, AppToolBar, Toast } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Scan from './Scan'
import { FileTools, SARMap } from 'imobile_for_reactnative'
import { ConstPath } from '@/constants'

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
    this.openARMap('DefaultARMap')
    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})
        Toast.show('定位成功')
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
    AppEvent.removeListener('ar_image_tracking_result')
    if(this.state.showScan) {
      SARMap.stopAREnhancePosition()
    }
    SARMap.close()
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
    const isPortrait = this.props.windowSize.width < this.props.windowSize.height
    const width = Math.min(this.props.windowSize.width, this.props.windowSize.height)
    const height = Math.max(this.props.windowSize.width, this.props.windowSize.height)

    const space = width * 0.3 / 2

    const position = width * 0.7 / 2 + height / 2 + dp(40)

    let style : ViewStyle = {
      position: 'absolute',
      flex: 1,
      width: '100%',
      height: dp(70),
      alignItems: 'center',
      top: position,
      overflow: 'hidden',
    }
    if(!isPortrait && space < dp(70)) {
      style = {
        position: 'absolute',
        flex: 1,
        maxWidth: (height / 2- width * 0.7 / 2 ) * 0.9,
        alignItems: 'center',
        top: width / 2,
        right: 0,
      }
    }

    return (
      <>
        <Scan
          ref={ref => this.scanRef = ref}
          windowSize={this.props.windowSize}
          auto={false}
          color='red' />

        <View
          style={style}
        >
          <TouchableOpacity
            style={{
              width: dp(100),
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.startScan}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={getImage().background_red}
              resizeMode="stretch" />
            <Text style={[AppStyle.h3, { color: 'white' }]}>
              {'扫一扫'}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              marginTop: dp(10),
              textAlign: 'center',
            }}
          >
            {'请扫描演示台上的二维码加载展示内容'}
          </Text>
        </View>

      </>
    )
  }

  render() {
    return(
      <>
        {this.state.showScan && this.renderScan()}
        {this.renderBack()}
      </>
    )
  }
}

export default PresentationView