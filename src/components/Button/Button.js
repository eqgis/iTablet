/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import styles from './styles'

export default class Button extends PureComponent {
  props: {
    style?: any,
    titleStyle?: any,
    title: string,
    activeOpacity?: number,
    type?: string,
    disabled?: Boolean,
    onPress?: () => void,
  }

  static defaultProps = {
    activeOpacity: 0.8,
    type: 'BLUE',
    disabled: false,
  }

  constructor(props) {
    super(props)
  }

  action = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    let color, textColor
    switch (this.props.type) {
      case 'GRAY':
        color = styles.gray
        textColor = 'white'
        break
      case 'RED':
        color = styles.red
        textColor = 'white'
        break
      case 'BLUE':
      default:
        color = styles.blue
        textColor = 'white'
        break
    }
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={this.props.title}
        activeOpacity={this.props.activeOpacity}
        style={[styles.baseStyle, color, this.props.style]}
        onPress={this.action}
        disabled={this.props.disabled}
      >
        <Text
          style={[
            styles.btnTitle,
            textColor && { color: textColor },
            this.props.titleStyle,
          ]}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

Button.Type = {
  BLUE: 'BLUE',
  RED: 'RED',
  GRAY: 'GRAY',
}
