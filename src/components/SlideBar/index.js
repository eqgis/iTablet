import React, { Component } from 'react'
import { View, PanResponder } from 'react-native'
import { screen, scaleSize } from '../../utils'

export default class SlideBar extends Component {
  props: {
    style: Object,
    onStart: () => {},
    onMove: () => {},
    onEnd: () => {},
  }

  static defaultProps = {
    range: [0, 100],
    defaultValue: 0,
  }

  constructor(props) {
    super(props)

    this.barWidth = this.props.style?.width || screen.getScreenWidth()
    this.count = Math.abs(this.props.range[1] - this.props.range[0])

    this.state = {
      left: this.getLocation(this.props.defaultValue),
    }
    this.prevLeft = this.state.left
    this.lastestLeft = 0
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.onStart,
      onPanResponderMove: this.onPanMove,
      onPanResponderRelease: this.onPanRelease,
      onPanResponderTerminate: this.onPanRelease,
    })
  }

  //根据位置获取值
  getValue = location => {
    return (
      Math.round((this.count * location) / this.barWidth) + this.props.range[0]
    )
  }

  //根据值获取位置
  getLocation = value => {
    return (this.barWidth * (value - this.props.range[0])) / this.count
  }

  onStart = () => {
    this.props.onStart && this.props.onStart()
  }

  onMove = location => {
    if (this.lastOutput === undefined || this.lastOutput !== location) {
      this.lastOutput = location
      this.props.onMove && this.props.onMove(this.getValue(location))
    }
  }

  onEnd = location => {
    this.onMove(location)
    this.props.onEnd && this.props.onEnd()
  }

  onPanMove = (evt, gesture) => {
    let offx = gesture.dx
    let location = this.prevLeft + offx
    if (location > this.barWidth) location = this.barWidth
    if (location < 0) location = 0
    location = this.getLocation(this.getValue(location))
    this.setState({
      left: location,
    })
    this.lastestLeft = location
    this.onMove(location)
  }

  onPanRelease = (evt, gesture) => {
    let location = this.lastestLeft
    if (gesture.dx === 0) {
      location = evt.nativeEvent.locationX
      if (location > this.barWidth) location = this.barWidth
      if (location < 0) location = 0
      location = this.getLocation(this.getValue(location))
      this.setState({
        left: location,
      })
    }
    this.prevLeft = location
    this.onEnd(location)
  }

  render() {
    return (
      <View
        style={[
          {
            width: this.barWidth,
            height: scaleSize(60),
            justifyContent: 'center',
            backgroundColor: '#00000000',
          },
          this.props.style,
        ]}
        {...this.panResponder.panHandlers}
      >
        <View
          style={{
            width: '100%',
            height: scaleSize(5),
            backgroundColor: '#F1F3F8',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: scaleSize(5),
              backgroundColor: '#000000',
              width: this.state.left,
            }}
          />
          <View
            style={{
              width: scaleSize(30),
              height: scaleSize(30),
              borderWidth: scaleSize(5),
              borderColor: '#000000',
              borderRadius: scaleSize(16),
              backgroundColor: '#FFFFFF',
              marginLeft: -scaleSize(15),
            }}
          />
        </View>
      </View>
    )
  }
}
