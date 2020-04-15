/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import {ConstToolType, Height, ToolbarType } from "../../../../../../constants"
import ToolbarModule from "../ToolbarModule"
import {StyleUtils} from "../../../../../../utils"
import {DatasetType, SMap, Action} from 'imobile_for_reactnative'
import {constants} from "../../../index"
import TopoEditData from "./TopoEditData"
import ToolBarHeight from "../ToolBarHeight"

//todo 结束编辑时
//   let layers = _params.layers.layers
//   layers.map(layer => SMap.setLayerSelectable(layer.path,false))
//   重新设置当前图层 _params.layers.currentLayer
//   GLOBAL.TouchType = TouchType.NORMAL

async function geometrySelected(event) {
  const _params = ToolbarModule.getParams()
  if (_params.type === ConstToolType.MAP_TOPO_EDIT) {
    ToolbarModule.addData({
      event,
    })
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
    if(geoType === DatasetType.LINE){
      StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
      let type = ConstToolType.MAP_TOPO_SWITCH_TYPE
      const _data = await TopoEditData.getData(type)
      const containerType = ToolbarType.table
      const data = ToolBarHeight.getToolbarSize(containerType, {data: _data.data})
      _params.setToolbarVisible(true, type, {
        containerType,
        isFullScreen: false,
        height: data.height,
        column: data.column,
        ..._data,
      })
    }
  }
}

/**
 * 合并数据集
 */
function showMerge() {
  const _params = ToolbarModule.getParams()
  let preType = _params.type
  _params.setToolbarVisible(true, ConstToolType.MAP_TOPO_MERGE_DATASET, {
    isFullScreen: false,
    containerType:ToolbarType.list,
    height: _params.device.orientation === "PORTRAIT"
      ? Height.LIST_HEIGHT_P
      : Height.LIST_HEIGHT_L,
  })
  ToolbarModule.addData({preType})
}

function changeEditType() {
  //todo show changeType view
}

async function switchType(item) {
  let { key } = item
  switch(key){
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
      GLOBAL.removeObjectDialog && GLOBAL.removeObjectDialog.setDialogVisible(true)
      break
    case constants.MAP_TOPO_SMOOTH:
    case constants.MAP_TOPO_POINT_ADJUST:
    case constants.MAP_TOPO_SPLIT:
    case constants.MAP_TOPO_EXTEND:
    case constants.MAP_TOPO_TRIM:
    case constants.MAP_TOPO_RESAMPLE:
    case constants.MAP_TOPO_CHANGE_DIRECTION:
  }
  if(key !== constants.MAP_TOPO_DELETE_OBJECT){
    let type = ConstToolType.MAP_TOPO_TOPING
    const _params = ToolbarModule.getParams()
    const _data = await TopoEditData.getData(type)
    const containerType = ToolbarType.table
    const data = ToolBarHeight.getToolbarSize(containerType, {data: _data.data})
    _params.setToolbarVisible(true, type, {
      containerType,
      isFullScreen: false,
      height: data.height,
      column: data.column,
      ..._data,
    })
  }
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

function cancel() {
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

function close(type) {
  const _params = ToolbarModule.getParams()
  const containerType = ToolbarType.table
  switch (type) {
    case ConstToolType.MAP_TOPO_EDIT:
      ToolbarModule.setToolBarData(ConstToolType.MAP_INCREMENT_GPS_TRACK)
      _params.setToolbarVisible(true, ConstToolType.MAP_INCREMENT_GPS_TRACK,{
        containerType,
        isFullScreen:false,
      })
      SMap.setAction(Action.PAN)
      break
    case ConstToolType.MAP_TOPO_SWITCH_TYPE:
    case ConstToolType.MAP_TOPO_TOPING:
      _params.setToolbarVisible(true, ConstToolType.MAP_TOPO_EDIT,{
        containerType,
        isFullScreen:false,
      })
      SMap.setAction(Action.SELECT)
      break
  }
}
export default {
  close,
  geometrySelected,

  showMerge,
  changeEditType,
  switchType,
  undo,
  redo,
  cancel,
  submit,
}