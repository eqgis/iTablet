/**
 * 添加 数据
 */
import { SMap } from 'imobile_for_reactnative'
import { getThemeAssets } from '../../../../../../assets'
import { ConstOnline, OpenData } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolbarModule from '../ToolbarModule'

async function getData(params = {}) {
  let _data = ToolbarModule.getData().data
  let data
  if (!_data || !_data.mapName) {
    return data
  }
  switch (_data.mapName) {
    case 'tianditu':
      data = await getDatasources(params)
      break
    default:
      data = getDatasets(params)
  }
  return data
}

async function getDatasets(params = {}) {
  let data: { title: string; image: any; data: any[] }[] = [], buttons: string[] = []
  try {
    let _data = ToolbarModule.getData().data

    if (!_data || !_data.DSParams) {
      return { data, buttons }
    }
    let datasets = await SMap.getDatasetsByDatasource(
      _data.DSParams,
      false,
    )
    let baseLayers: { name: string; image: any; data: SMap.DatasetInfo; type: string }[] = []
    datasets.list.forEach(element => {
      baseLayers.push({
        name: element.datasetName,
        image: getThemeAssets().dataType.icon_data_set,
        data: element,
        type: 'Dataset',
      })
    })

    data = [
      {
        title: datasets.datasource.alias,
        image: getThemeAssets().dataType.icon_data_set_selected,
        data: baseLayers,
      },
    ]
    buttons = [ToolbarBtnType.CANCEL]
  } catch(e) {
    data = []
    buttons = []
  }
  return { data, buttons }
}

async function getDatasources(params = {}) {
  let data: { title: any; image: any; data: any[] }[] = [], buttons: string[] = []
  try {
    let _data = ToolbarModule.getData().data

    let datasources: any[] = []
    switch (_data.mapName) {
      case 'tianditu':
        datasources = [
          ConstOnline.tianditu,
          ConstOnline.tiandituCN,
          ConstOnline.tiandituEN,
          ConstOnline.tiandituImg,
          ConstOnline.tiandituImgCN,
          ConstOnline.tiandituImgEN,
          ConstOnline.tiandituTer,
          ConstOnline.tiandituTerCN,
        ]
        break
    }
    datasources.forEach(element => {
      element.name = element.mapName
      element.image = getThemeAssets().dataType.icon_data_source
    })

    data = [
      {
        title: _data.mapName,
        image: getThemeAssets().dataType.icon_data_source_selected,
        data: datasources,
      },
    ]
    buttons = [ToolbarBtnType.CANCEL]
  } catch(e) {
    data = []
    buttons = []
  }
  return { data, buttons }
}



export default {
  getData,
}
