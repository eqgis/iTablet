/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { getPublicAssets } from '../../assets'
import { scaleSize } from '../../utils'

export default class RadioButton extends React.Component {
  props: {
    onChange: () => {},
    checkStatus: string,
    style?: Object,
    imgStyle?: Object,
    disable?: boolean,
  }

  static defaultProps = {
    disable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  _btnPress = () => {
    if (this.props.disable) return
    this.setState(
      oldState => {
        let newState = !oldState.checked
        return {
          checked: newState,
        }
      },
      (() => {
        this.props.onChange(this.state.checked)
      }).bind(this),
    )
  }

  setChecked = value => {
    this.setState({
      checked: value,
    })
  }

  isChecked = () => {
    return this.state.checked
  }

  render() {
    let icon
    if (!this.props.disable) {
      icon = this.state.checked
        ? getPublicAssets().common.icon_select
        : getPublicAssets().common.icon_none
    } else {
      icon = this.state.checked
        ? getPublicAssets().common.icon_disable_select
        : getPublicAssets().common.icon_disable_none
    }
    return (
      <TouchableOpacity
        disable={this.props.disable}
        style={[styles.btn, this.props.style]}
        onPress={this._btnPress}
        underlayColor={'transparent'}
      >
        <Image
          resizeMode={'contain'}
          style={[styles.btn_image, this.props.imgStyle]}
          source={icon}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  btn_image: {
    height: scaleSize(32),
    width: scaleSize(32),
  },
})
