/*
  图片按钮
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: ysl19910917@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, ViewStyle, ImageStyle, ImageSourcePropType, TextStyle, GestureResponderEvent, FlexStyle } from 'react-native'
import { scaleSize, setSpText } from '../utils'
import { color } from '../styles'

interface Props extends Partial<DefaultProps> {
  containerStyle?: ViewStyle,
  titleStyle?: TextStyle,
  iconBtnStyle?: ViewStyle,
  iconStyle?: ImageStyle,
  onPress: (event: GestureResponderEvent) => void,
  icon?: ImageSourcePropType,
  title?: string,
}

interface DefaultProps {
  activeOpacity: number,
  resizeMode: 'contain',
  direction: FlexStyle['flexDirection'],
  enabled: boolean,
}

const defaultProps: DefaultProps = {
  activeOpacity: 0.8,
  resizeMode: 'contain',
  direction: 'column',
  enabled: true,
}

export default class ImageButton extends React.Component<Props & DefaultProps> {


  static defaultProps = defaultProps

  render() {
    if (!this.props.icon && !this.props.title) {
      return null
    }

    return (
      <TouchableOpacity
        disabled={!this.props.enabled}
        accessible={true}
        accessibilityLabel={'图片按钮'}
        activeOpacity={this.props.activeOpacity}
        onPress={event => {
          if (this.props.enabled) {
            this.props.onPress && this.props.onPress(event)
          }
        }}
        style={[
          styles.container,
          { flexDirection: this.props.direction },
          this.props.containerStyle,
        ]}
      >
        {
          this.props.icon &&
          <View
            style={[
              // this.props.type === 'normal' ? styles.iconBgNormal : styles.iconBg,
              styles.iconBg,
              this.props.iconBtnStyle,
            ]}
          >
            <Image
              resizeMode={this.props.resizeMode}
              style={[styles.icon, this.props.iconStyle]}
              source={this.props.icon}
            />
          </View>
        }
        {
          this.props.title && (
            <Text
              numberOfLines={2}
              style={[
                styles.iconTitle,
                // this.props.direction === 'column' && { marginTop: scaleSize(10) },
                this.props.titleStyle,
              ]}
            >
              {this.props.title}
            </Text>
          )
        }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconBg: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    height: scaleSize(50),
    width: scaleSize(50),
  },
  iconTitle: {
    flexWrap: 'wrap',
    fontSize: setSpText(20),
    color: color.blue2,
    backgroundColor: 'transparent',
  },
})
