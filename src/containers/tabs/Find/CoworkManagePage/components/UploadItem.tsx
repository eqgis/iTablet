/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet, Animated, Easing } from 'react-native'
import { scaleSize } from '../../../../../utils'
import { CheckBox } from '../../../../../components'
import { getPublicAssets, getThemeAssets } from '../../../../../assets'
import { color } from '../../../../../styles'

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scaleSize(30),
  },
  contentView: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentSubView: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  itemTitle: {
    fontSize: scaleSize(26),
    color: color.fontColorBlack,
  },
  checkBox: {
    height: scaleSize(30),
    width: scaleSize(60),
  },
  itemImg: {
    width: scaleSize(48),
    height: scaleSize(48),
    marginRight: scaleSize(30),
  },
  itemStatus: {
    fontSize: scaleSize(26),
    color: color.fontColorGray,
    marginRight: scaleSize(20),
  },
  downloadImg: {
    height: scaleSize(44),
    width: scaleSize(44),
  },
})

interface State {
  rotateValue: Animated.Value,
}

interface Props {
  data: any,
  isUploading?: boolean,
  uploadingInfo?: string,
  checked?: boolean,
  onChange?: (value: boolean) => void,
  onPress?: (item?: any) => void,
}

export default class UploadItem extends Component<Props, State> {

  aniMotion: any

  static defaultProps = {
    isUploading: false,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      rotateValue: new Animated.Value(0),
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Props) {
    if (JSON.stringify(prevProps.isUploading) !== JSON.stringify(this.props.isUploading)) {
      if (this.props.isUploading) {
        this._spin()
      } else {
        this.aniMotion = null
      }
    }
  }

  _onChange = (value: boolean) => {
    this.props.onChange && this.props.onChange(value)
  }

  _onPress = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  _spin = () => {
    if (!this.aniMotion && this.props.isUploading) {
      this.state.rotateValue.setValue(0)
      this.aniMotion = Animated.timing(this.state.rotateValue,{
        toValue: this.state.rotateValue._value === 0 ? 1 : 0,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      });
      Animated.loop(this.aniMotion).start()
    }
  }
  
  render() {
    let item = this.props.data
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={this._onPress}
      >
        <CheckBox
          style={styles.checkBox}
          checked={this.props.checked}
          onChange={this._onChange}
        />
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          // source={getThemeAssets().dataType.icon_map}
          source={require('../../../../../assets/mapToolbar/list_type_map_black.png')}
        />
        <View style={styles.contentView}>
          <Text style={styles.itemTitle}>{item.name.replace('.xml', '')}</Text>
          <View style={styles.contentSubView}>
            {
              this.props.uploadingInfo &&
              <Text style={styles.itemStatus}>{this.props.uploadingInfo}</Text>
            }
            {
            this.props.isUploading &&
            <Animated.Image
              resizeMode={'contain'}
              style={[
                styles.downloadImg,
                {
                  transform: [{rotate: this.state.rotateValue
                    .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']})
                  }]
                }
              ]}
              source={getPublicAssets().common.icon_downloading}
            />
          }
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
