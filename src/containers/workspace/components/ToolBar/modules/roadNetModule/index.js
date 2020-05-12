/**
 * @description 路网切换模块
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import NavigationService from '../../../../../NavigationService'
import RoadNetData from './RoadNetData'
import ToolbarModule from '../ToolbarModule'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class RoadNetModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const _params = ToolbarModule.getParams()
    let data = await RoadNetData.getData()
    const mapDatasource = data[0]
    const mapDataset = data[1]

    const selectedDatas = _params.getNavigationDatas()
    let {
      selectedDatasets,
      selectedDatasources,
      currentDatasource,
      currentDataset,
    } = selectedDatas
    if (mapDatasource.data.length === 0 && mapDataset.data.length === 0) {
      NavigationService.navigate('NavigationDataChangePage', {
        data,
        selectedDatasets,
        selectedDatasources,
        currentDatasource,
        currentDataset,
      })
    } else {
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
        mapDatasource.data[0] && (mapDatasource.data[0].selected = true)
        mapDataset.data[0] && (mapDataset.data[0].selected = true)
        selectedDatasets = JSON.parse(JSON.stringify([mapDataset.data[0]]))
        selectedDatasources = JSON.parse(
          JSON.stringify([mapDatasource.data[0]]),
        )
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
  }
}

export default function() {
  return new RoadNetModule({
    type: 'MAP_ROAD_NET_MODULE',
    key: getLanguage(GLOBAL.language).Map_Main_Menu.NETWORK_MODULE,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.NETWORK_MODULE,
    size: 'large',
    image: require('../../../../../../assets/Navigation/network.png'),
  })
}
