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
import { getPublicAssets } from '../../../../../../assets'
import BackgroundTimer from 'react-native-background-timer'
import { SMap, Action } from 'imobile_for_reactnative'
import { Toast, LayerUtils } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'

async function start() {
  if (GLOBAL.INCREMENT_DATA.datasetName) {
    BackgroundTimer.runBackgroundTimer(async () => {
      await SMap.startGpsIncrement()
    }, 2000)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
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
      await SMap.clearIncrementPoints()
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      await SMap.clearIncrementPoints()
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
  if (GLOBAL.INCREMENT_DATA.datasetName) {
    await SMap.startGpsIncrement()
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
  }
}

/**
 * 提交
 */
async function submit() {
  if (GLOBAL.INCREMENT_DATA.datasetName) {
    const _params = ToolbarModule.getParams()
    let type = _params.type
    switch (type) {
      case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
        BackgroundTimer.stopBackgroundTimer()
        await SMap.submitIncrement()
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
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
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
      await SMap.redoIncrement()
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
      await SMap.undoIncrement()
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
}

/**
 * 切换数据集
 */
function changeNetwork() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_INCREMENT_CHANGE_NETWORK, {
    isFullScreen: false,
    containerType: ToolbarType.list,
    height:
      _params.device.orientation === 'PORTRAIT'
        ? Height.LIST_HEIGHT_P
        : Height.LIST_HEIGHT_L,
  })
  ToolbarModule.addData({ preType: type })
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
      image = getPublicAssets().navigation.btn_increment_point_line
      break
    case ConstToolType.SM_MAP_INCREMENT_FREELINE:
      image = getPublicAssets().navigation.btn_increment_freeline
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      image = getPublicAssets().navigation.btn_increment_gps_point
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
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
  GLOBAL.SimpleDialog.set({
    text: getLanguage(GLOBAL.language).Prompt.CONFIRM_EXIT,
    confirmAction: dialogConfirm,
  })
  GLOBAL.SimpleDialog.setVisible(true)
}

function dialogConfirm() {
  const _params = ToolbarModule.getParams()
  if (GLOBAL.INCREMENT_DATA.datasetName) {
    BackgroundTimer.stopBackgroundTimer()
    SMap.clearIncrementPoints()
    SMap.cancelIncrement(GLOBAL.INCREMENT_DATA)
  }
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(false)
  let layers = _params.layers.layers
  LayerUtils.setLayersSelectable(layers, true, true)
  GLOBAL.FloorListView?.setVisible(true)
  GLOBAL.mapController?.setVisible(true)
  GLOBAL.TouchType = TouchType.NORMAL
}

/**
 * 拓扑编辑
 */
async function topoEdit() {
  const _params = ToolbarModule.getParams()
  //切换方式 清除上次增量的数据
  await SMap.clearIncrementPoints()
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
}
