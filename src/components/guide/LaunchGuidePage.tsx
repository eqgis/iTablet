import React, { PureComponent } from 'react'
import { View, PanResponder, PanResponderInstance, Text, Image } from 'react-native'
import Swiper from 'react-native-swiper' // eslint-disable-line
import Orientation from 'react-native-orientation'
import styles from './styles'

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
}

interface State {
  visible: boolean,
}

export default class LaunchGuidePage extends PureComponent<Props, State> {

  panResponder: PanResponderInstance

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

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) < 1) {
          return false
        } else {
          return true
        }
      },
      onPanResponderMove: (evt, gestureState) => {},
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -100) {
          this.setVisible(false)
        }
      },
    })

    if (!GLOBAL.isPad) {
      Orientation.lockToPortrait()
    }
  }

  setVisible = (visible: boolean) => {
    let _visible
    if (visible === undefined) {
      _visible = !this.state.visible
    } else if (this.state.visible != visible) {
      _visible = visible
    }
    if (_visible !== undefined) {
      this.setState({
        visible,
      }, () => {
        if (!visible && this.props.dismissCallback) {
          this.props.dismissCallback()
        }
        if (!visible &&!GLOBAL.isPad) {
          Orientation.unlockAllOrientations()
        }
      })
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
              style={styles.image}
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
              style={styles.image}
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
      <View
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
      </View>
    )
  }

}