import React, { createRef } from 'react'
import { Image, ImageRequireSource, ImageStyle, Text, TouchableOpacity, View } from 'react-native'
import { getImage } from '../assets'
import { AppStyle, dp } from '../utils'
import SlideBar from './SlideBar'

export type Props = SingleProps | DoubleProps

interface SingleProps extends CommonProps {
  type: 'single'
  defaultValue?: number
}

interface DoubleProps extends CommonProps {
  type: 'double'

  bottomLeft?: SideProps

  defaultMinValue?: number
  defaultMaxValue?: number

}

interface CommonProps extends Partial<DefaultProps> {
  showManulController?: boolean
  onMove:(value: number, isMin?: boolean) => void
  onDisable?:(isDisabled: boolean) => void
  onEnd?:() => void

  left?: SideProps
  right?: SideProps

  disabled?: boolean
  disableText?: string

  increment?: number
}

type SideProps = IndicatorProp | TextProp | ImageProp

interface IndicatorProp {
  type: 'indicator'
  unit?: string
}

interface TextProp {
  type: 'text'
  text: string
}

interface ImageProp {
  type: 'image'
  image: ImageRequireSource
}

//TODO
// interface InputProp {
//   type: 'input'
// }

interface DefaultProps {
  range: [number, number]
  /** 横向显示 */
  horizontal: boolean
}

interface State {
  currentMaxValue: number
  currentMinValue: number
  disabled: boolean
  range: [number, number]
}

const defaultProps: DefaultProps = {
  range: [0, 100],
  horizontal: true,
}

class Slider extends React.Component<Props & DefaultProps, State> {

  static defaultProps = defaultProps
  newMaxValue: number

  slideBar = createRef<SlideBar>()

  constructor(props: Props & DefaultProps) {
    super(props)
    if(this.props.type === 'single'){
      this.newMaxValue = this.props.defaultValue || 0
    } else {
      this.newMaxValue = this.props.defaultMaxValue || 0
    }

    this.state = {
      currentMaxValue: this.props.type === 'single' ? (this.props.defaultValue || 0) : (this.props.defaultMaxValue || 0),
      currentMinValue: this.props.type === 'double' ? (this.props.defaultMinValue || 0) : 0,
      disabled: !!this.props.disabled,
      range: this.props.range,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.updateParams()
    }
  }

  updateParams = () => {
    this.setState({
      currentMaxValue: this.props.type === 'single' ? (this.props.defaultValue || 0) : (this.props.defaultMaxValue || 0),
      currentMinValue: this.props.type === 'double' ? (this.props.defaultMinValue || 0) : 0,
      disabled: !!this.props.disabled,
      range: this.props.range,
    })
  }

  reset = () => {
    this.slideBar.current?.onClear()
    this.updateParams()
  }

  _renderSide = (side: 'left' | 'right') => {
    const props = side === 'left' ? this.props.left : this.props.right
    if(props === undefined) return
    let image: ImageRequireSource | null = null
    let text: string | null = null
    if(props.type === 'image') {
      image = props.image
    } else if(props.type === 'text') {
      text = props.text
    } else if(props.type === 'indicator') {
      if(this.props.type === 'double' && side === 'left') {
        text = this.state.currentMinValue + (props.unit || '')
      } else {
        text = this.state.currentMaxValue + (props.unit || '')
      }
    }
    return (
      <View
        style={{
          maxWidth: dp(50),
          minWidth: dp(20),
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

  manulControlLongPress: NodeJS.Timer | null = null

  renderManulController = (mode: 'decrement' | 'increment') => {
    if(!this.props.showManulController) return null
    const icon = mode === 'decrement' ? getImage().icon_narrow : getImage().icon_enlarge
    const disableStyle: ImageStyle = {
      tintColor: AppStyle.Color.LIGHT_GRAY
    }
    return (
      <TouchableOpacity
        style={{
          paddingVertical: dp(5),
          paddingHorizontal: dp(10)
        }}
        disabled={this.state.disabled}
        onLongPress={() => {
          this.manulControlLongPress = setInterval(() => {
            if(mode === 'decrement') {
              this.slideBar.current?.decrement()
            } else {
              this.slideBar.current?.increment()
            }
          }, 100)
        }}
        onPressOut={() => {
          this.manulControlLongPress && clearInterval(this.manulControlLongPress)
          this.manulControlLongPress = null
        }}
        onPress={() => {
          if(mode === 'decrement') {
            this.slideBar.current?.decrement()
          } else {
            this.slideBar.current?.increment()
          }
        }}
      >
        <Image
          source={icon}
          style={[AppStyle.Image_Style_Small, {tintColor: 'black'},this.state.disabled && disableStyle]}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <View
        // style={{backgroundColor: 'red'}}
      >
        <View style={this.props.horizontal ? {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }: {
          flexDirection: 'column-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          flex: 1,
        }}>
          {this.renderManulController('decrement')}
          {this._renderSide('left')}
          <SlideBar
            ref={this.slideBar}
            style={this.props.horizontal ? {
              flex: 1,
              marginHorizontal: dp(10),
            }: {
              flex: 1,
              marginVertical: dp(10),
            }}
            horizontal={this.props.horizontal}
            mode={this.props.type}
            disabled={this.state.disabled}
            onMaxReach={(loc, isGesture) => {
              let newRange = this.state.range
              if(!isGesture && this.props.increment !== undefined){

                let rangeMax = this.state.range[1]
                if( loc === this.state.range[1]) {
                  rangeMax += this.props.increment
                  newRange = [newRange[0], newRange[1]]
                  newRange[1] = rangeMax
                  this.newMaxValue =this.state.range[1]
                }
              }
              this.setState({
                range: newRange
              })
            }}
            onMove={(loc, isGesture, isMin) => {
              this.props.onMove(loc, isMin)
              if(isMin) {
                this.setState({
                  currentMinValue: loc
                })
              } else {
                this.setState({
                  currentMaxValue: loc,
                })
              }
            }}
            onEnd={this.props.onEnd}
            range={this.state.range}
            // defaultMaxValue={this.props.type === 'single' ? this.props.defaultValue: this.props.defaultMaxValue}
            defaultMaxValue={this.props.type === 'single' ? this.newMaxValue: this.props.defaultMaxValue}
            defaultMinValue={this.props.type === 'double' ? this.props.defaultMinValue : undefined}
          />
          {this._renderSide('right')}
          {this.renderManulController('increment')}
        </View>

        {((this.props.type === 'double' && this.props.bottomLeft) || this.props.disableText) && (
          <View
            style={this.props.horizontal ? {
              flexDirection: 'row',
              paddingHorizontal: dp(20),
              justifyContent: 'space-between',
            }: {
              flexDirection: 'column',
              paddingVertical: dp(10),
            }}
          >
            <Text style={AppStyle.h3c}>
              {this.props.type === 'double' && this.props.bottomLeft?.type === 'text' && this.props.bottomLeft.text}
            </Text>
            {this.props.disableText && (
              <TouchableOpacity
                style={[{flexDirection: 'row'}, !this.props.horizontal && {marginTop: dp(5)}]}
                onPress={() => {
                  this.props.onDisable?.(!this.state.disabled)
                  this.setState({disabled: !this.state.disabled})
                }}
              >
                <Image
                  source={this.state.disabled ? getImage().icon_check : getImage().icon_uncheck}
                  style={AppStyle.Image_Style_Small}
                />
                <Text
                  style={AppStyle.h3c}
                  numberOfLines={1}
                >
                  {this.props.disableText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </View>
    )
  }
}

export default Slider