import * as React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { zIndexLevel } from '../../../../styles'

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    zIndex: zIndexLevel.THREE,
    backgroundColor: 'rgba(48,48,48,0.5)',
  },
})

export default class BackgroundOverlay extends React.Component {
  props: {
    device: Object,
  }

  constructor(props) {
    super(props)
    ;(this.width =
      Math.max(this.props.device.width, this.props.device.height) + 100),
    (this.state = {
      left: new Animated.Value(this.width),
    })
    this.visible = false
  }

  setVisible = visible => {
    if (this.visible === visible) return
    Animated.timing(this.state.left, {
      toValue: visible ? 0 : this.width,
      duration: 300,
      useNativeDriver: false,
    }).start()
    this.visible = visible
  }

  render() {
    return (
      <Animated.View
        style={[styles.overlay, { width: this.width, left: this.state.left }]}
      />
    )
  }
}
