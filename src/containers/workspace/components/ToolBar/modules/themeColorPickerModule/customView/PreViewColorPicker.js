/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import {View, Image, TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native'
import Slider from 'react-native-slider'
import ToolbarModule from "../../ToolbarModule"
import { SThemeCartography } from 'imobile_for_reactnative'
import { color, size } from '../../../../../../../styles'
import { scaleSize, setSpText, Toast } from '../../../../../../../utils'
import { ColorWheel } from 'react-native-color-wheel'
import colorsys from 'colorsys'
import { ConstToolType } from '../../../../../../../constants'
import { getLanguage } from '../../../../../../../language'

export default class PreviewColorPicker extends Component {
    props: {
        device: Object,
        data: Array,
        selectedIndex: Number,
        r: Number,
        g: Number,
        b: Number,
        currentLayer: Object,
    }

    constructor(props) {
      super(props)
      this.state = {
        leftSelect: true,
        data: props.data || [],
        r: props.r || 0,
        g: props.g || 0,
        b: props.b || 0,
        selectedIndex:props.selectedIndex === undefined ? 0 : props.selectedIndex,
      }
      this.visible = false
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if(nextProps.r !== this.props.r || nextProps.g !== this.props.g || nextProps.b !== this.props.b){
        let {r,g,b,data,selectedIndex} = nextProps
        this.setState({
          r,
          g,
          b,
          data,
          selectedIndex,
        })
      }
    }

    _changeLeftSelect = select => {
      if (this.state.leftSelect === select) {
        return
      }
      this.setState({
        leftSelect: select,
      })
    }

    _onValueChange = ({ name, value, rgbColor }) => {
      let data = JSON.parse(JSON.stringify(this.state.data))
      let r, g, b
      if (rgbColor !== undefined) {
        r = rgbColor.r
        g = rgbColor.g
        b = rgbColor.b
      } else {
        r = this.state.r
        g = this.state.g
        b = this.state.b
      }
      data[this.state.selectedIndex].color = {
        r,
        g,
        b,
      }
      if (name !== undefined) {
        this.setState({
          [`${name}`]: value,
          data,
        })
      } else {
        this.setState({
          r,
          g,
          b,
          data,
        })
      }
    }

    _setAttrToMap = async () => {
      let type = ToolbarModule.getData().customType
      let data = JSON.parse(JSON.stringify(this.state.data))
      let params = {
        LayerName: this.props.currentLayer.name,
        RangeList: data,
      }
      let rel = false
      switch (type) {
        case ConstToolType.SM_MAP_THEME_PARAM_RANGE_MODE:
          rel = await SThemeCartography.setCustomThemeRange(params)
          break
        case ConstToolType.SM_MAP_THEME_PARAM_RANGELABEL_MODE:
          rel = await SThemeCartography.setCustomRangeLabel(params)
          break
        case ConstToolType.SM_MAP_THEME_PARAM_UNIQUE_COLOR:
          rel = await SThemeCartography.setCustomThemeUnique(params)
          break
        case ConstToolType.SM_MAP_THEME_PARAM_UNIQUELABEL_COLOR:
          rel = await SThemeCartography.setCustomUniqueLabel(params)
          break
      }
      if (rel) {
        ToolbarModule.addData({ customModeData: data })
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.PARAMS_ERROR)
      }
    }

    _renderProgress = () => {
      let { r, g, b } = this.state
      let backStyle = {
        backgroundColor: `rgb(${r},${g},${b})`,
      }
      let marginStyle =
            this.props.device.orientation.indexOf('LANDSCAPE') === 0
              ? { marginTop: scaleSize(100) }
              : { marginTop: scaleSize(40) }
      return (
        <View style={styles.progressContainer}>
          <View style={[styles.colorView, backStyle]} />
          <View style={[styles.progresses, marginStyle]}>
            {this._renderSlider({ text: 'r', value: r })}
            {this._renderSlider({ text: 'g', value: g })}
            {this._renderSlider({ text: 'b', value: b })}
          </View>
        </View>
      )
    }

    _renderSlider = ({ text, value }) => {
      const minus = require('../../../../../../../assets/mapTool/icon_minus.png')
      const plus = require('../../../../../../../assets/mapTool/icon_plus.png')
      let sliderStyle =
            this.props.device.orientation.indexOf('LANDSCAPE') === 0
              ? { height: scaleSize(100) }
              : { height: scaleSize(60) }
      return (
        <View style={styles.progressItem}>
          <Text style={styles.sliderText}>{text.toUpperCase()}</Text>
          <TouchableOpacity
            onPress={() => {
              if(this.state[`${text}`] > 0){
                this._onValueChange({
                  name: text,
                  value: this.state[`${text}`] - 1,
                })
                this._setAttrToMap()
              }
            }}
          >
            <Image source={minus} style={styles.leftIcon} />
          </TouchableOpacity>
          <Slider
            style={[styles.slider, sliderStyle]}
            thumbStyle={{
              backgroundColor: color.item_selected_bg,
              width: scaleSize(30),
              height: scaleSize(30),
              borderRadius: scaleSize(15),
            }}
            trackStyle={{
              height: scaleSize(5),
            }}
            value={value}
            minimumValue={0}
            maximumValue={255}
            step={1}
            minimumTrackTintColor={color.item_selected_bg}
            maximumTrackTintColor={color.gray}
            onValueChange={val => {
              this._onValueChange({ name: text, value: val })
            }}
            onSlidingComplete={this._setAttrToMap}
          />
          <TouchableOpacity
            onPress={() => {
              if(this.state[`${text}`] < 255){
                this._onValueChange({
                  name: text,
                  value: this.state[`${text}`] + 1,
                })
                this._setAttrToMap()
              }
            }}
          >
            <Image source={plus} style={styles.rightIcon} />
          </TouchableOpacity>
          <Text style={styles.sliderText}>{value}</Text>
        </View>
      )
    }

    _renderColorPicker = () => {
      let extraContainerStyle = {
          flexDirection:'row',
        },
        colorWheelStyle = {},
        colorPickerTextStyle = {
          fontSize: size.fontSize.fontSizeMd,
          paddingVertical: scaleSize(30),
          textAlign: 'center',
        }
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        colorPickerTextStyle = {
          fontSize: size.fontSize.fontSizeMd,
          paddingLeft: scaleSize(10),
          paddingVertical: scaleSize(10),
          textAlign: 'center',
        }
        extraContainerStyle ={
          flexDirection: 'column',
        }
        colorWheelStyle = {
          marginTop:scaleSize(100),
          maxHeight: scaleSize(450),
        }
      }
      let { r, g, b } = this.state
      let colorHex = colorsys.rgb2Hex({
        r,
        g,
        b,
      })
      return (
        <View style={{ flex: 1,
          alignItems:'center',
          justifyContent:'space-around',
          ...extraContainerStyle}}>
          <View style={{flex: 1,...colorWheelStyle}}>
            <ColorWheel
              style={{
                width: Dimensions.get('window').width,
                height: scaleSize(300),
                alignSelf:'center',
              }}
              initialColor={colorHex}
              thumbSize={scaleSize(30)}
              onColorChange={hsvColor => {
                let rgbColor = colorsys.hsv2Rgb(hsvColor)
                this._onValueChange({ rgbColor })
              }}
              onColorChangeComplete={hsvColor => {
                let rgbColor = colorsys.hsv2Rgb(hsvColor)
                this._onValueChange({ rgbColor })
                this._setAttrToMap()
              }}
            />
          </View>
          <View
            style={{
              flex:1,
              width: scaleSize(200),
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text style={colorPickerTextStyle}>R: {this.state.r}</Text>
            <Text style={colorPickerTextStyle}>G: {this.state.g}</Text>
            <Text style={colorPickerTextStyle}>B: {this.state.b}</Text>
          </View>
        </View>
      )
    }
    render() {
      let leftStyle, rightStyle, leftText, rightText
      if (this.state.leftSelect) {
        leftStyle = { ...styles.headerItem, backgroundColor: '#303030' }
        leftText = { ...styles.headerTxt, color: '#fbfbfb' }
        rightStyle = styles.headerItem
        rightText = styles.headerTxt
      } else {
        rightStyle = { ...styles.headerItem, backgroundColor: '#303030' }
        rightText = { ...styles.headerTxt, color: '#fbfbfb' }
        leftStyle = styles.headerItem
        leftText = styles.headerTxt
      }
      return (
        <View
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={leftStyle}
              onPress={() => {
                this._changeLeftSelect(true)
              }}
            >
              <Text style={leftText}>RGB</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={rightStyle}
              onPress={() => {
                this._changeLeftSelect(false)
              }}
            >
              <Text style={rightText}>
                {getLanguage(GLOBAL.language).Map_Main_Menu.COLOR_PICKER}
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.leftSelect && this._renderProgress()}
          {!this.state.leftSelect && this._renderColorPicker()}
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: scaleSize(40),
    paddingTop: scaleSize(20),
  },
  header: {
    width: '100%',
    height: scaleSize(40),
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.gray,
    overflow: 'hidden',
  },
  headerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
  },
  headerTxt: {
    fontSize: setSpText(16),
    color: '#303030',
  },
  progressContainer: {
    paddingTop: scaleSize(20),
    flex: 1,
  },
  colorView: {
    width: '80%',
    marginLeft: '10%',
    height: scaleSize(40),
    borderRadius: 5,
  },
  progresses: {
    width: '80%',
    marginLeft: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderText: {
    width: scaleSize(40),
    fontSize: setSpText(16),
  },
  leftIcon: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: 1,
    borderColor: color.gray,
    marginLeft: scaleSize(20),
  },
  rightIcon: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: 1,
    borderColor: color.gray,
    marginRight: scaleSize(20),
  },
  slider: {
    marginHorizontal: scaleSize(10),
    flex: 1,
  },
})