import {SARMap, SData } from 'imobile_for_reactnative'
import { ARLayer } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { DatasetInfo, FieldInfoValue, QueryParameter } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'

export interface AttributeHead {
  value: string,
  isSystemField: boolean,
  fieldInfo: FieldInfoValue,
  name: string
}

export interface Attributes {
  data: any[],
  head: AttributeHead[]
}

export interface AttributesResp {
  attributes?: Attributes,
  total: number,
  currentPage: number,
  startIndex: number,
  resLength?: number,
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
  layer: ARLayer,
  page: number,
  size: number,
  params?: {filter?: string, groupBy?: string},
  type: GetAttributeType = 'loadMore',
) {
  if(!('datasourceAlias' in layer)) return

  const datasetInfo:DatasetInfo = {datasetName:layer.datasetName,datasourceName:layer.datasourceAlias}
  const groups = params?.groupBy?.split(",")
  const orders = params?.filter?.split(",")
  const para:QueryParameter = {orderBy:orders,groupBy:groups}
  return await _getAttribute(attributes, datasetInfo, page, size, para, type)

}

async function getSelectionAttributeByData(
  attributes: Attributes,
  layer: ARLayer,
  elementId: number,
  page: number,
  size: number,
  type: GetAttributeType = 'loadMore',
) {
  if(!('datasourceAlias' in layer)) return

  const datasetInfo:DatasetInfo = {datasetName:layer.datasetName,datasourceName:layer.datasourceAlias}

  return await _getAttribute(attributes, datasetInfo, page, size, {queryIDs: [elementId]}, type)
}

async function _getAttribute(
  attributes: Attributes,
  datasetInfo: DatasetInfo,
  page: number,
  size: number,
  params?: QueryParameter,
  type: GetAttributeType = 'loadMore',
) {
  const data1 = (await SData.queryRecordset(datasetInfo,params)).map(recordset => recordset.fieldInfoValue)
  const head = await SData.getFieldInfos(datasetInfo)
  const startIndex =  page*size
  const total = data1.length
  const data  = data1.slice(startIndex,startIndex+(total-startIndex>size?size:total-startIndex))
  const dataShow = {currentPage:page,head,startIndex,total,data}
  return dealData(attributes, dataShow, page, type)
}

function dealData(attributes: Attributes, result: any, page: number, type: GetAttributeType) {
  const tableHead: AttributeHead[] = []
  const resLength = (result.data && result.data.length) || 0
  if (resLength > 0) {
    result.data[0].forEach((item: any) => {
      item.selected = false
      if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
        tableHead.unshift({
          value: item.fieldInfo.caption,
          isSystemField: item.fieldInfo.isSystemField,
          fieldInfo: item.fieldInfo,
          name: ''
        })
      } else {
        tableHead.push({
          value: item.fieldInfo.caption,
          isSystemField: item.fieldInfo.caption.toString().toLowerCase() === 'smuserid' || item.fieldInfo.isSystemField,
          fieldInfo: item.fieldInfo,
          name: ''
        })
      }
    })
  } else if (result.head && result.head.length > 0) {
    result.head.forEach((item: any) => {
      if (item.caption.toString().toLowerCase() === 'smid') {
        tableHead.unshift({
          value: item.caption,
          isSystemField: item.isSystemField,
          fieldInfo: item,
          name: ''
        })
      } else {
        tableHead.push({
          value: item.caption,
          isSystemField: item.caption.toString().toLowerCase() === 'smuserid' || item.isSystemField,
          fieldInfo: item,
          name: ''
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

export default {
  getLayerAttribute,
  getSelectionAttributeByData,
}
