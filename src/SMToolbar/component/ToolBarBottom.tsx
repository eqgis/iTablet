import React, { createContext } from 'react'
import { Image, ImageRequireSource, ScaledSize, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Animated, { EasingNode as Easing } from 'react-native-reanimated'
import { AppStyle, dp } from '../../utils'

/** toolbar bottom 按钮参数 */
export interface ToolBarBottomItem {
  image: ImageRequireSource
  text?: string
  onPress: () => void
  /**
   * toolbar 用来识别特定功能的按钮
   * 'back': 点击toobar透明背景会调用此按钮来退出
   * 'menu_toogle': toolbar menu 菜单显隐按钮
   * 'menu_view_toogle': toolbar menu view显隐按钮
   */
  ability?: 'back' | 'menu_toogle' | 'menu_view_toogle'
}

interface Props {
  data: Array<ToolBarBottomItem>
  visible: boolean
  /** 渲染需要和 bottom 连在一起的view */
  renderView?: () => JSX.Element
  nonAnimated?: boolean
  style?: ViewStyle
  windowSize: ScaledSize
}

interface BottomContex {
  height: number
  isPortrait: boolean
}

export const BottomHeight = dp(60)

export const bottomContext: BottomContex = {
  height: BottomHeight,
  isPortrait: true,
}

export const HeightContext = createContext(bottomContext)

class ToolBarBottom extends React.Component<Props> {
  bottom = new Animated.Value(-2000)

  constructor(props: Props) {
    super(props)
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible ||
      prevProps.data.length !== this.props.data.length) {
      this.changePostion()
    }
  }

  changePostion = () => {
    Animated.timing(this.bottom, {
      toValue: this.isVisible() ? 0 : -2000,
      duration: 300,
      easing: this.props.visible ?  Easing.bezier(0.28, 0, 0.63, 1) : Easing.cubic
    }).start()
  }

  isVisible = (): boolean => {
    return this.props.visible && this.props.data.length > 0
  }

  renderItem = (item: ToolBarBottomItem, index: number) => {
    return (
      <TouchableOpacity
        key={index.toString()}
        onPress={item.onPress}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={item.image}
          style={{width: dp(22), height:dp(22)}}
        />
        {item.text && (
          <Text style={AppStyle.h2c}>
            {item.text}
          </Text>)}
      </TouchableOpacity>
    )
  }

  renderItems = () => {
    const items: JSX.Element[] = []
    for(let i = 0; i < this.props.data.length; i++) {
      items.push(this.renderItem(this.props.data[i], i))
    }
    const isSingle = items.length === 1
    return (
      <View
        style={[
          this.isPortrait
            ? styles.ItemsContainer
            : styles.ItemsContainerL,
          {height: '100%'},
          this.props.style,
          isSingle && { justifyContent: 'flex-start' }
        ]}>
        {items}
      </View>
    )
  }

  renderAnimatedBottom = () => {
    return(
      <>
        <HeightContext.Provider
          value={{
            height: this.props.data.length > 0 ? BottomHeight : 0,
            isPortrait: this.isPortrait
          }}
        >
          {this.props.renderView?.()}
        </HeightContext.Provider>

        <Animated.View
          style={[
            {
              position: 'absolute',
              // elevation: 3,
              backgroundColor: AppStyle.Color.Toolbar_Bottom,
            },
            this.isPortrait ? {
              bottom: this.bottom,
              ...styles.bottomViewContainer,
            } : {
              width: BottomHeight,
              right: this.bottom,
              ...styles.bottomViewContainerL
            },
          ]}
        >
          {this.renderItems()}
        </Animated.View>
      </>
    )
  }

  renderNonAnimatedBottom = () => {
    return(
      <View style={styles.bottomViewContainer}>
        {this.props.renderView?.()}
        {this.renderItems()}
      </View>
    )
  }

  isPortrait = true

  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    if(this.props.nonAnimated === true) {
      return this.renderNonAnimatedBottom()
    } else {
      return this.renderAnimatedBottom()
    }
  }
}

export default ToolBarBottom

const styles = StyleSheet.create({
  bottomViewContainer: {
    width: '100%',
    borderTopLeftRadius: dp(20),
    borderTopRightRadius: dp(20),
    height: BottomHeight,
  },
  bottomViewContainerL: {
    height: '100%',
    borderTopLeftRadius: dp(20),
    borderBottomLeftRadius: dp(20),
  },

  ItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: dp(37),
  },
  ItemsContainerL: {
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    paddingVertical: dp(37),
  },
})