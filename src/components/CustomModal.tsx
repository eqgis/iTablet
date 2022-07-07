import React from 'react'
import { BackHandler, Pressable, StyleSheet, View } from 'react-native'
import { Animated, Easing } from 'react-native'
import { RootSiblingPortal } from 'react-native-root-siblings'
import { AppStyle } from '../utils'

interface Props extends Partial<DefaultProps> {
  visible: boolean
  animationType?: AnimationType
  onBackPress?(): void
}

interface DefaultProps {
  transparent: boolean
}

const defaultProps: DefaultProps = {
  transparent: false
}

interface State {
  childrenVisible: boolean
}

type AnimationType = 'none' | 'slide'

class CustomModal extends React.Component<Props & DefaultProps, State> {

  static defaultProps = defaultProps

  bottom = new Animated.Value(-2000)

  backgroundOpacity = new Animated.Value(0)

  backgroundHeight = new Animated.Value(0)

  constructor(props: Props & DefaultProps) {
    super(props)

    this.state = {
      childrenVisible: this.props.visible
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible) {
      this.onShow(this.props.visible)
      this.showBackground(this.props.visible)
      this.handleBackListener(this.props.visible)
    }
  }

  //处理物理返回
  handleBackListener = (visible: boolean) => {
    if(visible) {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    } else {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  //显示时拦截物理返回事件
  onBackPress = (): boolean => {
    if(this.props.onBackPress) {
      this.props.onBackPress()
    }
    return true
  }

  backgroundPressed = false
  onPressBackground = () => {
    if(!this.props.transparent && !this.backgroundPressed) {
      this.backgroundPressed = true
      this.props.onBackPress?.()
      //防止重复点击
      setTimeout(() => {
        this.backgroundPressed = false
      }, 1000)
    }
  }

  onShow = (visible: boolean) => {
    Animated.timing(this.bottom, {
      toValue: visible ? 0 : -2000,
      duration: 300,
      easing: visible ?  Easing.bezier(0.28, 0, 0.63, 1) : Easing.cubic,
      useNativeDriver: false
    }).start()
    if(visible) {
      this.setState({childrenVisible: true})
    } else {
      setTimeout(() => {
        this.setState({childrenVisible: this.props.visible})
      }, 1000)
    }
  }

  showBackground = (visible: boolean) => {
    Animated.timing(this.backgroundHeight, {
      toValue: visible ? 100 : 0,
      duration: 1,
      easing: Easing.linear,
      useNativeDriver: false
    }).start()
    if(!visible) {
      Animated.timing(this.backgroundOpacity, {
        toValue: visible ? 0.6 : 0,
        duration: 1,
        easing: Easing.linear,
        useNativeDriver: false
      }).start()
    } else {
      setTimeout(() => {
        Animated.timing(this.backgroundOpacity, {
          toValue: visible ? 0.6 : 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start()
      }, 300)
    }
  }

  renderBackground = () => {
    const height = this.backgroundHeight.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    })
    return (
      <Animated.View
        style={[{
          position: 'absolute',
          width: '100%',
          backgroundColor: this.props.transparent ? 'transparent' : AppStyle.Color.GRAY,
          opacity: this.props.animationType === 'slide' ? this.backgroundOpacity: 0.6,
          height: this.props.animationType === 'slide' ? height : '100%'
        }]}
      >
        <Pressable
          onPress={this.onPressBackground}
          style={{flex: 1}}
        />
      </Animated.View>
    )
  }

  renderNoneAnimation = () => {
    if(!this.props.visible) return null
    return(
      <RootSiblingPortal>
        <View style={StyleSheet.absoluteFill}>
          {this.renderBackground()}
          {this.props.children}
        </View>
      </RootSiblingPortal>
    )
  }

  renderSlideAnimation = () => {
    return(
      <RootSiblingPortal>
        <>
          {this.renderBackground()}
          <Animated.View style={[styles.bottomSheet, {bottom: this.bottom}]}>
            {this.state.childrenVisible && this.props.children}
          </Animated.View>
        </>
      </RootSiblingPortal>
    )
  }

  render() {
    if(this.props.animationType === 'slide') {
      return this.renderSlideAnimation()
    } else {
      return this.renderNoneAnimation()
    }
  }
}

export default CustomModal

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    width: '100%',
  },
})