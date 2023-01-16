/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import {
  ConstToolType,
  // Height,
  ToolbarType,
  TouchType,
} from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'
import { Toast, LayerUtils } from '../../../../../../utils'
import {  SMap, SNavigation } from 'imobile_for_reactnative'
import { DatasetType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SDataType'
import { constants } from '../../../index'
import TopoEditData from './TopoEditData'
import { getLanguage } from '../../../../../../language'
import { Action } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'

async function geometrySelected(event) {
  const _params = ToolbarModule.getParams()
  let preType = _params.type
  if (
    preType === ConstToolType.SM_MAP_TOPO_SPLIT_LINE &&
    ToolbarModule.getData().event
  ) {
    ToolbarModule.addData({ secondEvent: event })
    global.bubblePane && global.bubblePane.clear()
  } else {
    ToolbarModule.addData({
      event,
    })
  }
  const layerType = event.layerInfo.type
  let geoType
  let fieldInfos = event.fieldInfo
  for (let i = 0; i < fieldInfos.length; i++) {
    if (fieldInfos[i].name === 'SmGeoType') {
      geoType = fieldInfos[i].value
      break
    }
  }
  if (!geoType) {
    geoType = layerType
  }

  let type
  let secondLine = false
  if (geoType === DatasetType.LINE) {
    switch (preType) {
      case ConstToolType.SM_MAP_TOPO_EDIT:
      case ConstToolType.SM_MAP_TOPO_OBJECT_EDIT:
        {
          SMap.setAction(Action.VERTEXEDIT)
          type = ConstToolType.SM_MAP_TOPO_OBJECT_EDIT_SELECTED
          const _data = await TopoEditData.getData(type)
          const containerType = ToolbarType.table
          const data = ToolbarModule.getToolbarSize(containerType, {
            data: _data.data,
          })
          _params.setToolbarVisible(true, type, {
            containerType,
            isFullScreen: false,
            height: data.height,
            column: data.column,
            ..._data,
          })
        }
        break
      case ConstToolType.SM_MAP_TOPO_SMOOTH:
        //弹窗 输入平滑系数
        global.InputDialog?.setDialogVisible(true, {
          title: getLanguage(global.language).Prompt.SMOOTH_FACTOR,
          value: '',
          confirmBtnTitle: getLanguage(global.language).Prompt.CONFIRM,
          cancelBtnTitle: getLanguage(global.language).Prompt.CANCEL,
          placeholder: '',
          returnKeyType: 'done',
          keyboardAppearance: 'dark',
          keyboardType: 'numeric',
          confirmAction: inputConfirm,
          cancelAction: inputCancel,
        })
        break
      // case ConstToolType.SM_MAP_TOPO_EXTEND_LINE:
      //   SMap.setAction(Action.PAN)
      //   Toast.show(getLanguage(global.language).Prompt.SELECT_EXTEND_LINE)
      //   //geometrySelected会在singleTap之前触发 延迟改变类型，避免触发两个
      //   setTimeout(() => {
      //     global.TouchType = TouchType.MAP_TOPO_EXTEND_LINE
      //   }, 200)
      //   break
      case ConstToolType.SM_MAP_TOPO_SPLIT_LINE: {
        let data = ToolbarModule.getData()
        let { secondEvent } = data
        if (!secondEvent) {
          Toast.show(getLanguage(global.language).Prompt.SELECT_SECOND_LINE)
        } else {
          secondLine = true
          SMap.setAction(Action.PAN)
        }
        break
      }
      // case ConstToolType.SM_MAP_TOPO_TRIM_LINE:
      //   SMap.setAction(Action.PAN)
      //   Toast.show(getLanguage(global.language).Prompt.SELECT_TRIM_LINE)
      //   //geometrySelected会在singleTap之前触发 延迟改变类型，避免触发两个
      //   setTimeout(() => {
      //     global.TouchType = TouchType.MAP_TOPO_TRIM_LINE
      //   }, 200)
      //   break
      case ConstToolType.SM_MAP_TOPO_RESAMPLE_LINE:
        resampleLine()
        break
      case ConstToolType.SM_MAP_TOPO_CHANGE_DIRECTION:
        changeLineDirection()
        break
    }
    if (
      preType === ConstToolType.SM_MAP_TOPO_EXTEND_LINE ||
      preType === ConstToolType.SM_MAP_TOPO_SPLIT_LINE ||
      preType === ConstToolType.SM_MAP_TOPO_TRIM_LINE
    ) {
      let params = {
        id: event.id,
        ...global.INCREMENT_DATA,
        secondLine,
      }
      SNavigation.drawSelectedLineOnTrackingLayer(params)
    }
  }
}

/**
 * 提交 显示Dialog
 */
function commit() {
  global.SimpleDialog.set({
    text: getLanguage(global.language).Prompt.TOPO_EDIT_END,
    confirmAction: dialogConfirm,
  })
  global.SimpleDialog.setVisible(true)
}

function dialogConfirm() {
  const _params = ToolbarModule.getParams()
  SNavigation.cancelIncrement(global.INCREMENT_DATA)
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(false)
  let layers = _params.layers.layers
  LayerUtils.setLayersSelectable(layers, true, true)
  global.FloorListView?.setVisible(true)
  global.mapController?.setVisible(true)
  global.TouchType = TouchType.NORMAL
  SNavigation.clearTrackingLayer()
  global.bubblePane && global.bubblePane.clear()
}
/**
 * 合并数据集
 */
// function showMerge() {
//   const _params = ToolbarModule.getParams()
//   let preType = _params.type
//   _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_MERGE_DATASET, {
//     isFullScreen: false,
//     containerType: ToolbarType.list,
//     height:
//       _params.device.orientation === 'PORTRAIT'
//         ? Height.LIST_HEIGHT_P
//         : Height.LIST_HEIGHT_L,
//   })
//   ToolbarModule.addData({ preType })
// }

//切换编辑方式
async function changeEditType() {
  const _params = ToolbarModule.getParams()
  if (_params.type === ConstToolType.SM_MAP_TOPO_SWITCH_TYPE) {
    return
  }
  SNavigation.clearTrackingLayer()
  global.TouchType = TouchType.NULL
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_SWITCH_TYPE, {
    containerType: ToolbarType.table,
    isFullScreen: false,
  })
}
//对象编辑
function changeAction(item) {
  //打开捕捉
  let { key } = item
  switch (key) {
    case constants.MAP_TOPO_MOVE_OBJECT:
      SMap.setAction(Action.MOVE_GEOMETRY)
      break
    case constants.MAP_TOPO_ADD_NODE:
      SMap.setAction(Action.VERTEXADD)
      break
    case constants.MAP_TOPO_EDIT_NODE:
      SMap.setAction(Action.VERTEXEDIT)
      break
    case constants.MAP_TOPO_DELETE_NODE:
      SMap.setAction(Action.VERTEXDELETE)
      break
    case constants.MAP_TOPO_DELETE_OBJECT:
      global.removeObjectDialog &&
        global.removeObjectDialog.setDialogVisible(true)
      break
  }
}

//拓扑编辑
async function switchType(item) {
  let { key } = item
  let touchType
  let type ,params,title
  switch (key) {
    case constants.MAP_TOPO_SMOOTH:
      type = ConstToolType.SM_MAP_TOPO_SMOOTH
      //弹窗 输入平滑系数
        global.InputDialog?.setDialogVisible(true, {
          title: getLanguage(global.language).Prompt.SMOOTH_FACTOR,
          value: '',
          confirmBtnTitle: getLanguage(global.language).Prompt.CONFIRM,
          cancelBtnTitle: getLanguage(global.language).Prompt.CANCEL,
          placeholder: '',
          returnKeyType: 'done',
          keyboardAppearance: 'dark',
          keyboardType: 'numeric',
          confirmAction: inputConfirm,
          cancelAction: inputCancel,
        })
      // await SMap.setAction(Action.SELECT)
      // Toast.show(getLanguage(global.language).Prompt.SELECT_LINE_SMOOTH)
      break
    case constants.MAP_TOPO_SPLIT_LINE:
      params = {
        id: ToolbarModule.getData().event.id,
        ...global.INCREMENT_DATA,
        secondLine: false,
      }
      SNavigation.drawSelectedLineOnTrackingLayer(params)
      type = ConstToolType.SM_MAP_TOPO_SPLIT_LINE
      await SMap.setAction(Action.SELECT)
      title= getLanguage(global.language).Prompt.SELECT_LINE_WITH_INTERRUPT
      break
    case constants.MAP_TOPO_SPLIT:
      params = {
        id: ToolbarModule.getData().event.id,
        ...global.INCREMENT_DATA,
        secondLine: false,
      }
      SNavigation.drawSelectedLineOnTrackingLayer(params)
      type = ConstToolType.SM_MAP_TOPO_SPLIT
      touchType = TouchType.MAP_TOPO_SPLIT_BY_POINT
      await SMap.setAction(Action.PAN)
      // Toast.show(getLanguage(global.language).Prompt.SELECT_A_POINT_INLINE)
      title= getLanguage(global.language).Prompt.SELECT_POINT_INCURRENTLINE
      break
    case constants.MAP_TOPO_EXTEND:
      title= getLanguage(global.language).Prompt.SELECT_LINE_EXTENSION
      params = {
        id: ToolbarModule.getData().event.id,
        ...global.INCREMENT_DATA,
        secondLine: false,
      }
      SNavigation.drawSelectedLineOnTrackingLayer(params)
      type = ConstToolType.SM_MAP_TOPO_EXTEND_LINE
      await SMap.setAction(Action.PAN)
      setTimeout(() => {
        global.TouchType = TouchType.MAP_TOPO_EXTEND_LINE
      }, 200)
      break
    case constants.MAP_TOPO_TRIM:
      title= getLanguage(global.language).Prompt.SELECT_LINE_TO_TRIM
      params = {
        id: ToolbarModule.getData().event.id,
        ...global.INCREMENT_DATA,
        secondLine: false,
      }
      SNavigation.drawSelectedLineOnTrackingLayer(params)
      type = ConstToolType.SM_MAP_TOPO_TRIM_LINE
      await SMap.setAction(Action.PAN)
      setTimeout(() => {
        global.TouchType = TouchType.MAP_TOPO_TRIM_LINE
      }, 200)
      break
    case constants.MAP_TOPO_RESAMPLE:
      // type = ConstToolType.SM_MAP_TOPO_RESAMPLE_LINE
      type = ConstToolType.SM_MAP_TOPO_EDIT
      await SMap.setAction(Action.SELECT)
      resampleLine()
      // Toast.show(getLanguage(global.language).Prompt.SELECT_RESAMPLE_LINE)
      break
    case constants.MAP_TOPO_CHANGE_DIRECTION:
      // type = ConstToolType.SM_MAP_TOPO_CHANGE_DIRECTION
      type = ConstToolType.SM_MAP_TOPO_EDIT
      await SMap.setAction(Action.SELECT)
      changeLineDirection()
      // Toast.show(
      //   getLanguage(global.language).Prompt.SELECT_CHANGE_DIRECTION_LINE,
      // )
      break
    case constants.MAP_TOPO_OBJECT_EDIT:
      type = ConstToolType.SM_MAP_TOPO_OBJECT_EDIT
      await SMap.setAction(Action.SELECT)
      break
  }
  const _params = ToolbarModule.getParams()
  const _data = await TopoEditData.getData(type)
  const containerType = ToolbarType.table
  const data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
  _params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: false,
    height: data.height,
    column: data.column,
    touchType,
    ..._data,
  })
  global.bubblePane && global.bubblePane.clear()
  global.bubblePane &&
    global.bubblePane.addBubble(
      {
        title: title,
        type: 'success',
      },
    )
}

function undo() {
  SMap.undo()
}

function redo() {
  SMap.redo()
}

function submit() {
  SMap.submit()
  let type = ConstToolType.SM_MAP_TOPO_EDIT
  const _params = ToolbarModule.getParams()
  const containerType = ToolbarType.table
  ToolbarModule.setToolBarData(type)
  _params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: false,
  })
  SMap.setAction(Action.SELECT)
}

async function close() {
  const _params = ToolbarModule.getParams()
  const containerType = ToolbarType.table
  let nextType, touchType
  if (
    _params.type === ConstToolType.SM_MAP_TOPO_EDIT ||
    _params.type === ConstToolType.SM_MAP_TOPO_SWITCH_TYPE ||
    _params.type === ConstToolType.SM_MAP_TOPO_OBJECT_EDIT_SELECTED
  ) {
    ToolbarModule.setToolBarData(ConstToolType.SM_MAP_INCREMENT_GPS_TRACK)
    // nextType = ConstToolType.SM_MAP_INCREMENT_GPS_TRACK
    nextType = global.NAVMETHOD
    touchType = TouchType.NULL
    SMap.setAction(Action.PAN)
    switch (nextType) {
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
  } else {
    nextType = ConstToolType.SM_MAP_TOPO_EDIT
    SMap.setAction(Action.SELECT)
  }
  SNavigation.clearTrackingLayer()
  _params.setToolbarVisible(true, nextType, {
    containerType,
    isFullScreen: false,
    touchType,
  })
  global.bubblePane && global.bubblePane.clear()
}

/**
 * 输入框确定事件
 * @param text
 */
async function inputConfirm(text) {
  let data = ToolbarModule.getData()

  let reg = /^[0-9]+$/
  if (reg.test(text) && text >= 2 && text <= 10) {
    let result = await SNavigation.smoothLine({
      id: data.event.id,
      smooth: ~~text,
      ...global.INCREMENT_DATA,
    })
    if (result) {
      Toast.show(getLanguage(global.language).Prompt.EDIT_SUCCESS)
    }
    const _params = ToolbarModule.getParams()
    await SMap.setAction(Action.SELECT)
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_EDIT, {
        isFullScreen: false,
        height: 0,
        resetToolModuleData: true,
      })
    return true
  } else {
    Toast.show(
      getLanguage(global.language).Prompt.SMOOTH_NUMBER_NEED_BIGGER_THAN_2,
    )
    return false
  }
}

/**
 * 输入框取消事件
 */
function inputCancel() {
  const _params = ToolbarModule.getParams()
  // SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_OBJECT_EDIT_SELECTED, {
    containerType: ToolbarType.table,
    isFullScreen: false,
  })
}

/**
 * 点打断线
 * @param point
 * @returns {Promise<void>}
 */
async function pointSplitLine(point) {
  let params = {
    id: ToolbarModule.getData().event.id,
    point,
    ...global.INCREMENT_DATA,
  }
  let rel = await SNavigation.pointSplitLine(params)
  if (rel) {
    Toast.show(getLanguage(global.language).Prompt.EDIT_SUCCESS)
    global.TouchType = TouchType.NULL
    const _params = ToolbarModule.getParams()
    await SMap.setAction(Action.SELECT)
    SNavigation.clearTrackingLayer()
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_EDIT, {
        isFullScreen: false,
        height: 0,
        resetToolModuleData: true,
      })
  } else {
    Toast.show(getLanguage(global.language).Prompt.SELECT_POINT_INCURRENTLINE)
  }
}

/**
 * 线延长
 * @returns {Promise<void>}
 */
async function extendLine() {
  let data = ToolbarModule.getData()
  let point = data.point
  if (!point) {
    Toast.show(getLanguage(global.language).Prompt.SELECT_A_POINT_INLINE)
    return
  }
  let params = {
    point,
    id: data.event.id,
    ...global.INCREMENT_DATA,
  }
  let rel = await SNavigation.extendLine(params)
  if (rel) {
    Toast.show(getLanguage(global.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(global.language).Prompt.EDIT_FAILED)
  }
  global.TouchType = TouchType.NULL
  SMap.setAction(Action.SELECT)
  ToolbarModule.addData({ event: undefined, point: undefined })
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_EDIT, {
      isFullScreen: false,
      height: 0,
      resetToolModuleData: true,
    })
}

/**
 * 线线打断
 * @returns {Promise<void>}
 */
async function lineSplitByLine() {
  let data = ToolbarModule.getData()
  let { event, secondEvent } = data
  if (!secondEvent) {
    Toast.show(getLanguage(global.language).Prompt.SELECT_SECOND_LINE)
    return
  }
  let params = {
    id1: event.id,
    id2: secondEvent.id,
    ...global.INCREMENT_DATA,
  }
  let rel = await SNavigation.lineSplitByLine(params)
  if (rel) {
    Toast.show(getLanguage(global.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(global.language).Prompt.EDIT_FAILED)
  }
  SMap.setAction(Action.SELECT)
  global.TouchType = TouchType.NULL
  ToolbarModule.addData({ event: undefined, secondEvent: undefined })
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_EDIT, {
      isFullScreen: false,
      height: 0,
      resetToolModuleData: true,
    })
}

/**
 * 线修剪
 * @returns {Promise<void>}
 */
async function trimLine() {
  let data = ToolbarModule.getData()
  let point = data.point
  if (!point) {
    Toast.show(getLanguage(global.language).Prompt.SELECT_A_POINT_INLINE)
    return
  }
  let params = {
    point,
    id: data.event.id,
    ...global.INCREMENT_DATA,
  }
  let rel = await SNavigation.trimLine(params)
  if (rel) {
    Toast.show(getLanguage(global.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(global.language).Prompt.EDIT_FAILED)
  }
  global.TouchType = TouchType.NULL
  SMap.setAction(Action.SELECT)
  ToolbarModule.addData({ event: undefined, point: undefined })
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_EDIT, {
      isFullScreen: false,
      height: 0,
      resetToolModuleData: true,
    })
}

/**
 * 重采样
 * @returns {Promise<void>}
 */
async function resampleLine() {
  let data = ToolbarModule.getData()
  let params = {
    id: data.event.id,
    ...global.INCREMENT_DATA,
  }
  let rel = await SNavigation.resampleLine(params)
  if (rel) {
    Toast.show(getLanguage(global.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(global.language).Prompt.EDIT_FAILED)
  }
  // SMap.setAction(Action.SELECT)
  // ToolbarModule.addData({ event: undefined })
}

/**
 * 变方向
 * @returns {Promise<void>}
 */
async function changeLineDirection() {
  let data = ToolbarModule.getData()
  let params = {
    id: data.event.id,
    ...global.INCREMENT_DATA,
  }
  let rel = await SNavigation.changeLineDirection(params)
  if (rel) {
    Toast.show(getLanguage(global.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(global.language).Prompt.EDIT_FAILED)
  }
  // SMap.setAction(Action.SELECT)
  // ToolbarModule.addData({ event: undefined })
}

function editConfirm() {
  SNavigation.clearTrackingLayer()
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch (type) {
    case ConstToolType.SM_MAP_TOPO_SPLIT_LINE:
      lineSplitByLine()
      break
    case ConstToolType.SM_MAP_TOPO_EXTEND_LINE:
      extendLine()
      break
    case ConstToolType.SM_MAP_TOPO_TRIM_LINE:
      trimLine()
      break
  }
  global.bubblePane && global.bubblePane.clear()
}

async function editCancel() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch (type) {
    case ConstToolType.SM_MAP_TOPO_SPLIT_LINE:
    case ConstToolType.SM_MAP_TOPO_EXTEND_LINE:
    case ConstToolType.SM_MAP_TOPO_TRIM_LINE:
      await SMap.setAction(Action.SELECT)
      ToolbarModule.addData({
        event: undefined,
        secondEvent: undefined,
        point: undefined,
      })
      break
  }
  global.TouchType = TouchType.NULL
  SNavigation.clearTrackingLayer()
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_TOPO_EDIT, {
      isFullScreen: false,
      height: 0,
      resetToolModuleData: true,
    })
  global.bubblePane && global.bubblePane.clear()
}
export default {
  close,
  commit,
  geometrySelected,

  // showMerge,
  changeEditType,
  changeAction,
  switchType,
  undo,
  redo,
  submit,
  inputConfirm,
  inputCancel,
  pointSplitLine,
  extendLine,
  trimLine,
  resampleLine,
  changeLineDirection,
  editConfirm,
  editCancel,
}
