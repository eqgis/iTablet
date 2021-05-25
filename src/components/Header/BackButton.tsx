/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { Text, View, Image, TouchableOpacity, GestureResponderEvent } from 'react-native'
import styles from './styles'
import { scaleSize } from '../../utils'
import { getPublicAssets } from '../../assets'

interface Props {
  style?: any,
  darkBackBtn?: boolean,
  count?: number,
  activeOpacity?: number,
  image?: any,
  imageStyle?: any,
  onPress: (event: GestureResponderEvent) => void,
}

class BackButton extends PureComponent<Props> {

  static defaultProps = {
    image: getPublicAssets().common.icon_back,
  }

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={'返回'}
        style={[{
          width: scaleSize(60),
          height: scaleSize(60),
        }, this.props.style]}
        activeOpacity={this.props.activeOpacity}
        onPress={event => {
          this.props.onPress && this.props.onPress(event)
        }}
      >
        {this.props.count ? <Text style={styles.count}>({this.props.count})</Text> : null}
        <View
          style={[styles.iconBtnBg, this.props.darkBackBtn && styles.iconBtnBgDarkColor]}
        >
          <Image
            source={this.props.image}
            style={[styles.backIcon, this.props.imageStyle]}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

export default BackButton
