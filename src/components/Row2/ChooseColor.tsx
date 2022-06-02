/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { StyleProp, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import styles from './styles'

interface Props {
  title: string,
  value: string,
  style?: StyleProp<TouchableOpacityProps>,
  getValue?: (value: string) => void,
}

export default class ChooseColor extends PureComponent<Props> {

  static defaultProps = {
    value: 'blue',
  }

  constructor(props: Props) {
    super(props)
  }

  getValue = () => {
    this.props.getValue && this.props.getValue(this.props.value)
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.chooseColorContainer, this.props.style, { backgroundColor: this.props.value }]}
        accessible={true}
        accessibilityLabel={this.props.title}
        onPress={() => this.getValue()}
      />
    )
  }
}
