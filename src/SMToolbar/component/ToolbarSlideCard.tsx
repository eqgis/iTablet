import React from 'react'
import { Dimensions, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { View } from 'react-native'
import Animated, { EasingNode as Easing } from 'react-native-reanimated'
import { AppStyle, dp } from '../../utils'
import { LANDSCAPE_WIDTH } from './styles'
import { BottomHeight, HeightContext } from './ToolBarBottom'

interface Props {
  visible: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
}

interface State {
  childrenVisible: boolean
}

class ToolbarSlideCard extends React.Component<Props, State> {

  height = Math.max(Dimensions.get('window').height, Dimensions.get('window').width)

  bottom = new Animated.Value(-2000)

  toolbarBottomHeight = -1

  constructor(props: Props) {
    super(props)

    this.state = {
      childrenVisible: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible) {
      this.onShow(this.props.visible)
    }
  }

  onShow = (visible: boolean) => {
    let bottom = 0
    if(this.toolbarBottomHeight > 0) {
      bottom = this.toolbarBottomHeight
    }
    Animated.timing(this.bottom, {
      toValue: visible ? bottom : -2000,
      duration: 300,
      easing: visible ?  Easing.bezier(0.28, 0, 0.63, 1) : Easing.cubic
    }).start()
    if(visible) {
      this.setState({childrenVisible: true})
    } else {
      setTimeout(() => {
        this.setState({childrenVisible: this.props.visible})
      }, 1000)
    }
  }

  render() {
    return (
      <HeightContext.Consumer>
        {value => {
          this.toolbarBottomHeight = value.height
          const isPortrait = value.isPortrait
          return (
            <Animated.View
              style={[
                isPortrait ? {
                  bottom: this.bottom,
                  ...styles.Container,
                } : {
                  right: this.bottom,
                  ...styles.ContainerL,
                },
                {
                  flex: 1,
                  position: 'absolute',
                  backgroundColor: AppStyle.Color.Toolbar_Bottom,
                  // elevation: 3,
                }
              ]
              }
            >
              {this.state.childrenVisible && (
                <View
                  style={[
                    isPortrait ? {
                      maxHeight: this.height * 0.6
                    } : {
                      width: LANDSCAPE_WIDTH,
                      height: '100%',
                    },
                    this.props.contentContainerStyle
                  ]}
                >
                  {this.props.children}
                </View>
              )}
              <View
                style={[
                  isPortrait ? {
                    bottom: -BottomHeight,
                    width: '100%',
                    height: BottomHeight + 1,
                  } : {
                    right: -BottomHeight,
                    width: BottomHeight + 1,
                    height: '100%',
                  },
                  {
                    position: 'absolute',
                    backgroundColor: AppStyle.Color.Toolbar_Bottom
                  }
                ]} />
            </Animated.View>
          )
        }}
      </HeightContext.Consumer>
    )
  }
}

export default ToolbarSlideCard

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    borderTopLeftRadius: dp(20),
    borderTopRightRadius: dp(20),
  },
  ContainerL: {
    height: '100%',
    borderTopLeftRadius: dp(20),
    borderBottomLeftRadius: dp(20),
  },
})