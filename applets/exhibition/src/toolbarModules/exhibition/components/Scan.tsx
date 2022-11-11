import React from 'react'
import { Image, ScaledSize, View, Animated, Easing, StyleSheet } from 'react-native'
import { getImage } from '../../../assets'
import HollowView from './HollowView'

interface Props extends Partial<DefaultProps> {
  windowSize: ScaledSize
}

interface DefaultProps {
  scanSize?: number
  color: 'blue' | 'red'
  auto: boolean
}

const defaultProps: DefaultProps = {
  color: 'blue',
  auto: true,
}
class Scan extends React.Component<Props & DefaultProps> {

  static defaultProps = defaultProps

  spinValue = new Animated.Value(0)

  scanValue = new Animated.Value(0)

  constructor(props: Props & DefaultProps) {
    super(props)
  }

  componentDidMount(): void {
    this.props.auto && this.scan()
  }

  scan = () => {
    const animation = Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 2500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
    Animated.loop(animation).start()

    const animation2 = Animated.timing(this.scanValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
    Animated.loop(animation2).start()
  }

  renderScan = () => {
    const minWidth = Math.min(this.props.windowSize.width, this.props.windowSize.height)
    let width = minWidth * 0.9
    if(this.props.scanSize) {
      width = this.props.scanSize * 1.2
    }

    const degree = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    const transY = this.scanValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width - 50],
    })

    const opacity = this.scanValue.interpolate({
      inputRange: [0,0.25,0.5, 0.75,1],
      outputRange: [0,0.2,1,0.2,0],
    })

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            width: width,
            height: width,
          }}
        >
          <Image
            style={{
              position: 'absolute',
              width: width,
              height: width,
            }}
            source={this.props.color === 'blue' ? getImage().scan_net : getImage().scan_net_red}
          />
          {this.props.color === 'red' && <Image
            style={{
              position: 'absolute',
              width: width,
              height: width,
            }}
            source={getImage().scan_inner_red}
          />}
          <Animated.Image
            style={{
              width: width,
              height: width,
              transform: [{rotate: degree}],
            }}
            source={this.props.color === 'blue' ? getImage().scan_circle : getImage().scan_circle_red}
          />
          <Animated.Image
            style={{
              position: 'absolute',
              width: width * 0.8,
              opacity,
              alignSelf: 'center',
              transform: [{translateY: transY}]
            }}
            source={this.props.color === 'blue' ? getImage().scan_line : getImage().scan_line_red}
          />
        </View>
      </View>
    )
  }


  render() {
    const width = Math.min(this.props.windowSize.width, this.props.windowSize.height)

    return (
      <>
        <HollowView
          style={{
            ...StyleSheet.absoluteFillObject,
            flex: 1,
          }}
          hollowStyle={{
            width: this.props.scanSize ? this.props.scanSize : width * (this.props.color === 'blue' ? 0.8 : 0.7),
            height: this.props.scanSize ? this.props.scanSize : width * (this.props.color === 'blue' ? 0.8 : 0.7),
            borderRadius: 1000,
            borderColor: 'rgba(0,0,0,0.6)',
          }}
        />
        {this.renderScan()}
      </>
    )
  }

}

export default Scan