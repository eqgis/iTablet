/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { View, ART, PanResponder, Dimensions } from 'react-native'
// import { SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { color } from '../../styles'
import styles from './styles'

const ShapeType = {
  RECTANGLE: 'RECTANGLE',
  CIRCLE: 'CIRCLE',
}

export { ShapeType }

export default class SurfaceView extends Component {
  props: {
    style: Object,
    type: string,
    orientation: string,
  }

  static defaultProps = {
    style: styles.container,
    type: ShapeType.RECTANGLE,
  }

  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      startPoint: {
        x: 0,
        y: 0,
      },
      endPoint: {
        x: 0,
        y: 0,
      },
    }

    // this.mapStartPoint = {
    //   x: 0,
    //   y: 0,
    // }
    //
    // this.mapEndPoint = {
    //   x: 0,
    //   y: 0,
    // }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })

    this.path = ART.Path()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.orientation !== prevProps.orientation) {
  //     (async function () {
  //       let mapStart = await SMap.mapToPixel(this.mapStartPoint)
  //       let mapEnd = await SMap.mapToPixel(this.mapEndPoint)
  //       this.setState({
  //         startPoint: mapStart,
  //         endPoint: mapEnd,
  //       })
  //     }.bind(this)())
  //   }
  // }

  _handleStartShouldSetPanResponder = () => {
    return true
  }

  _handleMoveShouldSetPanResponder = () => {
    return true
  }

  _onPanResponderGrant = (evt, gestureState) => {
    let point = {
      x: gestureState.x0,
      y: gestureState.y0,
    }
    this.setState({
      startPoint: point,
      endPoint: point,
    })
    // SMap.pixelPointToMap(point).then(mapPoint => {
    //   this.mapStartPoint = mapPoint
    // })
  }

  _handlePanResponderMove = (evt, gestureState) => {
    this.setState({
      endPoint: {
        x: gestureState.moveX,
        y: gestureState.moveY,
      },
    })
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let point = {
      x: gestureState.moveX,
      y: gestureState.moveY,
    }
    this.setState({
      endPoint: point,
    })
    // SMap.pixelPointToMap(point).then(mapPoint => {
    //   this.mapEndPoint = mapPoint
    // })
  }

  show = isShow => {
    let newState = {}
    if (
      (isShow === undefined && this.state.isShow) ||
      (isShow !== undefined && !isShow)
    ) {
      newState = {
        isShow: false,
        startPoint: {
          x: 0,
          y: 0,
        },
        endPoint: {
          x: 0,
          y: 0,
        },
      }
    } else {
      newState = {
        isShow: true,
      }
    }
    if (newState.isShow) {
      if (this.props.orientation.indexOf('LANDSCAPE') === 0) {
        Orientation.lockToLandscape()
      } else {
        Orientation.lockToPortrait()
      }
    } else {
      Orientation.unlockAllOrientations()
    }
    this.setState(newState)
  }

  getResult = () => {
    switch (this.props.type) {
      case ShapeType.CIRCLE:
        return [this.state.startPoint, this.state.endPoint]
      case ShapeType.RECTANGLE:
      default:
        return [
          this.state.startPoint,
          { x: this.state.startPoint.x, y: this.state.endPoint.y },
          this.state.endPoint,
          { x: this.state.endPoint.x, y: this.state.startPoint.y },
        ]
    }
  }

  draw = () => {
    switch (this.props.type) {
      case ShapeType.CIRCLE:
        this._drawCircle()
        break
      case ShapeType.RECTANGLE:
      default:
        this._drawRectangle()
    }
  }

  /** 画矩形 **/
  _drawRectangle = () => {
    this.path = ART.Path()
    this.path
      .moveTo(this.state.startPoint.x, this.state.startPoint.y)
      .lineTo(this.state.endPoint.x, this.state.startPoint.y)
      .lineTo(this.state.endPoint.x, this.state.endPoint.y)
      .lineTo(this.state.startPoint.x, this.state.endPoint.y)
      .close()
  }

  /** 画圆 **/
  _drawCircle = () => {
    this.path = ART.Path()
    const dx = Math.abs(this.state.endPoint.x - this.state.startPoint.x)
    const dy = Math.abs(this.state.endPoint.y - this.state.startPoint.y)
    let circleRadius = Math.max(dx, dy) / 2
    this.path
      .moveTo(
        // Math.min(this.state.startPoint.x, this.state.endPoint.x) + circleRadius,
        this.state.startPoint.x > this.state.endPoint.x
          ? this.state.startPoint.x - circleRadius
          : this.state.startPoint.x + circleRadius,
        this.state.startPoint.y,
        // Math.min(this.state.startPoint.y, this.state.endPoint.y),
      )
      .arc(0, Math.max(dx, dy), circleRadius)
      .arc(0, -Math.max(dx, dy), circleRadius)
      .close()
  }

  render() {
    if (!this.state.isShow) return null
    this.draw()
    const dWidth = Dimensions.get('window').width
    const dHeight = Dimensions.get('window').height
    return (
      <View {...this._panResponder.panHandlers} style={this.props.style}>
        <ART.Surface width={dWidth} height={dHeight}>
          <ART.Shape d={this.path} stroke={color.switch} strokeWidth={5} />
        </ART.Surface>
      </View>
    )
  }
}
