/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { getPublicAssets } from '../../../../assets'
import { color, zIndexLevel } from '../../../../styles'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'
import { TouchType } from '../../../../constants'
import { getLanguage } from '../../../../language'

export default class PreviewHeader extends React.Component {
  props: {
    navigation: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    this.top = new Animated.Value(-300)
    this.params = {}
    this.visible = false
  }

  setVisible = (iShow, params = this.params) => {
    if (iShow === this.visible) {
      return
    }
    this.params = params
    this.visible = iShow
    GLOBAL.TouchType = iShow ? TouchType.NULL : TouchType.NORMAL
    Animated.timing(this.top, {
      toValue: iShow ? 0 : -300,
      time: 300,
    }).start()
  }

  _back = () => {
    this.props.navigation.navigate('CustomModePage')
    this.setVisible(false, {})
  }

  _confirm = () => {
    //confirm
    this.setVisible(false, {})
    GLOBAL.ToolBar && GLOBAL.ToolBar.existFullMap()
    GLOBAL.TouchType = TouchType.NORMAL
    ToolbarModule.setData({})
  }
  render() {
    const backImg = getPublicAssets().common.icon_back
    return (
      <Animated.View
        style={[
          styles.container,
          {
            paddingTop: screen.getIphonePaddingTop(),
            height: screen.getHeaderHeight(),
            top: this.top,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={this._back}>
          <Image source={backImg} resizeMode={'contain'} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {getLanguage(this.props.language).Map_Main_Menu.CUSTOM_THEME_MAP}
          </Text>
        </View>
        <TouchableOpacity style={styles.confirm} onPress={this._confirm}>
          <Text style={styles.confirmTxt}>
            {getLanguage(this.props.language).Map_Settings.CONFIRM}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.white,
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleSize(20),
  },
  back: {
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    color: color.content,
    fontSize: setSpText(36),
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  confirm: {
    height: scaleSize(50),
    marginHorizontal: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTxt: {
    fontSize: setSpText(20),
    color: color.content,
  },
})
