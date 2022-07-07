/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from "../ToolbarModule"
import NavigationService from "../../../../../NavigationService"
import ThemeAction from "../themeModule/ThemeAction"

function close() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false, undefined, {
    isExistFullMap: false,
  })
  NavigationService.navigate('CustomModePage')
}

async function commit() {
  const _params = ToolbarModule.getParams()
  if (global.coworkMode) {
    let layerInfo = await SMap.getLayerInfo(_params.currentLayer.path)
    ThemeAction.sendUpdateThemeMsg(layerInfo)
  }
  _params.setToolbarVisible(false)
  _params.existFullMap()
}

export default {
  close,
  commit,
}