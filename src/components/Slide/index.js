import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { screen, scaleSize } from '../../utils'
import SlideBar from '../SlideBar'

export default class Slide extends Component {
  props: {
    style: Object,
    range: Array,
    onMove: () => {},
    defaultValue: Number,
    unit: String,
  }

  static defaultProps = {
    range: [0, 100],
    defaultValue: 0,
  }

  constructor(props) {
    super(props)

    this.state = {
      currentValue: this.props.defaultValue,
      backgroundColor: '#FFFFFF',
    }
  }

  onStart = () => {
    this.setState({
      backgroundColor: '#FFFFFFAA',
    })
  }

  onEnd = () => {
    this.setState({
      backgroundColor: '#FFFFFF',
    })
  }

  onMove = value => {
    this.setState({
      currentValue: value,
    })
    this.props.onMove && this.props.onMove(value)
  }

  renderItem = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <SlideBar
          style={{ width: screen.getScreenWidth() }}
          defaultValue={this.props.defaultValue}
          range={this.props.range}
          onStart={this.onStart}
          onEnd={this.onEnd}
          onMove={this.props.onMove}
        />
      </View>
    )
  }

  render() {
    let text = this.state.currentValue
    if (this.props.unit) {
      text = text + ' ' + this.props.unit
    }
    return (
      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            paddingTop: scaleSize(20),
            width: '100%',
            alignItems: 'center',
            borderTopStartRadius: scaleSize(25),
            borderTopRightRadius: scaleSize(25),
            backgroundColor: this.state.backgroundColor,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: scaleSize(24),
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
        <SlideBar
          style={{ width: screen.getScreenWidth() - 20 }}
          defaultValue={this.props.defaultValue}
          range={this.props.range}
          onStart={this.onStart}
          onEnd={this.onEnd}
          onMove={this.onMove}
        />
      </View>
    )
  }
}
