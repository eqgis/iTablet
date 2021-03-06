/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import ToolbarModule from "../ToolbarModule"
import NavigationService from "../../../../../NavigationService"

function close() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false, undefined, {
    isExistFullMap: false,
  })
  NavigationService.navigate('CustomModePage')
}

function commit() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
  _params.existFullMap()
}

export default {
  close,
  commit,
}