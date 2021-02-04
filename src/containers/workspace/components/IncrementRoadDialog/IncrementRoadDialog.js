/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import HardwareBackHandler from '../../../../components/HardwareBackHandler'
import { color } from '../../../../styles'

export default class IncrementRoadDialog extends Component {
  props: {
    children: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  onBack = () => {
    this.setVisible(false)
    return true
  }

  setVisible = visible => {
    visible = visible === undefined ? !this.state.visible : visible
    if (visible === this.state.visible) return
    this.setState({
      visible,
    })
  }

  render() {
    if (!this.state.visible) return <View />
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.setVisible(false)
        }}
      >
        <HardwareBackHandler onBackPress={this.onBack}/>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.overlay,
  },
})
