import { SCoordination } from 'imobile_for_reactnative'

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

export default {
  setScoordiantion,
  getScoordiantion,

  getInfoFromDescription,
}