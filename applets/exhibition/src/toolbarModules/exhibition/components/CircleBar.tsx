import { dp } from '@/utils'
import React, { Component } from 'react'
import { View, StyleSheet, PanResponder, Platform, Text, PanResponderInstance } from 'react-native'
import Svg, { Circle, Path, Color } from 'react-native-svg'

interface Props {
  height: number,
  width: number,
  r: number,
  angle: number,
  outArcColor: Color,
  title: string,
  progressvalue: string,
  activeProgressvalue: string,
  tabColor: Color,
  tabStrokeColor: Color,
  strokeWidth: number,
  value: number,
  valueUnit: string,
  min: number,
  max: number,
  tabR: number,
  step: number,
  tabStrokeWidth: number,
  valueChange: (value: number) => void,
  renderCenterView: (value: number) => void,
  complete: (value: number) => void,
  enTouch: boolean,
  showText: boolean,
}

interface State {
  value: number,
  isActive: boolean,
}

export default class CircleBar extends Component<Props, State> {
  static defaultProps = {
    width: 300,
    height: 300,
    r: 100,
    angle: 1,
    outArcColor: 'white',
    strokeWidth: 10,
    value: 20,
    valueUnit: '',
    title: '',
    min: 0,
    max: 360,
    progressvalue: '#1D1D1D',
    activeProgressvalue: '#FF2323',
    tabR: 15,
    tabColor: '#EFE526',
    tabStrokeWidth: 5,
    tabStrokeColor: '#86BA38',
    valueChange: () => {},
    complete: () => {},
    renderCenterView: undefined,
    step: 1,
    enTouch: true,
    showText: true,
  }

  _panResponder: PanResponderInstance
  lastValue: number
  lastPostion: {
    x: number,
    y: number,
  } = { x: 0, y: 0 }

  constructor(props: Props) {
    super(props)
    this.state = {
      value: this.props.value,
      isActive: false,
    }
    this.lastValue = 0
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: evt => {
        // 开始手势操作。
        this.setState({
          isActive: true,
        })
        if (this.props.enTouch) {
          this.lastValue = this.state.value
          const x = evt.nativeEvent.locationX
          const y = evt.nativeEvent.locationY
          this.parseToDeg(x, y)
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this.props.enTouch) {
          this.lastValue = this.state.value
          let x = evt.nativeEvent.locationX
          let y = evt.nativeEvent.locationY
          if (gestureState.dx === 0 && gestureState.dy === 0) {
            this.lastPostion = { x, y }
            return
          } else {
            x = this.lastPostion.x + gestureState.dx
            y = this.lastPostion.y + gestureState.dy
          }
          this.parseToDeg(x, y)
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {
        this.setState({
          isActive: false,
        })
        if (this.props.enTouch) this.props.complete(this.state.value)
      },
      // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      onPanResponderTerminate: () => { },
      // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
      // 默认返回true。目前暂时只支持android。
      onShouldBlockNativeResponder: () => true,
    })
  }

  reset = () => {
    this.setState({
      value: this.props.value,
    })
  }

  parseToDeg = (x: number, y: number) => {
    const cx = this.props.width / 2
    const cy = this.props.height / 2
    let deg
    let value = 0
    if (x >= cx && y <= cy) {
      deg = Math.atan((cy - y) / (x - cx)) * 180 / Math.PI
      value =
        (270 - deg - this.props.angle / 2) /
        (360 - this.props.angle) *
        (this.props.max - this.props.min) +
        this.props.min
    } else if (x >= cx && y >= cy) {
      deg = Math.atan((cy - y) / (cx - x)) * 180 / Math.PI
      value =
        (270 + deg - this.props.angle / 2) /
        (360 - this.props.angle) *
        (this.props.max - this.props.min) +
        this.props.min
    } else if (x <= cx && y <= cy) {
      deg = Math.atan((x - cx) / (y - cy)) * 180 / Math.PI
      value =
        (180 - this.props.angle / 2 - deg) /
        (360 - this.props.angle) *
        (this.props.max - this.props.min) +
        this.props.min
    } else if (x <= cx && y >= cy) {
      deg = Math.atan((cx - x) / (y - cy)) * 180 / Math.PI
      if (deg < this.props.angle / 2) {
        deg = this.props.angle / 2
      }
      value =
        (deg - this.props.angle / 2) /
        (360 - this.props.angle) *
        (this.props.max - this.props.min) +
        this.props.min
    }
    if (value <= this.props.min) {
      value = this.props.min
    }
    if (value >= this.props.max) {
      value = this.props.max
    }
    value = this.getTemps(value)
    this.setState({
      value,
    })
    this.props.valueChange(this.state.value)
  }

  getTemps = (tmps: number) => {
    const k = parseInt((tmps - this.props.min) / this.props.step + '', 10)
    const k1 = this.props.min + this.props.step * k
    const k2 = this.props.min + this.props.step * (k + 1)
    if (Math.abs(k1 - tmps) > Math.abs(k2 - tmps)) return k2
    return k1
  }

  renderCenterView = () => {
    if (this.props.renderCenterView) {
      return this.props.renderCenterView(this.state.value)
    } else if (this.props.showText) {
      return (
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'black', textAlign: 'center', fontSize: dp(12)}}>{`${this.state.value}${this.props.valueUnit}`}</Text>
          <Text style={{color: 'black', textAlign: 'center', fontSize: dp(12)}}>{`${this.props.title}`}</Text>
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <View pointerEvents={'box-only'} {...this._panResponder.panHandlers}>
        {this._renderCircleSvg()}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.renderCenterView()}
        </View>
      </View>
    )
  }

  _circlerate() {
    let rate = parseInt(
      (this.state.value - this.props.min) *
      100 /
      (this.props.max - this.props.min) + '',
      10
    )
    if (rate < 0) {
      rate = 0
    } else if (rate > 100) {
      rate = 100
    }
    return rate
  }

  _renderCircleSvg() {
    const cx = this.props.width / 2
    const cy = this.props.height / 2
    const prad = this.props.angle / 2 * (Math.PI / 180)
    const startX = -(Math.sin(prad) * this.props.r) + cx
    const startY = cy + Math.cos(prad) * this.props.r // // 最外层的圆弧配置
    const endX = Math.sin(prad) * this.props.r + cx
    const endY = cy + Math.cos(prad) * this.props.r
    // 计算进度点
    const progress = parseInt(
      this._circlerate() * (360 - this.props.angle) / 100 + '',
      10
    )
    // 根据象限做处理,参考辅助线
    const t = progress + this.props.angle / 2
    const progressX = cx - Math.sin(t * (Math.PI / 180)) * this.props.r
    const progressY = cy + Math.cos(t * (Math.PI / 180)) * this.props.r
    const descriptions = [
      'M',
      startX,
      startY,
      'A',
      this.props.r,
      this.props.r,
      0,
      1,
      1,
      endX,
      endY,
    ].join(' ')
    const progressdescription = [
      'M',
      startX,
      startY,
      'A',
      this.props.r,
      this.props.r,
      0,
      t >= 180 + this.props.angle / 2 ? 1 : 0,
      1,
      progressX,
      progressY,
    ].join(' ')
    return (
      <Svg
        height={this.props.height}
        width={this.props.width}
        style={styles.svg}>
        <Path
          d={descriptions}
          fill="none"
          stroke={this.props.outArcColor}
          strokeWidth={this.props.strokeWidth} />
        <Path
          d={progressdescription}
          fill="none"
          stroke={this.state.isActive ? this.props.activeProgressvalue : this.props.progressvalue}
          strokeWidth={this.props.strokeWidth} />
        <Circle
          cx={progressX}
          cy={progressY}
          r={this.props.tabR}
          stroke={this.props.tabStrokeColor}
          strokeWidth={this.props.tabStrokeWidth}
          fill={this.props.tabColor} />
      </Svg>
    )
  }
}

const styles = StyleSheet.create({
  svg: {},
})