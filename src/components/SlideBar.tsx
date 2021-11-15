import React, { Component } from 'react'
import { Dimensions, View, PanResponder, ViewStyle, PanResponderInstance, GestureResponderEvent, PanResponderGestureState, ScaledSize } from 'react-native'
import { scaleSize } from '../utils'

interface Props {
  style?: ViewStyle,
  onStart?: () => void,
  onMove: (loc: number) => void,
  onEnd?: () => void,
}

interface State {
  left: number
}

const defaultProps = {
  range: [0, 100],
  defaultValue: 0,
}

class SlideBar extends Component<Props & typeof defaultProps, State> {

  static defaultProps = defaultProps

  barWidth: number | undefined

  dimensions = Dimensions.get('screen')

  count: number

  prevLeft: number

  lastestLeft: number

  panResponder: PanResponderInstance

  lastOutput: number | undefined

  currentValue: number = this.props.defaultValue

  constructor(props: Props & typeof defaultProps) {
    super(props)

    // this.barWidth = typeof this.props.style?.width === 'number' ?  this.props.style?.width : this.dimensions.width
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

  shouldComponentUpdate(nextProps: Props & typeof defaultProps, nextState: State) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  componentDidUpdate(prevProps: Props & typeof defaultProps) {
    if (
      JSON.stringify(prevProps.range) !== JSON.stringify(this.props.range) ||
      prevProps.defaultValue !== this.props.defaultValue
    ) {
      this.count = Math.abs(this.props.range[1] - this.props.range[0])
      this.setState({
        left: this.getLocation(this.props.defaultValue),
      })
    }
  }

  reset = () => {
    this.prevLeft = this.getLocation(this.props.defaultValue)
    this.setState({
      left: this.prevLeft,
    })
    this.lastestLeft = 0
  }

  _getBarWidth = (): number => {
    if (this.barWidth !== undefined) return this.barWidth
    return typeof this.props.style?.width === 'number' ?  this.props.style?.width : Dimensions.get('window').width
  }

  updateParams = (currentValue: number) => {
    this.count = Math.abs(this.props.range[1] - this.props.range[0])

    this.setState({
      left: this.getLocation(currentValue),
    })
    this.prevLeft = this.getLocation(currentValue)
    this.lastestLeft = 0
  }

  //根据位置获取值
  getValue = (location: number) => {
    return (
      Math.round((this.count * location) / this._getBarWidth()) + this.props.range[0]
    )
  }

  //根据值获取位置
  getLocation = (value: number) => {
    return (this._getBarWidth() * (value - this.props.range[0])) / this.count
  }

  onStart = () => {
    this.props.onStart && this.props.onStart()
  }

  onMove = (location: number) => {
    if (this.lastOutput === undefined || this.lastOutput !== location) {
      this.lastOutput = location
      this.currentValue = this.getValue(location)
      this.props.onMove && this.props.onMove(this.currentValue)
    }
  }

  onEnd = (location: number) => {
    this.onMove(location)
    this.props.onEnd && this.props.onEnd()
  }

  onPanMove = (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
    const offx = gesture.dx
    let location = this.prevLeft + offx
    if (location > this._getBarWidth()) location = this._getBarWidth()
    if (location < 0) location = 0
    location = this.getLocation(this.getValue(location))
    this.setState({
      left: location,
    })
    this.lastestLeft = location
    this.onMove(location)
  }

  onPanRelease = (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
    let location = this.lastestLeft
    if (gesture.dx === 0) {
      location = evt.nativeEvent.locationX
      if (location > this._getBarWidth()) location = this._getBarWidth()
      if (location < 0) location = 0
      location = this.getLocation(this.getValue(location))
      this.setState({
        left: location,
      })
    }
    this.prevLeft = location
    this.onEnd(location)
  }

  onClear = () => {
    this.setState({
      left: this.getLocation(this.props.defaultValue),
    })
    this.prevLeft = this.getLocation(this.props.defaultValue)
    this.onEnd(this.prevLeft)
  }

  render() {
    return (
      <View
        style={[
          {
            width: this._getBarWidth(),
            height: scaleSize(40),
            justifyContent: 'center',
            backgroundColor: '#00000000',
          },
          this.props.style,
        ]}
        {...this.panResponder.panHandlers}
        onLayout={e => {
          const width =  e.nativeEvent.layout.width
          if(this.barWidth === undefined || this.barWidth !== width) {
            this.barWidth = width
            this.updateParams(this.currentValue)
          } else {
            this.barWidth = width
          }
        }}
      >
        <View
          style={{
            width: '100%',
            height: scaleSize(2),
            backgroundColor: '#F1F3F8',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: scaleSize(2),
              backgroundColor: '#000000',
              width: this.state.left,
            }}
          />
          <View
            style={{
              width: scaleSize(25),
              height: scaleSize(25),
              borderWidth: scaleSize(2),
              borderColor: '#000000',
              borderRadius: scaleSize(12.5),
              backgroundColor: '#FFFFFF',
              marginLeft: -scaleSize(12.5),
            }}
          />
        </View>
      </View>
    )
  }
}

export default SlideBar