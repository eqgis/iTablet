/* global global */
import { TOnlineData } from '@/constants/ConstOnline'
import { SData, SMap, SNavigation} from 'imobile_for_reactnative'
import { DatasetType, FieldType, FieldInfo, FieldInfoValue, QueryParameter, DatasetInfo } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
// import { AttributesResp} from 'imobile_for_reactnative/types/interface/mapping/SMap'
import { AttributesResp } from "@/utils/AttributeUtils"
import { ConstOnline } from '../constants'
import { getLanguage } from '../language'
import { LayerInfo } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'
import AppUser from './AppUser'

export interface AttributeHead {
  value: string,
  isSystemField: boolean,
  fieldInfo: FieldInfoValue,
  name?: string,
}

export interface Attributes {
  data: Array<FieldInfo[]>,
  head: AttributeHead[],
}

export interface AttributesResp2 {
  attributes: Attributes,
  total: number,
  currentPage: number,
  startIndex: number,
  resLength: number,
}

export type GetAttributeType = 'loadMore' | 'refresh' | 'reset'

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
  attributes: Attributes,
  layerInfo: LayerInfo,
  page: number,
  size: number,
  params?: {filter?: string, groupBy?: string},
  type: GetAttributeType = 'loadMore',
) {
  //查询接口替换为下面SData
  // const data1111 = await SMap.getLayerAttribute(layerInfo.path, page, size, params)

  const datasetInfo:DatasetInfo = {datasetName:layerInfo.datasetName,datasourceName:layerInfo.datasourceAlias}
  const groups = params?.groupBy?.split(",")
  const orders = params?.filter?.split(",")
  const para:QueryParameter = {orderBy:orders,groupBy:groups}
  const data1 = (await SData.queryRecordset(datasetInfo,para )).map(recordset => recordset.fieldInfoValue)
  const head = await SData.getFieldInfos(datasetInfo)
  const startIndex =  page*size
  const total = data1.length
  const data  = data1.slice(startIndex,startIndex+(total-startIndex>size?size:total-startIndex))
  const dataShow = {currentPage:page,head,startIndex,total,data}
  return dealData(attributes, dataShow, page, type)
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
  attributes: Attributes,
  layerInfo: LayerInfo,
  params: {filter?: string, groupBy?: string},
  page: number,
  size: number,
  type: GetAttributeType = 'loadMore',
) {
  //查询接口替换为下面SData 
  //这里模糊查询所有字段

  const datasetInfo:DatasetInfo = {datasetName:layerInfo.datasetName,datasourceName:layerInfo.datasourceAlias}
  const fieldInfos = await SData.getFieldInfos(datasetInfo)
  let attriButeFilter = ""
  for(let i=0;i<fieldInfos.length;i++){
    const fieldInfo = fieldInfos[i]
    const fieldName = fieldInfo.name
    if (i == 0) {
      attriButeFilter = fieldName + " LIKE '%%" + params.key + "%%'"
    } else {
      attriButeFilter = attriButeFilter + " OR " + fieldName + " LIKE '%%" + params.key + "%%'"
    }
  }
  const para:QueryParameter = {attriButeFilter}
  const data1 = (await SData.queryRecordset(datasetInfo,para )).map(recordset => recordset.fieldInfoValue)
  const head = fieldInfos
  const startIndex =  page*size
  const total = data1.length
  const data  = data1.slice(startIndex,startIndex+(total-startIndex>size?size:total-startIndex))
  const dataShow = {currentPage:page,head,startIndex,total,data}
  return dealData(attributes, dataShow, page, type)
  // const data = await SMap._searchLayerAttribute(layerInfo.path, params, page, size)

  // return dealData(attributes, data, page, type)
}

/**
 * 搜索我的数据中对象的属性
 * @param attributes
 * @param path
 * @param params
 * @param page
 * @param size
 * @param type
 * @returns {Promise.<*>}
 */
// async function searchMyDataAttribute(
//   attributes: Attributes,
//   layerInfo: LayerInfo,
//   params: {filter?: string, groupBy?: string},
//   page: number,
//   size: number,
//   type: GetAttributeType = 'loadMore',
// ) {
//   const data = await SMap._searchMyDataAttribute(path, params, page, size)

//   return dealData(attributes, data, page, type)
// }

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
  attributes: Attributes,
  layerInfo: LayerInfo,
  searchKey: string = '',
  page: number,
  size: number,
  type: GetAttributeType = 'loadMore',
) {
  // const data = await SMap._searchSelectionAttribute(path, searchKey, page, size)

  const data1 = await SMap.getLayerSelectionAttribute(layerInfo?.path||"",searchKey)

  const datasetInfo:DatasetInfo = {datasetName:layerInfo.datasetName,datasourceName:layerInfo.datasourceAlias}
  const head = await SData.getFieldInfos(datasetInfo)
  const startIndex =  page*size
  const total = data1.length
  const data  = data1.slice(startIndex,startIndex+(total-startIndex>size?size:total-startIndex))
  const dataShow = {currentPage:page,head,startIndex,total,data}

  return dealData(attributes, dataShow, page, type)
}

async function getSelectionAttributeByLayer(
  attributes: Attributes,
  layerInfo: LayerInfo,
  page: number,
  size: number,
  type: GetAttributeType = 'loadMore',
  isCollection: boolean = false
) {
  const data1 = await SMap.getLayerSelectionAttribute(layerInfo?.path||"")

  const datasetInfo:DatasetInfo = {datasetName:layerInfo.datasetName,datasourceName:layerInfo.datasourceAlias}
  const head = await SData.getFieldInfos(datasetInfo)
  const startIndex =  page*size
  const total = data1.length
  const data  = data1.slice(startIndex,startIndex+(total-startIndex>size?size:total-startIndex))
  const dataShow = {currentPage:page,head,startIndex,total,data}
  return dealData(attributes, dataShow, page, type)
}

async function getSelectionAttributeByData(
  attributes: Attributes,
  datasetInfo: DatasetInfo,
  page: number,
  size: number,
  type: GetAttributeType = 'loadMore',
) {
  // const data = await SMap.getSelectionAttributeByData(name, page, size)
  const para:QueryParameter = {}
  const data1 = (await SData.queryRecordset(datasetInfo,para )).map(recordset => recordset.fieldInfoValue)
  const head = await SData.getFieldInfos(datasetInfo)
  const startIndex =  page*size
  const total = data1.length
  const data  = data1.slice(startIndex,startIndex+(total-startIndex>size?size:total-startIndex))
  const dataShow = {currentPage:page,head,startIndex,total,data}

  return dealData(attributes, dataShow, page, type)
}

async function getNavigationAttributeByData(
  attributes: Attributes,
  name: string,
  page = 0,
  size = 20,
  type: GetAttributeType = 'loadMore',
) {
  const userName = AppUser.getCurrentUser().userName
  return await getSelectionAttributeByData(
    attributes,
    {datasourceName: 'default_increment_datasource@' + userName, datasetName: name},
    page, size, type
  )
}


async function deleteSelectionAttributeByLayer(path: string, index: number, isCollection: boolean) {
  return await SMap.deleteLayerSelectionAttribute(path, index)
}

async function deleteAttributeByLayer(layerInfo: LayerInfo, smID: number, isCollection: boolean) {    
  // return await SMap.deleteAttributeByLayer(path, smID, isCollection)
  return await SData.deleteRecordsetValue({datasetName:layerInfo.datasetName,datasourceName:layerInfo.datasourceAlias},{index:smID})
}

// async function deleteAttributeByData(name: string, smID: number) {
//   debugger
//   return await SMap.deleteAttributeByData(name, smID)
// }


// async function getCurrentGeometryID(path: string) {
//   return await SMap.getCurrentGeometryID(path)
// }

function dealData(attributes: Attributes, result: AttributesResp, page: number, type: GetAttributeType) {
  const tableHead: {
    value: string,
    isSystemField: boolean,
    fieldInfo: FieldInfoValue,
  }[] = []
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
          isSystemField: item.fieldInfo.caption.toString().toLowerCase() === 'smuserid' || item.fieldInfo.isSystemField,
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
          isSystemField: item.caption.toString().toLowerCase() === 'smuserid' || item.isSystemField,
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
// 系统底图数组
const baseMaps = [...baseMapsOrigin]
// 用户添加的底图数组
let userBaseMap: Array<string> = []

/**
 * 是否是系统的底图
 * @param {LayerInfo} layer 需要判断的图层的图层信息
 * @returns {boolean} 是系统的底图返回true，不是返回false
 */
function isBaseLayer(layer: LayerInfo) {
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
    //  
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
/**
 * 是否是系统的底图图层数据源
 * @param {string} datasourceName 数据源名称
 * @returns {boolean} 是系统的底图图层数据源返回true，不是返回false
 */
function isBaseLayerDatasource(datasourceName: string) {
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

/**
 * 是否是用户添加的底图图层数据源 lyx
 * @param {string} datasourceName 数据源名称
 * @returns {boolean} 是用户添加的底图图层数据源返回true，不是返回false
 */
function isUserBaseLayerDatasource(datasourceName: string) {
  try {
    for (let i = 0, n = userBaseMap.length; i < n; i++) {
      const _dsName = userBaseMap[i].toUpperCase().split('@')[1]
      if (datasourceName.toUpperCase() === _dsName) {
        return true
      }
    }
    return false
  } catch (e) {
    return false
  }
}

function getBaseLayers(layers: LayerInfo[] = []) {
  const baseMapTempArr = baseMaps.concat(userBaseMap)
  const arr = []
  for (let i = 0; i < layers.length; i++) {
    const { name } = layers[i]
    for (let i = 0, n = baseMapTempArr.length; i < n; i++) {
      if (name.toUpperCase().indexOf(baseMapTempArr[i].toUpperCase()) >= 0) {
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
  global.BaseMapSize = arr.length
  return arr
}

// function setBaseMap(baseMap: string[]) {
//   baseMaps = []
//   baseMaps = baseMaps.concat(baseMap)
// }

/**
 * 设置用户添加的底图 lyx
 * @param {Array<string>} datasourceName 用户添加的底图的名称数组
 * @returns {void}
 */
function setUserBaseMap(baseMap: string[]) {
  userBaseMap = []
  userBaseMap = userBaseMap.concat(baseMap)
}

async function addBaseMap(
  layers: LayerInfo[] = [],
  data: TOnlineData | TOnlineData[] = ConstOnline.Google,
  index?: number,
  visible: boolean = true,
) {
  if (getBaseLayers(layers).length === 0) {
    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        await SMap.openMapWithDatasource(
          data[i].DSParams,
          index !== undefined ? index : data[i].layerIndex,
        )
      }
      global.BaseMapSize = data.length
    } else {
      await SMap.openMapWithDatasource(
        data.DSParams,
        index !== undefined ? index : data.layerIndex,
      )
      global.BaseMapSize = 1
    }
  }
}

async function openDefaultBaseMap() {
  let data = getDefaultBaseMapData()
  await addBaseMap([], data)
}

function getDefaultBaseMapData(language = global.language): TOnlineData | TOnlineData[] {
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
function getLayerType(currentLayer: LayerInfo) {
  // let currentLayer = global.currentLayer
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

function getFieldTypeText(intType: TFieldType, language = 'CN') {
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
function setLayersSelectable(layers: LayerInfo[] & {child?: LayerInfo[]}, selectable: boolean, modifyTrue: boolean = false) {
  layers.map(layer => {
    if (layer.type === 'layerGroup') {
      layer.child && setLayersSelectable(layer.child, selectable, modifyTrue)
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
function isMediaData(fieldInfo: FieldInfo[]) {
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
function getDatasetDescriptionByLayer(layer: LayerInfo) {
  try{
    if (!layer.datasetDescription || layer.datasetDescription === 'NULL') return null
    return JSON.parse(layer.datasetDescription)
  }catch(e){
    return null
  }
}

/**
 * 是否可作为服务的图层
 * @param {*} datasetType
 * @returns
 */
function availableServiceLayer(datasetType: TDatasetType) {
  return datasetType === DatasetType.CAD || datasetType === DatasetType.POINT || datasetType === DatasetType.LINE || datasetType === DatasetType.REGION
}

interface MapLayerAttributeState {
  layerPath?: string,
  attributes?: Attributes,
  showTable?: boolean,
  editControllerVisible?: boolean,
  addControllerVisible?: boolean,
  currentFieldInfo?: [],
  relativeIndex?: -1, // 当前页面从startIndex开始的被选中的index, 0 -> this.total - 1
  currentIndex?: -1,
  startIndex?: 0,

  canBeUndo?: boolean,
  canBeRedo?: boolean,
  canBeRevert?: boolean,

  isShowSystemFields?: boolean,
  descending?: boolean, //属性排列倒序时为true add jiakai
}

interface MapLayerAttributeTag {
  currentPage?: number
  tota?: number // 属性总数
  canBeRefresh?: boolean // 是否可以刷新
  noMore?: boolean // 是否可以加载更多
  isLoading?: boolean // 防止同时重复加载多次
  filter?: string // 属性查询过滤
  isMediaLayer?: boolean // 是否是多媒体图层
}

const layerAttribute: {
  state: MapLayerAttributeState,
  tag: MapLayerAttributeTag
} = {
  state: {},
  tag: {},
}
/**
 * 记录二维地图属性界面state和标记
 */
function setMapLayerAttribute(mapLayerAttributeState?: MapLayerAttributeState, tag?: MapLayerAttributeTag, reset?: false) {
  if (reset) {
    layerAttribute.state = mapLayerAttributeState || {}
    layerAttribute.tag = tag || {}
  } else {
    Object.assign(layerAttribute.state, mapLayerAttributeState)
    Object.assign(layerAttribute.tag, tag)
  }
}

/**
 * 获取二维地图属性界面state
 * @returns MapLayerAttribute
 */
function getMapLayerAttribute() {
  return layerAttribute
}

/** 选择集的数据类型 */
export interface selectionParam {
  /** 图层信息 */
  layerInfo: LayerInfo,
  /** 图层里被选中的对象的id数组 */
  ids: Array<number>,
}

/** 清除选择状态 */
async function clearSelection(selection: Array<selectionParam>) {
  if(selection?.length || 0 > 0) {
    for(let i = 0; i < selection.length; i ++) {
      const layerInfo = selection[i].layerInfo
      const layerPath = layerInfo.path
      layerPath && await SMap.clearLayerSelection(layerPath)
    }
  }
}

export default {
  getLayerAttribute,
  searchLayerAttribute,
  searchSelectionAttribute,
  // searchMyDataAttribute,
  getSelectionAttributeByLayer,
  deleteSelectionAttributeByLayer,
  deleteAttributeByLayer,
  canBeUndo,
  canBeRedo,
  canBeRevert,

  isBaseLayer,
  isBaseLayerDatasource,
  isUserBaseLayerDatasource,
  addBaseMap,
  // setBaseMap,
  setUserBaseMap,
  openDefaultBaseMap,
  getDefaultBaseMapData,
  getLayerType,
  getFieldTypeText,
  getDatasetDescriptionByLayer,

  setLayersSelectable,

  // getCurrentGeometryID,

  isMediaData,

  getSelectionAttributeByData,
  // deleteAttributeByData,
  getNavigationAttributeByData,

  availableServiceLayer,

  setMapLayerAttribute,
  getMapLayerAttribute,
  clearSelection,
}
