/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import styles from './styles'

export default class ChooseColor extends PureComponent {
  props: {
    title: string,
    value: any,
    defaultValue: any,
    style?: StyleSheet,
    getValue?: () => {},
  }

  static defaultProps = {
    value: 'blue',
  }

  constructor(props) {
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
