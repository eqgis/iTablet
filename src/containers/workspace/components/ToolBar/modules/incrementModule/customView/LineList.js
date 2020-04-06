/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React,{Component} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SectionList,
  TextInput,
  Platform,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
} from "react-native"
import {scaleSize, setSpText, Toast} from "../../../../../../../utils"
import {getLayerIconByType, getLayerWhiteIconByType, getPublicAssets, getThemeAssets} from "../../../../../../../assets"
import {SMap,DatasetType} from 'imobile_for_reactnative'
import {color} from "../../../../../../../styles"
import ToolbarModule from "../../ToolbarModule"
import {Const, ToolbarType} from "../../../../../../../constants"
import IncrementData from "../IncrementData"
import ToolBarHeight from "../../ToolBarHeight"
import {getLanguage} from "../../../../../../../language"

export default class LineList extends Component{
    props:{
        data: Array,
        selectedItem: Object,
        device: Object,
    }

    constructor(props){
      super(props)
      this.state = {
        data: props.data || [],
        selectedItem: props.selectedItem || {},
        editingItem: {},
      }
      this.keyBoardDidShowListener = null
      this.keyBoardDidHideListener = null
    }
    componentDidMount(){
      if(Platform.OS === 'ios'){
        this.keyBoardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow,
        )
        this.keyBoardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide,
        )
      }
    }
    componentWillUnmount(){
      //安卓不加 用keyboardAvoidingView
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
    _cancel = async () => {
      const params = ToolbarModule.getParams()
      const preType = ToolbarModule.getData().preType
      const containerType = ToolbarType.table
      const _data = await IncrementData.getData(preType)
      if(GLOBAL.INCREMENT_DATA.datasetName !== this.state.selectedItem.datasetName
          || GLOBAL.INCREMENT_DATA.datasourceName !== this.state.selectedItem.datasourceName){
        GLOBAL.INCREMENT_DATA = {}
      }
      const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
      params.setToolbarVisible && params.setToolbarVisible(true,preType,{
        containerType:ToolbarType.table,
        isFullScreen: false,
        resetToolModuleData:true,
        height:data.height,
        column:data.column,
        ..._data,
      })
    }

    _confirm = async () => {
      if(GLOBAL.INCREMENT_DATA.datasetName !== this.state.selectedItem.datasetName
        || GLOBAL.INCREMENT_DATA.datasourceName !== this.state.selectedItem.datasourceName){
        await SMap.setCurrentDataset(this.state.selectedItem)
        GLOBAL.INCREMENT_DATA = this.state.selectedItem
      }
      const params = ToolbarModule.getParams()
      const preType = ToolbarModule.getData().preType
      const containerType = ToolbarType.table
      const _data = await IncrementData.getData(preType)
      const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
      params.setToolbarVisible && params.setToolbarVisible(true,preType,{
        containerType:ToolbarType.table,
        isFullScreen: false,
        resetToolModuleData:true,
        height:data.height,
        column:data.column,
        ..._data,
      })
    }

    _onTitlePress = section => {
      let data = JSON.parse(JSON.stringify(this.state.data))
      let currentIndex
      for(let i = 0; i < data.length; i++){
        if(data[i].title === section.title){
          currentIndex = i
          break
        }
      }
      data[currentIndex].visible = !data[currentIndex].visible
      this.setState({
        data,
      })
    }

    _onEditPress = ({item}) => {
      let editingItem = this.state.editingItem
      if(editingItem.datasetName !== item.datasetName
        || editingItem.datasourceName !== item.datasourceName){
        this.setState({
          editingItem:item,
          selectedItem:item,
        },()=>{
          this.input && this.input.focus()
        })
      }
    }
    _endEditing = ({section,index,text}) => {
      let data = JSON.parse(JSON.stringify(this.state.data))
      let currentIndex
      for(let i = 0; i < data.length; i++){
        if(data[i].title === section.title){
          currentIndex = i
          break
        }
      }
      let regExp = /^[a-zA-Z0-9@#_]+$/
      let isValid = regExp.test(text)
      if(isValid){
        let {datasourceName, datasetName} = data[currentIndex].data[index]
        data[currentIndex].data[index].datasetName = text
        let selectedItem = JSON.parse(JSON.stringify(this.state.selectedItem))
        selectedItem.datasetName = text
        //更新datasteName
        SMap.modifyDatasetName({datasourceName,datasetName,newDatasetName:text})
        this.setState({
          data,
          selectedItem,
          editingItem:{},
        })
      }else{
        Toast.show(getLanguage(GLOBAL.language).Prompt.DATASET_RENAME_FAILED)
      }
    }
    // _clearEdit = () => {
    //   this.setState({
    //     editingItem:{},
    //   })
    // }
    _selectItem = ({item}) => {
      let selectedItem = this.state.selectedItem
      if(selectedItem.datasetName !== item.datasetName
            || selectedItem.datasourceName !== item.datasourceName){
        this.setState({
          selectedItem:item,
        })
      }
    }
    _onDeletePress = ({index,section}) => {
      let data = JSON.parse(JSON.stringify(this.state.data))
      let currentIndex
      for(let i = 0; i < data.length; i++){
        if(section.title === data[i].title){
          currentIndex = i
          break
        }
      }
      let deleteData = data[currentIndex].data.splice(index,1)
      let {datasourceName,datasetName} = deleteData[0]
      //如果删除的是当前选中 自动选中下一个
      let selectedItem = this.state.selectedItem
      let removeLayer = false
      if(selectedItem.datasourceName === datasourceName && selectedItem.datasetName === datasetName){
        selectedItem = data[currentIndex].data[index] || {}
        removeLayer = true
      }
      SMap.deleteDatasetAndLayer({datasourceName,datasetName,removeLayer})
      this.setState({
        data,
        selectedItem,
      })
    }
    _renderItem = ({section, index, item}) => {
      if(!section.visible) return null
      let hasExtra = this.state.selectedItem.datasourceName === item.datasourceName
            && this.state.selectedItem.datasetName === item.datasetName
      let extraStyle,extraTxtStyle,lineImg
      if(hasExtra){
        extraStyle = {backgroundColor: color.item_selected_bg}
        extraTxtStyle = {color: color.white}
        lineImg = getLayerWhiteIconByType(DatasetType.LINE)
      }else{
        extraStyle = {}
        extraTxtStyle = {}
        lineImg = getLayerIconByType(DatasetType.LINE)
      }
      let isEditing = this.state.editingItem.datasourceName === item.datasourceName
          && this.state.editingItem.datasetName === item.datasetName
      //todo 图片白色版本
      const renameImg = getPublicAssets().navigation.icon_increment_rename
      const deleteImg = getPublicAssets().navigation.icon_increment_delete
      return (
        <TouchableOpacity
          style={[styles.row, extraStyle]}
          onPress={()=>{this._selectItem({item})}}
        >
          <View style={styles.imageWrap}>
            <Image source={lineImg} resizeMode={'contain'} style={styles.image}/>
          </View>
          {isEditing
            ? <TextInput
              ref={ref=>(this.input = ref)}
              style={[styles.text,styles.input,extraTxtStyle]}
              defaultValue={item.datasetName}
              returnKeyType={'done'}
              maxLength={32}
              onEndEditing={evt=>{
                this._endEditing({section,index,text:evt.nativeEvent.text})
              }}
            />
            : <Text style={[styles.text,extraTxtStyle]}>{item.datasetName}</Text>}
          <TouchableOpacity
            style={styles.imageWrap}
            onPress={()=>{this._onEditPress({item})}}>
            <Image source={renameImg} resizeMode={'contain'} style={styles.image}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageWrap}
            onPress={()=>{this._onDeletePress({index,section})}}
          >
            <Image source={deleteImg} resizeMode={'contain'} style={styles.image}/>
          </TouchableOpacity>
        </TouchableOpacity>
      )
    }

    _renderSectionHeader = ({section}) => {
      let arrowImg = section.visible
        ? getThemeAssets().publicAssets.icon_arrow_down
        : getThemeAssets().publicAssets.icon_arrow_right_2
      return (
        <TouchableOpacity style={styles.section}  onPress={()=>{this._onTitlePress(section)}}>
          <View style={styles.imageWrap}>
            <Image source={arrowImg} style={styles.image} resizeMode={'contain'}/>
          </View>
          <Text style={styles.text}>{section.title}</Text>
        </TouchableOpacity>
      )
    }

    render(){
      if(Platform.OS === 'ios'){
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <TouchableOpacity style={styles.titleTxtWrap} onPress={this._cancel}>
                <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Prompt.CANCEL}</Text>
              </TouchableOpacity>
              <Text style={styles.titleTxt}>{getLanguage(GLOBAL.language).Prompt.SWITCH_LINE}</Text>
              <TouchableOpacity style={styles.titleTxtWrap} onPress={this._confirm}>
                <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Prompt.CONFIRM}</Text>
              </TouchableOpacity>
            </View>
            <SectionList
              keyExtractor={(item,index)=>(item.toString() + index)}
              sections={this.state.data}
              extraData={this.state}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderItem}
            />
          </View>
        )
      }else{
        return (
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.title}>
              <TouchableOpacity style={styles.titleTxtWrap} onPress={this._cancel}>
                <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Prompt.CANCEL}</Text>
              </TouchableOpacity>
              <Text style={styles.titleTxt}>{getLanguage(GLOBAL.language).Prompt.SWITCH_LINE}</Text>
              <TouchableOpacity style={styles.titleTxtWrap} onPress={this._confirm}>
                <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Prompt.CONFIRM}</Text>
              </TouchableOpacity>
            </View>
            <SectionList
              keyExtractor={(item,index)=>(item.toString() + index)}
              sections={this.state.data}
              extraData={this.state}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderItem}
            />
          </KeyboardAvoidingView>
        )
      }

    }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:scaleSize(10),
  },
  title:{
    width:'100%',
    height:scaleSize(80),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:color.content_white,
    borderBottomWidth:1,
    borderBottomColor:color.USUAL_SEPARATORCOLOR,
  },
  titleTxt:{
    fontSize:setSpText(22),
  },
  actionTxt:{
    fontSize:setSpText(20),
  },
  titleTxtWrap:{
    width: scaleSize(80),
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  section:{
    width:'100%',
    height:scaleSize(80),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:color.content_white,
    marginHorizontal:scaleSize(20),
    borderBottomWidth:1,
    borderBottomColor:color.USUAL_SEPARATORCOLOR,
  },
  row:{
    height:scaleSize(61),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginLeft:scaleSize(20),
    paddingLeft:scaleSize(20),
    borderBottomWidth:1,
    borderBottomColor:color.USUAL_SEPARATORCOLOR,
  },
  imageWrap:{
    width:scaleSize(60),
    height:scaleSize(60),
    alignItems:'center',
    justifyContent:'center',
  },
  image:{
    width:scaleSize(40),
    height:scaleSize(40),
  },
  text:{
    flex:1,
    fontSize:setSpText(18),
  },
  input:{
    ...Platform.select({
      android:{
        padding:0,
      },
    }),
  },
  flex:{
    flex:1,
  },
})