import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { screen, scaleSize } from '../../utils'
import SlideBar from '../SlideBar'
import { getLanguage } from '../../language'

export default class RevolveSlide extends Component {
  props: {
    style: Object,
    rangeR: Array,
    onMoveR: () => {},
  }

  static defaultProps = {
    rangeR: [0, 100],
    style:{ width: screen.getScreenWidth() - scaleSize(130) }
  }

  constructor(props) {
    super(props)

    this.state = {
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

  renderItem = dir => {
    let range, onMove, labelLeft, labelRight
    switch (dir) {
      default:
        labelLeft = -180
        labelRight = 180
        range = this.props.rangeR
        onMove = this.props.onMoveR
        break
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          numberOfLines={1}
          style={{
            width: scaleSize(60),
            textAlign: 'center',
            fontSize: scaleSize(24),
          }}
        >
          {labelLeft}
        </Text>
        <SlideBar
          style={this.props.style}
          range={range}
          onStart={this.onStart}
          onEnd={this.onEnd}
          onMove={onMove}
        />
        <Text
          numberOfLines={1}
          style={{
            width: scaleSize(60),
            textAlign: 'center',
            fontSize: scaleSize(24),
          }}
        >
          {labelRight}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            paddingTop: scaleSize(40),
            width: '100%',
            borderTopStartRadius: scaleSize(25),
            borderTopRightRadius: scaleSize(25),
            backgroundColor: this.state.backgroundColor,
          },
        ]}
      >
        {this.renderItem('r')}
      </View>
    )
  }
}
