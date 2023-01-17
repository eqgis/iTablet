import * as React from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableHighlight,
  Animated,
} from 'react-native'

import { scaleSize, screen, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
import { SMap, SNavigation } from 'imobile_for_reactnative'
import { Const } from '../../../../constants'

const DEFAULT_BOTTOM = scaleSize(135)
const DEFAULT_BOTTOM_LOW = scaleSize(45)
const DEFAULT_LEFT = scaleSize(34)
export default class RNFloorListView extends React.Component {
  props: {
    device: Object,
    mapLoaded: Boolean,
    currentFloorID: String,
    changeFloorID: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      column: props.device.orientation.indexOf('LANDSCAPE') === 0 ? 8 : 4,
      data: [],
      height:
        props.device.orientation.indexOf('LANDSCAPE') === 0
          ? global.isPad
            ? scaleSize(360)
            : scaleSize(240)
          : scaleSize(360),
      left: new Animated.Value(DEFAULT_LEFT),
      bottom:
        props.device.orientation.indexOf('LANDSCAPE') === 0
          ? new Animated.Value(DEFAULT_BOTTOM_LOW)
          : new Animated.Value(DEFAULT_BOTTOM),
      currentFloorID: props.currentFloorID,
      isGuiding: false,
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentFloorID !== prevState.currentFloorID) {
      return {
        currentFloorID: nextProps.currentFloorID,
      }
    }
    return null
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      let height, bottom
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        height = global.isPad ? scaleSize(360) : scaleSize(240)
        bottom = this.isSimilar(prevState.bottom._value, DEFAULT_BOTTOM)
          ? DEFAULT_BOTTOM_LOW
          : prevState.bottom._value
      } else {
        height = scaleSize(360)
        bottom = this.isSimilar(prevState.bottom._value, DEFAULT_BOTTOM_LOW)
          ? DEFAULT_BOTTOM
          : prevState.bottom._value
      }
      this.setState(
        {
          height,
        },
        () => {
          Animated.timing(this.state.bottom, {
            toValue: bottom,
            duration: Const.ANIMATED_DURATION,
            useNativeDriver: false,
          }).start()
          if (height < prevState.height) {
            this.list &&
              this.list.scrollToIndex({
                viewPosition: 0.5,
                index: this.curIndex,
              })
          }
        },
      )
    } else if (
      this.props.mapLoaded &&
      this.props.mapLoaded !== prevProps.mapLoaded
    ) {
      let datas = await SNavigation.getFloorData()
      if (datas.data && datas.data.length > 0) {
        let { data, datasource, currentFloorID } = datas
        data = data.sort(this.sortID)
        this.setState({
          data,
          datasource,
          currentFloorID,
        })
      }
    }
  }

  sortID = (a, b) => {
    try {
      return b.id - a.id
    } catch (e) {
      return 0
    }
  }

  /**
   * 设置导航状态
   * @param isGuiding
   */
  setGuiding = isGuiding => {
    if (isGuiding !== this.state.isGuiding) {
      this.setState({
        isGuiding,
      })
    }
  }
  /**
   * 判断两数相等 兼容scaleSize转换后animate得到的值不精确
   * @param num1
   * @param num2
   * @returns {boolean}
   */
  isSimilar = (num1, num2) => {
    return Math.abs(num1 - num2) < 0.001
  }

  setVisible = (visible, immediately = false) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: DEFAULT_LEFT,
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    }
  }

  /**
   * 组件是否靠右显示
   * @param bool
   */
  floatToRight = bool => {
    let needAnim = false
    let left
    if (this.isSimilar(this.state.left._value, DEFAULT_LEFT) && bool) {
      left =
        screen.getScreenWidth(this.props.device.orientation) - scaleSize(94)
      needAnim = true
    } else if (!this.isSimilar(this.state.left._value, DEFAULT_LEFT) && !bool) {
      left = DEFAULT_LEFT
      needAnim = true
    }
    needAnim &&
      Animated.timing(this.state.left, {
        toValue: left,
        duration: Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
  }
  /**
   * 改变bottom位置 导航路径界面使用
   * @param isBottom
   */
  changeBottom = isBottom => {
    let value = isBottom
      ? scaleSize(240)
      : this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? DEFAULT_BOTTOM_LOW
        : DEFAULT_BOTTOM
    Animated.timing(this.state.bottom, {
      toValue: value,
      duration: Const.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
  }

  _onFloorPress = async item => {
    //change floor
    await SNavigation.setCurrentFloorID(item.id)
    this.props.changeFloorID && this.props.changeFloorID(item.id)
  }

  _renderItem = ({ item, index }) => {
    let textStyle = {}
    let backgroundStyle = {}

    if (item.id === this.state.currentFloorID) {
      this.curIndex = index
      textStyle = {
        color: color.white,
      }
      backgroundStyle = {
        backgroundColor: color.item_selected_bg,
      }
    }

    return (
      <TouchableHighlight
        underlayColor={color.UNDERLAYCOLOR}
        style={[styles.item, backgroundStyle]}
        onPress={() => {
          this._onFloorPress(item)
        }}
      >
        <Text style={[styles.floorID, textStyle]}>{item.name}</Text>
      </TouchableHighlight>
    )
  }

  render() {
    if (
      this.state.data.length === 0 ||
      !this.state.currentFloorID ||
      (!global.isPad &&
        this.props.device.orientation.indexOf('LANDSCAPE') === 0 &&
        this.state.isGuiding)
    )
      return null
    let floorListStyle = {
      maxHeight: this.state.height,
      left: this.state.left,
      bottom: this.state.bottom,
    }
    return (
      <Animated.View style={[styles.floorListView, floorListStyle]}>
        <FlatList
          ref={ref => {
            this.list = ref
          }}
          style={styles.floorList}
          keyExtractor={(item, index) => item.toString + index}
          data={this.state.data}
          renderItem={this._renderItem}
          showsVerticalScrollIndicator={false}
          getItemLayout={(param, index) => ({
            length: scaleSize(60),
            offset: scaleSize(60) * index,
            index,
          })}
        />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  floorListView: {
    position: 'absolute',
    width: scaleSize(60),
    backgroundColor: color.white,
    borderRadius: scaleSize(4),
    borderWidth: 1,
    borderColor: 'rgba(48,48,48,0.2)',
  },
  floorList: {
    flex: 1,
  },
  item: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorID: {
    fontSize: setSpText(16),
  },
})
