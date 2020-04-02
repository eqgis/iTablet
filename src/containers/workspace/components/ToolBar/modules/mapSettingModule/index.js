/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SMap } from 'imobile_for_reactnative'
import MapSettingData from './MapSettingData'
import MapSettingAction from './MapSettingAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'
import ToolBarHeight from '../ToolBarHeight'

async function action(type) {
  const _params = ToolbarModule.getParams()
  const _data = MapSettingData.getData(type)
  const containerType = ToolbarType.colorTable
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  _params.showFullMap && _params.showFullMap(true)
  _params.navigation.navigate('MapView')
  await setModuleData(type)

  _params.setToolbarVisible(true, type, {
    containerType,
    column: data.column,
    isFullScreen: false,
    height: data.height,
    ..._data,
  })
}

async function setModuleData(type) {
  const mapXML = await SMap.mapToXml()
  ToolbarModule.setData({
    type,
    getData: MapSettingData.getData,
    actions: MapSettingAction,
    mapXML,
  })
}

export default function(title) {
  return {
    key: title,
    title,
    action: type => action(type),
    size: 'large',
    getData: MapSettingData.getData,
    actions: MapSettingAction,
    setModuleData,
  }
}
