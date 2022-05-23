import React from 'react'
import { Dimensions, FlatList, Image, ImageSourcePropType, ListRenderItemInfo, ScaledSize, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Animated, { EasingNode as Easing }  from 'react-native-reanimated'
import { AppStyle, dp } from '../../utils'

export interface ToolbarSlideHeaderOption {
  data: SlideHeaderData[]
  visible: boolean
  selectIndex: number
  onShowAll?: (isShowAll: boolean) => void
  rightView?: JSX.Element
}

export interface SlideHeaderData {
  title: string
  image: ImageSourcePropType
  onPress: () => void
}

interface Props {
  toolbarVisible: boolean
  option: ToolbarSlideHeaderOption
  windowSize: ScaledSize
}

interface State {
  currnentData: SlideHeaderData[]
  currentIndex: number
  showAll: boolean
}

const LEFT_GAP = dp(10)
const ITEM_WIDTH = dp(45)
const MAX_ITEM_WIDTH = Dimensions.get('screen').width / 2
const MAX_LIST_WIDTH = Dimensions.get('screen').width - dp(30)

class ToolbarSlideHeader extends React.Component<Props, State> {
  top = new Animated.Value(-dp(80))
  left = new Animated.Value(LEFT_GAP)
  width = new Animated.Value(0)
  borderRadius = new Animated.Value(BORDERRADIUS)

  constructor(props: Props) {
    super(props)

    this.state = {
      currnentData: this.props.option.data,
      currentIndex: this.props.option.selectIndex,
      showAll: true,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.toolbarVisible !== this.props.toolbarVisible ||
      JSON.stringify(prevProps.option.data) !== JSON.stringify(this.props.option.data)) {
      if(this.isVisible()) {
        this.onShow()
      } else {
        this.onHide()
      }
    }
    if(this.isVisible() && (prevProps.windowSize.height !== this.props.windowSize.height)) {
      this.onRotationChange()
    }
  }

  isVisible = () => {
    return this.props.toolbarVisible && this.props.option.data.length > 0
  }

  _setData = () => {
    this.itemWidth = undefined
    this.setState({
      currnentData: this.props.option.data,
      currentIndex: this.props.option.selectIndex,
      showAll: false,
    })
  }

  _clearData = () => {
    this.itemWidth = undefined
    this.setState({
      currnentData: [],
      currentIndex: 0,
      showAll: false,
    })
  }

  onRotationChange = () => {
    Animated.timing(this.top, {
      toValue: this.isPortrait ? dp(50) : dp(20),
      duration: 100,
      easing: Easing.linear
    }).start()
  }

  onShow = () => {
    this._setData()
    Animated.timing(this.top, {
      toValue: this.isPortrait ? dp(50) : dp(20),
      duration: 300,
      easing: Easing.linear
    }).start()
  }

  onHide = () => {
    Animated.timing(this.top, {
      toValue: -dp(80),
      duration: 300,
      easing: Easing.linear
    }).start()
    setTimeout(() => {
      this._clearData()
    }, 400)
  }

  setShowAll = (isShowAll = this.state.showAll) => {
    Animated.timing(this.left, {
      toValue: isShowAll ? dp(10) : 0,
      duration: 200,
      easing: Easing.linear
    }).start()
    if(this.itemWidth) {
      Animated.timing(this.width, {
        toValue: isShowAll ? this.getListWidth(): this.itemWidth,
        duration: 200,
        easing: Easing.linear
      }).start()
    }
    Animated.timing(this.borderRadius, {
      toValue: isShowAll ? BORDERRADIUS: 0,
      duration: 200,
      easing: Easing.linear
    }).start()
    this.props.option.onShowAll?.(isShowAll)
  }

  getListWidth = () => {
    const count = this.state.currnentData.length
    if(count === 0 || this.itemWidth === undefined) return 0
    //选中item当前宽度 + 未选中item固定宽度 + 每个item的margin
    const result =  this.itemWidth + ITEM_WIDTH * (count - 1) + count * dp(4)
    return result > MAX_LIST_WIDTH ? MAX_LIST_WIDTH : result
  }

  itemWidth?: number
  renderItem = (info: ListRenderItemInfo<SlideHeaderData>) => {
    const isSelect = info.index === this.state.currentIndex
    const item = info.item
    const isVisible = isSelect || this.state.showAll
    let selectstyle: ViewStyle = {}
    if(isSelect) {
      selectstyle = {
        backgroundColor: AppStyle.Color.Background_Container,
      }
    }
    if(!this.state.showAll) {
      selectstyle.borderBottomLeftRadius = 0
      selectstyle.borderTopLeftRadius = 0
      selectstyle.marginLeft = 0
      selectstyle.marginRight = dp(5)
    }
    return (
      <View
        style={{
          width: isVisible ? undefined : 0,
          overflow: 'hidden',
        }}
        onLayout={event => {
          if(isSelect) {
            let width = event.nativeEvent.layout.width
            if(width > MAX_ITEM_WIDTH) {
              width = MAX_ITEM_WIDTH
            }
            this.itemWidth = width
            //每次选中 item layout完成后再收缩header
            //保证 item 宽度在三种状态有区别以确保会调用onLayout
            this.setShowAll(this.state.showAll)
          }
        }}
      >
        <TouchableOpacity
          style={[styles.item, selectstyle]}
          onPress={() => {
            item.onPress()
            if(!isSelect) {
              this.setState({showAll: !this.state.showAll, currentIndex: info.index})
            } else {
              this.setState({showAll: !this.state.showAll})
            }
          }}
        >
          <Image
            style={{...AppStyle.Image_Style, marginHorizontal: dp(10)}}
            source={item.image}
          />
          {isSelect && (
            <Text style={{...AppStyle.Text_Style_Center, marginRight: dp(20), color: AppStyle.Color.Text_Light}}>
              {item.title}
            </Text>
          )}
        </TouchableOpacity>

      </View>
    )
  }

  renderList = () => {
    return (
      <FlatList
        data={this.state.currnentData}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index + ''}
        extraData={this.state.showAll}
      />
    )
  }

  isPortrait = true
  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row'
        }}
      >
        <Animated.View
          style={[
            styles.typeContainer,
            {
              top: this.top,
              left: this.left,
              width: this.width,
              borderTopLeftRadius: this.borderRadius,
              borderBottomLeftRadius: this.borderRadius,
            },
          ]}
        >
          {this.renderList()}
        </Animated.View>


        <Animated.View
          style={[{
            top: this.top,
            left: this.left,
            marginLeft: dp(10),
          }]}
        >
          {this.props.option.rightView}
        </Animated.View>
      </View>
    )
  }
}

export default ToolbarSlideHeader


const BORDERRADIUS = dp(25)
const styles = StyleSheet.create({
  typeContainer: {
    ...AppStyle.FloatStyle,
    height: dp(50),
    backgroundColor: AppStyle.Color.Background_Page,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDERRADIUS,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    height: dp(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: dp(2),
    borderRadius: 17,
  },
})