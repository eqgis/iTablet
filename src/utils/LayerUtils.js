/* global GLOBAL */
import { SMap, DatasetType, FieldType } from 'imobile_for_reactnative'
import { ConstOnline } from '../constants'
import { getLanguage } from '../language'

/**
 * 获取图层属性
 * @param attributes
 * @param path
 * @param page
 * @param size
 * @param params 过滤条件 {filter: string  |  groupBy: string}
 * @param type
 * @returns {Promise.<{attributes, total, currentPage, startIndex, resLength}|*>}
 */
async function getLayerAttribute(
  attributes,
  path,
  page,
  size,
  params,
  type = 'loadMore',
) {
  const data = await SMap.getLayerAttribute(path, page, size, params)

  return dealData(attributes, data, page, type)
}

/**
 * 搜索指定图层匹配对象的属性
 * @param attributes
 * @param path
 * @param params
 * @param page
 * @param size
 * @param type
 * @returns {Promise.<*>}
 */
async function searchLayerAttribute(
  attributes,
  path,
  params = {},
  page,
  size,
  type = 'loadMore',
) {
  // let data = await SMap.getLayerAttribute(path, page, size)
  const data = await SMap.searchLayerAttribute(path, params, page, size)

  return dealData(attributes, data, page, type)
}

/**
 * 搜索指定图层中Selection匹配对象的属性
 * @param attributes
 * @param path
 * @param searchKey
 * @param page
 * @param size
 * @param type
 * @returns {Promise.<*>}
 */
async function searchSelectionAttribute(
  attributes,
  path,
  searchKey = '',
  page,
  size,
  type = 'loadMore',
) {
  const data = await SMap.searchSelectionAttribute(path, searchKey, page, size)

  return dealData(attributes, data, page, type)
}

async function getSelectionAttributeByLayer(
  attributes,
  path,
  page,
  size,
  type = 'loadMore',
  isCollection = false
) {
  const data = await SMap.getSelectionAttributeByLayer(path, page, size,isCollection)

  return dealData(attributes, data, page, type)
}

async function getSelectionAttributeByData(
  attributes,
  name,
  page,
  size,
  type = 'loadMore',
) {
  const data = await SMap.getSelectionAttributeByData(name, page, size)

  return dealData(attributes, data, page, type)
}

async function getNavigationAttributeByData(
  attributes,
  name,
  page,
  size,
  type = 'loadMore',
) {
  const data = await SMap.getNavigationAttributeByData(name, page, size)
  return dealData(attributes, data, page, type)
}


async function deleteSelectionAttributeByLayer(path,index,isCollection) {
  return await SMap.deleteSelectionAttributeByLayer(path,index,isCollection)
}

async function deleteAttributeByLayer(path, smID, isCollection) {
  return await SMap.deleteAttributeByLayer(path, smID, isCollection)
}

async function deleteAttributeByData(name, smID) {
  return await SMap.deleteAttributeByData(name, smID)
}

async function deleteNavigationAttributeByData(name, smID) {
  return await SMap.deleteNavigationAttributeByData(name, smID)
}

async function getCurrentGeometryID(path) {
  return await SMap.getCurrentGeometryID(path)
}

function dealData(attributes, result = {}, page, type) {
  const tableHead = []
  const resLength = (result.data && result.data.length) || 0
  if (resLength > 0) {
    result.data[0].forEach(item => {
      item.selected = false
      if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
        tableHead.unshift({
          value: item.fieldInfo.caption,
          isSystemField: item.fieldInfo.isSystemField,
          fieldInfo: item.fieldInfo,
        })
      } else {
        tableHead.push({
          value: item.fieldInfo.caption,
          isSystemField: item.fieldInfo.isSystemField,
          fieldInfo: item.fieldInfo,
        })
      }
    })
  } else if (result.head && result.head.length > 0) {
    result.head.forEach(item => {
      if (item.caption.toString().toLowerCase() === 'smid') {
        tableHead.unshift({
          value: item.caption,
          isSystemField: item.isSystemField,
          fieldInfo: item,
        })
      } else {
        tableHead.push({
          value: item.caption,
          isSystemField: item.isSystemField,
          fieldInfo: item,
        })
      }
    })
  }
  // else if (result.head && result.head.length > 0) {
  //   result.head.forEach(item => {
  //     if (item.caption.toString().toLowerCase() === 'smid') {
  //       tableHead.unshift({
  //         value: item.caption,
  //         isSystemField: item.isSystemField,
  //       })
  //     } else {
  //       tableHead.push({
  //         value: item.caption,
  //         isSystemField: item.isSystemField,
  //         fieldInfo: item.fieldInfo,
  //       })
  //     }
  //   })
  // }
  attributes.head =
    tableHead.length === 0 && page > 0 ? attributes.head : tableHead
  if (type === 'refresh') {
    attributes.data = result.data.concat(attributes.data || [])
  } else if (type === 'reset') {
    attributes.data = result.data
  } else if (type === 'loadMore') {
    attributes.data = (attributes.data || []).concat(result.data)
  }

  return {
    attributes,
    total: result.total,
    currentPage: result.currentPage,
    startIndex: result.startIndex,
    resLength,
  }
}

function canBeUndo(layerHistory) {
  return (
    (layerHistory &&
      layerHistory.history &&
      layerHistory.history.length > 0 &&
      layerHistory.currentIndex < layerHistory.history.length - 1) ||
    false
  )
}

function canBeRedo(layerHistory) {
  return (
    (layerHistory &&
      layerHistory.history &&
      layerHistory.history.length > 0 &&
      layerHistory.currentIndex > 0) ||
    false
  )
}

function canBeRevert(layerHistory) {
  return (
    (layerHistory &&
      layerHistory.history &&
      layerHistory.history.length > 0 &&
      layerHistory.currentIndex < layerHistory.history.length - 1 &&
      ((!(layerHistory.history[layerHistory.currentIndex] instanceof Array) &&
        !(
          layerHistory.history[layerHistory.currentIndex + 1] instanceof Array
        )) ||
        (!(layerHistory.history[layerHistory.currentIndex] instanceof Array) &&
          layerHistory.history[layerHistory.currentIndex + 1] instanceof
            Array) ||
        (layerHistory.history[layerHistory.currentIndex] instanceof Array &&
          layerHistory.history[layerHistory.currentIndex + 1] instanceof
            Array))) ||
    false
  )
}

const baseMapsOrigin = [
  'roadmap@GoogleMaps',
  'satellite@GoogleMaps',
  'terrain@GoogleMaps',
  'hybrid@GoogleMaps',
  'labelmap@GoogleMaps',
  // 'vec@TD',
  // 'cva@TDWZ',
  // 'img@TDYXM',
  'TrafficMap@BaiduMap',
  'Standard@OpenStreetMaps',
  'CycleMap@OpenStreetMaps',
  'TransportMap@OpenStreetMaps',
  'quanguo@SuperMapCloud',
  'roadmap_cn@bingMap',
  'baseMap',
  'vec@tianditu',
  'cva@tiandituCN',
  'eva@tiandituEN',
  'img@tiandituImg',
  'cia@tiandituImgCN',
  'eia@tiandituImgEN',
  'ter@tiandituTer',
  'cta@tiandituTerCN',
  'roadmap@GaoDeMap',
  'satellite@GaoDeMap',
]
let baseMaps = [...baseMapsOrigin]
function isBaseLayer(layer) {
  try {
    let name = layer.name
    for (let i = 0, n = baseMaps.length; i < n; i++) {
      if (name.toUpperCase().indexOf(baseMaps[i].toUpperCase()) >= 0) {
        if (
          layer.type === DatasetType.IMAGE ||
          layer.type === DatasetType.MBImage
        ) {
          return true
        }
      }
    }
    return false
  } catch (e) {
    // debugger
    return false
  }

  // if (
  //   name.indexOf('roadmap@GoogleMaps') >= 0 ||
  //   name.indexOf('satellite@GoogleMaps') >= 0 ||
  //   name.indexOf('terrain@GoogleMaps') >= 0 ||
  //   name.indexOf('hybrid@GoogleMaps') >= 0 ||
  //   name.indexOf('vec@TD') >= 0 ||
  //   name.indexOf('cva@TDWZ') >= 0 ||
  //   name.indexOf('img@TDYXM') >= 0 ||
  //   name.indexOf('TrafficMap@BaiduMap') >= 0 ||
  //   name.indexOf('Standard@OpenStreetMaps') >= 0 ||
  //   name.indexOf('CycleMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('TransportMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('quanguo@SuperMapCloud') >= 0
  // ) {
  //   return true
  // }
  // return false
}

function isBaseLayerDatasource(datasourceName) {
  try {
    for (let i = 0, n = baseMaps.length; i < n; i++) {
      const _dsName = baseMaps[i].toUpperCase().split('@')[1]
      if (datasourceName.toUpperCase() === _dsName) {
        return true
      }
    }
    return false
  } catch (e) {
    return false
  }

  // if (
  //   name.indexOf('roadmap@GoogleMaps') >= 0 ||
  //   name.indexOf('satellite@GoogleMaps') >= 0 ||
  //   name.indexOf('terrain@GoogleMaps') >= 0 ||
  //   name.indexOf('hybrid@GoogleMaps') >= 0 ||
  //   name.indexOf('vec@TD') >= 0 ||
  //   name.indexOf('cva@TDWZ') >= 0 ||
  //   name.indexOf('img@TDYXM') >= 0 ||
  //   name.indexOf('TrafficMap@BaiduMap') >= 0 ||
  //   name.indexOf('Standard@OpenStreetMaps') >= 0 ||
  //   name.indexOf('CycleMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('TransportMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('quanguo@SuperMapCloud') >= 0
  // ) {
  //   return true
  // }
  // return false
}

function getBaseLayers(layers = []) {
  const arr = []
  for (let i = 0; i < layers.length; i++) {
    const { name } = layers[i]
    for (let i = 0, n = baseMaps.length; i < n; i++) {
      if (name.toUpperCase().indexOf(baseMaps[i].toUpperCase()) >= 0) {
        arr.push(layers[i])
      }
    }
    // if (
    //   name.indexOf('roadmap@GoogleMaps') >= 0 ||
    //   name.indexOf('satellite@GoogleMaps') >= 0 ||
    //   name.indexOf('terrain@GoogleMaps') >= 0 ||
    //   name.indexOf('hybrid@GoogleMaps') >= 0 ||
    //   name.indexOf('vec@TD') >= 0 ||
    //   name.indexOf('cva@TDWZ') >= 0 ||
    //   name.indexOf('img@TDYXM') >= 0 ||
    //   name.indexOf('TrafficMap@BaiduMap') >= 0 ||
    //   name.indexOf('Standard@OpenStreetMaps') >= 0 ||
    //   name.indexOf('CycleMap@OpenStreetMaps') >= 0 ||
    //   name.indexOf('TransportMap@OpenStreetMaps') >= 0 ||
    //   name.indexOf('quanguo@SuperMapCloud') >= 0
    // ) {
    //   arr.push(layers[i])
    // }
  }
  GLOBAL.BaseMapSize = arr.length
  return arr
}

function setBaseMap(baseMap) {
  baseMaps = [...baseMapsOrigin]
  baseMaps = baseMaps.concat(baseMap)
}
async function addBaseMap(
  layers = [],
  data = ConstOnline.Google,
  index,
  visible = true,
) {
  if (getBaseLayers(layers).length === 0) {
    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        await SMap.openDatasource(
          data[i].DSParams,
          index !== undefined ? index : data[i].layerIndex,
          false,
          visible,
        )
      }
      GLOBAL.BaseMapSize = data.length
    } else {
      await SMap.openDatasource(
        data.DSParams,
        index !== undefined ? index : data.layerIndex,
        false,
        visible,
      )
      GLOBAL.BaseMapSize = 1
    }
  }
}

async function openDefaultBaseMap() {
  let data = getDefaultBaseMapData()
  await addBaseMap([], data)
}

function getDefaultBaseMapData(language = GLOBAL.language) {
  if (language === 'CN') {
    return [ConstOnline.tiandituImgCN(), ConstOnline.tiandituImg()]
  } else {
    return { ...ConstOnline.Google, layerIndex: 1 }
  }
}

/**
 * 判断当前图层类型 控制标注相关功能是否可用
 * @returns {string}
 */
function getLayerType(currentLayer) {
  // let currentLayer = GLOBAL.currentLayer
  try {
    let layerType = ''
    if (currentLayer && !currentLayer.themeType) {
      switch (currentLayer.type) {
        case DatasetType.CAD: {
          if (currentLayer.name.indexOf('@Label_') !== -1) {
            layerType = 'TAGGINGLAYER'
          } else {
            layerType = 'CADLAYER'
          }
          break
        }
        case DatasetType.POINT:
          layerType = 'POINTLAYER'
          break
        case DatasetType.LINE:
          layerType = 'LINELAYER'
          break
        case DatasetType.REGION:
          layerType = 'REGIONLAYER'
          break
        case DatasetType.TEXT:
          layerType = 'TEXTLAYER'
          break
        case DatasetType.IMAGE:
          layerType = 'IMAGELAYER'
          break
        case 'layerGroup':
          layerType = 'LAYERGROUP'
          break
      }
    }
    return layerType
  } catch (e) {
    return ''
  }
}

function getFieldTypeText(intType, language = 'CN') {
  let text = ''
  switch (intType) {
    case FieldType.BOOLEAN:
      text = getLanguage(language).FieldType.BOOLEAN
      break
    case FieldType.BYTE:
      text = getLanguage(language).FieldType.BYTE
      break
    case FieldType.INT16:
      text = getLanguage(language).FieldType.INT16
      break
    case FieldType.INT32:
      text = getLanguage(language).FieldType.INT32
      break
    case FieldType.INT64:
      text = getLanguage(language).FieldType.INT64
      break
    case FieldType.SINGLE:
      text = getLanguage(language).FieldType.SINGLE
      break
    case FieldType.DOUBLE:
      text = getLanguage(language).FieldType.DOUBLE
      break
    case FieldType.LONGBINARY:
      text = getLanguage(language).FieldType.LONGBINARY
      break
    case FieldType.TEXT:
      text = getLanguage(language).FieldType.TEXT
      break
    case FieldType.CHAR:
      text = getLanguage(language).FieldType.CHAR
      break
    case FieldType.WTEXT:
      text = getLanguage(language).FieldType.WTEXT
      break
  }
  return text
}

/**
 * @param {*} layers
 * @param {*} selectable
 * @param {*} modifyTrue 仅修改selectable为true的图层，在某些操作需要设置所有图层为false之后再恢复原来设置时很有用
 */
function setLayersSelectable(layers, selectable, modifyTrue = false) {
  layers.map(layer => {
    if (layer.type === 'layerGroup') {
      setLayersSelectable(layer.child, selectable, modifyTrue)
    } else {
      if (!modifyTrue) {
        SMap.setLayerSelectable(layer.path, selectable)
      } else {
        if (layer.isSelectable) {
          SMap.setLayerSelectable(layer.path, selectable)
        }
      }
    }
  })
}

/**
 * 判断当前对象是否是多媒体对象
 * 用于判断多媒体采集和旅行轨迹对象判断
 * @param {*} fieldInfo
 */
function isMediaData(fieldInfo) {
  try {
    let tag = 0, isTourLine = false, hasMedia
    fieldInfo.forEach(item => {
      // 判断是否含有旅行轨迹线对象
      if (item.name === "MediaName" && item.value === 'TourLine') {
        isTourLine = true
      }
      // 判断是否含有多媒体文件
      if (item.name === "MediaFilePaths" && item.value !== '') {
        hasMedia = true
      }
      if (
        item.name === "ModifiedDate" || item.name === "Description" || item.name === "HttpAddress"
      ) {
        tag++
      }
    })
    return tag === 3 && (isTourLine || hasMedia)
  } catch (error) {
    return false
  }
}

/**
 * 获取图层对应数据集中的描述信息
 * 通常含有数据特殊类型（例如：旅行轨迹图层，数据服务图层等），以及其他特殊信息
 * @param {*} layer
 * @returns
 */
function getDatasetDescriptionByLayer(layer) {
  try{
    if (!layer.datasetDescription || layer.datasetDescription === 'NULL') return null
    return JSON.parse(layer.datasetDescription)
  }catch(e){
    return null
  }
}

export default {
  getLayerAttribute,
  searchLayerAttribute,
  searchSelectionAttribute,
  getSelectionAttributeByLayer,
  deleteSelectionAttributeByLayer,
  deleteAttributeByLayer,
  canBeUndo,
  canBeRedo,
  canBeRevert,

  isBaseLayer,
  isBaseLayerDatasource,
  addBaseMap,
  setBaseMap,
  openDefaultBaseMap,
  getDefaultBaseMapData,
  getLayerType,
  getFieldTypeText,
  getDatasetDescriptionByLayer,

  setLayersSelectable,

  getCurrentGeometryID,

  isMediaData,

  getSelectionAttributeByData,
  deleteAttributeByData,
  getNavigationAttributeByData,
  deleteNavigationAttributeByData,
}
