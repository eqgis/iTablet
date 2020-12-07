/*
  Copyright © SuperMap. All rights reserved.
  Author: Yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import {
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'
import { constUtil, scaleSize } from '../../utils/index'
import { size } from '../../styles/index'

const BTN_UNDERCOLOR = constUtil.UNDERLAYCOLOR_TINT

export default class MTBtn extends React.Component {
  props: {
    image: any, // 未点击时图片
    selectedImage?: any, // 点击时图片
    size?: string, // 图片文字大小
    title?: string, // 文字
    onPress: () => void, // 点击事件
    textStyle?: any, // 自定义文字样式
    textColor?: string, // 自定义文字颜色
    imageStyle?: any, // 自定义图片样式
    style?: any, // 自定义按钮样式
    selected?: boolean, // 是否被选中
    selectMode?: string, // normal: 选择 | 非选择状态
    // flash：按下和松开
    activeOpacity?: number, // 点击按钮透明度 0 - 1
    separator?: number, // 图片和文字的间距
    onPressIn?: () => void, // 按下时的事件
    onPressOut?: () => void, // 松开时的事件
    opacity?: number, // 点击后透明度，若无，在为TouchableHighlight，反之为TouchableOpacity
  }

  static defaultProps = {
    activeOpacity: 1,
    size: 'normal',
    selected: false,
    selectMode: 'normal', // normal: 选择 | 非选择状态     ---    flash：按下和松开
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected,
    }
    this.clickAble = true // 防止重复点击
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  action = e => {
    if (this.props.selectMode === 'flash') return
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 100)
      this.props.onPress && this.props.onPress(e)
    }
  }

  _onPressOut = e => {
    if (this.props.onPressOut) {
      this.props.onPressOut()
      return
    }
    if (this.props.selectMode === 'normal') return
    this.setState(
      {
        selected: false,
      },
      () => {
        this.props.onPress && this.props.onPress(e)
      },
    )
  }

  _onPressIn = () => {
    if (this.props.onPressIn) {
      this.props.onPressIn()
      return
    }
    if (this.props.selectMode === 'normal') return
    this.setState({
      selected: true,
    })
  }

  setNativeProps = props => {
    this.mtBtn && this.mtBtn.setNativeProps(props)
  }

  render() {
    let imageStyle, textStyle

    switch (this.props.size) {
      case 'small':
        imageStyle = styles.smallImage
        textStyle = styles.smallText
        break
      case 'large':
        imageStyle = styles.largeImage
        textStyle = styles.largeText
        break
      default:
        imageStyle = styles.normalImage
        textStyle = styles.normalText
        break
    }

    let image
    if (this.props.selectMode === 'flash' && this.props.selectedImage) {
      image = this.state.selected ? this.props.selectedImage : this.props.image
    } else if (this.props.selectedImage) {
      image = this.props.selected ? this.props.selectedImage : this.props.image
    } else {
      image = this.props.image
    }

    let TouchBtn =
      this.props.opacity >= 0 ? TouchableOpacity : TouchableHighlight

    return (
      <TouchBtn
        ref={ref => (this.mtBtn = ref)}
        accessible={true}
        activeOpacity={this.props.activeOpacity}
        accessibilityLabel={this.props.title}
        onPress={this.action}
        style={[styles.container, this.props.style]}
        underlayColor={BTN_UNDERCOLOR}
        onPressOut={this._onPressOut}
        onPressIn={this._onPressIn}
      >
        <View style={styles.container}>
          {image && (
            <Image
              resizeMode={'contain'}
              style={[imageStyle, this.props.imageStyle]}
              source={image}
            />
          )}
          {this.props.title && (
            <Text
              style={[
                { marginTop: scaleSize(5) },
                textStyle,
                this.props.textStyle,
                this.props.textColor && { color: this.props.textColor },
                this.props.separator && { marginTop: this.props.separator },
              ]}
            >
              {this.props.title}
            </Text>
          )}
        </View>
      </TouchBtn>
    )
  }
}

MTBtn.Size = {
  LARGE: 'large',
  NORMAL: 'normal',
  SMALL: 'small',
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  largeImage: {
    height: scaleSize(65),
    width: scaleSize(65),
  },
  normalImage: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  smallImage: {
    height: scaleSize(55),
    width: scaleSize(55),
  },
  largeText: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  normalText: {
    fontSize: scaleSize(20),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  smallText: {
    fontSize: size.fontSize.fontSizeXs,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})
