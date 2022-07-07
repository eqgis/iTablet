import React from 'react'
import { View } from 'react-native'
import { scaleSize } from '../../utils'

export default class ColorScheme extends React.Component {
  props: {
    colors: Array, //颜色数组
    style: Object,
  }

  constructor(props) {
    super(props)
  }

  renderItem = (color, index) => {
    let colorS = `rgb(${color.r}, ${color.g}, ${color.b})`
    return (
      <View
        key={index + ''}
        style={{
          flex: 1,
          backgroundColor: colorS,
        }}
      />
    )
  }

  renderItems = () => {
    let items = []
    for (let i = 0; i < this.props.colors.length; i++) {
      items.push(this.renderItem(this.props.colors[i], i))
    }
    return items
  }

  render() {
    return (
      <View
        style={[
          {
            width: scaleSize(300),
            height: scaleSize(30),
            flexDirection: 'row',
          },
          this.props.style,
        ]}
      >
        {this.renderItems()}
      </View>
    )
  }
}
