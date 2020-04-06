/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { color, zIndexLevel } from '../../../../styles'

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: zIndexLevel.THREE,
    backgroundColor: color.overlay_tint,
  },
})

export default class OverlayView extends React.Component {
  props: {
    isFullScreen?: boolean,
    onPress?: () => {},
  }

  static defaultProps = {
    isFullScreen: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  setVisible = visible => {
    if (this.state.visible === visible) return
    this.setState({
      visible,
    })
  }

  getVisible = () => {
    return this.state.visible
  }

  render() {
    if (!this.state.visible) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={() => {
          this.props.onPress && this.props.onPress()
        }}
      />
    )
  }
}
