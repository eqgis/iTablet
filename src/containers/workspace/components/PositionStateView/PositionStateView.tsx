import React, {Component} from "react"
import { Text, Animated } from 'react-native'
import styles from './style'

interface Props {
  pointStateText: string,
  isPointParamShow: boolean,
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
          (!this.props.isPointParamShow || this.props.pointStateText == "") && styles.containerHiden
        ]}
      >
        <Text style={[styles.text]}>{this.props.pointStateText}</Text>
      </Animated.View>
    )
  }
}
