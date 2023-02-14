import { SData, SIndoorNavigation, SMap, SNavigation } from "imobile_for_reactnative"
import { GeometryType, Point2D } from "imobile_for_reactnative/NativeModule/interfaces/data/SDataType"

let incrementDatasource: string | null = null
let incrementLineDatasetName: string | null = null
let incrementNetworkDatasetName: string | null = null

let gpsPoints: Point2D[] = []

let incrementLayerAdded = false

async function addNetWorkDataset(): Promise<boolean> {

  const currentFloorID = await SIndoorNavigation.getCurrentFloorID()
  if(currentFloorID === '') return false

  const datasourcesInfo = await SData.getDatasources()

  const datasources = []
  for(let i = 0; i < datasourcesInfo.length; i++) {
    const datasets = await SData.getDatasetsByDatasource({alias: datasourcesInfo[i].alias})
    datasources.push(datasets)
  }

  const indoorData = datasources.filter(datasource => datasource.filter(dataset => dataset.datasetName === 'FloorRelationTable').length > 0)

  if(indoorData.length === 0) return false

  const indoorDatasource = indoorData[0]
  const floorDataset = indoorDatasource.filter(dataset => dataset.datasetName === 'FloorRelationTable')[0]
  incrementDatasource = floorDataset.datasourceName
  const fieldValues = await SData.queryWithParameter({datasourceName: floorDataset.datasourceName, datasetName: floorDataset.datasetName})
  for(const fields of fieldValues) {
    const FL_ID = fields.filter(field => field.name === 'FL_ID')
    if(FL_ID.length > 0 && FL_ID[0].value === currentFloorID) {
      incrementLineDatasetName = fields.filter(field => field.name === 'LineDatasetName')[0].value as string
      incrementNetworkDatasetName = fields.filter(field => field.name === 'NetworkName')[0].value as string
      break
    }
  }

  if(incrementLineDatasetName != null && incrementDatasource != null) {
    const layer = await SMap.addLayer({datasourceAlias:incrementDatasource, datasetName: incrementLineDatasetName}, true)
    if(layer) {
      SMap.setLayerEditable(layer.path as string, true)
      return true
    }

  }

  return false
}


async function removeNetworkDataset(): Promise<boolean> {
  if(!incrementDatasource) return false

  await SMap.removeLayer(incrementLineDatasetName + '@' + incrementDatasource)

  const datasets = await SData.getDatasetsByDatasource({alias: incrementDatasource})

  const filterdData = datasets.filter(dataset => dataset.datasetName === incrementNetworkDatasetName)

  if(filterdData.length > 0) {
    const networkDataset = filterdData[0]
    if(networkDataset.child) {
      await SMap.removeLayer(networkDataset.child.datasetName + '@' + incrementDatasource)
    }
  }

  gpsPoints = []
  incrementLayerAdded = false


  return true
}

async function gpsBegin(): Promise<boolean> {
  const current = await SMap.getCurrentLocation()
  gpsPoints.push({x: current.longitude, y: current.latitude})
  return true
}

async function addGPSRecordset(): Promise<boolean>  {
  if(gpsPoints.length === 0 || !incrementDatasource || !incrementLineDatasetName) return false

  await SData.addRecordsetValue(
    {datasourceName: incrementDatasource, datasetName: incrementLineDatasetName},
    [],
    {type: GeometryType.GEOLINE, points: [...gpsPoints]}
  )

  gpsPoints = []
  SMap.refreshMap()

  return true
}


async function buildNetwork(): Promise<boolean> {
  if(!incrementDatasource || !incrementLineDatasetName || !incrementNetworkDatasetName) return false

  if(incrementLayerAdded) {
    await SMap.removeLayer(0)
  }

  await SData.deleteDataset(incrementDatasource, incrementNetworkDatasetName)

  const result =await SNavigation.buildNetwork({
    srcLineDataset: {datasourceAlias: incrementDatasource, datasetName: incrementLineDatasetName},
    targetNetworkDataset: {datasourceAlias: incrementDatasource, datasetName: incrementNetworkDatasetName }
  })

  if(result) {
    SMap.addLayer({datasourceAlias: incrementDatasource, datasetName: incrementNetworkDatasetName, addChild: true}, true)
  }


  incrementLayerAdded = true

  return result
}


export default {
  addNetWorkDataset,
  removeNetworkDataset,
  gpsBegin,
  addGPSRecordset,
  buildNetwork,
}