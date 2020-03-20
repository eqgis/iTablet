/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import ToolbarModule from "../workspace/components/ToolBar/modules/ToolbarModule"
import React,{Component} from 'react'
import {View, Image, Text, TouchableOpacity,SectionList, StyleSheet} from "react-native"
import {Container} from "../../components"
import {getPublicAssets, getThemeAssets} from "../../assets"
import {scaleSize, setSpText} from "../../utils"
import color from "../../styles/color"
import {getLanguage} from "../../language"

export default class NavigationDataChangePage extends Component{
    props:{
        navigation:Object,
    }
    constructor(props){
      super(props)
      let {params} = this.props.navigation.state
      this.state = {
        data:params && params.data || {},
      }
      this.selectedDatasources = params.selectedDatasources || []
      this.selectedDatasets = params.selectedDatasets || []
      this.currentDatasource = params.currentDatasource || []
      this.currentDataset = params.currentDataset || {}
    }

    _onPress = item => {
      let data = JSON.parse(JSON.stringify(this.state.data))
      let datasource = data[0]
      let dataset = data[1]
      datasource.data.map(val => {
        if(val.name === item.name){
          val.selected = !val.selected
          if(val.selected){
            this.selectedDatasources.push(val)
          }else{
            this.selectedDatasources.map((item,index)=>{
              if(item.name === val.name){
                this.selectedDatasources.splice(index,1)
                this.currentDatasource.length > 0 && this.currentDatasource.map((ds,pos) => {
                  if(ds.name === item.name){
                    this.currentDatasource.splice(pos, 1)
                  }
                })
              }
            })
          }
        }
      })
      dataset.data.map(val => {
        if(val.name === item.name){
          val.selected = !val.selected
          if(val.selected){
            this.selectedDatasets.push(val)
          }else{
            this.selectedDatasets.map((item,index)=>{
              if(item.name === val.name){
                this.selectedDatasets.splice(index,1)
                if(item.name === this.currentDataset.name){
                  this.currentDataset = {}
                }
              }
            })
          }
        }
      })
      data[0] = datasource
      data[1] = dataset
      this.setState({
        data,
      })
    }

    _confirm = () => {
      const _params = ToolbarModule.getParams()
      _params.setNavigationDatas && _params.setNavigationDatas({
        selectedDatasets:this.selectedDatasets,
        selectedDatasources: this.selectedDatasources,
        currentDataset:this.currentDataset,
        currentDatasource:this.currentDatasource,
      })
      this.props.navigation.goBack()
    }

    _renderItem = ({item,section}) => {
      let img = item.selected
        ? getPublicAssets().common.icon_check
        : getPublicAssets().common.icon_uncheck
      let typeImg = section.title === 'datasource'
        ? getThemeAssets().mine.my_local_data
        : require('../../assets/Navigation/network.png')
      let extraStyle = {},extraTxt = {}
      if(item.name === this.currentDataset.name || this.currentDatasource.filter(p => p.name === item.name).length > 0){
        extraStyle = {
          borderLeftColor:color.blue1,
        }
        extraTxt = {color:color.blue1}
      }
      return (
        <View style={styles.row}>
          <View style={[styles.info,extraStyle]}>
            <TouchableOpacity
              style={styles.imgWrap}
              onPress={()=>{
                this._onPress(item)
              }}>
              <Image source={img} resizeMode={'contain'} style={styles.checkIcon}/>
            </TouchableOpacity>
            <Image source={typeImg} resizeMode={'contain'} style={styles.icon}/>
            <Text style={[styles.name,extraTxt]}>{item.name}</Text>
            <TouchableOpacity style={styles.imgWrap}>
              {/*<Image source={img} resizeMode={'contain'} style={styles.image} />*/}
              <View style={{width:scaleSize(40),height:scaleSize(40), backgroundColor:color.blue1}}/>
            </TouchableOpacity>
          </View>
          {this.renderLine()}
        </View>
      )
    }

    renderLine = () => {
      return (
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.separateColorGray,
          }}
        />
      )
    }

    _renderSectionHeader = ({section}) => {
      let title,
        separate = false
      if(section.title === 'datasource'){
        title = getLanguage(GLOBAL.language).Map_Main_Menu.INDOOR_DATASOURCE
        separate = false
      }else{
        title = getLanguage(GLOBAL.language).Map_Main_Menu.OUTDOOR_DATASETS
        separate = true
      }
      return (
        <View>
          {separate && (<View style={styles.sectionSeparate}/>)}
          <Text style={styles.title}>{title}</Text>
          {this.renderLine()}
        </View>
      )
    }

    render(){
      return(
        <Container
          headerProps={{
            title:getLanguage(GLOBAL.language).Map_Main_Menu.SWITCH_DATA,
            navigation:this.props.navigation,
          }}
        >
          <SectionList
            style={styles.list}
            sections={this.state.data}
            renderSectionHeader={this._renderSectionHeader}
            renderItem={this._renderItem}
            keyExtractor={(item,index)=>(item.toString() + index)}
            getItemLayout={(data,index)=>({
              length: 81,
              offset: 81 * index,
              index,
            })}
          />
          <TouchableOpacity style={styles.confirm} onPress={this._confirm}>
            <Text style={styles.confirmTxt}>{getLanguage(GLOBAL.language).Prompt.CONFIRM}</Text>
          </TouchableOpacity>
        </Container>
      )
    }
}

const styles = StyleSheet.create({
  title:{
    width:'100%',
    height:scaleSize(80),
    fontSize:setSpText(24),
    paddingLeft:scaleSize(40),
    paddingTop:scaleSize(30),
    backgroundColor:color.white,
  },
  list:{
    maxHeight:scaleSize(650),
  },
  sectionSeparate:{
    width:'100%',
    height:scaleSize(20),
    backgroundColor:color.separateColorGray,
  },
  row:{
    flex:1,
    height: scaleSize(81),
  },
  info:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginHorizontal:scaleSize(30),
    borderLeftWidth:scaleSize(8),
    borderLeftColor: 'transparent',
  },
  imgWrap:{
    width:scaleSize(60),
    height:scaleSize(80),
    justifyContent:'center',
    alignItems:'center',
  },
  checkIcon:{
    width:scaleSize(40),
    height:scaleSize(40),
  },
  icon:{
    width:scaleSize(40),
    height:scaleSize(40),
    marginRight:scaleSize(10),
  },
  name:{
    flex:1,
    fontSize: setSpText(20),
  },
  image:{
    width:scaleSize(40),
    height:scaleSize(40),
  },
  confirm:{
    position:'absolute',
    bottom:scaleSize(60),
    left:0,
    right:0,
    height:scaleSize(60),
    marginHorizontal: scaleSize(60),
    borderRadius:scaleSize(30),
    backgroundColor: color.blue1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTxt:{
    fontSize:setSpText(24),
    color:color.white,
  },
})