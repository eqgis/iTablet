import {
  SCollector,
  SMCollectorType,
  SMap,
  GeoStyle,
  SLocation,
  SData,
  SNavigation,
} from 'imobile_for_reactnative'
import { DatasetType, EngineType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import {
  ConstToolType,
  ConstPath,
  ToolbarType,
} from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import CollectionData from './CollectionData'
import NavigationService from '../../../../../NavigationService'
import { AppEvent, Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { Login } from '@/containers/tabs'
import { Action, } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'

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
  let have = await SMap.getCurrentEditGeometry()
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
    case SMCollectorType.REGION_AIM_POINT:
      toolbarType = ConstToolType.SM_MAP_COLLECTION_REGION
      break
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.LINE_HAND_PATH:
    case SMCollectorType.LINE_AIM_POINT:
      toolbarType = ConstToolType.SM_MAP_COLLECTION_LINE
      break
    case SMCollectorType.POINT_GPS:
    case SMCollectorType.POINT_HAND:
    case SMCollectorType.POINT_AIM_POINT:
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

  // 是准星采集的话，就发消息让准星显示出来
  if(type === SMCollectorType.LINE_AIM_POINT
    || type === SMCollectorType.POINT_AIM_POINT
    || type === SMCollectorType.REGION_AIM_POINT
  ) {
    AppEvent.emitEvent("collector_aim_point_show", true)
  } else {
    AppEvent.emitEvent("collector_aim_point_show", false)
  }
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
  let geoStyle = null
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
    case SMCollectorType.POINT_HAND:
    case SMCollectorType.POINT_AIM_POINT:
    {
      if (
        _params.symbol.currentSymbol &&
        _params.symbol.currentSymbol.type &&
        _params.symbol.currentSymbol.type.toLowerCase() ===
          'marker'
      ) {
        geoStyle = new GeoStyle()
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
    case SMCollectorType.LINE_HAND_PATH:
    case SMCollectorType.LINE_AIM_POINT:
    {
      if (
        _params.symbol.currentSymbol &&
        _params.symbol.currentSymbol.type &&
        _params.symbol.currentSymbol.type.toLowerCase() ===
          'line'
      ) {
        geoStyle = new GeoStyle()
        geoStyle.setLineStyle(_params.symbol.currentSymbol.id)
      }
      mType = DatasetType.LINE
      break
    }
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.REGION_HAND_POINT:
    case SMCollectorType.REGION_HAND_PATH:
    case SMCollectorType.REGION_AIM_POINT:
    {
      if (
        _params.symbol.currentSymbol &&
        _params.symbol.currentSymbol.type &&
        _params.symbol.currentSymbol.type.toLowerCase() ===
          'fill'
      ) {
        geoStyle = new GeoStyle()
        geoStyle.setFillStyle(_params.symbol.currentSymbol.id)
      }
      mType = DatasetType.REGION
      break
    }
  }

  let params = {}
  let datasourcePath = ''
  let datasourceName = ''
  let datasetName = ''
  let layer = null
  if (_params.template.currentTemplateInfo.layerPath) {
    params = {
      layerPath: _params.template.currentTemplateInfo
        .layerPath,
    }
    datasourceName = _params.template.currentTemplateInfo.datasetInfo.datasourceName
    datasetName = _params.template.currentTemplateInfo.datasetInfo.datasetName
  } else if (layerName !== undefined) {
    params = { layerPath: layerName }
  } else {
    datasetName = _params.symbol.currentSymbol.type
      ? `${_params.symbol.currentSymbol.type}_${
        _params.symbol.currentSymbol.id
      }`
      : ''
    datasourcePath =
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

    datasourceName =
      _params.collection.datasourceName ||
      (_params.map &&
        _params.map.currentMap.name &&
        `${_params.map.currentMap.name}_collection`) ||
      mapInfo.name && `${mapInfo.name}_collection` ||
      `Collection-${new Date().getTime()}`

    params = {
      datasourcePath,
      datasourceName,
      datasetName,
      datasetType: mType,
      style: geoStyle,
    }
  }

  let hasDataset = false
  let _datasource = await SData.getDatasourceByAlias(datasourceName)
  if (params?.layerPath) {
    // 判断所选图层是否存在
    layer = await SMap.getLayerInfo(params?.layerPath)
    hasDataset = !!layer
    datasourceName = layer.datasourceAlias
    datasetName = layer.datasetName
  } else if (!_datasource) {
    // 若没有数据源则创建
    const createDsResult = await SData.createDatasource({
      server: datasourcePath + datasourceName + '.udb',
      alias: datasourceName,
      engineType: EngineType.UDB,
    })
    if (createDsResult) {
      // 创建数据集
      hasDataset = await SData.createDataset(datasourceName, datasetName, mType)
      layer = await SMap.addLayer({datasource: datasourceName, dataset: datasetName}, true)
      hasDataset = hasDataset && layer
    }
  } else {
    const dataset = await SData.getDatasetInfo({
      datasourceName,
      datasetName,
    })
    if (!dataset) {
      hasDataset = await SData.createDataset(datasourceName, datasetName, mType)
      layer = await SMap.addLayer({datasource: datasourceName, dataset: datasetName}, true)
      hasDataset = hasDataset && layer
    } else {
      const layers = await SMap.getLayersInfo()
      // 查看数据集是否已经添加到地图上
      let isAddLayer = false
      for (const _layer of layers) {
        if (_layer.datasetName === dataset.datasetName && _layer.themeType <= 0) {
          isAddLayer = true
          layer = _layer
          break
        }
      }
      // 若数据集没有添加到地图上，则添加图层
      if (!isAddLayer) {
        layer = await SMap.addLayer({datasource: datasourceName, dataset: datasetName}, true)
        hasDataset = !!layer
      } else {
        hasDataset = true
      }
    }
  }

  if (!hasDataset) {
    return
  }

  const result = await SCollector.setDataset({
    datasourceName,
    datasetName,
  }, geoStyle)
  if (!result) return
  // 设置绘制风格
  await SCollector.setStyle(collectorStyle)
  await SCollector.setCollectorType(type)
  if (isGPSCollect(type)) {
    await SLocation.setBackgroundLocationEnable(true)
  } else {
    await SLocation.setBackgroundLocationEnable(false)
  }
  ToolbarModule.getParams().getLayers(-1, () => {
    layer && ToolbarModule.getParams().setCurrentLayer(layer)
  })
}

async function collectionSubmit(type) {
  let have = await SMap.getCurrentEditGeometry()
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
      SData.setRecordsetValue(
        ToolbarModule.getParams().template.currentTemplateInfo.datasetInfo,
        ToolbarModule.getParams().template.currentTemplateInfo.field,
        {index:-1}
      )
      // SMap.setLayerFieldInfo(
      //   ToolbarModule.getParams().template.currentTemplateInfo.layerPath,
      //   ToolbarModule.getParams().template.currentTemplateInfo.field,
      // )
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
  // switch (type) {
  //   case SMCollectorType.LINE_GPS_PATH:
  //   case SMCollectorType.REGION_GPS_PATH:
  //     await SCollector.stopCollect()
  //     break
  // }
  await SCollector.stopCollect()
  return SCollector.cancel()
}

function undo(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  return SCollector.undo()
}

function redo(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  return SCollector.redo()
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
