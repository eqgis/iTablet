/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import { View, Text, Image, FlatList, PanResponder, Platform } from 'react-native'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import color from '../../../../styles/color'

const FOOTER_HEIGHT = scaleSize(88)
const TOP_DEFAULT = Platform.select({
  android: 0,
  // ios: screen.isIphoneX() ? screen.X_TOP : screen.IOS_TOP,
  // ios: screen.isIphoneX() ? 0 : screen.IOS_TOP,
  ios: 0,
})
export default class RNLegendView extends React.Component {
  props: {
    device: Object,
    language: String,
    legendSettings: Object,
    setMapLegend: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      title: getLanguage(this.props.language).Map_Settings.LEGEND,
      width: 600,
      height: 420,
      topLeft: {
        left: 0,
        top: screen.getHeaderHeight(props.device.orientation),
      },
      topRight: {
        right: 0,
        top: screen.getHeaderHeight(props.device.orientation),
      },
      leftBottom: { left: 0, bottom: FOOTER_HEIGHT },
      rightBottom: { right: 0, bottom: FOOTER_HEIGHT },
      legendSource: '',
      flatListKey: 0,
      imageSize: scaleSize(120),
      fontSize: setSpText(40),
    }
    this.startTime = 0
    this.endTime = 0
    this.INTERVAL = 300

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })

    // 初始化位置
    let legendPosition = this.props.legendSettings[global.Type].position
    this._previousTop = legendPosition?.y > 0
      ? legendPosition.y
      : screen.getHeaderHeight(this.props.device.orientation) + scaleSize(8)
    this._previousLeft = legendPosition?.x > 0 ? legendPosition.x : 0
    const position = this._getAvailablePosition(this._previousLeft, this._previousTop)
    this._previousTop = position.y
    this._previousLeft = position.x
    this._moveViewStyles = {
      style: {
        top: this._previousTop,
        left: this._previousLeft,
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      const position = this._getAvailablePosition(this._moveViewStyles.style.left, this._moveViewStyles.style.top)

      this._moveViewStyles.style.top = position.y
      this._moveViewStyles.style.left = position.x
      this._previousTop = position.y
      this._previousLeft = position.x

      this._updateNativeStyles()
    }
  }

  UNSAFE_componentWillMount() {
    if (this.state.legendSource === '') {
      this.getLegendData()
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    let returnFlag = false
    if (this.props.device.orientation !== nextProps.device.orientation) {
      returnFlag = true
    } else if (
      nextState.legendSource !== this.state.legendSource ||
      JSON.stringify(nextProps.legendSettings[global.Type]) !==
        JSON.stringify(this.props.legendSettings[global.Type]) ||
      (JSON.stringify(this.state) !== JSON.stringify(nextState) &&
        this.state.flatListKey === nextState.flatListKey)
    ) {
      let flatListKey = this.state.flatListKey + 1
      this.setState({
        flatListKey,
      })
      returnFlag = true
    }
    return returnFlag
  }

  componentWillUnmount() {
    SMap.setLegendListener(null)
  }

  /**
   * 获取图例可用位置, 不能超出屏幕
   */
  _getAvailablePosition = (x, y) => {
    if (y < TOP_DEFAULT && this.props.device.orientation.indexOf('PORTRAIT') >= 0) {
      y = TOP_DEFAULT
    } else if (y < 0 && this.props.device.orientation.indexOf('LANDSCAPE') >= 0) {
      y = 0
    } else {
      const maxY = this.props.device.safeHeight - scaleSize(
        (this.state.height *
          this.props.legendSettings[global.Type].heightPercent) /
          100,
      )
      if (y > maxY) {
        y = maxY
      }
    }
    if (x < 0) {
      x = 0
    } else {
      const maxX = this.props.device.safeWidth - scaleSize(
        (this.state.width *
          this.props.legendSettings[global.Type].widthPercent) /
          100,
      )
      if (x > maxX) {
        x = maxX
      }
    }
    return {x, y}
  }

  _handleStartShouldSetPanResponder = () => {
    return true
  }

  _handleMoveShouldSetPanResponder = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) < 1 && Math.abs(gestureState.dx) < 1) {
      return false
    }
    return true
  }

  _handlePanResponderMove = (evt, gestureState) => {
    let y = this._previousTop + gestureState.dy
    let x = this._previousLeft + gestureState.dx

    const position = this._getAvailablePosition(x, y)

    this._moveViewStyles.style.top = position.y
    this._moveViewStyles.style.left = position.x

    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    this._previousTop = this._moveViewStyles.style.top
    this._previousLeft = this._moveViewStyles.style.left

    // console.warn(this._previousTop, this._previousLeft)

    // const position = this._getAvailablePosition(this._previousTop, this._previousLeft)
    // this._previousTop = position.dy
    // this._previousLeft = position.dx

    let legendData = this.props.legendSettings
    legendData[global.Type].position = {
      x: this._moveViewStyles.style.left,
      y: this._moveViewStyles.style.top,
    }
    this.props.setMapLegend(legendData)
  }

  _updateNativeStyles = () => {
    this.moveView && this.moveView.setNativeProps(this._moveViewStyles)
  }

  /**
   * 获取图例数据方法
   * @returns {Promise<void>}
   */
  getLegendData = async () => {
    SMap.setLegendListener({
      legendContentChange: this._contentChange,
    })
  }

  /**
   * 图例内容改变回调
   * @param legendSource
   * @private
   */
  _contentChange = legendSource => {
    this.endTime = +new Date()
    if (this.endTime - this.startTime > this.INTERVAL) {
      legendSource.sort(this.sortMethod('type'))
      this.setState(
        {
          legendSource,
        },
        () => {
          this.startTime = this.endTime
        },
      )
    }
  }
  /**
   * 排序 按照对象属性值
   * @param type
   * @returns {function(*, *): number}
   */
  sortMethod = type => (a, b) => {
    let value1 = a[type]
    let value2 = b[type]
    return value1 - value2
  }

  /**
   * 渲染FlatList里面的图例项
   * @param item
   * @returns {*}
   */
  renderLegendItem = ({ item }) => {
    let title = item.title
    title = title.replace(/\s<=?\sX\s<\s/, '~').split('~')
    //处理分段专题图 自定义
    if (item.type === 3) {
      //保留2位小数
      title = title.map(item =>
        isNaN(item) ? item : parseFloat(item).toFixed(2),
      )
      if (title[0]?.indexOf('-3') === 0 && title[0].length > 12) {
        title[0] = 'min'
      } else if (title[1]?.indexOf('3') === 0 && title[1].length > 12) {
        title[1] = 'max'
      }
      //新建分段专题图caption信息错误 需要反转
      if (title[0] && title[1] && title[0] - title[1] > 0) {
        title = title.reverse()
      }
    }
    title = title.join('~')
    let curImageSize =
      (this.state.imageSize *
        this.props.legendSettings[global.Type].imagePercent) /
      100
    let curFontSize =
      (this.state.fontSize *
        this.props.legendSettings[global.Type].fontPercent) /
      100
    return (
      <View
        pointerEvents={'box-none'}
        style={{
          width:
            (1 / this.props.legendSettings[global.Type].column) * 100 + '%',
          height: scaleSize(80),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        {item.image && (
          <Image
            source={{ uri: `data:image/png;base64,${item.image}` }}
            style={{
              width: curImageSize,
              height: curImageSize / 2,
              resizeMode: 'contain',
            }}
          />
        )}
        {item.color && (
          <View
            style={{
              width: curImageSize,
              height: curImageSize / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: (curImageSize * 3) / 4,
                height: (curImageSize * 9) / 16,
                backgroundColor: item.color,
              }}
            />
          </View>
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{
            flex: 1,
            fontSize: curFontSize,
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            height: curFontSize + scaleSize(4),
          }}
        >
          {title.toLowerCase()}
        </Text>
      </View>
    )
  }

  render() {
    if (this.props.legendSettings[global.Type]) {
      return (
        <View
          ref={ref => this.moveView = ref}
          style={{
            position: 'absolute',
            width: scaleSize(
              (this.state.width *
                this.props.legendSettings[global.Type].widthPercent) /
                100,
            ),
            height: scaleSize(
              (this.state.height *
                this.props.legendSettings[global.Type].heightPercent) /
                100,
            ),
            borderColor: color.separateColorGray4,
            borderRadius: scaleSize(16),
            borderWidth: scaleSize(3),
            paddingHorizontal: scaleSize(5),
            overflow: 'hidden',
            backgroundColor: this.props.legendSettings[global.Type]
              .backgroundColor,
            ...this._moveViewStyles.style,
          }}
        >
          <View
            style={{
              width: '100%',
              height: scaleSize(60),
              backgroundColor: 'transparent',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
            {...this._panResponder.panHandlers}
          >
            <View
              style={{
                height: scaleSize(8),
                width: scaleSize(60),
                borderRadius: scaleSize(4),
                backgroundColor: color.separateColorGray4,
              }}
            />
            <Text
              style={{
                letterSpacing: scaleSize(2),
                fontSize: setSpText(18),
              }}
            >
              {this.state.title}
            </Text>
          </View>
          <FlatList
            style={{
              flex: 1,
            }}
            pointerEvents={'box-none'}
            renderItem={this.renderLegendItem}
            data={this.state.legendSource}
            keyExtractor={(item, index) => item.title + index}
            numColumns={this.props.legendSettings[global.Type].column}
            key={this.state.flatListKey}
          />
        </View>
      )
    }
    return null
  }
}
