import {
  SCollector,
  SMCollectorType,
  SMap,
  DatasetType,
  GeoStyle,
  Action,
  SLocation,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
  ConstPath,
  ToolbarType,
} from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import CollectionData from './CollectionData'
import NavigationService from '../../../../../NavigationService'
import { jsonUtil, Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'

function openTemplate(type) {
  const params = ToolbarModule.getParams()
  const _data = CollectionData.getData(type)
  const containerType = ToolbarType.tabs
  const data = ToolbarModule.getToolbarSize(containerType, {
    data: _data.data,
  })
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.SM_MAP_COLLECTION_SYMBOL, {
    isFullScreen: true,
    containerType: ToolbarType.tabs,
    ...data,
  })
}

async function showAttribute() {
  let have = await SMap.haveCurrentGeometry()
  if(have){
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SUBMIT_EDIT_GEOMETRY)
  }else{
    if(global.HAVEATTRIBUTE){
      const _params = ToolbarModule.getParams()
      NavigationService.navigate('LayerSelectionAttribute',{isCollection:true, preType: _params.type})
    }
  }
  return true
}

/**
 *
 */
function changeCollection(type) {
  const params = ToolbarModule.getParams()
  const data = ToolbarModule.getData()
  SCollector.stopCollect()
  let toolbarType
  switch (data.lastType) {
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.REGION_HAND_PATH:
    case SMCollectorType.REGION_HAND_POINT:
      toolbarType = ConstToolType.SM_MAP_COLLECTION_REGION
      break
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.LINE_HAND_PATH:
      toolbarType = ConstToolType.SM_MAP_COLLECTION_LINE
      break
    case SMCollectorType.POINT_GPS:
    case SMCollectorType.POINT_HAND:
      toolbarType = ConstToolType.SM_MAP_COLLECTION_POINT
      break
  }

  if (isGPSCollect(type)) {
    SLocation.setBackgroundLocationEnable(false)
  }

  params.setToolbarVisible(true, toolbarType, {
    isFullScreen: false,
    // height: ConstToolType.HEIGHT[0],
    cb: () => {
      ToolbarModule.addData({
        lastType: toolbarType,
      })
    },
  })
}

/** 采集分类点击事件 * */
function showCollection(type, layerName) {
  const { data, buttons } = CollectionData.getData(type)
  if (!ToolbarModule.getParams().setToolbarVisible) return
  // const column = 4
  // const rows = Math.ceil(data.length / column) - 1 + 1
  // let height
  // switch (rows) {
  //   case 2:
  //     height = ConstToolType.HEIGHT[2]
  //     break
  //   case 1:
  //   default:
  //     height = ConstToolType.HEIGHT[0]
  //     break
  // }
  ToolbarModule.getParams().showFullMap(true)
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    isFullScreen: false,
    // height,
    data,
    buttons,
    // column,
    cb: () => {
      ToolbarModule.addData({
        lastType: type,
        lastLayer:layerName,
      })
      createCollector(type, layerName)
    },
  })
}

function showSymbol() {
  global.HAVEATTRIBUTE = false
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.SM_MAP_COLLECTION_SYMBOL, {
    isFullScreen: true,
    containerType: ToolbarType.tabs,
    cb: () => SCollector.stopCollect(),
  })
}

/** 创建采集 * */
async function createCollector(type, layerName) {
  const _params = ToolbarModule.getParams()
  // 风格
  const geoStyle = new GeoStyle()
  const collectorStyle = new GeoStyle()
  collectorStyle.setPointColor(0, 255, 0)
  // 线颜色
  collectorStyle.setLineColor(0, 255, 0)
  // 面颜色
  collectorStyle.setFillForeColor(255, 0, 0)

  // let style = await SCollector.getStyle()
  let mType
  switch (type) {
    case SMCollectorType.POINT_GPS:
    case SMCollectorType.POINT_HAND: {
      if (
        _params.symbol.currentSymbol &&
        _params.symbol.currentSymbol.type &&
        _params.symbol.currentSymbol.type.toLowerCase() ===
          'marker'
      ) {
        geoStyle.setMarkerStyle(
          _params.symbol.currentSymbol.id,
        )
      }
      mType = DatasetType.POINT
      break
    }
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.LINE_HAND_PATH: {
      if (
        _params.symbol.currentSymbol &&
        _params.symbol.currentSymbol.type &&
        _params.symbol.currentSymbol.type.toLowerCase() ===
          'line'
      ) {
        geoStyle.setLineStyle(_params.symbol.currentSymbol.id)
      }
      mType = DatasetType.LINE
      break
    }
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.REGION_HAND_POINT:
    case SMCollectorType.REGION_HAND_PATH: {
      if (
        _params.symbol.currentSymbol &&
        _params.symbol.currentSymbol.type &&
        _params.symbol.currentSymbol.type.toLowerCase() ===
          'fill'
      ) {
        geoStyle.setFillStyle(_params.symbol.currentSymbol.id)
      }
      mType = DatasetType.REGION
      break
    }
  }

  let params = {}
  if (_params.template.currentTemplateInfo.layerPath) {
    params = {
      layerPath: _params.template.currentTemplateInfo
        .layerPath,
    }
  } else if (layerName !== undefined) {
    params = { layerPath: layerName }
  } else {
    const datasetName = _params.symbol.currentSymbol.type
      ? `${_params.symbol.currentSymbol.type}_${
        _params.symbol.currentSymbol.id
      }`
      : ''
    const datasourcePath =
      _params.collection.datasourceParentPath ||
      (await FileTools.appendingHomeDirectory(
        _params.user &&
          _params.user.currentUser &&
          _params.user.currentUser.userName
          ? `${ConstPath.UserPath +
              _params.user.currentUser.userName}/${
            ConstPath.RelativePath.Datasource
          }`
          : ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      ))

    const mapInfo = await SMap.getMapInfo()

    const datasourceName =
      _params.collection.datasourceName ||
      (_params.map &&
        _params.map.currentMap.name &&
        `${_params.map.currentMap.name}_collection`) ||
      `${mapInfo.name}_collection` ||
      `Collection-${new Date().getTime()}`

    params = {
      datasourcePath,
      datasourceName,
      datasetName,
      datasetType: mType,
      style: geoStyle,
    }
  }

  SCollector.setDataset(params).then(async layerInfo => {
    if (!layerInfo) return
    // 设置绘制风格
    await SCollector.setStyle(collectorStyle)
    await SCollector.initCollect(type)
    if (isGPSCollect(type)) {
      await SLocation.setBackgroundLocationEnable(true)
    } else {
      await SLocation.setBackgroundLocationEnable(false)
    }
    ToolbarModule.getParams().getLayers(-1, () => {
      ToolbarModule.getParams().setCurrentLayer(layerInfo)
    })
  })
}

async function collectionSubmit(type) {
  let have = await SMap.haveCurrentGeometry()
  if (have) {
    // 是否有新的采集或标注
    global.HAVEATTRIBUTE = true
  }
  const result = await SCollector.submit(type)
  if (result) {
    global.HAVEATTRIBUTE = true
    //协作时同步编辑对象
    if (global.coworkMode && global.getFriend) {
      const params = ToolbarModule.getParams()
      let currentTaskInfo = params.coworkInfo?.[params.user.currentUser.userName]?.[params.currentTask.groupID]?.[params.currentTask.id]
      let isRealTime = currentTaskInfo?.isRealTime === undefined ? false : currentTaskInfo.isRealTime
      let friend = global.getFriend()
      isRealTime && friend.onGeometryAdd(params.currentLayer)
    }
    switch (type) {
      case SMCollectorType.LINE_GPS_PATH:
      case SMCollectorType.REGION_GPS_PATH:
        await SCollector.stopCollect()
        await SCollector.cancel(type) // 防止GPS轨迹提交后，点击开始无法再次采集
        break
    }
    if (ToolbarModule.getParams().template.currentTemplateInfo.layerPath) {
      SMap.setLayerFieldInfo(
        ToolbarModule.getParams().template.currentTemplateInfo.layerPath,
        ToolbarModule.getParams().template.currentTemplateInfo.field,
      )
    }
    // 采集后 需要刷新属性表
    global.NEEDREFRESHTABLE = true
  }
  return result
}

async function cancel(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  switch (type) {
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.REGION_GPS_PATH:
      await SCollector.stopCollect()
      break
  }
  return SCollector.cancel(type)
}

function undo(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  return SCollector.undo(type)
}

function redo(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  return SCollector.redo(type)
}

async function close(type) {
  global.HAVEATTRIBUTE = false
  const params = ToolbarModule.getParams()
  // 当前为采集状态
  if (
    typeof type === 'number' ||
    (typeof type === 'string' && type.indexOf('MAP_COLLECTION_') >= 0)
  ) {
    await SCollector.stopCollect()
    if (isGPSCollect(type)) {
      await SLocation.setBackgroundLocationEnable(false)
    }
  }
  if (type === ConstToolType.SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE) {
    NavigationService.navigate('LayerSelectionAttribute', {
      isCollection:true,
    })
    await SMap.clearTrackingLayer()
    let data = ToolbarModule.getData()
    showCollection(data.lastType, data.lastLayer)
  }else{
    params.existFullMap && params.existFullMap()
    // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
    params.setToolbarVisible(false)
    params.setCurrentTemplateInfo()
    params.setCurrentSymbol()
    ToolbarModule.setData() // 关闭Toolbar清除临时数据
    SMap.setAction(Action.PAN)
  }
}

function isGPSCollect (type) {
  return (
    type === SMCollectorType.POINT_GPS ||
    type === SMCollectorType.LINE_GPS_POINT ||
    type === SMCollectorType.LINE_GPS_PATH ||
    type === SMCollectorType.REGION_GPS_POINT ||
    type === SMCollectorType.REGION_GPS_PATH
  )
}

export default {
  close,

  openTemplate,
  changeCollection,
  showCollection,
  showSymbol,
  createCollector,
  collectionSubmit,
  cancel,
  undo,
  redo,
  showAttribute,
}
