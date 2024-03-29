/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { View, Animated, Easing } from 'react-native'
import PropTypes from 'prop-types'
import { color } from '../../styles'
import styles from './styles'

export default class Progress extends Component {
  static propTypes = {
    ...View.propTypes,
    //当前进度
    progress: PropTypes.number,
    //second progress进度
    buffer: PropTypes.number,
    //进度条颜色
    progressColor: PropTypes.string,
    //buffer进度条颜色
    bufferColor: PropTypes.string,
    //进度动画时长
    progressAniDuration: PropTypes.number,
    //buffer动画时长
    bufferAniDuration: PropTypes.number,
    //进度条高度
    height: PropTypes.number | PropTypes.string,
  }

  static defaultProps = {
    //进度条颜色
    // progressColor: 'yellow',
    progressColor: color.item_selected_bg,
    //buffer进度条颜色
    bufferColor: 'rgba(255,0,0,0.7)',
    //进度条动画时长
    progressAniDuration: 300,
    //buffer进度条动画时长
    bufferAniDuration: 300,
    progress: 0,
    buffer: 0,
    height: '100%',
  }

  // eslint-disable-next-line
  // componentWillMount() {
  //   this.progress = this.props.progress
  //   this.buffer = this.props.buffer
  // }

  constructor(props) {
    super(props)
    this._progressAni = new Animated.Value(0)
    this._bufferAni = new Animated.Value(0)
    this.totalWidth = -1
  }

  _onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => {
    //防止多次调用,当第一次获取后,后面就不再去获取了

    if (width > 0 && this.totalWidth !== width) {
      //获取progress控件引用
      let progress = this.mProgress
      //获取buffer控件引用
      let buffer =  this.mBuffer
      //获取父布局宽度
      this.totalWidth = width
      //给progress控件设置高度
      progress.setNativeProps({
        style: {
          height: this.props.height !== undefined ? this.props.height : height,
        },
      })
      //给buffer控件设置高度
      buffer.setNativeProps({
        style: {
          height: this.props.height !== undefined ? this.props.height : height,
        },
      })
      //开始执行进度条动画
      this._startAniProgress(this.progress)
      //开始执行buffer动画
      this._startAniBuffer(this.buffer)
    }
  }

  _startAniProgress = progress => {
    if (progress >= 0 && this.totalWidth !== 0) {
      Animated.timing(this._progressAni, {
        isInteraction: false,
        toValue: progress * this.totalWidth,
        duration: this.props.progressAniDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start()
    }
  }

  _startAniBuffer = buffer => {
    if (buffer >= 0 && this.totalWidth !== 0) {
      Animated.timing(this._bufferAni, {
        isInteraction: false,
        toValue: buffer * this.totalWidth,
        duration: this.props.bufferAniDuration,
        useNativeDriver: false,
      }).start()
    }
  }

  _getProgress = () => {
    if (typeof this.mProgress.refs?.node !== 'undefined') {
      return this.mProgress.refs.node
    }
    return this.mProgress._component || 0
  }

  _getBuffer = () => {
    if (typeof this.mBuffer.refs?.node !== 'undefined') {
      return this.mBuffer.refs.node
    }
    return this.mBuffer._component
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.style,
          this.props.height >= 0 && { height: this.props.height },
        ]}
        onLayout={this._onLayout}
        // removeClippedSubviews={true}
      >
        <Animated.View
          ref={ref => (this.mProgress = ref)}
          style={{
            position: 'absolute',
            width: this._progressAni,
            height: this.props.height,
            backgroundColor: this.props.progressColor,
            // overflow: 'hidden',
          }}
        />
        <Animated.View
          ref={ref => (this.mBuffer = ref)}
          style={{
            position: 'absolute',
            width: this._bufferAni,
            height: this.props.height,
            backgroundColor: this.props.bufferColor,
            // overflow: 'hidden',
          }}
        />
      </View>
    )
  }
}

Object.defineProperty(Progress.prototype, 'progress', {
  set(value) {
    if (value >= 0 && this._progress !== value) {
      this._progress = value
      this._startAniProgress(value)
    }
  },
  get() {
    return this._progress
  },
  enumerable: true,
})

Object.defineProperty(Progress.prototype, 'buffer', {
  set(value) {
    if (value >= 0 && this._buffer !== value) {
      this._buffer = value
      this._startAniBuffer(value)
    }
  },
  get() {
    return this._buffer
  },
  enumerable: true,
})
