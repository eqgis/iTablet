/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { Text, TouchableOpacity, Platform, Image } from 'react-native'
import { getThemeAssets, getPublicAssets } from '../../../assets'

import styles from './styles'

export default class AppletItem extends React.Component {
  props: {
    data: Object,
    user: Object,
    selected: boolean,
    onPress: () => {},
  }
  
  static defaultProps = {
    selected: false,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.selected,
    }
  }
  
  componentDidMount() {
  }
  
  shouldComponentUpdate(prevProps, preState) {
    if (preState.selected !== this.state.selected) {
      return true
    }
    return false
  }
  
  _onPress = () => {
    this.setState({
      selected: !this.state.selected,
    }, () => {
      this.props.onPress && this.props.onPress({
        data: this.props.data,
        selected: this.state.selected,
      })
    })
  }
  
  render() {
    let titleName = ''
    if (this.props.data.fileName) {
      let index = this.props.data.fileName.lastIndexOf('.')
      titleName =
        index === -1
          ? this.props.data.fileName
          : this.props.data.fileName.substring(0, index)
      const suffix = (Platform.OS === 'ios' ? '.ios' : '.android') + '.bundle'
      if (titleName.endsWith(suffix)) {
        titleName = titleName.replace(suffix, '')
      }
    }
  
    const reg = new RegExp('_[0-9]{8}_[0-9]*$')
    let matchResult = titleName.match(reg)
    if (matchResult) {
      titleName = titleName.slice(0, matchResult.index)
    }
    
    const image = this.props.data.image || getThemeAssets().mine.my_applets_default
    const imageSelect = this.state.selected
      ? getPublicAssets().common.icon_select
      : getPublicAssets().common.icon_none
    
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={this._onPress}
        activeOpacity={1}
      >
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={image}
        />
        <Text style={styles.itemText}>{titleName}</Text>
        <Image
          style={styles.itemSelect}
          resizeMode={'contain'}
          source={imageSelect}
        />
      </TouchableOpacity>
    )
  }
}
