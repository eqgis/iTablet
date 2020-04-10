import * as React from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import { Const } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import styles from './styles'

export default class MapNavIcon extends React.Component {
  props: {
    getNavMenuRef: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    this.right =
      this.props.device.orientation === 'PORTRAIT'
        ? new Animated.Value(-scaleSize(96))
        : new Animated.Value(0)
    this.rotate = new Animated.Value(0)
    this.shadowVisible = new Animated.Value(0)
    this.visible = true
    this.menuVisible = false
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
  }

  onOrientationChange = () => {
    if (this.props.device.orientation === 'PORTRAIT') {
      Animated.timing(this.right, {
        toValue: -scaleSize(96),
        duration: 0,
      }).start()
    } else {
      if (this.visible) {
        Animated.timing(this.right, {
          toValue: 0,
          duration: 0,
        }).start()
        this.rotateMore(false)
      } else {
        Animated.timing(this.right, {
          toValue: -scaleSize(96),
          duration: 0,
        }).start()
      }
    }
  }

  rotateMore = visible => {
    Animated.timing(this.rotate, {
      toValue: visible ? 1 : 0,
      duration: Const.ANIMATED_DURATION,
    }).start()
    this.changeShadow(visible)
  }

  changeShadow = visible => {
    Animated.timing(this.shadowVisible, {
      toValue: visible ? 1 : 0,
      duration: 300,
    }).start()
  }

  setVisible = visible => {
    let right = visible ? 0 : -scaleSize(96)
    if (this.props.device.orientation === 'PORTRAIT') {
      right = -scaleSize(96)
    }
    Animated.timing(this.right, {
      toValue: right,
      duration: 300,
    }).start()
    this.visible = visible
    const menu = this.props.getNavMenuRef()
    if (menu) {
      menu.setLocation(right - scaleSize(96))
      this.rotateMore(menu.visible)
    }
  }

  onPress = () => {
    const menu = this.props.getNavMenuRef()
    let menuVisible = menu ? menu.visible : false
    let right = menuVisible ? 0 : scaleSize(96)
    Animated.timing(this.right, {
      toValue: right,
      duration: 300,
    }).start()
    if (menu) {
      menu.setLocation(right - scaleSize(96))
      this.rotateMore(menu.visible)
    }
  }

  render() {
    const rotate = this.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    })
    return (
      <Animated.View
        style={{
          position: 'absolute',
          right: this.right,
          bottom: 0,
          backgroundColor: '#FBFBFB',
          elevation: 20,
          borderTopLeftRadius: scaleSize(40),
          borderBottomLeftRadius: scaleSize(40),
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOpacity: this.shadowVisible,
          shadowRadius: 2,
        }}
      >
        <TouchableOpacity style={styles.moreImageView} onPress={this.onPress}>
          <Animated.Image
            style={[
              styles.moreImage,
              {
                transform: [{ rotateY: rotate }],
              },
            ]}
            source={require('../../../../assets/public/left_arrow.png')}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}
