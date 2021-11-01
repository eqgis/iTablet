/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { View, TextInput, Text, StyleSheet, Platform } from 'react-native'
import { scaleSize, screen, setSpText, Toast } from '../../../../../../../utils'
import { Const } from '../../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../../language'

const TIME_INTERVAL = 300
export default class LayerVisibilityView extends Component {
  props: {
    mapScale: String,
    currentType: String,
  }
  constructor(props) {
    super(props)
    this.state = {
      mapScale: props.mapScale,
    }
    this.listener = null
    this.startTime = 0
    this.endTime = 0
  }

  componentDidMount() {
    this.listener = SMap.addScaleChangeDelegate({
      scaleViewChange: this._scaleViewChange,
    })
  }

  componentWillUnmount() {
    SMap.removeScaleChangeDelegate(this.listener)
  }

  _scaleViewChange = data => {
    this.endTime = +new Date()
    if (data && data.scale && this.endTime - this.startTime > TIME_INTERVAL) {
      this.startTime = this.endTime
      this.setState({
        mapScale: Number.parseFloat((1 / data.scale).toFixed(6)),
      })
    }
  }

  render() {
    let orientation = GLOBAL.getDevice().orientation
    let leftStyle = {
      left: (screen.getScreenWidth(orientation) - scaleSize(220)) / 2,
    }
    return (
      <View style={[styles.textContainer, leftStyle]}>
        <Text style={styles.text}>1:</Text>
        <TextInput
          style={styles.input}
          keyboardType={'numeric'}
          value={this.state.mapScale + ''}
          returnKeyType={'done'}
          onBlur={async evt => {
            let mapScale = 0
            if (
              (evt.nativeEvent.text !== '' && isNaN(evt.nativeEvent.text)) ||
              evt.nativeEvent.text === ''
            ) {
              Toast.show(getLanguage(GLOBAL.language).Prompt.TRANSFER_PARAMS)
            } else {
              mapScale = Number.parseFloat(this.state.mapScale)
              //地图比例尺跟着变
              await SMap.setMapScale(1.0 / mapScale)
              SMap.refreshMap()
            }
            this.setState({
              mapScale,
            })
          }}
          onChangeText={mapScale => {
            this.setState({
              mapScale,
            })
          }}
          // onEndEditing={async evt => {
          //   let mapScale = 0
          //   if (
          //     (evt.nativeEvent.text !== '' && isNaN(evt.nativeEvent.text)) ||
          //     evt.nativeEvent.text === ''
          //   ) {
          //     Toast.show(getLanguage(GLOBAL.language).Prompt.TRANSFER_PARAMS)
          //   } else {
          //     mapScale = Number.parseFloat(this.state.mapScale)
          //     //地图比例尺跟着变
          //     await SMap.setMapScale(1.0 / mapScale)
          //     SMap.refreshMap()
          //   }
          //   this.setState({
          //     mapScale,
          //   })
          // }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (screen.isIphoneX()? scaleSize(150):scaleSize(80)) : scaleSize(60),
    maxWidth: scaleSize(320),
    paddingHorizontal: scaleSize(10),
    height: scaleSize(80),
    backgroundColor: 'rgba(240,240,240,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: setSpText(20),
  },
  input: {
    height: Const.BOTTOM_HEIGHT,
    maxWidth: scaleSize(280),
    minWidth: scaleSize(80),
    fontSize: setSpText(20),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
