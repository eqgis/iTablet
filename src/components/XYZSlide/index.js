import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { screen, scaleSize } from '../../utils'
import SlideBar from '../SlideBar'
import { getLanguage } from '../../language'

export default class XYZSlide extends Component {
  props: {
    style: Object,
    rangeX: Array,
    rangeY: Array,
    rangeZ: Array,
    onMoveX: () => {},
    onMoveY: () => {},
    onMoveZ: () => {},
  }

  static defaultProps = {
    rangeX: [0, 100],
    rangeY: [0, 100],
    rangeZ: [0, 100],
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
      case 'x':
        labelLeft = getLanguage(GLOBAL.language).Common.LEFT
        labelRight = getLanguage(GLOBAL.language).Common.RIGHT
        range = this.props.rangeX
        onMove = this.props.onMoveX
        break
      case 'y':
        labelLeft = getLanguage(GLOBAL.language).Common.DOWN
        labelRight = getLanguage(GLOBAL.language).Common.UP
        range = this.props.rangeY
        onMove = this.props.onMoveY
        break
      default:
        labelLeft = getLanguage(GLOBAL.language).Common.BACK
        labelRight = getLanguage(GLOBAL.language).Common.FRONT
        range = this.props.rangeZ
        onMove = this.props.onMoveZ
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
          style={{ width: screen.getScreenWidth() - scaleSize(130) }}
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
        {this.renderItem('x')}
        {this.renderItem('y')}
        {this.renderItem('z')}
      </View>
    )
  }
}
