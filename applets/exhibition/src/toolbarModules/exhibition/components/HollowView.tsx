import React from 'react'
import { ColorValue, Dimensions, View, ViewStyle } from 'react-native'

interface Props {
  style?: ViewStyle
  hollowStyle?: {
    width?: number
    height?: number
    top?: number
    borderRadius?: number
    borderColor?: ColorValue
  }
}

interface State {
  /** 长边 */
  parentWidth?: number
  /** 短边 */
  parentHeight?: number
}

const BORDER_WIDTH = Math.max(
  Dimensions.get('screen').height,
  Dimensions.get('screen').width,
)

class HollowView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  renderHole = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: (this.props.hollowStyle?.top !== undefined) ? - BORDER_WIDTH + this.props.hollowStyle?.top : undefined,
          width: BORDER_WIDTH * 2 + (this.props.hollowStyle?.width || 0),
          height: BORDER_WIDTH * 2 + (this.props.hollowStyle?.height || 0),
          borderWidth: BORDER_WIDTH,
          borderRadius: BORDER_WIDTH + (this.props.hollowStyle?.borderRadius || 0),
          borderColor: this.props.hollowStyle?.borderColor || 'rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
      >
        {this.props.children}
      </View>
    )
  }

  render() {
    return(
      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
          this.props.style,
        ]}
      >
        {this.renderHole()}
      </View>
    )
  }
}

export default HollowView