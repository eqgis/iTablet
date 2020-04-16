/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React,{ Component } from 'react'
import {View, TouchableOpacity, Image, TextInput, Text, StyleSheet, Platform, Keyboard, Animated} from "react-native"
import {scaleSize, setSpText, Toast} from "../../../../../../../utils"
import {Const, ConstToolType, ToolbarType} from "../../../../../../../constants"
import {color} from "../../../../../../../styles"
import { SMap } from 'imobile_for_reactnative'
import {getLanguage} from "../../../../../../../language"
import ToolbarModule from "../../ToolbarModule"

const TIME_INTERVAL = 300
export default class LayerVisibilityView extends Component{
    props:{
        mapScale:String,
        currentType:String,
    }
    constructor(props){
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
      this.keyBoardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      )
      this.keyBoardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      )
    }

    componentWillUnmount() {
      SMap.removeScaleChangeDelegate(this.listener)
      this.keyBoardDidHideListener && this.keyBoardDidHideListener.remove()
      this.keyBoardDidShowListener && this.keyBoardDidShowListener.remove()
    }

  _keyboardDidShow = e => {
    let { height } = e.startCoordinates
    Animated.timing(GLOBAL.ToolBar.state.bottom,{
      toValue:height,
      duration:Const.ANIMATED_DURATION,
    }).start()

  }

  _keyboardDidHide = () => {
    Animated.timing(GLOBAL.ToolBar.state.bottom,{
      toValue:0,
      duration:Const.ANIMATED_DURATION,
    }).start()
  }
  _scaleViewChange = data => {
    this.endTime = +new Date()
    if (data && data.scale && this.endTime - this.startTime > TIME_INTERVAL){
      this.startTime = this.endTime
      this.setState({
        mapScale: Number.parseFloat((1 / data.scale).toFixed(6)),
      })
    }
  }

    _confirm = () => {
      const _params = ToolbarModule.getParams()
      ToolbarModule.addData({[this.props.currentType]:this.state.mapScale})
      _params.setToolbarVisible(true,ConstToolType.MAP_LAYER_VISIBLE_SCALE,{
        containerType:ToolbarType.multiPicker,
        isFullScreen:false,
      })
    }

    _cancel = () => {
      const _params = ToolbarModule.getParams()
      _params.setToolbarVisible(true,ConstToolType.MAP_LAYER_VISIBLE_SCALE,{
        containerType:ToolbarType.multiPicker,
        isFullScreen:false,
      })
    }

    render(){
      const cancel = require('../../../../../../../assets/mapEdit/icon_function_cancel.png')
      const commit =  require('../../../../../../../assets/mapEdit/icon_function_theme_param_commit.png')
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={this._cancel}>
            <Image source={cancel} resizeMode={'contain'} style={styles.icon}/>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.text}>1:</Text>
            <TextInput
              style={styles.input}
              keyboardType={'numeric'}
              value={this.state.mapScale + ''}
              returnKeyType={'done'}
              onChangeText={mapScale=>{
                this.setState({
                  mapScale,
                })
              }}
              onEndEditing={evt=>{
                let mapScale = 0
                if(evt.nativeEvent.text !== '' && isNaN(evt.nativeEvent.text)){
                  Toast.show(getLanguage(GLOBAL.language).Prompt.TRANSFER_PARAMS)
                }else{
                  mapScale = Number.parseFloat(this.state.mapScale)
                  //地图比例尺跟着变
                  SMap.setMapScale(1/mapScale)
                }
                this.setState({
                  mapScale,
                })
              }}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={this._confirm}>
            <Image source={commit} resizeMode={'contain'} style={styles.icon}/>
          </TouchableOpacity>
        </View>
      )
    }

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Const.BOTTOM_HEIGHT,
    backgroundColor: color.theme,
    paddingHorizontal: scaleSize(20),
  },
  textContainer:{
    width:scaleSize(220),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text:{
    color:color.content_white,
    fontSize:setSpText(20),
  },
  input:{
    color:color.content_white,
    height:Const.BOTTOM_HEIGHT,
    width:scaleSize(200),
    fontSize:setSpText(20),
    ...Platform.select({
      android:{
        padding:0,
      },
    }),
  },
  icon:{
    width:scaleSize(40),
    height:scaleSize(40),
  },
  button:{
    width:scaleSize(60),
  },
})