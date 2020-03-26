/**
 * @description 路网切换模块
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import NavigationService from '../../../../../NavigationService'
import RoadNetData from './RoadNetData'
import ToolbarModule from '../ToolbarModule'

async function action(type) {
  const _params = ToolbarModule.getParams()
  let data = await RoadNetData.getData(type)
  const selectedDatas = _params.getNavigationDatas()
  let {
    selectedDatasets,
    selectedDatasources,
    currentDatasource,
    currentDataset,
  } = selectedDatas
  const mapDatasource = data[0]
  const mapDataset = data[1]
  mapDatasource.data.map(item => {
    selectedDatasources &&
      selectedDatasources.map(ds => {
        if (item.name === ds.name) {
          item.selected = true
        }
      })
  })
  mapDataset.data.map(item => {
    selectedDatasets &&
      selectedDatasets.map(dt => {
        if (item.name === dt.name) {
          item.selected = true
        }
      })
  })
  if (selectedDatasets.length === 0 && selectedDatasources.length === 0) {
    mapDatasource.data[0].selected = true
    mapDataset.data[0].selected = true
    selectedDatasets = JSON.parse(JSON.stringify([mapDataset.data[0]]))
    selectedDatasources = JSON.parse(JSON.stringify([mapDatasource.data[0]]))
  }
  data = [mapDatasource, mapDataset]
  NavigationService.navigate('NavigationDataChangePage', {
    data,
    selectedDatasets: JSON.parse(JSON.stringify(selectedDatasets)),
    selectedDatasources: JSON.parse(JSON.stringify(selectedDatasources)),
    currentDatasource: JSON.parse(JSON.stringify(currentDatasource)),
    currentDataset: JSON.parse(JSON.stringify(currentDataset)),
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/Navigation/network.png'),
    getData: RoadNetData.getData,
  }
}
