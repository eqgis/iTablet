/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'

function commit() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
  ToolbarModule.setData()
}

function colorAction(item) {
  SMap._setMapBackgroundColor(item.key)
}

function close() {
  const params = ToolbarModule.getParams()
  const { mapXML } = ToolbarModule.getData()
  SMap.mapFromXml(mapXML)
  params.setToolbarVisible(false)
  ToolbarModule.setData()
}

export default {
  close,
  commit,
  colorAction,
}
