/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { getPublicAssets } from '../assets'

export default class CheckBox extends React.Component {
  props: {
    onChange: (boolean) => void,
    style?: Object,
    imgStyle?: Object,
    disable?: boolean,
    checked?: boolean,
    type?: string,
    type?: string,
    type?: string,
    checkedImg?: any,
    unCheckedImg?: any,
    checkedDisableImg?: any,
    unCheckedDisableImg?: any,
  }

  static defaultProps = {
    disable: false,
    type: 'square', // square 方形 | circle 圆形
  }

  constructor(props) {
    super(props)
    this.isPropsEdit = false
    let isCheckd = false
    if (this.props.checked) {
      isCheckd = true
    }
    this.state = {
      checked: isCheckd,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      (this.props.checked !== undefined &&
        nextProps.checked !== this.state.checked)
    ) {
      if (
        JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
        nextProps.checked !== this.state.checked
      ) {
        this.isPropsEdit = true
      }
      return true
    }
    return false
  }

  componentDidUpdate() {
    if (this.isPropsEdit && this.props.checked !== undefined) {
      this.setState({
        checked: this.props.checked,
      })
      this.isPropsEdit = false
    }
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

  getIcon = () => {
    let icon
    if (this.state.checked) {
      if (this.props.checkedImg && !this.props.disable) {
        icon = this.props.checkedImg
      } else if (this.props.checkedDisableImg && this.props.disable) {
        icon = this.props.checkedDisableImg
      }
    } else {
      if (this.props.unCheckedImg && !this.props.disable) {
        icon = this.props.unCheckedImg
      } else if (this.props.unCheckedDisableImg && this.props.disable) {
        icon = this.props.unCheckedDisableImg
      }
    }
    if (!icon) {
      switch(this.props.type) {
        case 'circle':
          if (!this.props.disable) {
            icon = this.state.checked
              ? getPublicAssets().common.icon_select
              : getPublicAssets().common.icon_none
          } else {
            icon = this.state.checked
              ? getPublicAssets().common.icon_disable_select
              : getPublicAssets().common.icon_disable_none
          }
          break
        case 'square':
        default:
          if (!this.props.disable) {
            icon = this.state.checked
              ? getPublicAssets().common.icon_check
              : getPublicAssets().common.icon_uncheck
          } else {
            icon = this.state.checked
              ? getPublicAssets().common.icon_check_disable
              : getPublicAssets().common.icon_uncheck_disable
          }
          break
      }
    }
    return icon
  }

  render() {
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
          source={this.getIcon()}
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
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  btn_image: {
    height: 30,
    width: 30,
  },
})
