import React, {Component} from "react"
import { Text, Animated } from 'react-native'
import styles from './style'

interface Props {
  pointStateText: string,
}

export default class PositionStateView extends Component<Props> {

  constructor(props: Props) {
    super(props)
    this.state = {
      text: this.props.pointStateText,
    }
  }


  render() {
    return (
      <Animated.View
        style={[
          styles.container,
        ]}
      >
        <Text style={[styles.text]}>{this.props.pointStateText}</Text>
      </Animated.View>
    )
  }
}
