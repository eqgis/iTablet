import React, { PureComponent } from 'react'
import {
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native'

interface Props {
  onPress: (ref: TouchableOpacity, index: number) => void,
  text: string,
  index: number,
  style?: ViewStyle,
  textStyle?: TextStyle,
}

export default class CellButton extends PureComponent<Props> {
  cellButton: TouchableOpacity | null | undefined
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <TouchableOpacity
        ref={ref => this.cellButton = ref}
        activeOpacity={1}
        style={[this.props.style]}
        onPress={() => this.cellButton && this.props.onPress(this.cellButton, this.props.index)}
      >
        <Text style={[this.props.textStyle]}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    )
  }
}