import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, ViewStyle, TextStyle, Image, ImageSourcePropType, StyleProp } from 'react-native'
import { scaleSize } from '../../../../../src/utils'

type IProp = {
  style?: StyleProp<ViewStyle>,
  titleStyle?: TextStyle,
  title?: string,
  image?: ImageSourcePropType,
  onPress: () => void
} & Partial<IDefaultProps>

interface IDefaultProps {
  activeOpacity: number,
  color: 'DEFAULT' | 'WHITE',
  disabled: boolean,
}

const defaultProps = {
  activeOpacity: 0.8,
  color: 'DEFAULT',
  disabled: false,
}

const Button = class Button extends PureComponent<IProp & IDefaultProps> {
  static defaultProps = defaultProps

  action = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    let style: ViewStyle = {}
    let textStyle: TextStyle = {}
    switch (this.props.color) {
      case 'WHITE':
        style = {
          backgroundColor: '#F6F7F8',
          borderColor: '#EBEBEB',
        }
        textStyle = {
          color: 'black'
        }
        break
      default:
        break
    }
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={this.props.title}
        activeOpacity={this.props.activeOpacity}
        style={[{
          height: scaleSize(45),
          minWidth: scaleSize(60),
          backgroundColor: '#2D2D2D',
          borderColor: '#2D2D2D',
          borderWidth: scaleSize(1),
          borderRadius: scaleSize(30),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: scaleSize(10),
          alignSelf: 'center'
        }, style, this.props.style]}
        onPress={this.action}
        disabled={this.props.disabled}
      >
        {this.props.image && (
          <Image
            style={[
              {
                width: scaleSize(25),
                height: scaleSize(25),
                marginHorizontal: scaleSize(5)
              }
            ]}
            source={this.props.image}
          />
        )}
        {this.props.title && (
          <Text
            style={[
              {
                textAlign: 'center',
                fontSize: scaleSize(20),
                color: 'white',
                marginHorizontal: scaleSize(5)
              },
              textStyle,
              this.props.titleStyle,
            ]}
          >
            {this.props.title}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
} as React.ComponentClass<IProp>

export default Button