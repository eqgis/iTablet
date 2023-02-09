/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SData } from "imobile_for_reactnative"

async function getData() {
  const data = await getAllNavData()
  return data
}

export default {
  getData,
}


export async function getAllNavData() {
  const datasourcesInfo = await SData.getDatasources()
  const datasources = []

  const datasourceArr = []
  const datasetArr = []
  for(let i = 0; i < datasourcesInfo.length; i++) {
    datasources.push(await SData.getDatasetsByDatasource({alias: datasourcesInfo[i].alias}))
  }

  for(let i = 0; i < datasources.length; i++) {
    const datasets = datasources[i]

    const hasFloorTable = datasets.filter(dataset => dataset.datasetName === 'FloorRelationTable').length  > 0
    const hasModelTable = datasets.filter(dataset => dataset.datasetName === 'ModelFileLinkTable').length  > 0

    if(hasFloorTable) {
      datasourceArr.push({
        selected: false,
        name: datasets[0].datasourceName,
        datasourceName: datasets[0].datasourceName,
      })
    }

    if(hasModelTable) {
      const linkTable = datasets.filter(dataset => dataset.datasetName === 'ModelFileLinkTable')[0]
      const records = await SData.queryWithParameter({datasetName: linkTable.datasetName, datasourceName: linkTable.datasourceName})
      records.map(recordset => {
        let networkDatasetName = ''
        let networkModelFile = ''
        let POIDataset = ''
        recordset.map(field => {
          if(field.name === 'NetworkDataset') {
            networkDatasetName = field.value
          } else if(field.name === 'NetworkModelFIle') {
            networkModelFile = field.value
          } else if(field.name === 'POIDataset') {
            POIDataset = field.value
          }
        })

        if(networkModelFile !== '') {
          const info = {
            selected: false,
            name: networkDatasetName,
            modelFileName: networkModelFile,
            datasetName: networkDatasetName,
            datasourceName: datasets[0].datasourceName,
          }

          if(POIDataset !== '' ) {
            info.poiDatasetName = POIDataset
          }

          datasetArr.push(info)

        }

      })
    }
  }



  return [
    {
      title: 'datasource',
      data: datasourceArr,
    },
    {
      title: 'dataset',
      data: datasetArr
    }
  ]

}