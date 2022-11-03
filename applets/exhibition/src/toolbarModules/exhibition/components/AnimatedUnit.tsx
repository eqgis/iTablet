import React from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing
} from 'react-native'

interface Props {
  endDiameter: number,
  initialPosition: { top: number, left: number },
  waveColor: string,
  intervals: number,//间隔时间
  spreadSpeed: number,//扩散速度
}

export default class AnimatedUnit extends React.Component<Props> {
  static defaultProps = {
    endDiameter: 60,
    initialPosition: { top: 0, left: 0 },
    // waveColor: '#5BC6AD',
    waveColor: '#F89746',
    intervals: 500,//间隔时间
    spreadSpeed: 500,//扩散速度
  }

  anim: Animated.Value
  animatedFun: Animated.CompositeAnimation | null

  constructor(props: Props) {
    super(props)
    this.anim = new Animated.Value(0)
    this.animatedFun = null
  }

  startAnimation = () => {
    this.anim.setValue(0)
    this.animatedFun = Animated.timing(this.anim, {
      toValue: 1,
      duration: this.props.spreadSpeed,
      easing: Easing.linear,// 线性的渐变函数,
      useNativeDriver: false
    })
    this.animatedFun.start()
  }

  render() {
    const { initialPosition, endDiameter, waveColor } = this.props
    const r = endDiameter / 2// 直径变化量,top与left的变化是直径的一半
    // console.warn(initialPosition)
    return (
      <View pointerEvents='none'>
        <Animated.View style={[styles.spreadCircle, { backgroundColor: waveColor }, {
          opacity: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }),
          height: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, endDiameter]
          }),
          width: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, endDiameter]
          }),
          top: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [initialPosition.top, initialPosition.top - r]
          }),
          left: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [initialPosition.left, initialPosition.left - r]
          }),
        },]}></Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  spreadCircle: {
    borderRadius: 999,
    position: 'absolute',
  },
})