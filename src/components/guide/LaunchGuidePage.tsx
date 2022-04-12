import React, { PureComponent } from 'react'
import { View, PanResponder, PanResponderInstance, Text, Image, Animated, Easing, NativeModules, Platform } from 'react-native'
import Swiper from 'react-native-swiper' // eslint-disable-line
import Orientation from 'react-native-orientation'
import styles from './styles'
let AppUtils = NativeModules.AppUtils
export interface GuideDataType {
  title: string,
  subTitle: string,
  image: any,
}

interface Props {
  // device: any,
  data: Array<GuideDataType>,
  defaultIndex?: number,
  defaultVisible?: boolean,
  getCustomGuide?: () => Array<React.ReactNode>,
  dismissCallback?: () => void,
  language: string,
  device: any,
}

interface State {
  visible: boolean,
}

export default class LaunchGuidePage extends PureComponent<Props, State> {

  panResponder: PanResponderInstance
  fadeOutOpacity: Animated.AnimatedValue
  fadeOutAnimated: Animated.CompositeAnimation
  isAnimated: boolean

  static defaultProps = {
    data: [],
    defaultIndex: 0,
    defaultVisible: false,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      visible: this.props.defaultVisible || false,
    }

    this.isAnimated = false

    this.fadeOutOpacity = new Animated.Value(1)

    this.fadeOutAnimated = Animated.timing(
      this.fadeOutOpacity,
      {
        toValue: 0,  //透明度动画最终值
        duration: 100,   //动画时长3000毫秒
        easing: Easing.linear,
        useNativeDriver: true,
      },
    )

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) < 1) {
          return false
        } else {
          return true
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -60) {
          this.state.visible && this.setVisible(false)
        }
      },
      onPanResponderEnd: (evt, gestureState) => {},
      onPanResponderRelease: (evt, gestureState) => {},
    })
    if (Platform.OS === 'ios') {
      if (!Platform.isPad) {
        Orientation.lockToPortrait()
      } else {
        Orientation.unlockAllOrientations()
      }
    } else {
      AppUtils.isPad().then((result: boolean) => {
        if (!result) {
          Orientation.lockToPortrait()
        } else {
          Orientation.unlockAllOrientations()
        }
      })
    }
  }

  setVisible = (visible: boolean) => {
    if (this.isAnimated) return
    this.isAnimated = true
    let _visible
    if (visible === undefined) {
      _visible = !this.state.visible
    } else if (this.state.visible != visible) {
      _visible = visible
    }
    if (_visible !== undefined) {
      this.fadeOutAnimated.start(() => {
        this.isAnimated = false
        if (!visible && this.props.dismissCallback) {
          this.props.dismissCallback()
        }
        if (!visible &&!global.isPad) {
          Orientation.unlockAllOrientations()
        }
      })
      this.isAnimated = false
    } else {
      this.isAnimated = false
    }
  }

  getGuidePage = (): Array<React.ReactNode> => {
    let pages: Array<React.ReactNode> = []
    if (this.props.getCustomGuide) {
      let customPages = this.props.getCustomGuide() || []
      if (customPages.length > 0) {
        customPages.forEach((item, index) => {
          if (index === this.props.data.length - 1) {
            pages.push(
              <View
                style={{flex: 1}}
                {...this.panResponder.panHandlers}
              >
                {item}
              </View>
            )
          } else {
            pages.push(item)
          }
        })
        return pages
      }
    }
    this.props.data.forEach((item: GuideDataType, index: number) => {
      if (index === this.props.data.length - 1) {
        pages.push(
          <View
            key={index}
            style={styles.pageContainer}
            {...this.panResponder.panHandlers}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subTitle}>{item.subTitle}</Text>
            <Image
              source={item.image}
              resizeMode={'contain'}
              style={[this.props.device.orientation.indexOf('PORTRAIT') >= 0 ? styles.imageP : styles.imageL]}
            />
          </View>
        )
      } else {
        pages.push(
          <View key={index} style={styles.pageContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subTitle}>{item.subTitle}</Text>
            <Image
              source={item.image}
              resizeMode={'contain'}
              style={[this.props.device.orientation.indexOf('PORTRAIT') >= 0 ? styles.imageP : styles.imageL]}
            />
          </View>
        )
      }
    })
    return pages
  }

  getData = () => {
    let _data: (React.Component<{}, {}, any> | JSX.Element)[] = []
    this.props.data.forEach((item, index) => {
      if (index === this.props.data.length - 1) {
        _data.push(
          <View
            style={{flex: 1}}
            {...this.panResponder.panHandlers}
          >
            {item}
          </View>
        )
      } else {
        _data.push(item)
      }
    })
    return _data
  }

  render() {
    if (!this.state.visible) {
      return null
    }
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <Swiper
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          index={this.props.defaultIndex}
          loop={false}
        >
          {this.getGuidePage()}
        </Swiper>
      </Animated.View>
    )
  }

}