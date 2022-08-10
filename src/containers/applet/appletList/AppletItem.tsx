/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { Text, TouchableOpacity, Platform, Image } from 'react-native'
import { getThemeAssets, getPublicAssets } from '@/assets'

import styles from './styles'

interface Props {
  data: any,
  selected: boolean,
  onPress: (params: {data: any, selected: boolean}) => void,
}

interface State {
  selected: boolean,
}

export default class AppletItem extends React.Component<Props, State> {

  static defaultProps = {
    selected: false,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      selected: this.props.selected,
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(prevProps: Props, preState: State) {
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
    // let titleName = ''
    // if (this.props.data.fileName) {
    //   const index = this.props.data.fileName.lastIndexOf('.')
    //   titleName =
    //     index === -1
    //       ? this.props.data.fileName
    //       : this.props.data.fileName.substring(0, index)
    //   const suffix = (Platform.OS === 'ios' ? '.ios' : '.android') + '.bundle'
    //   if (titleName.endsWith(suffix)) {
    //     titleName = titleName.replace(suffix, '')
    //   }
    // }

    // const reg = new RegExp('_[0-9]{8}_[0-9]*$')
    // const matchResult = titleName.match(reg)
    // if (matchResult) {
    //   titleName = titleName.slice(0, matchResult.index)
    // }

    let titleName = this.props.data.key
    if (titleName) {
      const index = titleName.lastIndexOf('.')
      titleName =
        index === -1
          ? titleName
          : titleName.substring(0, index)
      const suffix = (Platform.OS === 'ios' ? '.ios' : '.android') + '.bundle'
      if (titleName.endsWith(suffix)) {
        titleName = titleName.replace(suffix, '')
      }
    }

    const reg = new RegExp('_[0-9]{8}_[0-9]*$')
    const matchResult = titleName.match(reg)
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
