/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, TextInput, Image, TouchableOpacity } from 'react-native'
import { getPublicAssets } from '../../assets'
import { color } from '../../styles'
import styles from './styles'

export default class SearchBar extends PureComponent {
  props: {
    onBlur?: () => void, // 失去焦点事件
    onFocus?: () => void, // 获得焦点事件
    onClear?: () => void, // 清除文字
    onSubmitEditing?: (value: string) => void, // 提交

    style?: any, // 自定义内容样式
    defaultValue?: string, // 默认值
    editable?: string, // 是否可编辑
    placeholder?: string, // 占位符
    placeholderTextColor?: string, // 占位符颜色
    isFocused?: string, // 是否获得焦点
    keyboardAppearance?: string, // 键盘样式
    returnKeyType?: string, // Android上确定按钮文字
    returnKeyLabel?: string, // 键盘返回按钮文字
    blurOnSubmit?: string, // 是否提交失去焦点
  }

  static defaultProps = {
    isFocused: false,
    keyboardAppearance: 'default',
    returnKeyType: 'search',
    returnKeyLabel: '搜索',
    blurOnSubmit: true,
    placeholderTextColor: color.fontColorGray,
  }

  constructor(props) {
    super(props)
    this.state = {
      isFocused: props.isFocused,
      value: props.defaultValue,
    }
  }

  focus = () => {
    this.searchInput && this.searchInput.focus()
  }

  blur = () => {
    this.searchInput && this.searchInput.blur()
  }

  _onBlur = () => {
    if (this.state.value === '' && this.state.isFocused) {
      this.setState({
        isFocused: false,
      })
    }
    if (this.props.onBlur && typeof this.props.onBlur === 'function') {
      this.props.onBlur(this.state.value)
    }
  }

  _onFocus = () => {
    if (!this.state.isFocused) {
      this.setState({
        isFocused: true,
      })
    }
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(this.state.value)
    }
  }

  _clear = () => {
    if (this.props.onClear && typeof this.props.onClear === 'function') {
      this.props.onClear()
    }
    this.searchInput && this.searchInput.clear()
  }

  _onSubmitEditing = () => {
    if (
      this.props.onSubmitEditing &&
      typeof this.props.onSubmitEditing === 'function'
    ) {
      this.props.onSubmitEditing(this.state.value)
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Image
          style={styles.searchImg}
          resizeMode={'contain'}
          source={getPublicAssets().common.icon_search_a0}
        />
        <TextInput
          ref={ref => (this.searchInput = ref)}
          underlineColorAndroid={'transparent'}
          defaultValue={this.props.defaultValue}
          editable={this.props.editable}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          style={styles.input}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onSubmitEditing={this._onSubmitEditing}
          returnKeyLabel={this.props.returnKeyLabel}
          returnKeyType={this.props.returnKeyType}
          keyboardAppearance={this.props.keyboardAppearance}
          blurOnSubmit={this.props.blurOnSubmit}
          onChangeText={value => {
            this.setState({ value })
          }}
        />
        {
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={this._clear}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={require('../../assets/public/icon_input_clear.png')}
            />
          </TouchableOpacity>
        }
      </View>
    )
  }
}
