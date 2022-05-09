/**
 * @author ysl
 *
 * Toolbar顶部横向进度条，全屏可触摸滑动
 *
 * Module中重写getTouchProgressInfo和setTouchProgressInfo来自定义数据和方法
 * getTouchProgressInfo: 获取TouchProgress对应title的数据
 * setTouchProgressInfo: 设置值
 *
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  PanResponder,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { Height } from '../../../../constants'
import { color } from '../../../../styles'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'
const IMAGE_SIZE = scaleSize(25)
const MARGIN = scaleSize(30)
const TIP_SPACE = '   '

export default class TouchProgress extends Component {
  props: {
    language: string,
    currentLayer: Object,
    device: Object,
    selectName: any, // 智能配图 selectName 为Array；其余为String
    value: '',
    mapLegend?: Object,
    setMapLegend?: () => {},
    showMenu: () => {},
  }

  constructor(props) {
    super(props)
    this.screenWidth = this.getWidthByOrientation()
    this._previousLeft = MARGIN - IMAGE_SIZE / 2
    this._panBtnStyles = {
      style: {
        left: this._previousLeft,
      },
    }
    this._linewidth = 0
    this.INTERVAL = 100
    this._BackLine = {
      style: {
        width: this._linewidth,
      },
    }
    this.tempText = ''
    this.state = {
      tips: '',
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
    this.range = [0, 100]                      // 进度条范围默认值
    this.step = 1                              // 进度条步长默认值
    this.title = this.props.selectName || ''   // 标题
    this.unit = ''                             // 单位
  }

  componentDidUpdate() {
    if (this.screenWidth !== this.getWidthByOrientation()) {
      this._initialization()
      this.screenWidth = this.getWidthByOrientation()
    }
  }

  componentDidMount() {
    this._initialization(this.props.value)
  }

  getWidthByOrientation = () => {
    let width = this.props.device.safeWidth
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width -= Height.TOOLBAR_BUTTONS
    }
    return width
  }

  getHeightByOrientation = () => {
    let height = this.props.device.safeHeight
    if (this.props.device.orientation.indexOf('LANDSCAPE') < 0) {
      height -= height.TOOLBAR_BUTTONS
    }
    return height
  }

  _updateNativeStyles = () => {
    this.panBtn && this.panBtn.setNativeProps(this._panBtnStyles)
  }

  _updateBackLine = () => {
    this.backLine && this.backLine.setNativeProps(this._BackLine)
  }

  /**
   * 更新进度条
   * @param value
   * @private
   */
  _updateProgress = value => {
    if (isNaN(value)) return
    let panBtnDevLeft = MARGIN - IMAGE_SIZE / 2 // 图片相对左边偏差

    let distance = this.valueToDistance(value)

    this._panBtnStyles.style.left = distance + panBtnDevLeft
    this._previousLeft = distance
    this._BackLine.style.width = distance

    this._updateNativeStyles()
    this._updateBackLine()
  }

  /**
   * 初始化时去对应Toolbar的module找getTouchProgressInfo这个方法 获取信息
   * @param value
   * @returns {Promise.<void>}
   * @private
   */
  _initialization = async value => {
    const _data = ToolbarModule.getData()

    let tips = ''
    if (_data.actions && _data.actions.getTouchProgressInfo) {
      let data = await _data.actions.getTouchProgressInfo(this.title)
      let _tipsValue = value !== undefined ? value : data.value
      this.range = data.range
      this.step = data.step
      this.title = data.title
      this.unit = data.unit
      if (data.tips !== undefined && data.tips !== '') {
        _tipsValue = data.tips
      }

      this._updateTips(_tipsValue)
      this._updateProgress(_tipsValue)
    } else {
      if (tips !== this.state.tips) {
        this.tempText = value ? ~~value : ''
        this.setState({
          tips,
        })
        this._updateProgress(this.tempText)
      }
    }
  }

  _handleStartShouldSetPanResponder = () => {
    // evt, gestureState
    return true
  }

  _handleMoveShouldSetPanResponder = (evt, gestureState) => {
    // 解决PanResponder中的onPress无作用
    // 当大于5时才进入移动事件，有的情况下需要将onStartShouldSetPanResponderCapture设为false
    if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
      return true
    } else if (Math.abs(gestureState.dx) === 0 || Math.abs(gestureState.dy) === 0) {
      return false
    }
  }

  _handlePanResponderMove = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
      if (Math.abs(gestureState.dy) > 20) {
        this.showMenu()
      }
    } else {
      let progressWidth = this.getWidthByOrientation() - MARGIN * 2
      let x = this._previousLeft + gestureState.dx
      this._panBtnStyles.style.left = x + MARGIN - IMAGE_SIZE / 2
      if (this._panBtnStyles.style.left <= -IMAGE_SIZE / 2)
        this._panBtnStyles.style.left = MARGIN - IMAGE_SIZE / 2
      if (
        this._panBtnStyles.style.left >=
        progressWidth + MARGIN - IMAGE_SIZE / 2
      )
        this._panBtnStyles.style.left = progressWidth + MARGIN - IMAGE_SIZE / 2

      this._BackLine.style.width = x
      if (this._BackLine.style.width <= 0) this._BackLine.style.width = 0
      if (this._BackLine.style.width >= progressWidth)
        this._BackLine.style.width = progressWidth
      this._updateNativeStyles()
      this._updateBackLine()

      let _value = x / progressWidth
      let value = this.distanceToValue(_value > 1 ? 1 : _value < 0 ? 0 : _value)
      value !== undefined && this._updateTips(value)
    }
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let progressWidth = this.getWidthByOrientation() - MARGIN * 2
    let x = this._previousLeft + gestureState.dx
    if (x <= 0) x = 0
    if (x >= progressWidth + MARGIN - IMAGE_SIZE / 2)
      x = progressWidth + MARGIN - IMAGE_SIZE / 2
    this._previousLeft = x

    let _value = x / progressWidth
    let value = this.distanceToValue(_value > 1 ? 1 : _value < 0 ? 0 : _value)
    value !== undefined && this.setData(value)
  }

  /**
   * 上下滑动唤出菜单
   * @param value
   * @returns {*}
   */
  showMenu = async () => {
    if (this.props.showMenu) {
      await this.props.showMenu()
    } else return
  }

  /**
   * @author ysl
   * 获取提示信息
   * @param value
   * @returns {*}
   * @private
   */
  _getTips = value => {
    let _value
    if (value === '-') {
      _value = value
    } else if (isNaN(value) || value === '') {
      _value = ''
    } else {
      _value = Math.floor(value)
    }
    return this.title + TIP_SPACE + _value + this.unit
  }

  /**
   * @author ysl
   * 更新提示信息
   * @param value {number | string}
   *        若value为string切不能转换为number时，则认为value为完整提示信息，直接显示，
   *        若value为number或可转换为number的字符串时，则自动拼接处提示信息
   * @private
   */
  _updateTips = value => {
    let tips
    if (isNaN(value) && typeof value === 'string') {
      tips = value
    } else if (!isNaN(value)) {
      if (value < this.range[0]) value = this.range[0]
      if (value > this.range[1]) value = this.range[1]
      tips = this._getTips(value)
    }

    if (tips !== this.state.tips && tips !== undefined) {
      this.tempText = ~~value
      this.setState({
        tips,
      })
    }
  }

  /**
   * @author ysl
   * 把数据转化为滑动距离
   * @param value
   */
  valueToDistance = value => {
    let progressWidth = this.getWidthByOrientation() - MARGIN * 2
    let distance = (value - this.range[0]) / (this.range[1] - this.range[0]) * progressWidth
    return distance
  }

  /**
   * @author ysl
   * 把滑动距离转成对应数据
   * @param distance
   * @returns {*}
   */
  distanceToValue = distance => {
    let newValue
    if (this.range[1]) {
      newValue = distance * (this.range[1] - this.range[0]) + this.range[0]
      return newValue
    }

    return newValue
  }

  /**
   * 设置数据
   * @param value
   */
  setData = async value => {
    const _value = ~~value
    const _data = ToolbarModule.getData()

    if (value < this.range[0]) value = this.range[0]
    if (value > this.range[1]) value = this.range[1]
    let tips = this._getTips(value)

    if (_data.actions && _data.actions.setTouchProgressInfo) {
      // 设置数据
      _data.actions.setTouchProgressInfo(this.title, value)
      this.tempText = ~~value

      if (tips !== this.state.tips || this.tempText !== _value) {
        this.setState({
          tips,
        })
      }
      return
    }

    if (tips !== this.state.tips) {
      this.tempText = ~~value
      this.setState({
        tips,
      })
    }
  }

  render() {
    let container = {
      // backgroundColor: '#rgba(110, 110, 110, 1)',
      backgroundColor: color.white,
      flexDirection: 'column',
      height: scaleSize(40),
      justifyContent: 'center',
      alignItems: 'center',
      // shadowOffset: { width: 0, height: 0 },
      // shadowColor: 'black',
      // shadowOpacity: 1,
      // shadowRadius: 2,
      // elevation: 20,
    }
    let num, strArray
    if (this.state.tips !== '') {
      let matchRel = this.state.tips.match(/([-0-9][0-9]*)/)
      matchRel && (num = matchRel[0])
      if (num) {
        strArray = this.state.tips.split(num)
      } else {
        strArray = this.state.tips.split(TIP_SPACE)
        strArray[0] += TIP_SPACE
      }
    }
    let isIphoneXLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0 && screen.isIphoneX()
    return (
      <KeyboardAvoidingView
        style={[
          // styles.box,
          this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? styles.boxL : styles.boxP,
          { flex: 1, width: this.getWidthByOrientation(), height: this.getHeightByOrientation()},
        ]}
        behavior={Platform.OS === 'ios' && 'position'}
      >
        <View
          style={[styles.panView, { flex: 1, width: this.getWidthByOrientation(), height: this.getHeightByOrientation()}]}
          {...this._panResponder.panHandlers}
        >
          <View style={[styles.containerRadius, styles.containerShadow]}>
            <View style={[styles.containerRadius, styles.hidden]} >
              {this.state.tips !== '' && (
                <TouchableOpacity
                  style={styles.tips}
                  onPress={() => {
                    this.input && this.input.focus()
                  }}
                  activeOpacity={1}
                >
                  <Text style={styles.tipsText}>{strArray[0]}</Text>
                  <TextInput
                    ref={ref => (this.input = ref)}
                    value={num !== undefined ? num + '' : ' '}
                    keyboardType={'numeric'}
                    returnKeyType={'done'}
                    onChangeText={text => {
                      let matchRel = text.match(/([-0-9][0-9]*)/)
                      text = matchRel ? matchRel[0] : ''
                      this.tempText = text
                      let tips = this._getTips(this.tempText)
                      this.setState({
                        tips,
                      })
                    }}
                    onBlur={() => {
                      this.setData(~~this.tempText)
                      this._updateProgress(this.tempText)
                    }}
                    style={styles.input}
                  />
                  <Text style={styles.tipsText}>{strArray[1]}</Text>
                </TouchableOpacity>
              )}
              <View style={[
                container,
                { width: this.getWidthByOrientation() },
                isIphoneXLandscape && {paddingBottom: screen.X_BOTTOM},
              ]}>
                <View
                  style={[
                    styles.line,
                    { width: this.getWidthByOrientation() - MARGIN * 2 },
                  ]}
                >
                  <View
                    style={[styles.backline]}
                    ref={ref => (this.backLine = ref)}
                  />
                </View>
                <View
                  ref={ref => (this.panBtn = ref)}
                  style={[
                    styles.pointer, isIphoneXLandscape && { top: -screen.X_BOTTOM / 4 },
                  ]}>
                  {/* <Image
                    style={[styles.image]}
                    source={require('../../../../assets/function/icon_progress.png')}
                  /> */}
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* {this.state.tips !== '' && (
          <TouchableOpacity
            style={styles.tips}
            onPress={() => {
              this.input && this.input.focus()
            }}
            activeOpacity={1}
          >
            <Text style={styles.tipsText}>{strArray[0]}</Text>
            <TextInput
              ref={ref => (this.input = ref)}
              value={num !== undefined ? num + '' : ' '}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              onChangeText={text => {
                let matchRel = text.match(/([-0-9][0-9]*)/)
                text = matchRel ? matchRel[0] : ''
                this.tempText = text
                let tips = this._getTips(this.tempText)
                this.setState({
                  tips,
                })
              }}
              onBlur={() => {
                this.setData(~~this.tempText)
                this._updateProgress(this.tempText)
              }}
              style={styles.input}
            />
            <Text style={styles.tipsText}>{strArray[1]}</Text>
          </TouchableOpacity>
        )} */}
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  boxP: {
    backgroundColor: '#rgba(0, 0, 0, 0)',
    flex: 1,
    alignItems: 'center',
  },
  boxL: {
    flex: 1,
    // backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#rgba(0, 0, 0, 0)',
  },
  panView: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#rgba(0, 0, 0, 0)',
    flexDirection: 'column',
    height: scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerRadius: {
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
  },
  containerShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: color.itemColorGray3,
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 20,
  },
  hidden: {
    overflow: 'hidden',
  },
  // progressContainer: {
  //   flexDirection: 'column',
  //   borderTopLeftRadius: scaleSize(40),
  //   borderTopRightRadius: scaleSize(40),
  //   // overflow: 'hidden',
  //   shadowOffset: { width: 0, height: 0 },
  //   shadowColor: 'black',
  //   shadowOpacity: 1,
  //   shadowRadius: 2,
  //   elevation: 20,
  // },
  pointer: {
    position: 'absolute',
    justifyContent: 'center',
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    borderWidth: scaleSize(2),
    borderColor: 'black',
    backgroundColor: color.white,
  },
  line: {
    justifyContent: 'center',
    height: scaleSize(2),
    // backgroundColor: '#rgba(96,122,137,1)',
    backgroundColor: color.separateColorGray3,
  },
  backline: {
    // backgroundColor: '#rgba(0,157,249,1)',
    backgroundColor: color.black,
    height: '100%',
    width: 0,
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  tips: {
    // position: 'absolute',
    // top: scaleSize(50),
    paddingHorizontal: scaleSize(20),
    // backgroundColor: 'rgba(110,110,110,0.85)',
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tipsText: {
    textAlign: 'center',
    fontSize: setSpText(24),
    // fontWeight: 'bold',
    // color: 'white',
    color: color.itemColorBlack,
  },
  input: {
    height: setSpText(50),
    fontSize: setSpText(24),
    // fontWeight: 'bold',
    textAlign: 'right',
    // color: 'white',
    color: color.itemColorBlack,
    width: scaleSize(100),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  valueText: {
    height: setSpText(50),
    fontSize: setSpText(24),
    fontWeight: 'bold',
    textAlign: 'center',
    // color: 'white',
    color: color.itemColorBlack,
    minWidth: scaleSize(40),
  },
})
