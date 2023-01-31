/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import ToolbarModule from '../ToolbarModule'
import {
  ConstToolType,
  Height,
  ToolbarType,
  TouchType,
} from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import BackgroundTimer from 'react-native-background-timer'
import { SMap, SNavigation } from 'imobile_for_reactnative'
import { Toast, LayerUtils } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'
import { Action } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'

async function start() {
  if (global.INCREMENT_DATA.datasetName) {
    BackgroundTimer.runBackgroundTimer(async () => {
      await SNavigation.startGpsIncrement()
    }, 2000)
  } else {
    Toast.show(getLanguage(global.language).Prompt.SELECT_LINE_DATASET)
  }
}
function stop() {
  BackgroundTimer.stopBackgroundTimer()
}

async function cancel() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch (type) {
    case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
      BackgroundTimer.stopBackgroundTimer()
      await SNavigation.clearIncrementPoints()
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      await SNavigation.clearIncrementPoints()
      break
    case ConstToolType.SM_MAP_INCREMENT_POINTLINE:
      await SMap.cancel()
      await SMap.setAction(Action.CREATEPOLYLINE)
      break
    case ConstToolType.SM_MAP_INCREMENT_FREELINE:
      await SMap.cancel()
      await SMap.setAction(Action.FREEDRAW)
      break
  }
}

async function addPoint() {
  if (global.INCREMENT_DATA.datasetName) {
    await SNavigation.startGpsIncrement()
  } else {
    Toast.show(getLanguage(global.language).Prompt.SELECT_LINE_DATASET)
  }
}

/**
 * 提交
 */
async function submit() {
  if (global.INCREMENT_DATA.datasetName) {
    const _params = ToolbarModule.getParams()
    let type = _params.type
    switch (type) {
      case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
        BackgroundTimer.stopBackgroundTimer()
        await SNavigation.submitIncrement()
        break
      case ConstToolType.SM_MAP_INCREMENT_POINTLINE:
        await SMap.submit()
        await SMap.setAction(Action.CREATEPOLYLINE)
        break
      case ConstToolType.SM_MAP_INCREMENT_FREELINE:
        await SMap.submit()
        await SMap.setAction(Action.FREEDRAW)
        break
    }
  } else {
    Toast.show(getLanguage(global.language).Prompt.SELECT_LINE_DATASET)
  }
}

/**
 * 重做
 * @returns {Promise<void>}
 */
async function redo() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch (type) {
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      await SNavigation.redoIncrement()
      break
    case ConstToolType.SM_MAP_INCREMENT_POINTLINE:
    case ConstToolType.SM_MAP_INCREMENT_FREELINE:
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
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      await SNavigation.undoIncrement()
      break
    case ConstToolType.SM_MAP_INCREMENT_POINTLINE:
    case ConstToolType.SM_MAP_INCREMENT_FREELINE:
      await SMap.undo()
      break
  }
}

/**
 * 切换采集方式
 */
async function changeMethod(type = ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD) {
  BackgroundTimer.stopBackgroundTimer()
  const _params = ToolbarModule.getParams()
  let containerType = ToolbarType.table
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, type, {
      containerType,
      isFullScreen: false,
    })
  global.NAVMETHOD = type
}

function showAttribute() {
  if (global.INCREMENT_DATA.datasetName){
    global.NEEDREFRESHTABLE = true
    NavigationService.navigate('LayerSelectionAttribute',{type:'NAVIGATION',datasetName:global.INCREMENT_DATA.datasetName})
  }else{
    Toast.show(getLanguage(global.language).Prompt.SELECT_LINE_DATASET)
  }
}

/**
 * 切换数据集
 */
function changeNetwork() {
  NavigationService.navigate('ChooseNaviLayer')
  // const _params = ToolbarModule.getParams()
  // let type = _params.type
  // _params.setToolbarVisible(true, ConstToolType.SM_MAP_INCREMENT_CHANGE_NETWORK, {
  //   isFullScreen: false,
  //   containerType: ToolbarType.list,
  //   height:
  //     _params.device.orientation === 'PORTRAIT'
  //       ? Height.LIST_HEIGHT_P
  //       : Height.LIST_HEIGHT_L,
  // })
  // ToolbarModule.addData({ preType: type })
}

//底部增量方式图片
let image

/**
 * 获取当前增量方式图片
 */
function getTypeImage(type) {
  if (type === ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD) return image
  switch (type) {
    case ConstToolType.SM_MAP_INCREMENT_POINTLINE:
      // image = getThemeAssets().navigation.btn_increment_point_line
      image = getThemeAssets().navigation.increment_pointline
      break
    case ConstToolType.SM_MAP_INCREMENT_FREELINE:
      // image = getThemeAssets().navigation.btn_increment_freeline
      image = getThemeAssets().navigation.increment_freeline
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      // image = getThemeAssets().navigation.btn_increment_gps_point
      image = getThemeAssets().navigation.increment_add_point
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
      // image = getThemeAssets().navigation.btn_increment_gps_track
      image = getThemeAssets().navigation.increment_gps_track
      break
    default:
      // image = getThemeAssets().navigation.btn_increment_gps_track
      image = getThemeAssets().navigation.increment_gps_track
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
  await SNavigation.clearIncrementPoints()
  await SMap.setAction(Action.PAN)
  switch (type) {
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
      break
    case ConstToolType.SM_MAP_INCREMENT_POINTLINE:
      await SMap.setAction(Action.CREATEPOLYLINE)
      break
    case ConstToolType.SM_MAP_INCREMENT_FREELINE:
      await SMap.setAction(Action.FREEDRAW)
      break
  }
  changeMethod(type)
}
function close() {
  global.SimpleDialog.set({
    text: getLanguage(global.language).Prompt.CONFIRM_EXIT,
    confirmAction: dialogConfirm,
  })
  global.SimpleDialog.setVisible(true)
}

function dialogConfirm() {
  const _params = ToolbarModule.getParams()
  if (global.INCREMENT_DATA.datasetName) {
    BackgroundTimer.stopBackgroundTimer()
    SNavigation.clearIncrementPoints()
    SNavigationInner.cancelIncrement(global.INCREMENT_DATA)
  }
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(false)
  let layers = _params.layers.layers
  LayerUtils.setLayersSelectable(layers, true, true)
  global.FloorListView?.setVisible(true)
  global.mapController?.setVisible(true)
  global.TouchType = TouchType.NORMAL
}

/**
 * 拓扑编辑
 */
async function topoEdit() {
  Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_OBJECT)
  const _params = ToolbarModule.getParams()
  //切换方式 清除上次增量的数据
  await SNavigation.clearIncrementPoints()
  SMap.submit()
  await SMap.setAction(Action.SELECT)
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_EDIT, {
      isFullScreen: false,
      height: 0,
      resetToolModuleData: true,
    })
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
  showAttribute,
}
