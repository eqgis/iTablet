import React from 'react'
import {
  ScaledSize,
  View,
  ViewStyle,
  Text,
  Image,
} from 'react-native'
import { dp } from 'imobile_for_reactnative/utils/size'
import Scan from './Scan'
import { getImage } from '../../../assets'

interface Props {
  windowSize: ScaledSize
  hint: string
}

interface State {
  hintText: string
}


class ScanWrap extends React.Component<Props, State> {
  timer:any
  scanRef: Scan | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hintText: this.props.hint,
    }
  }

  componentDidMount = (): void => {
    this.timer = setTimeout(() => {
      this.setState({
        hintText: '请调整距离将二维码放入扫描圈内',
      })
      clearTimeout(this.timer)
    }, 5000)
  }

  componentWillUnmount(): void {
    clearTimeout(this.timer)
  }

  renderScan = () => {
    const isPortrait = this.props.windowSize.width < this.props.windowSize.height
    const width = Math.min(this.props.windowSize.width, this.props.windowSize.height)
    const height = Math.max(this.props.windowSize.width, this.props.windowSize.height)
    const isLargeScreen = width > 400 //平板

    const scanSize = dp(isLargeScreen ? 300 : 220)

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
    const maxWidthSmall = (height / 2- width * 0.7 / 2 )

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
        // top: width / 2,
        bottom: dp(10),
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
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              marginTop: dp(15),
              height: dp(isLargeScreen ? 50 : 40),
              width: dp(390)
            }}
            source={getImage().scan_title}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: dp(10),
          }}
        >
          <View
            style={style}
          >
            <Text
              style={{
                color: 'white',
                marginTop: dp(10),
                textAlign: 'center',
              }}
            >
              {/* {this.props.hint} */}
              {this.state.hintText}
            </Text>
          </View>
        </View>
      </>
    )
  }


  render() {
    return this.renderScan()
  }
}

export default ScanWrap