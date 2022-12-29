/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { Text, TouchableOpacity, ImageBackground, Platform } from 'react-native'
import { getLanguage } from '@/language'
import { getThemeAssets } from '@/assets'

import styles from './styles'
import { BundleType } from 'imobile_for_reactnative'

interface Props {
  data: BundleType,
  onPress: (data: BundleType) => void,
}

interface State {
  progress: string | number,
  isDownloading: boolean,
}

export default class AppletItem extends React.Component<Props, State> {

  path: string | undefined = undefined
  exist = false
  downloading = false
  downloadingPath = false

  constructor(props: Props) {
    super(props)
    this.state = {
      progress: getLanguage(global.language).Prompt.DOWNLOAD,
      isDownloading: false,
    }
  }

  componentDidMount() {
  }

  _action = () => {
    this.props.onPress?.(this.props.data)
  }

  render() {
    let titleName = this.props.data.name
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

    const image = this.props.data.icon || getThemeAssets().mine.my_applets_default

    return (
      <TouchableOpacity
        style={styles.btn}
        onPress={this._action}
      >
        <ImageBackground
          resizeMode={'contain'}
          source={image}
          style={styles.itemImg}
        >
          {/* {
            this.state.isDownloading && (
              <Animated.View style={styles.progressView}>
                <Text style={styles.progressText}>{this.state.progress}</Text>
              </Animated.View>
            )
          } */}
        </ImageBackground>
        <Text style={styles.itemText}>{titleName}</Text>
      </TouchableOpacity>
    )
  }
}
