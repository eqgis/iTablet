/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import {ConstToolType, Height, ToolbarType, TouchType} from "../../../../../../constants"
import ToolbarModule from "../ToolbarModule"
import {StyleUtils, Toast} from "../../../../../../utils"
import {DatasetType, SMap, Action} from 'imobile_for_reactnative'
import {constants} from "../../../index"
import TopoEditData from "./TopoEditData"
import ToolBarHeight from "../ToolBarHeight"

async function geometrySelected(event) {
  const _params = ToolbarModule.getParams()

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

  let preType = _params.type
  let type
  switch(preType){
    case ConstToolType.MAP_TOPO_EDIT:
    case ConstToolType.MAP_TOPO_OBJECT_EDIT:
      type = ConstToolType.MAP_TOPO_OBJECT_EDIT_SELECTED
      if(geoType === DatasetType.LINE){
        StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
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
      break
    case ConstToolType.MAP_TOPO_SMOOTH:
      //弹窗 输入平滑系数
      break
  }

}

function commit() {
  const _params = ToolbarModule.getParams()
  SMap.cancelIncrement(GLOBAL.INCREMENT_DATA)
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(false)
  SMap.setIsMagnifierEnabled(false)
  let layers = _params.layers.layers
  let currentLayer = _params.layers.currentLayer
  layers.map(layer => SMap.setLayerSelectable(layer.path,false))
  if(currentLayer.name){
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
    containerType:ToolbarType.list,
    height: _params.device.orientation === "PORTRAIT"
      ? Height.LIST_HEIGHT_P
      : Height.LIST_HEIGHT_L,
  })
  ToolbarModule.addData({preType})
}

//切换编辑方式
async function changeEditType() {
  const _params = ToolbarModule.getParams()
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.MAP_TOPO_SWITCH_TYPE, {
    containerType:ToolbarType.table,
    isFullScreen: false,
  })
}

//拓扑编辑
async function switchType(item) {
  let { key } = item
  let type
  switch(key){
    case constants.MAP_TOPO_ADD_NODE:
      SMap.setAction(Action.VERTEXADD)
      type = ConstToolType.MAP_TOPO_TOPING
      break
    case constants.MAP_TOPO_EDIT_NODE:
      SMap.setAction(Action.VERTEXEDIT)
      type = ConstToolType.MAP_TOPO_TOPING
      break
    case constants.MAP_TOPO_DELETE_NODE:
      SMap.setAction(Action.VERTEXDELETE)
      type = ConstToolType.MAP_TOPO_TOPING
      break
    case constants.MAP_TOPO_DELETE_OBJECT:
      GLOBAL.removeObjectDialog && GLOBAL.removeObjectDialog.setDialogVisible(true)
      break
    case constants.MAP_TOPO_SMOOTH:
      type = ConstToolType.MAP_TOPO_SMOOTH
      SMap.setAction(Action.SELECT)
      Toast.show('请选择需要平滑的线')
      break
    case constants.MAP_TOPO_POINT_ADJUST:
    case constants.MAP_TOPO_SPLIT:
    case constants.MAP_TOPO_EXTEND:
    case constants.MAP_TOPO_TRIM:
    case constants.MAP_TOPO_RESAMPLE:
    case constants.MAP_TOPO_CHANGE_DIRECTION:
    case constants.MAP_TOPO_OBJECT_EDIT:
      type = ConstToolType.MAP_TOPO_OBJECT_EDIT
      SMap.setAction(Action.SELECT)
      break

  }
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

function close() {
  const _params = ToolbarModule.getParams()
  const containerType = ToolbarType.table
  ToolbarModule.setToolBarData(ConstToolType.MAP_INCREMENT_GPS_TRACK)
  let nextType = ConstToolType.MAP_INCREMENT_GPS_TRACK
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true,nextType,{
    containerType,
    isFullScreen:false,
  })
}
export default {
  close,
  commit,
  geometrySelected,

  showMerge,
  changeEditType,
  switchType,
  undo,
  redo,
  cancel,
  submit,
}