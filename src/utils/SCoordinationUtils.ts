import { SCoordination } from 'imobile_for_reactnative'
import { ServiceDatasource } from 'imobile_for_reactnative/types/interface/iserver/types'
import LayerUtils from './LayerUtils'

let _SCoordination: SCoordination | null

function setScoordiantion(type: 'online' | 'iportal') {
  if (_SCoordination) {
    _SCoordination.setCoordinationType(type)
  } else {
    if (type === 'iportal') {
      _SCoordination = new SCoordination('iportal')
    } else {
      _SCoordination = new SCoordination('online')
    }
  }
}

function getScoordiantion(type?: 'online' | 'iportal') {
  if (!_SCoordination || type && _SCoordination.type !== type) {
    _SCoordination = null
    if (type === 'iportal') {
      _SCoordination = new SCoordination('iportal')
    } else {
      _SCoordination = new SCoordination('online')
    }
  }
  _SCoordination.setCoordinationType(_SCoordination.type) // 重新获取cookie,防止cookie失效
  return _SCoordination
}

function getInfoFromDescription(datasetDescription: string) {
  let dsDescription = JSON.parse(datasetDescription)
  if (dsDescription.type !== 'onlineService' || !dsDescription.url) return {}
  let serviceName = dsDescription.url.substring(dsDescription.url.indexOf('/services/') + 10, dsDescription.url.indexOf('/rest/'))
  let datasourceName = dsDescription.url.substring(dsDescription.url.indexOf('/datasources/') + 13, dsDescription.url.indexOf('/datasets/'))
  let datasetName = dsDescription.url.substring(dsDescription.url.indexOf('/datasets/') + 10)

  return {serviceName, datasourceName, datasetName}
}

/**
 * 初始化在线服务地图数据
 * @param serviceUrl
 * @returns
 */
async function initMapDataWithService(serviceUrl: string) {
  let data: ServiceDatasource[] = []
  try {
    const _scoordiantion = getScoordiantion()
    let datasources = await _scoordiantion.getServiceData(serviceUrl)
    for (const datasourceName of datasources.datasourceNames) {
      if (
        datasourceName.indexOf('Label_') === 0 && datasourceName.indexOf('#') === datasourceName.length - 1 || // 过滤标注数据源
        LayerUtils.isBaseLayerDatasource(datasourceName) // 过滤底图数据源
      ) continue
      let dsData: ServiceDatasource = {
        datasourceName: datasourceName,
        datasets: [],
      }
      let datasets = await _scoordiantion.getServiceData(serviceUrl, datasourceName)
      for (const datasetUrl of datasets.childUriList) {
        if (datasetUrl.indexOf('_Table', datasetUrl.length - '_Table'.length) === -1) {
          dsData.datasets.push({
            datasetName: datasetUrl.substr(datasetUrl.lastIndexOf('/') + 1),
            datasetUrl: datasetUrl,
          })
        }
      }
      if (dsData.datasets.length > 0) {
        data.push(dsData)
      }
    }
    await getScoordiantion().initDatasourceWithService(data)
    return data
  } catch (error) {
    return data
  }
}

/**
 * 初始化在UDB线服务地图数据
 * @param udbServiceUrl
 * @param datasourceName
 * @param datasets
 * @returns
 */
async function initMapDataWithServiceUDB(udbServiceUrl: string, datasourceName: string, datasets?: Array<{datasetName: string, datasetUrl: string}>) {
  let data: ServiceDatasource[] = []
  try {
    let dsData: ServiceDatasource = {
      datasourceName: datasourceName,
      datasets: [],
    }
    if (datasets) {
      dsData.datasets = datasets
      data.push(dsData)
    } else {
      let _datasets = datasets || await getScoordiantion().getServiceData(udbServiceUrl, datasourceName)

      for (const datasetUrl of _datasets.childUriList) {
        if (datasetUrl.indexOf('_Table', datasetUrl.length - '_Table'.length) === -1) {
          dsData.datasets.push({
            datasetName: datasetUrl.substr(datasetUrl.lastIndexOf('/') + 1),
            datasetUrl: datasetUrl,
          })
        }
      }
      if (dsData.datasets.length > 0) {
        data.push(dsData)
      }
    }
    await getScoordiantion().initDatasourceWithService(data)
    return data
  } catch (error) {
    return data
  }
}

export default {
  setScoordiantion,
  getScoordiantion,

  getInfoFromDescription,
  initMapDataWithService,
  initMapDataWithServiceUDB,
}