import React from 'react'
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  Image,
  PanResponder,
  PanResponderInstance,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
} from 'react-native'
import { getImage } from '../assets'
import { AppStyle, dp } from '../utils'

const ITEM_HEIGHT = dp(50)
const ARROW_HEIGHT = dp(10)
const VIEW_WIDTH = dp(200)

interface Props extends Partial<typeof defaultProps>{
  data: Item[] //TODO
  /** 当前选中的key */
  selectKey?: string
  /** 选中item的回调 */
  onSelect?: (item: Item) => void
}

interface State {
  data: Item[] //TODO
  currentIndex: number
}

const defaultProps = {
  /** 可见范围item的数量 */
  viewableItems: 3,
  /** 松手自动选择 */
  autoSelect: false,
}

export interface Item {
  key: string
  selectKey: string
  action: (item: Item) => void
}

const BOTTOM_HEIGHT = dp(80)

const MenuDialog = class MenuDialog extends React.PureComponent<Props & typeof defaultProps, State> {

  static defaultProps = defaultProps

  lastIndex: number

  selectedViewTop: number

  moveViewHeight: number

  _previousTop: number

  _panResponder: PanResponderInstance

  moveViewBg: View | null |undefined

  moveView: View | null | undefined

  _moveViewBgStyles: {
    style: ViewStyle
  }

  _moveViewStyles: {
    style: ViewStyle
  }

  offset: number

  constructor(props: Props & typeof defaultProps) {
    super(props)
    this.lastIndex = this.getIndexByKey(props.data, props.selectKey)
    this.state = {
      currentIndex: this.lastIndex,
      data: props.data,
    }

    this.selectedViewTop =
      (Dimensions.get('screen').height - BOTTOM_HEIGHT - ITEM_HEIGHT) / 2
    this.moveViewHeight =
      ITEM_HEIGHT * this.state.data.length + ARROW_HEIGHT * 2

    this._previousTop =
      this.selectedViewTop -
      (this.state.currentIndex * ITEM_HEIGHT + ARROW_HEIGHT)
    this._moveViewBgStyles = {
      style: {
        top: this._previousTop,
        width: VIEW_WIDTH,
      },
    }
    this._moveViewStyles = {
      style: {
        top: this._previousTop,
        width: VIEW_WIDTH,
      },
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })

    this.offset = this.state.currentIndex * ITEM_HEIGHT
  }

  componentDidUpdate(prevProps: Props & typeof defaultProps) {
    if (
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
    ) {
      this.setState({ data: this.props.data.concat() || [] })
    }
    if (this.props.selectKey !== prevProps.selectKey) {
      const index = this.getIndexByKey(this.props.data, this.props.selectKey)
      this.moveToIndex(index)
    }
  }

  componentDidMount() {
    const curIndex = this.getIndexByKey(this.state.data, this.props.selectKey)
    this.moveToIndex(curIndex)

    if (this.state.data.length > curIndex) {
      this.lastIndex = curIndex
      this.onSelect(this.state.data[curIndex])
    }
  }

  moveToIndex = (index: number) => {
    let curIndex

    if (index === undefined) {
      curIndex = this.state.currentIndex
    } else if (index < 0) {
      curIndex = 0
    } else if (index > this.state.data.length - 1) {
      curIndex = this.state.data.length - 1
    } else {
      curIndex = index
    }
    this.selectedViewTop =
      (Dimensions.get('screen').height - BOTTOM_HEIGHT - ITEM_HEIGHT) / 2
    this.moveViewHeight =
      ITEM_HEIGHT * this.state.data.length + ARROW_HEIGHT * 2

    this._previousTop =
      this.selectedViewTop - (curIndex * ITEM_HEIGHT + ARROW_HEIGHT)

    this._moveViewBgStyles.style.top = this._previousTop
    this._moveViewStyles.style.top = this._moveViewBgStyles.style.top

    this.setState({
      currentIndex: curIndex,
    })

    this._updateNativeStyles()
  }

  getIndexByKey = (data: Item[], key?: string) => {
    if (!key) return 0
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].selectKey === key) {
          return i
        }
      }
    }
    return 1
  }

  _handleStartShouldSetPanResponder = () => {
    return true
  }

  _handleMoveShouldSetPanResponder = (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    if (Math.abs(gestureState.dy) < 1) {
      return false
    } else {
      return true
    }
  }

  _handlePanResponderMove = (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    this.handleMove(evt, gestureState)
  }

  handleMove = (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    let y = this._previousTop + gestureState.dy
    if (y > this.selectedViewTop - ARROW_HEIGHT) {
      // 向下滑动
      y = this.selectedViewTop - ARROW_HEIGHT
    } else if (
      y <
      this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    ) {
      // 向上滑动
      y =
        this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    }

    this._moveViewBgStyles.style.top = y
    this._moveViewStyles.style.top = this._moveViewBgStyles.style.top

    const currentIndex = Math.ceil((this.selectedViewTop - y - ARROW_HEIGHT) / ITEM_HEIGHT)
    if (this.state.currentIndex !== currentIndex) {
      this.setState({
        currentIndex,
      })
    }

    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    this.handleEnd(evt, gestureState)
  }

  handleEnd = (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    let y = this._previousTop + gestureState.dy

    if (y > this.selectedViewTop - ARROW_HEIGHT) {
      // 向下滑动
      y = this.selectedViewTop - ARROW_HEIGHT
    } else if (
      y <
      this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    ) {
      // 向上滑动
      y =
        this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    }
    this._previousTop = y

    this.moveToIndex(this.state.currentIndex)
    this.lastIndex = this.state.currentIndex

    if (this.props.autoSelect) {
      this.onSelect(this.state.data[this.state.currentIndex])
      this.callCurrentAction()
    }
  }

  scroll = (moveIndex: number) => {
    this.moveToIndex(this.state.currentIndex + moveIndex)
  }

  _updateNativeStyles = () => {
    this.moveViewBg && this.moveViewBg.setNativeProps(this._moveViewBgStyles)
    this.moveView && this.moveView.setNativeProps(this._moveViewStyles)
  }

  callCurrentAction = () => {
    if (this.state.data.length > this.state.currentIndex) {
      const item = this.state.data[this.state.currentIndex]
      item && item.action && item.action(item)
    }
  }

  onSelect = (item: Item) => {
    this.props.onSelect && this.props.onSelect(item)
  }

  itemAction = ({ item, index }: {item: Item, index: number}) => {
    if (index !== this.state.currentIndex) {
      this.setState({
        // lastIndex: index, //TODO
        data: this.state.data.concat(),
      })
    }
    this.onSelect(item)
    item.action && item.action(item)
  }

  _renderItem = ({ item, index }: {item: Item, index: number}) => {
    if (item && item.key) {
      return (
        <TouchableHighlight
          key={item.key}
          activeOpacity={0.8}
          underlayColor="#4680DF"
          style={styles.item}
          onPress={() => this.itemAction({ item, index })}
        >
          <Text
            style={
              index === this.state.currentIndex
                ? styles.textHighLight
                : styles.text
            }
          >
            {item.key}
          </Text>
        </TouchableHighlight>
      )
    } else {
      return <View key={index + ''} style={styles.item} />
    }
  }

  renderList = () => {
    const data: JSX.Element[] = []
    this.state.data.forEach((item, index) => {
      data.push(this._renderItem({ item, index }))
    })
    return data
  }

  render() {
    this.selectedViewTop =
      (Dimensions.get('screen').height - BOTTOM_HEIGHT - ITEM_HEIGHT) / 2
    return (
      <View
        style={[
          styles.overlay,
          {
            width: '100%',
            height:'100%',
          },
        ]}
        {...this._panResponder.panHandlers}
      >
        <View style={styles.dialogView}>
          <View
            ref={ref => (this.moveViewBg = ref)}
            style={[
              styles.moveViewBg,
              // { top: this.state.top },
              { height: this.moveViewHeight },
            ]}
          />
          <View
            key={'selected_view'}
            style={[styles.selectedView, { top: this.selectedViewTop }]}
          />
          <View
            ref={ref => (this.moveView = ref)}
            style={[
              styles.moveView,
              {
                // top: this.state.top,
                height: this.moveViewHeight,
              },
              // { height: ITEM_HEIGHT * this.props.viewableItems + ARROW_HEIGHT * 2 },
            ]}
          >
            <TouchableHighlight
              key={'up'}
              onPress={() => this.scroll(-1)}
              style={styles.arrowView}
            >
              <Image
                resizeMode={'contain'}
                style={styles.arrowImg}
                source={getImage().icon_drop_up}
              />
            </TouchableHighlight>

            {this.renderList()}

            <TouchableHighlight
              key={'down'}
              onPress={() => this.scroll(1)}
              style={styles.arrowView}
            >
              <Image
                resizeMode={'contain'}
                style={styles.arrowImg}
                source={getImage().icon_drop_down}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
} as React.ComponentClass<Props>

export default MenuDialog

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: color.transOverlay,
    backgroundColor: 'transparent',
  },
  dialogView: {
    height: "100%",
    width: VIEW_WIDTH,
    flexDirection: 'column',
    // backgroundColor: color.transOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveViewBg: {
    position: 'absolute',
    minHeight: dp(50),
    width: VIEW_WIDTH,
    flexDirection: 'column',
    // transView 会导致安卓(Redmi k30)在全面屏下看不到整个menu，暂时不做透明
    // backgroundColor: color.transView,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  moveView: {
    position: 'absolute',
    minHeight: dp(50),
    width: VIEW_WIDTH,
    flexDirection: 'column',
    // backgroundColor: color.transOverlay,
    // backgroundColor: 'pink'
  },
  text: {
    color: AppStyle.Color.Text_Dark,
    fontSize: dp(12),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  textHighLight: {
    color: AppStyle.Color.WHITE,
    fontWeight: 'bold',
    fontSize: dp(12),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    // backgroundColor: 'transparent',
    minWidth: dp(100),
    width: VIEW_WIDTH,
  },
  selectedView: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    backgroundColor: '#4680DF',
    minWidth: dp(100),
    width: VIEW_WIDTH,
  },
  arrowView: {
    height: ARROW_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImg: {
    height: dp(9),
    width: dp(24),
  },
})
