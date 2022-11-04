import React from 'react'
import { ViewStyle, Animated } from 'react-native'

interface AnimationWrapProps extends React.ClassAttributes<AnimationWrap> {
  visible: boolean
  style: ViewStyle
  range: [number, number]
  animated: 'left' | 'right' | 'top' | 'bottom'
}

export default class AnimationWrap extends React.Component<AnimationWrapProps> {


  value: Animated.Value

  constructor(props: AnimationWrapProps) {
    super(props)

    this.value = new Animated.Value(props.range[props.visible ? 1 : 0])
  }

  componentDidUpdate(prevProps: Readonly<AnimationWrapProps>): void {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.show()
      } else {
        this.hide()
      }
    }
  }

  show = () => {
    Animated.timing(this.value, {
      toValue: this.props.range[1],
      duration: 500,
      useNativeDriver: false
    }).start()
  }

  hide = () => {
    Animated.timing(this.value, {
      toValue: this.props.range[0],
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  render(): React.ReactNode {
    return (
      <Animated.View
        style={[
          this.props.style,
          this.props.animated === 'bottom' && { bottom: this.value },
          this.props.animated === 'top' && { top: this.value },
          this.props.animated === 'left' && { left: this.value },
          this.props.animated === 'right' && { right: this.value },
        ]}
      >
        {this.props.children}
      </Animated.View>
    )
  }

}