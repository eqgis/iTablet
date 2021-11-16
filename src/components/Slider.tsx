import React, { createRef } from 'react'
import { Image, Text, View } from 'react-native'
import { dp } from '../utils'
import { AppStyle } from '../styles'
import SlideBar from './SlideBar'

export interface Props {
  defaultValue?: number,
  range?: number[],
  onMove:(value: number) => void,
  onEnd?:() => void,

  unit?: string,
  leftText?: string,
  leftImage?: any,
  rightText?: string,
  rightImage?: any,
}

interface State {
  currentValue: number
}

class Slider extends React.Component<Props, State> {

  slideBar = createRef<SlideBar>()

  constructor(props: Props) {
    super(props)

    this.state = {
      currentValue: this.props.defaultValue || 0,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.updateParams()
    }
  }

  updateParams = () => {
    this.setState({
      currentValue: this.props.defaultValue || 0,
    })
  }

  reset = () => {
    this.slideBar.current?.onClear()
  }

  _renderSide = (side: 'left' | 'right') => {
    let text = side === 'left' ? this.props.leftText : this.props.rightText
    const image = side === 'left' ? this.props.leftImage : this.props.rightImage
    if(side === 'right' && text === undefined) {
      text = this.state.currentValue + (this.props.unit || '')
    }
    return (
      <View
        style={{
          width: dp(50),
          alignItems: 'center',
        }}
      >
        {text ? (
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'center',
              fontSize: dp(12),
            }}>
            {text}
          </Text>
        ) : (image && (
          <Image
            source={image}
            style={AppStyle.Image_Style_Small}
          />
        ))}
      </View>
    )
  }

  render() {
    return(
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {this._renderSide('left')}
        <SlideBar
          ref={this.slideBar}
          style={{
            flex: 1,
            marginHorizontal: dp(10),
          }}
          onMove={loc => {
            this.props.onMove(loc)
            this.setState({
              currentValue: loc,
            })
          }}
          onEnd={this.props.onEnd}
          range={this.props.range}
          defaultValue={this.props.defaultValue}
        />
        {this._renderSide('right')}
      </View>
    )
  }
}

export default Slider