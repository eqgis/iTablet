import { AppEvent, AppStyle, AppToolBar, Toast } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Animated, Easing, EmitterSubscription, Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Scan from '../components/Scan'
import { FileTools, SARMap, SExhibition } from 'imobile_for_reactnative'
import { ConstPath } from '@/constants'

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  targetPosition: 0 | 1 | 2 | 3 | 4
}

class PresentationView extends React.Component<Props, State> {

  scanRef: Scan | null = null

  event: EmitterSubscription | null = null

  moveValue = new Animated.Value(0)

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      targetPosition: 0,
    }
  }

  componentDidMount(): void {
    this.openARMap('DefaultARMap_5')
    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})
        Toast.show('请按照箭头引导转动屏幕查看地图集')
        SExhibition.startExhibition()
        this._startMoveArrow()
        SARMap.loadUnityScene()
      }
    })
    this.event = SExhibition.addExhibitionTargetPositionChangeListener(mode => {
      if(this.state.targetPosition === 0 && mode !== 0) {
        this._startMoveArrow()
      }
      this.setState({targetPosition: mode})
    })
  }

  _startMoveArrow = () => {
    const animation = Animated.timing(this.moveValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
    Animated.loop(animation).start()
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
    SExhibition.endExhibition()
    this.event?.remove()
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

  renderArrow = () => {
    if(this.state.targetPosition == 0) return
    const move = this.moveValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.targetPosition === 1 ? -dp(30) : dp(30)]
    })
    const moveUpDown = this.moveValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.targetPosition === 4 ? -dp(30) : dp(30)]
    })
    const isLR = this.state.targetPosition === 1 || this.state.targetPosition === 2
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: '40%',
          alignSelf: 'center',
          width: dp(100),
          height: dp(100),
          transform:
            isLR ? [{translateX: move}, {rotateY: this.state.targetPosition === 1 ? '0deg' : '180deg'}]
              : [{translateY: moveUpDown}, {rotate: this.state.targetPosition === 4 ? '90deg' : '270deg'}]
        }}
      >
        <Image
          source={getImage().guide_arrow}
          style={{width: '100%', height: '100%' }}
        />
      </Animated.View>
    )
  }

  renderScan = () => {
    const isPortrait = this.props.windowSize.width < this.props.windowSize.height
    const width = Math.min(this.props.windowSize.width, this.props.windowSize.height)
    const height = Math.max(this.props.windowSize.width, this.props.windowSize.height)
    const isLargeScreen = width > 400 //平板

    const scanSize = dp(300)

    let space: number
    let position: number
    let maxWidth: number

    const positionLargeLand = width / 2 + scanSize / 2 + dp(40)
    const positionLargePortrait = height / 2 + scanSize / 2 + dp(40)
    const postionSmallLand = width * 0.7 / 2 + width / 2 + dp(40)
    const postionSmallPortrait = width * 0.7 / 2 + height / 2 + dp(40)

    const spaceLarge = width - scanSize / 2
    const spaceSmall = width * 0.3 / 2

    const maxWidthLarge = (height / 2- scanSize / 2 ) * 0.9
    const maxWidthSmall = (height / 2- width * 0.7 / 2 ) * 0.9

    if(isLargeScreen) {
      space = spaceLarge
      position = isPortrait ? positionLargePortrait : positionLargeLand
      maxWidth = maxWidthLarge
    } else {
      space = spaceSmall
      position = isPortrait ? postionSmallPortrait : postionSmallLand
      maxWidth = maxWidthSmall
    }

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
        maxWidth: maxWidth,
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
          scanSize={scanSize}
          color='red'
        />

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
            // onPress={this.startScan}
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
        {this.renderArrow()}
      </>
    )
  }
}

export default PresentationView