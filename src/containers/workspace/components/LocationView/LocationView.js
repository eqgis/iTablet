/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image, Animated } from 'react-native'

import { constUtil, FetchUtils, scaleSize } from '../../../../utils'
import { getThemeAssets } from '../../../../assets'
import { color } from '../../../../styles'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'

export default class LocationView extends React.Component {
  props: {
    getNavigationDatas: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
    this.isStart = true
  }
  _location = async () => {
    let point = await SMap.getCurrentPosition()
    if (this.isStart) {
      global.STARTX = point.x
      global.STARTY = point.y
      await SMap.getStartPoint(global.STARTX, global.STARTY, false)
      global.STARTNAME =
        (await FetchUtils.getPointName(global.STARTX, global.STARTY)) ||
        `${
          getLanguage(global.language).Map_Main_Menu.START_POINT
        }(${global.STARTX.toFixed(6)},${global.STARTY.toFixed(6)})`
    } else {
      global.ENDX = point.x
      global.ENDY = point.y
      await SMap.getEndPoint(global.ENDX, global.ENDY, false)
      global.ENDNAME =
        (await FetchUtils.getPointName(global.ENDX, global.ENDY)) ||
        `${
          getLanguage(global.language).Map_Main_Menu.END_POINT
        }(${global.ENDX.toFixed(6)},${global.ENDY.toFixed(6)})`
    }
    SMap.moveToPoint(point)
  }

  setVisible = (visible, isStart) => {
    if (visible === this.state.visible && isStart === this.isStart) return
    if (isStart !== undefined) {
      this.isStart = isStart
    }
    this.setState({
      visible,
    })
  }

  render() {
    if (!this.state.visible) return null
    let locationImg = getThemeAssets().mapTools.icon_location
    return (
      <Animated.View style={styles.container}>
        <TouchableOpacity
          underlayColor={constUtil.UNDERLAYCOLOR_TINT}
          style={{
            flex: 1,
          }}
          onPress={() => {
            this._location()
          }}
        >
          <Image source={locationImg} style={styles.icon} />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: scaleSize(215),
    backgroundColor: color.content_white,
    borderRadius: scaleSize(4),
    left: scaleSize(35),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
})
