/**
 * AR导航，路径分析管理模块
 */

import { SData, SMap } from "imobile_for_reactnative"
import { POIInfo, POIInfoOnline, RouteAnalyzeResult } from "imobile_for_reactnative/types/interface/ar"

/** 室外导航数据源及路网数据集信息*/
export interface NaviDatasourceInfo {
  alias: string
  path: string
  datasets: Array<NaviDatasetInfo>
}

/** 室外导航数据集及模型文件信息 */
export interface NaviDatasetInfo {
  datasourceAlias: string
  datasetName: string
  modelFileName: string
  poiDatasetName: string
}

interface ARNaviModuleData {
  /** 管理当前使用的室外导航数据 */
  naviDatasourceInfo?: NaviDatasourceInfo
  /** 管理当前选中的路网数据集 */
  naviDatasetInfo?: NaviDatasetInfo
  currentPOI?: POIInfo | POIInfoOnline
  currentRoute: RouteAnalyzeResult | null
}

const data: ARNaviModuleData = {
  currentRoute: null
}

export function getData() {
  return data
}

export function setData(params: Partial<ARNaviModuleData>) {
  Object.assign(data, params)
}

/** 退出AR导航 */
export async function exit() {
  if(data.naviDatasourceInfo) {
    await SData.closeDatasource(data.naviDatasourceInfo.alias)
  }
  data.naviDatasourceInfo = undefined
  data.naviDatasetInfo = undefined
}