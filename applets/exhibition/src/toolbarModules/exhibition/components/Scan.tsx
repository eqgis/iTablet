import React from 'react'
import { Image, ScaledSize, View, Animated, Easing, StyleSheet } from 'react-native'
import { getImage } from '../../../assets'
import HollowView from './HollowView'

interface Props {
  windowSize: ScaledSize
}

class Scan extends React.Component<Props> {

  spinValue = new Animated.Value(0)

  scanValue = new Animated.Value(0)

  constructor(props: Props) {
    super(props)
  }

  componentDidMount(): void {
    this.scan()
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
    const width = minWidth * 0.9

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
          <Animated.Image
            style={{
              width: width,
              height: width,
              transform: [{rotate: degree}],
            }}
            source={getImage().scan_circle}
          />
          <Image
            style={{
              position: 'absolute',
              width: width,
              height: width,
            }}
            source={getImage().scan_net}
          />
          <Animated.Image
            style={{
              position: 'absolute',
              width: width,
              opacity,
              transform: [{translateY: transY}]
            }}
            source={getImage().scan_line}
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
            width: width * 0.8,
            height: width * 0.8,
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