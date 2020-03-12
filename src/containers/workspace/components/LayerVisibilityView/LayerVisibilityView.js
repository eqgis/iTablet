/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React,{ Component } from 'react'
import {View, TouchableOpacity, Image, TextInput, Text, KeyboardAvoidingView, StyleSheet, Platform} from "react-native"
import {scaleSize, setSpText, Toast} from "../../../../utils"
import {Const, TouchType} from "../../../../constants"
import {color} from "../../../../styles"
import { SMap } from 'imobile_for_reactnative'
import NavigationService from "../../../NavigationService"
import {getLanguage} from "../../../../language"

const TIME_INTERVAL = 300
export default class LayerVisibilityView extends Component{
  constructor(props){
    super(props)
    this.state = {
      visible:false,
      mapScale: 0,
    }
    this.listener = null
    this.startTime = 0
    this.endTime = 0
    this.mapXML = ''
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

  setVisible = async (visible,mapScale) => {
    if(visible === this.state.visible) return
    let curScale = this.state.mapScale
    if(visible && !this.listener){
      this.listener = SMap.addScaleChangeDelegate({
        scaleViewChange: this._scaleViewChange,
      })

      this.mapXML = await SMap.mapToXml()
      curScale = Number.parseFloat(mapScale)
    }
    if(!visible && this.listener){
      SMap.removeScaleChangeDelegate(this.listener)
      this.listener = null
      this.startTime = 0
      this.endTime = 0
    }
    this.setState({
      visible,
      mapScale:curScale,
    })
  }

  _confirm = () => {
    NavigationService.navigate('LayerManager',{currentScale:this.state.mapScale})
    this.setVisible(false)
    GLOBAL.TouchType = TouchType.NORMAL
    GLOBAL.ToolBar && GLOBAL.ToolBar.existFullMap()
    SMap.mapFromXml(this.mapXML)
  }

  _cancel = () => {
    NavigationService.navigate('LayerManager')
    this.setVisible(false)
    GLOBAL.TouchType = TouchType.NORMAL
    GLOBAL.ToolBar && GLOBAL.ToolBar.existFullMap()
    SMap.mapFromXml(this.mapXML)
  }

  render(){
    const cancel = require('../../../../assets/mapEdit/icon_function_cancel.png')
    const commit =  require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
    if(!this.state.visible)
      return <View/>
    let behavior,keyboardVerticalOffset,extraStyle = {}
    if(Platform.OS === 'android'){
      behavior = ''
      keyboardVerticalOffset = scaleSize(100)
      extraStyle = {paddingHorizontal: scaleSize(20)}
    }else {
      behavior = 'position'
      keyboardVerticalOffset = 0
    }
    return (
      <KeyboardAvoidingView
        behavior={behavior}
        style={[styles.container,extraStyle]}
        contentContainerStyle={styles.keyboardContent}
        keyboardVerticalOffset={keyboardVerticalOffset}>
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
      </KeyboardAvoidingView>
    )
  }

}

const styles = StyleSheet.create({
  container:{
    position:'absolute',
    left:0,
    bottom:0,
    width:'100%',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Const.BOTTOM_HEIGHT,
    backgroundColor: color.theme,
  },
  keyboardContent:{
    width:'100%',
    paddingHorizontal: scaleSize(20),
    height: Const.BOTTOM_HEIGHT,
    flexDirection:'row',
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
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