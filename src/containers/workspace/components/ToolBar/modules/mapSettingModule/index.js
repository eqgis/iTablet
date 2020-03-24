/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SMap } from 'imobile_for_reactnative'
import MapSettingData from './MapSettingData'
import MapSettingAction from './MapSettingAction'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'

async function action(type) {
  const _params = ToolbarModule.getParams()
  // let _data = MapSettingData.getData(type)
  const orientation = params.device.orientation
  const layout = utils.getLayout(type, orientation)
  _params.showFullMap && _params.showFullMap(true)
  _params.navigation.navigate('MapView')
  // let mapXML = await SMap.mapToXml()
  // ToolbarModule.setData({
  //   type,
  //   data: _data,
  //   getData: MapSettingData.getData,
  //   actions: MapSettingAction,
  //   mapXML,
  // })
  await setModuleData(type)
  
  _params.setToolbarVisible(true, type, {
    containerType: ToolbarType.colorTable,
    column: layout.column,
    isFullScreen: false,
    height: layout.height,
  })
}

async function setModuleData (type) {
  let mapXML = await SMap.mapToXml()
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
    title: title,
    action: type => action(type),
    size: 'large',
    getData: MapSettingData.getData,
    actions: MapSettingAction,
    setModuleData: setModuleData,
    getLayout: utils.getLayout,
  }
}
