/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import ToolbarModule from "../ToolbarModule"
import {ConstToolType, ToolbarType} from "../../../../../../constants"
import {getPublicAssets, getThemeAssets} from "../../../../../../assets"
import BackgroundTimer from 'react-native-background-timer'
import { SMap, Action} from 'imobile_for_reactnative'
import { Toast } from "../../../../../../utils"

//撤销过的点数组，用于undo redo
let POINT_ARRAY = []

async function start() {
  //开启放大镜
  SMap.setIsMagnifierEnabled(true)
  BackgroundTimer.runBackgroundTimer(async () => {
    await SMap.startGpsIncrement()
  }, 2000)
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
      SMap.clearTrackingLayer()
      break
    case ConstToolType.MAP_INCREMENT_GPS_POINT:
      SMap.clearTrackingLayer()
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
  await SMap.startGpsIncrement()
}

/**
 * 提交
 */
async function submit() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch(type){
    case ConstToolType.MAP_INCREMENT_GPS_POINT:
    case ConstToolType.MAP_INCREMENT_GPS_TRACK:
      SMap.clearTrackingLayer()
      await SMap.submitIncrement(GLOBAL.INCREMENT_DATASETNAME)
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
        Toast.show('无法重做')
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
          Toast.show('无法撤销')
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
function changeMethod(type) {
  const _params = ToolbarModule.getParams()
  if(type === undefined){
    type = ConstToolType.MAP_INCREMENT_CHANGE_METHOD
  }
  _params.setToolbarVisible && _params.setToolbarVisible(true,type,{
    isFullScreen: false,
  })
}

function changeNetwork() {

}

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
function methodSelected(type) {
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
  this.changeMethod(type)
}

function close() {
  const _params = ToolbarModule.getParams()
  SMap.cancelIncrement(GLOBAL.INCREMENT_DATASETNAME)
  SMap.clearTrackingLayer()
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(false)
  //todo 重新设置当前图层可编辑
}

function addNode() {

}

function editNode() {

}

function deleteNode() {

}

function deleteObject() {

}

function addAttribute() {

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
  addNode,
  editNode,
  deleteNode,
  deleteObject,
  addAttribute,
  getTypeImage,
}