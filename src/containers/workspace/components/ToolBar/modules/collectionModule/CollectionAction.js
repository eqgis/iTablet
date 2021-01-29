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
      })
      createCollector(type, layerName)
    },
  })
}

function showSymbol() {
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
        ToolbarModule.getParams().symbol.currentSymbol &&
        ToolbarModule.getParams().symbol.currentSymbol.type &&
        ToolbarModule.getParams().symbol.currentSymbol.type.toLowerCase() ===
          'marker'
      ) {
        geoStyle.setMarkerStyle(
          ToolbarModule.getParams().symbol.currentSymbol.id,
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
        ToolbarModule.getParams().symbol.currentSymbol &&
        ToolbarModule.getParams().symbol.currentSymbol.type &&
        ToolbarModule.getParams().symbol.currentSymbol.type.toLowerCase() ===
          'line'
      ) {
        geoStyle.setLineStyle(ToolbarModule.getParams().symbol.currentSymbol.id)
      }
      mType = DatasetType.LINE
      break
    }
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.REGION_HAND_POINT:
    case SMCollectorType.REGION_HAND_PATH: {
      if (
        ToolbarModule.getParams().symbol.currentSymbol &&
        ToolbarModule.getParams().symbol.currentSymbol.type &&
        ToolbarModule.getParams().symbol.currentSymbol.type.toLowerCase() ===
          'fill'
      ) {
        geoStyle.setFillStyle(ToolbarModule.getParams().symbol.currentSymbol.id)
      }
      mType = DatasetType.REGION
      break
    }
  }

  let params = {}
  if (ToolbarModule.getParams().template.currentTemplateInfo.layerPath) {
    params = {
      layerPath: ToolbarModule.getParams().template.currentTemplateInfo
        .layerPath,
    }
  } else if (layerName !== undefined) {
    params = { layerPath: layerName }
  } else {
    const datasetName = ToolbarModule.getParams().symbol.currentSymbol.type
      ? `${ToolbarModule.getParams().symbol.currentSymbol.type}_${
          ToolbarModule.getParams().symbol.currentSymbol.id
        }`
      : ''
    const datasourcePath =
      ToolbarModule.getParams().collection.datasourceParentPath ||
      (await FileTools.appendingHomeDirectory(
        ToolbarModule.getParams().user &&
          ToolbarModule.getParams().user.currentUser &&
          ToolbarModule.getParams().user.currentUser.name
          ? `${ConstPath.UserPath +
              ToolbarModule.getParams().user.currentUser.name}/${
              ConstPath.RelativePath.Datasource
            }`
          : ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      ))

    const mapInfo = await SMap.getMapInfo()

    const datasourceName =
      ToolbarModule.getParams().collection.datasourceName ||
      (ToolbarModule.getParams().map &&
        ToolbarModule.getParams().map.currentMap.name &&
        `${ToolbarModule.getParams().map.currentMap.name}_collection`) ||
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
  const result = await SCollector.submit(type)
  if (result) {
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
    GLOBAL.NEEDREFRESHTABLE = true
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
  params.existFullMap && params.existFullMap()
  // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
  params.setToolbarVisible(false)
  params.setCurrentTemplateInfo()
  params.setCurrentSymbol()
  ToolbarModule.setData() // 关闭Toolbar清除临时数据
  SMap.setAction(Action.PAN)
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
}
