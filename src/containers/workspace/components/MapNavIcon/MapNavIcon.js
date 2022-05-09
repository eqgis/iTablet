import * as React from 'react'
import { Animated, TouchableOpacity, Platform } from 'react-native'
import { Const } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import styles from './styles'

const ICON_RIGHT_INVISIBLE = -scaleSize(100)
const ICON_RIGHT_SHOWMENU = scaleSize(75)
const ICON_RIGHT_HIDEMENU = 0

const ICON_RIGHT_INVISIBLE_R = -scaleSize(100)
const ICON_RIGHT_SHOWMENU_R = 0
const ICON_RIGHT_HIDEMENU_R = 0

export default class MapNavIcon extends React.Component {
  props: {
    getNavMenuRef: () => {},
    device: Object,
    mapColumnNavBar: Boolean,
    navBarDisplay: Boolean,
    setNavBarDisplay: () => {},
  }

  constructor(props) {
    super(props)
    this.visible = true
    this.right = new Animated.Value(this.getRight())
    this.rotate = new Animated.Value(this.props.navBarDisplay ? 1 : 0)
    this.shadowVisible = new Animated.Value(0)
    this.color = new Animated.Value(
      this.props.mapColumnNavBar ? (this.props.navBarDisplay ? 1 : 0) : 0,
    )
    this.elevation = new Animated.Value(
      this.props.mapColumnNavBar ? (this.props.navBarDisplay ? 21 : 20) : 20,
    )
    this.imageX = new Animated.Value(
      this.props.mapColumnNavBar
        ? this.props.navBarDisplay
          ? scaleSize(5)
          : 0
        : 0,
    )
    this.opacity = new Animated.Value(
      this.props.mapColumnNavBar ? (this.props.navBarDisplay ? 0.6 : 1.0) : 1.0,
    )
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
    if (this.props.mapColumnNavBar !== prevProps.mapColumnNavBar) {
      this.changStyle(this.props.navBarDisplay)
    }
  }

  getRight = () => {
    let right
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0) {
      right = this.props.mapColumnNavBar
        ? ICON_RIGHT_INVISIBLE
        : ICON_RIGHT_INVISIBLE_R
    } else {
      if (this.visible) {
        if (this.props.navBarDisplay) {
          right = this.props.mapColumnNavBar
            ? ICON_RIGHT_SHOWMENU
            : ICON_RIGHT_SHOWMENU_R
        } else {
          right = this.props.mapColumnNavBar
            ? ICON_RIGHT_HIDEMENU
            : ICON_RIGHT_HIDEMENU_R
        }
      } else {
        right = this.props.mapColumnNavBar
          ? ICON_RIGHT_INVISIBLE
          : ICON_RIGHT_INVISIBLE_R
      }
    }
    return right
  }

  onOrientationChange = () => {
    let right = this.getRight()
    Animated.timing(this.right, {
      toValue: right,
      duration: 0,
      useNativeDriver: false,
    }).start()
    this.changStyle(this.props.navBarDisplay)
  }

  changStyle = showMenu => {
    this.rotateMore(showMenu)
    // this.changeShadow(showMenu)
    this.changeElevation(showMenu)
    this.changeColor(showMenu)
    this.changeImageX(showMenu)
  }

  rotateMore = show => {
    Animated.timing(this.rotate, {
      toValue: show ? 1 : 0,
      duration: Const.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
  }

  changeShadow = show => {
    if (Platform.OS === 'ios') {
      let value = show ? 1 : 0
      if (!this.props.mapColumnNavBar) {
        value = 0
      }
      Animated.timing(this.shadowVisible, {
        toValue: value,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }

  changeElevation = show => {
    if (Platform.OS === 'android') {
      let value = show ? 21 : 20
      if (!this.props.mapColumnNavBar) {
        value = 20
      }
      Animated.timing(this.elevation, {
        toValue: value,
        duration: 0,
        useNativeDriver: false,
      }).start()
    }
  }

  changeColor = show => {
    let color = show ? 1 : 0
    let opacity = show ? 0.6 : 1.0
    if (!this.props.mapColumnNavBar) {
      color = 0
      opacity = 1.0
    }
    Animated.timing(this.color, {
      toValue: color,
      duration: 150,
      useNativeDriver: false,
    }).start()
    Animated.timing(this.opacity, {
      toValue: opacity,
      duration: 150,
      useNativeDriver: false,
    }).start()
  }

  changeImageX = show => {
    let value = show ? scaleSize(5) : 0
    if (!this.props.mapColumnNavBar) {
      value = 0
    }
    Animated.timing(this.imageX, {
      toValue: value,
      duration: 150,
      useNativeDriver: false,
    }).start()
  }

  setVisible = visible => {
    this.visible = visible
    let right = this.getRight()
    Animated.timing(this.right, {
      toValue: right,
      duration: 300,
      useNativeDriver: false,
    }).start()
    const menu = this.props.getNavMenuRef()
    if (menu) {
      menu.setVisible(visible)
    }
  }

  onPress = () => {
    const menu = this.props.getNavMenuRef()
    let menuVisible = this.props.navBarDisplay
    let right
    if (menuVisible) {
      right = this.props.mapColumnNavBar
        ? ICON_RIGHT_HIDEMENU
        : ICON_RIGHT_HIDEMENU_R
    } else {
      right = this.props.mapColumnNavBar
        ? ICON_RIGHT_SHOWMENU
        : ICON_RIGHT_SHOWMENU_R
    }
    Animated.timing(this.right, {
      toValue: right,
      duration: 300,
      useNativeDriver: false,
    }).start()
    if (menu) {
      menu.locationChange()
    }
    this.props.setNavBarDisplay(!menuVisible)
    this.changStyle(!menuVisible)
  }

  render() {
    const rotate = this.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    })
    const color = this.color.interpolate({
      inputRange: [0, 1],
      outputRange: ['#FBFBFB', '#EEEEEE'],
    })
    return (
      <Animated.View
        style={{
          position: 'absolute',
          right: this.right,
          bottom: 0,
          backgroundColor: color,
          elevation: this.elevation,
          borderTopLeftRadius: scaleSize(40),
          borderBottomLeftRadius: scaleSize(40),
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOpacity: this.shadowVisible,
          shadowRadius: 2,
          opacity: this.opacity,
        }}
      >
        <TouchableOpacity style={styles.moreImageView} onPress={this.onPress}>
          <Animated.Image
            style={[
              styles.moreImage,
              {
                transform: [{ rotateY: rotate }, { translateX: this.imageX }],
              },
            ]}
            source={require('../../../../assets/public/left_arrow.png')}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}
