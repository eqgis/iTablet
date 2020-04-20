/**
 * @description 合并数据集
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, {Component} from 'react'
import {View, Image, TouchableOpacity, Text, FlatList, StyleSheet, SectionList} from 'react-native'
import {scaleSize, setSpText, Toast} from "../../../../../../../utils"
import {color} from "../../../../../../../styles"
import ToolbarModule from "../../ToolbarModule"
import {ToolbarType} from "../../../../../../../constants"
import {getLayerIconByType, getLayerWhiteIconByType, getPublicAssets, getThemeAssets} from "../../../../../../../assets"
import { SMap, DatasetType} from 'imobile_for_reactnative'
import ModalDropdown from 'react-native-modal-dropdown'
import {getLanguage} from "../../../../../../../language"

const VIEW_STATUS_MERGE = 'VIEW_STATUS_MERGE'
const VIEW_STATUS_ADD_NEW = 'VIEW_STATUS_ADD_NEW'
const VIEW_STATUS_NEED_SELECT = 'VIEW_STATUS_NEED_SELECT'
export default class MergeDatasetView extends Component{
  props:{
    data:Array,
  }
  constructor(props){
    super(props)
    this.state = {
      data:props.data || [],
      selectAll:false,
      needChangeData:[],
      selectedItem:{},
      ViewStatus:VIEW_STATUS_MERGE,
    }
  }

  _cancel = () => {
    const _params = ToolbarModule.getParams()
    let preType = ToolbarModule.getData().preType
    let containerType = ToolbarType.table
    _params.setToolbarVisible(true,preType,{
      containerType,
      isFullScreen:false,
    })
  }

  _onSelect = index => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let selected = !data[index].selected
    data[index].selected = selected
    let selectAll = !selected ? selected : this.state.selectAll
    this.setState({
      data,
      selectAll,
    })
  }

  _onSelectAll = () => {
    let preData = JSON.parse(JSON.stringify(this.state.data))
    let selectAll = !this.state.selectAll
    let data = preData.map(item => {
      item.selected = selectAll
      return item
    })
    this.setState({
      data,
      selectAll,
    })
  }

  _add = async () => {
    let lineDataset = await SMap.getAllLineDatasets()
    this.setState({
      ViewStatus:VIEW_STATUS_ADD_NEW,
      lineDataset,
    })
  }

  _confirm = async () => {
    let selectedDatas = this.state.data.filter(item => item.selected)
    // let {datasetName,datasourceName} = GLOBAL.INCREMENT_DATA
    // await SMap.deleteDatasetAndLayer({})
    let needChangeData = await SMap.queryFieldInfos(selectedDatas)
    if(needChangeData.length > 0){
      Toast.show(getLanguage(GLOBAL.language).Prompt.HAS_NO_ROADNAME_FIELD_DATA_DIALOG)
      this.setState({
        needChangeData,
        ViewStatus:VIEW_STATUS_NEED_SELECT,
      })
    }else{
      this.mergeData(selectedDatas)
    }
  }

  //todo 原生回调 添加进度条
  mergeData = async selectedDatas => {
    const _params = ToolbarModule.getParams()
    _params.setContainerLoading(true,getLanguage(GLOBAL.language).Prompt.MERGEING)
    let result = await SMap.mergeDataset(GLOBAL.INCREMENT_DATA,selectedDatas)
    if(result){
      _params.setContainerLoading(false)
      if(result instanceof Array){
        let str =result.reduce((preValue,curValue)=>(preValue + "、"+curValue),"")
        Toast.show(`${getLanguage(GLOBAL.language).Prompt.NOT_SUPPORT_PRJCOORDSYS}:${str}`)
      }else{
        Toast.show(getLanguage(GLOBAL.language).Prompt.MERGE_SUCCESS)
        let preType = ToolbarModule.getData().preType
        let containerType = ToolbarType.table
        _params.setToolbarVisible(true,preType,{
          containerType,
          isFullScreen:false,
        })
      }
    }else{
      Toast.show(getLanguage(GLOBAL.language).Prompt.MERGE_FAILD)
    }
  }

  _selectItem = ({item}) => {
    let selectedItem = this.state.selectedItem
    if(selectedItem.datasetName !== item.datasetName
        || selectedItem.datasourceName !== item.datasourceName){
      this.setState({
        selectedItem:item,
      })
    }
  }

  _onTitlePress = section => {
    let lineDataset = JSON.parse(JSON.stringify(this.state.lineDataset))
    let currentIndex
    for(let i = 0; i < lineDataset.length; i++){
      if(lineDataset[i].title === section.title){
        currentIndex = i
        break
      }
    }
    lineDataset[currentIndex].visible = !lineDataset[currentIndex].visible
    this.setState({
      lineDataset,
    })
  }

  _confirmAdd = () => {
    let selectedItem = this.state.selectedItem
    let data = JSON.parse(JSON.stringify(this.state.data))
    selectedItem.datasetName && data.push(this.state.selectedItem)
    this.setState({
      ViewStatus:VIEW_STATUS_MERGE,
      data,
      selectedItem:{},
    })
  }

  _cancelAdd = () => {
    this.setState({
      ViewStatus:VIEW_STATUS_MERGE,
      selectedItem:{},
    })
  }

  //用户选择了字段  不需要刷新View
  _itemSelected = (value,index) => {
    let needChangeData = this.state.needChangeData
    needChangeData[index].selectedFieldInfo = value
    this.setState({
      needChangeData,
    })
  }

  _confirmSelect = () => {
    let needChangeData = this.state.needChangeData
    if(needChangeData.every(item => item.selectedFieldInfo)){
      let selectedData = this.state.data.filter(item => item.selected)
      let datas = selectedData.map(item => {
        let data = needChangeData.filter(val => (
          val.datasetName === item.datasetName &&
        val.datasourceName === item.datasourceName
        ))
        return data[0]
      })
      datas = datas.filter(item => item)
      this.mergeData(datas)
    }else{
      Toast.show(getLanguage(GLOBAL.language).Prompt.HAS_NO_ROADNAME_FIELD_DATA)
    }
  }
  _renderDropMenu = () => {
    let renderItem = ({item,index}) => {
      return (
        <View style={styles.row}>
          <Text style={styles.text}>{item.datasetName}</Text>
          <ModalDropdown
            style={styles.dropDownStyle}
            textStyle={{
              fontSize:setSpText(18),
            }}
            onSelect={(selectIndex,value)=>{
              this._itemSelected(value,index)
            }}
            defaultValue={getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_FIELD}
            options={item.fieldName} />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.actionView}>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._cancelAdd}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Find.BACK}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_ROADNAME_FIELD}</Text>
          <View style={styles.actionView}>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._confirmSelect}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_CONFIRM}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={styles.padding}
          keyExtractor={(item,index)=>(item.toString() + index)}
          data={this.state.needChangeData}
          renderItem={renderItem}
        />
      </View>
    )
  }

  _renderItem = ({item,index}) => {
    let selectedImg = item.selected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.imageWrap}
          onPress={()=>this._onSelect(index)}
        >
          <Image
            source={selectedImg}
            resizeMode={'contain'}
            style={styles.image}/>
        </TouchableOpacity>
        <Image/>
        <Text style={styles.text}>{item.datasetName}</Text>
      </View>
    )
  }

  _renderSectionItem = ({section,item}) => {
    if(!section.visible) return null
    let extraStyle,extraTxtStyle,lineImg
    let selectedItem = this.state.selectedItem
    if(selectedItem.datasetName === item.datasetName
        && selectedItem.datasourceName === item.datasourceName){
      extraStyle = {backgroundColor: color.item_selected_bg}
      extraTxtStyle = {color: color.white}
      lineImg = getLayerWhiteIconByType(DatasetType.LINE)
    }else{
      extraStyle = {}
      extraTxtStyle = {}
      lineImg = getLayerIconByType(DatasetType.LINE)
    }
    return (
      <TouchableOpacity
        style={[styles.row, extraStyle]}
        onPress={()=>{this._selectItem({item})}}
      >
        <View style={styles.imageWrap}>
          <Image source={lineImg} resizeMode={'contain'} style={styles.image}/>
        </View>
        <Text style={[styles.text,extraTxtStyle]}>{item.datasetName}</Text>
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

  _renderAddNew = () => {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.actionView}>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._cancelAdd}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Find.BACK}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.ADD_DATASET}</Text>
          <View style={styles.actionView}>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._confirmAdd}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_CONFIRM}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SectionList
          style={styles.padding}
          keyExtractor={(item,index)=>(item.toString() + index)}
          sections={this.state.lineDataset}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderSectionItem}
        />
      </View>
    )
  }

  _renderMerge = () => {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.actionView}>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._cancel}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_CANCEL}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._onSelectAll}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_SELECT_ALL}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_DATASET}</Text>
          <View style={styles.actionView}>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._add}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_ADD}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.titleTxtWrap} onPress={this._confirm}>
              <Text style={styles.actionTxt}>{getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_CONFIRM}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={styles.padding}
          keyExtractor={(item,index)=>(item.toString() + index)}
          data={this.state.data}
          renderItem={this._renderItem}
          getItemLayout={(data, index) => {
            return {
              length: scaleSize(61),
              offset: scaleSize(61) * index,
              index,
            }
          }}/>
      </View>
    )
  }

  render(){
    if(this.state.ViewStatus === VIEW_STATUS_NEED_SELECT){
      return this._renderDropMenu()
    }else if (this.state.ViewStatus === VIEW_STATUS_ADD_NEW){
      return this._renderAddNew()
    }else{
      return this._renderMerge()
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:color.content_white,
  },
  padding:{
    paddingHorizontal:scaleSize(10),
    paddingBottom:scaleSize(10),
  },
  title:{
    width:'100%',
    height:scaleSize(80),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#303030',
  },
  titleTxt:{
    color:'white',
    fontSize:setSpText(22),
  },
  actionTxt:{
    color:'white',
    fontSize:setSpText(20),
  },
  titleTxtWrap:{
    width: scaleSize(80),
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
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
  dropDownStyle:{
    marginRight:scaleSize(10),
  },
})