import React, { PureComponent } from 'react'
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
} from 'react-native'
import { scaleSize } from '../../utils'
import { getPublicAssets } from '../../assets'
import { size, color } from '../../styles'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    height: scaleSize(80),
    alignItems: 'center',
    paddingLeft: scaleSize(50),
    paddingRight: scaleSize(50),
  },
  icon: {
    width: scaleSize(48),
    height: scaleSize(48),
    // marginRight: scaleSize(30),
  },
  itemText: {
    // lineHeight: scaleSize(28),
    padding: 0,
    flex: 1,
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeXl,
    // color: color.itemColorGray,
    // fontSize: setSpText(26),
    color: '#505050',
  },
  arrowImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})

export default class MapSettingItem extends PureComponent {
  props: {
    type?: string, // string, default
    title: string,
    value?: string,
    leftImage: any,
    rightImage: any,
    action: () => {},
    rightAction?: () => {},
    style?: Object,
  }
  
  _renderRightView = () => {
    let rightView
    switch (this.props.type) {
      case 'switch':
        rightView = (
          <Switch
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={this.props.value ? color.bgW : color.bgW}
            ios_backgroundColor={
              this.props.value ? color.switch : color.bgG
            }
            value={this.props.value}
            onValueChange={value => {
              if (typeof this.props.rightAction === 'function') {
                this.props.rightAction(value)
              }
            }}
          />
        )
        break
      default:
        rightView = (
          <Image
            style={styles.arrowImg}
            resizeMode={'contain'}
            source={this.props.rightImage || getPublicAssets().common.icon_move}
          />
        )
    }
    return rightView
  }
  
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.action) {
            this.props.action(this.props)
          }
        }}
        style={[styles.itemContainer, this.props.style]}
      >
        {
          this.props.leftImage &&
          <Image
            style={styles.icon}
            resizeMode={'contain'}
            source={this.props.leftImage}
          />
        }
        <Text
          style={[
            styles.itemText,
            this.props.leftImage && { marginLeft: scaleSize(40) },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {this.props.title}
        </Text>
        {this._renderRightView()}
      </TouchableOpacity>
    )
  }
}
