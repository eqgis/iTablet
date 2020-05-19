/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import {
  ConstToolType,
  Height,
  ToolbarType,
  TouchType,
} from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'
import { Toast } from '../../../../../../utils'
import { DatasetType, SMap, Action } from 'imobile_for_reactnative'
import { constants } from '../../../index'
import TopoEditData from './TopoEditData'
import { getLanguage } from '../../../../../../language'

async function geometrySelected(event) {
  const _params = ToolbarModule.getParams()
  let preType = _params.type
  if (
    preType === ConstToolType.MAP_TOPO_SPLIT_LINE &&
    ToolbarModule.getData().event
  ) {
    ToolbarModule.addData({ secondEvent: event })
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
      case ConstToolType.MAP_TOPO_EDIT:
      case ConstToolType.MAP_TOPO_OBJECT_EDIT:
        {
          SMap.setAction(Action.VERTEXEDIT)
          type = ConstToolType.MAP_TOPO_OBJECT_EDIT_SELECTED
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
      case ConstToolType.MAP_TOPO_SMOOTH:
        //弹窗 输入平滑系数
        GLOBAL.InputDialog?.setDialogVisible(true, {
          title: getLanguage(GLOBAL.language).Prompt.SMOOTH_FACTOR,
          value: '',
          confirmBtnTitle: getLanguage(GLOBAL.language).Prompt.CONFIRM,
          cancelBtnTitle: getLanguage(GLOBAL.language).Prompt.CANCEL,
          placeholder: '',
          returnKeyType: 'done',
          keyboardAppearance: 'dark',
          keyboardType: 'numeric',
          confirmAction: inputConfirm,
          cancelAction: inputCancel,
        })
        break
      case ConstToolType.MAP_TOPO_EXTEND_LINE:
        SMap.setAction(Action.PAN)
        Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_EXTEND_LINE)
        //geometrySelected会在singleTap之前触发 延迟改变类型，避免触发两个
        setTimeout(() => {
          GLOBAL.TouchType = TouchType.MAP_TOPO_EXTEND_LINE
        }, 200)
        break
      case ConstToolType.MAP_TOPO_SPLIT_LINE: {
        await SMap.setAction(Action.SELECT)
        let data = ToolbarModule.getData()
        let { secondEvent } = data
        if (!secondEvent) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_SECOND_LINE)
        } else {
          secondLine = true
          SMap.setAction(Action.PAN)
        }
        break
      }
      case ConstToolType.MAP_TOPO_TRIM_LINE:
        SMap.setAction(Action.PAN)
        Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_TRIM_LINE)
        //geometrySelected会在singleTap之前触发 延迟改变类型，避免触发两个
        setTimeout(() => {
          GLOBAL.TouchType = TouchType.MAP_TOPO_TRIM_LINE
        }, 200)
        break
      case ConstToolType.MAP_TOPO_RESAMPLE_LINE:
        resampleLine()
        break
      case ConstToolType.MAP_TOPO_CHANGE_DIRECTION:
        changeLineDirection()
        break
    }
    if (
      preType === ConstToolType.MAP_TOPO_EXTEND_LINE ||
      preType === ConstToolType.MAP_TOPO_SPLIT_LINE ||
      preType === ConstToolType.MAP_TOPO_TRIM_LINE
    ) {
      let params = {
        id: event.id,
        ...GLOBAL.INCREMENT_DATA,
        secondLine,
      }
      SMap.drawSelectedLineOnTrackingLayer(params)
    }
  }
}

function commit() {
  const _params = ToolbarModule.getParams()
  SMap.cancelIncrement(GLOBAL.INCREMENT_DATA)
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(false)
  let layers = _params.layers.layers
  let currentLayer = _params.layers.currentLayer
  layers.map(
    async layer => await SMap.setLayerSelectable(layer.path, layer.selectable),
  )
  if (currentLayer.name) {
    _params.setCurrentLayer(currentLayer)
    SMap.setLayerEditable(currentLayer.name, true)
    SMap.setLayerVisible(currentLayer.name, true)
  }
  GLOBAL.FloorListView?.setVisible(true)
  GLOBAL.mapController?.setVisible(true)
  GLOBAL.TouchType = TouchType.NORMAL
}
/**
 * 合并数据集
 */
function showMerge() {
  const _params = ToolbarModule.getParams()
  let preType = _params.type
  _params.setToolbarVisible(true, ConstToolType.MAP_TOPO_MERGE_DATASET, {
    isFullScreen: false,
    containerType: ToolbarType.list,
    height:
      _params.device.orientation === 'PORTRAIT'
        ? Height.LIST_HEIGHT_P
        : Height.LIST_HEIGHT_L,
  })
  ToolbarModule.addData({ preType })
}

//切换编辑方式
async function changeEditType() {
  const _params = ToolbarModule.getParams()
  if (_params.type === ConstToolType.MAP_TOPO_SWITCH_TYPE) {
    return
  }
  SMap.clearTrackingLayer()
  GLOBAL.TouchType = TouchType.NULL
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.MAP_TOPO_SWITCH_TYPE, {
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
      GLOBAL.removeObjectDialog &&
        GLOBAL.removeObjectDialog.setDialogVisible(true)
      break
  }
}

//拓扑编辑
async function switchType(item) {
  let { key } = item
  let touchType
  let type
  switch (key) {
    case constants.MAP_TOPO_SMOOTH:
      type = ConstToolType.MAP_TOPO_SMOOTH
      await SMap.setAction(Action.SELECT)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_SMOOTH)
      break
    case constants.MAP_TOPO_SPLIT_LINE:
      type = ConstToolType.MAP_TOPO_SPLIT_LINE
      await SMap.setAction(Action.SELECT)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_BASE_LINE)
      break
    case constants.MAP_TOPO_SPLIT:
      type = ConstToolType.MAP_TOPO_SPLIT
      touchType = TouchType.MAP_TOPO_SPLIT_BY_POINT
      await SMap.setAction(Action.PAN)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_A_POINT_INLINE)
      break
    case constants.MAP_TOPO_EXTEND:
      type = ConstToolType.MAP_TOPO_EXTEND_LINE
      await SMap.setAction(Action.SELECT)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_BASE_LINE)
      break
    case constants.MAP_TOPO_TRIM:
      type = ConstToolType.MAP_TOPO_TRIM_LINE
      await SMap.setAction(Action.SELECT)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_BASE_LINE)
      break
    case constants.MAP_TOPO_RESAMPLE:
      type = ConstToolType.MAP_TOPO_RESAMPLE_LINE
      await SMap.setAction(Action.SELECT)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_RESAMPLE_LINE)
      break
    case constants.MAP_TOPO_CHANGE_DIRECTION:
      type = ConstToolType.MAP_TOPO_CHANGE_DIRECTION
      await SMap.setAction(Action.SELECT)
      Toast.show(
        getLanguage(GLOBAL.language).Prompt.SELECT_CHANGE_DIRECTION_LINE,
      )
      break
    case constants.MAP_TOPO_OBJECT_EDIT:
      type = ConstToolType.MAP_TOPO_OBJECT_EDIT
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
}

function undo() {
  SMap.undo()
}

function redo() {
  SMap.redo()
}

function submit() {
  SMap.submit()
  let type = ConstToolType.MAP_TOPO_EDIT
  const _params = ToolbarModule.getParams()
  const containerType = ToolbarType.table
  ToolbarModule.setToolBarData(type)
  _params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: false,
  })
  SMap.setAction(Action.SELECT)
}

function close() {
  const _params = ToolbarModule.getParams()
  const containerType = ToolbarType.table
  let nextType, touchType
  if (
    _params.type === ConstToolType.MAP_TOPO_EDIT ||
    _params.type === ConstToolType.MAP_TOPO_SWITCH_TYPE
  ) {
    ToolbarModule.setToolBarData(ConstToolType.MAP_INCREMENT_GPS_TRACK)
    nextType = ConstToolType.MAP_INCREMENT_GPS_TRACK
    touchType = TouchType.NULL
  } else {
    nextType = ConstToolType.MAP_TOPO_SWITCH_TYPE
  }
  SMap.setAction(Action.PAN)
  SMap.clearTrackingLayer()
  _params.setToolbarVisible(true, nextType, {
    containerType,
    isFullScreen: false,
    touchType,
  })
}

/**
 * 输入框确定事件
 * @param text
 */
async function inputConfirm(text) {
  let data = ToolbarModule.getData()

  let reg = /^[0-9]+$/
  if (reg.test(text) && text >= 2 && text <= 10) {
    let result = await SMap.smoothLine({
      id: data.event.id,
      smooth: ~~text,
      ...GLOBAL.INCREMENT_DATA,
    })
    if (result) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_SUCCESS)
    }
    SMap.setAction(Action.SELECT)
  } else {
    Toast.show(
      getLanguage(GLOBAL.language).Prompt.SMOOTH_NUMBER_NEED_BIGGER_THAN_2,
    )
    return false
  }
}

/**
 * 输入框取消事件
 */
function inputCancel() {
  const _params = ToolbarModule.getParams()
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.MAP_TOPO_SWITCH_TYPE, {
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
    point,
    ...GLOBAL.INCREMENT_DATA,
  }
  let rel = await SMap.pointSplitLine(params)
  if (rel) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_FAILED)
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
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_A_POINT_INLINE)
    return
  }
  let params = {
    point,
    id: data.event.id,
    ...GLOBAL.INCREMENT_DATA,
  }
  let rel = await SMap.extendLine(params)
  if (rel) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_FAILED)
  }
  GLOBAL.TouchType = TouchType.NULL
  SMap.setAction(Action.SELECT)
  ToolbarModule.addData({ event: undefined, point: undefined })
}

/**
 * 线线打断
 * @returns {Promise<void>}
 */
async function lineSplitByLine() {
  let data = ToolbarModule.getData()
  let { event, secondEvent } = data
  if (!secondEvent) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_SECOND_LINE)
    return
  }
  let params = {
    id1: event.id,
    id2: secondEvent.id,
    ...GLOBAL.INCREMENT_DATA,
  }
  let rel = await SMap.lineSplitByLine(params)
  if (rel) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_FAILED)
  }
  SMap.setAction(Action.SELECT)
  GLOBAL.TouchType = TouchType.NULL
  ToolbarModule.addData({ event: undefined, secondEvent: undefined })
}

/**
 * 线修剪
 * @returns {Promise<void>}
 */
async function trimLine() {
  let data = ToolbarModule.getData()
  let point = data.point
  if (!point) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_A_POINT_INLINE)
    return
  }
  let params = {
    point,
    id: data.event.id,
    ...GLOBAL.INCREMENT_DATA,
  }
  let rel = await SMap.trimLine(params)
  if (rel) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_FAILED)
  }
  GLOBAL.TouchType = TouchType.NULL
  SMap.setAction(Action.SELECT)
  ToolbarModule.addData({ event: undefined, point: undefined })
}

/**
 * 重采样
 * @returns {Promise<void>}
 */
async function resampleLine() {
  let data = ToolbarModule.getData()
  let params = {
    id: data.event.id,
    ...GLOBAL.INCREMENT_DATA,
  }
  let rel = await SMap.resampleLine(params)
  if (rel) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_FAILED)
  }
  SMap.setAction(Action.SELECT)
  ToolbarModule.addData({ event: undefined })
}

/**
 * 变方向
 * @returns {Promise<void>}
 */
async function changeLineDirection() {
  let data = ToolbarModule.getData()
  let params = {
    id: data.event.id,
    ...GLOBAL.INCREMENT_DATA,
  }
  let rel = await SMap.changeLineDirection(params)
  if (rel) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_SUCCESS)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.EDIT_FAILED)
  }
  SMap.setAction(Action.SELECT)
  ToolbarModule.addData({ event: undefined })
}

function editConfirm() {
  SMap.clearTrackingLayer()
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch (type) {
    case ConstToolType.MAP_TOPO_SPLIT_LINE:
      lineSplitByLine()
      break
    case ConstToolType.MAP_TOPO_EXTEND_LINE:
      extendLine()
      break
    case ConstToolType.MAP_TOPO_TRIM_LINE:
      trimLine()
      break
  }
}

async function editCancel() {
  const _params = ToolbarModule.getParams()
  let type = _params.type
  switch (type) {
    case ConstToolType.MAP_TOPO_SPLIT_LINE:
    case ConstToolType.MAP_TOPO_EXTEND_LINE:
    case ConstToolType.MAP_TOPO_TRIM_LINE:
      await SMap.setAction(Action.SELECT)
      ToolbarModule.addData({
        event: undefined,
        secondEvent: undefined,
        point: undefined,
      })
      break
  }
  GLOBAL.TouchType = TouchType.NULL
  SMap.clearTrackingLayer()
}
export default {
  close,
  commit,
  geometrySelected,

  showMerge,
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
