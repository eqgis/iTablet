/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { StyleProp, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import styles from './styles'

interface Props {
  style?: StyleProp<TouchableOpacityProps>,
  title: string,
  value: string,
  defaultValue: string,
  getValue?: (value: string) => void,
}

export default class LabelBtn extends PureComponent<Props> {

  static defaultProps = {
    unit: 'm',
    minValue: 1,
    maxValue: 5,
    defaultValue: '请选择',
  }

  constructor(props: Props) {
    super(props)
    // this.state = {
    //   value: props.defaultValue,
    // }
  }

  getValue = () => {
    this.props.getValue && this.props.getValue(this.props.value)
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.textBtnContainer, this.props.style]}
        accessible={true}
        accessibilityLabel={this.props.title}
        onPress={() => this.getValue()}
      >
        <Text style={styles.textBtnTitle}>{this.props.value}</Text>
      </TouchableOpacity>
    )
  }
}