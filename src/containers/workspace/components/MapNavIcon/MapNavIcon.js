import * as React from 'react'
import { Animated, TouchableOpacity, Platform } from 'react-native'
import { Const } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import styles from './styles'

const ICON_RIGHT_INVISIBLE = -scaleSize(80)
const ICON_RIGHT_SHOWMENU = scaleSize(75)
const ICON_RIGHT_HIDEMENU = 0

const MENU_RIGHT_INVISIBLE = -(scaleSize(80) + scaleSize(96))
const MENU_RIGHT_SHOW = 0
const MENU_RIGHT_HIDE = -scaleSize(96)

export default class MapNavIcon extends React.Component {
  props: {
    getNavMenuRef: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    this.right =
      this.props.device.orientation === 'PORTRAIT'
        ? new Animated.Value(ICON_RIGHT_INVISIBLE)
        : new Animated.Value(ICON_RIGHT_HIDEMENU)
    this.rotate = new Animated.Value(0)
    this.shadowVisible = new Animated.Value(0)
    this.color = new Animated.Value(0)
    this.elevation = new Animated.Value(20)
    this.imageX = new Animated.Value(0)
    this.visible = true
    this.menuVisible = false
    this.opacity = new Animated.Value(1.0)
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
  }

  onOrientationChange = () => {
    if (this.props.device.orientation === 'PORTRAIT') {
      Animated.timing(this.right, {
        toValue: ICON_RIGHT_INVISIBLE,
        duration: 0,
      }).start()
    } else {
      if (this.visible) {
        Animated.timing(this.right, {
          toValue: ICON_RIGHT_HIDEMENU,
          duration: 0,
        }).start()
      } else {
        Animated.timing(this.right, {
          toValue: ICON_RIGHT_INVISIBLE,
          duration: 0,
        }).start()
      }
    }
    this.changStyle(false)
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
    }).start()
  }

  changeShadow = show => {
    if (Platform.OS === 'ios') {
      Animated.timing(this.shadowVisible, {
        toValue: show ? 1 : 0,
        duration: 300,
      }).start()
    }
  }

  changeElevation = show => {
    if (Platform.OS === 'android') {
      Animated.timing(this.elevation, {
        toValue: show ? 21 : 20,
        duration: 0,
      }).start()
    }
  }

  changeColor = show => {
    Animated.timing(this.color, {
      toValue: show ? 1 : 0,
      duration: 150,
    }).start()
    Animated.timing(this.opacity, {
      toValue: show ? 0.6 : 1.0,
      duration: 150,
    }).start()
  }

  changeImageX = show => {
    Animated.timing(this.imageX, {
      toValue: show ? scaleSize(5) : 0,
      duration: 150,
    }).start()
  }

  setVisible = visible => {
    let right = visible ? ICON_RIGHT_HIDEMENU : ICON_RIGHT_INVISIBLE
    if (this.props.device.orientation === 'PORTRAIT') {
      right = ICON_RIGHT_INVISIBLE
    }
    Animated.timing(this.right, {
      toValue: right,
      duration: 300,
    }).start()
    this.visible = visible
    const menu = this.props.getNavMenuRef()
    if (menu) {
      let menuRight = visible ? MENU_RIGHT_HIDE : MENU_RIGHT_INVISIBLE
      menu.setLocation(menuRight)
    }
    this.changStyle(false)
  }

  onPress = () => {
    const menu = this.props.getNavMenuRef()
    let menuVisible = menu ? menu.visible : false
    let right = menuVisible ? ICON_RIGHT_HIDEMENU : ICON_RIGHT_SHOWMENU
    Animated.timing(this.right, {
      toValue: right,
      duration: 300,
    }).start()
    if (menu) {
      let menuRight = menuVisible ? MENU_RIGHT_HIDE : MENU_RIGHT_SHOW
      menu.setLocation(menuRight)
    }
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
          opacity:this.opacity,
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
