/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import ToolbarModule from "../ToolbarModule"
import {ConstToolType, Height, ToolbarType} from "../../../../../../constants"
import {getPublicAssets} from "../../../../../../assets"
import BackgroundTimer from 'react-native-background-timer'
import { SMap, Action} from 'imobile_for_reactnative'
import {Toast} from "../../../../../../utils"
import IncrementData from "./IncrementData"
import ToolBarHeight from "../ToolBarHeight"
import {getLanguage} from "../../../../../../language"

//撤销过的点数组，用于undo redo
let POINT_ARRAY = []

async function start() {
  if(GLOBAL.INCREMENT_DATA.datasetName){
    BackgroundTimer.runBackgroundTimer(async () => {
      SMap.startGpsIncrement()
    }, 2000)
  }else{
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
  }

}
function stop() {
  BackgroundTimer.stopBackgroundTimer()
}

async function cancel(){
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch(type){
    case ConstToolType.MAP_INCREMENT_GPS_TRACK:
      BackgroundTimer.stopBackgroundTimer()
      SMap.clearIncrementPoints()
      break
    case ConstToolType.MAP_INCREMENT_GPS_POINT:
      SMap.clearIncrementPoints()
      break
    case ConstToolType.MAP_INCREMENT_POINTLINE:
      await SMap.cancel()
      SMap.setAction(Action.CREATEPOLYLINE)
      break
    case ConstToolType.MAP_INCREMENT_FREELINE:
      await SMap.cancel()
      SMap.setAction(Action.FREEDRAW)
      break
  }
}


async function addPoint(){
  if(GLOBAL.INCREMENT_DATA.datasetName){
    await SMap.startGpsIncrement()
  }else{
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
  }
}

/**
 * 提交
 */
async function submit() {
  if(GLOBAL.INCREMENT_DATA.datasetName){
    const _params = ToolbarModule.getParams()
    let type = _params.type
    switch(type) {
      case ConstToolType.MAP_INCREMENT_GPS_POINT:
      case ConstToolType.MAP_INCREMENT_GPS_TRACK:
        SMap.clearTrackingLayer()
        await SMap.submitIncrement(GLOBAL.INCREMENT_DATA)
        break
      case ConstToolType.MAP_INCREMENT_POINTLINE:
        await SMap.submit()
        SMap.setAction(Action.CREATEPOLYLINE)
        break
      case ConstToolType.MAP_INCREMENT_FREELINE:
        await SMap.submit()
        SMap.setAction(Action.FREEDRAW)
        break
    }
  }else{
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
  }
  // let showType = ConstToolType.MAP_INCREMENT_EDIT
  // _params.setToolbarVisible && _params.setToolbarVisible(true,showType,{
  //   isFullScreen: false,
  // })
}

/**
 * 重做
 * @returns {Promise<void>}
 */
async function redo() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch(type){
    case ConstToolType.MAP_INCREMENT_GPS_POINT:
      if(POINT_ARRAY.length === 0){
        Toast.show(getLanguage(GLOBAL.language).Prompt.CANT_REDO)
      }else{
        let point = POINT_ARRAY.pop()
        await SMap.redoIncrement(point)
      }
      break
    case ConstToolType.MAP_INCREMENT_POINTLINE:
    case ConstToolType.MAP_INCREMENT_FREELINE:
      await SMap.redo()
      break
  }
}

/**
 * 撤销打点
 * @returns {Promise<void>}
 */
async function undo() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch (type) {
    case ConstToolType.MAP_INCREMENT_GPS_POINT:
      {
        await SMap.clearTrackingLayer()
        let point = await SMap.undoIncrement()
        if(point.x && point.y){
          POINT_ARRAY.push(point)
        }else{
          Toast.show(getLanguage(GLOBAL.language).Prompt.CANT_UNDO)
        }
      }
      break
    case ConstToolType.MAP_INCREMENT_POINTLINE:
    case ConstToolType.MAP_INCREMENT_FREELINE:
      await SMap.undo()
      break
  }


}

/**
 * 切换采集方式
 */
async function changeMethod(type = ConstToolType.MAP_INCREMENT_CHANGE_METHOD) {
  const _params = ToolbarModule.getParams()
  const _data = await IncrementData.getData(type)
  let containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  _params.setToolbarVisible && _params.setToolbarVisible(true,type,{
    containerType,
    isFullScreen: false,
    height:data.height,
    column:data.column,
    ..._data,
  })
}

function changeNetwork() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  _params.setToolbarVisible && _params.setToolbarVisible(true,ConstToolType.MAP_INCREMENT_CHANGE_NETWORK,{
    isFullScreen: false,
    containerType:ToolbarType.symbol,
    height:_params.device.orientation === "PORTRAIT"
      ? Height.LIST_HEIGHT_P
      : Height.LIST_HEIGHT_L,
  })
  ToolbarModule.addData({preType:type})
}
//底部增量方式图片
let image
/**
 * 获取当前增量方式图片
 */
function getTypeImage(type) {
  if(type === ConstToolType.MAP_INCREMENT_CHANGE_METHOD)
    return image
  switch(type){
    case ConstToolType.MAP_INCREMENT_POINTLINE:
      image = getPublicAssets().navigation.btn_increment_point_line
      break
    case ConstToolType.MAP_INCREMENT_FREELINE:
      image = getPublicAssets().navigation.btn_increment_freeline
      break
    case ConstToolType.MAP_INCREMENT_GPS_POINT:
      image = getPublicAssets().navigation.btn_increment_gps_point
      break
    case ConstToolType.MAP_INCREMENT_GPS_TRACK:
      image = getPublicAssets().navigation.btn_increment_gps_track
      break
    default:
      image = getPublicAssets().navigation.btn_increment_gps_track
      break
  }
  return image
}

/**
 * 选择采集方式
 * @param type
 */
async function methodSelected(type) {
  //切换方式 清除上次增量的数据
  await SMap.clearIncrementPoints()
  SMap.setAction(Action.PAN)
  switch (type) {
    case ConstToolType.MAP_INCREMENT_GPS_POINT:
      break
    case ConstToolType.MAP_INCREMENT_GPS_TRACK:
      break
    case ConstToolType.MAP_INCREMENT_POINTLINE:
      SMap.setAction(Action.CREATEPOLYLINE)
      break
    case ConstToolType.MAP_INCREMENT_FREELINE:
      SMap.setAction(Action.FREEDRAW)
      break
  }
  changeMethod(type)
}

function close() {
  const _params = ToolbarModule.getParams()
  if(GLOBAL.INCREMENT_DATA.datasetName){
    SMap.cancelIncrement(GLOBAL.INCREMENT_DATA)
    SMap.clearTrackingLayer()
  }
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(false)
  SMap.setIsMagnifierEnabled(false)
  GLOBAL.currentLayer && _params.setCurrentLayer(GLOBAL.currentLayer)
}

/**
 * 拓扑编辑
 */
async function topoEdit() {
  //const _params = ToolbarModule.getParams()
  //切换方式 清除上次增量的数据
  await SMap.clearIncrementPoints()
  SMap.submit()
  SMap.setAction(Action.PAN)
  Toast.show('提交 进行拓扑编辑')
  // _params.setToolbarVisible && _params.setToolbarVisible(true,ConstToolType.MAP_TOPO_EDIT,{
  //   isFullScreen: false,
  //   height:0,
  // })
}
export default {
  close,

  start,
  stop,
  addPoint,
  cancel,
  submit,
  redo,
  undo,
  changeMethod,
  changeNetwork,
  methodSelected,
  getTypeImage,
  topoEdit,
}