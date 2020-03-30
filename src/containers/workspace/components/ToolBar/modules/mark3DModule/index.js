/**
 * @description 三维标注模块
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import Mark3DData from './Mark3DData'
import Mark3DAction from './Mark3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import ToolBarHeight from '../ToolBarHeight'

async function action(type) {
  const params = ToolbarModule.getParams()
  const _data = await Mark3DData.getData(type, params)
  const containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: true,
    column: data.column,
    height: data.height,
    data: _data.data,
    buttons: _data.buttons,
  })
  setModuleData(type)
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: Mark3DData.getData,
    actions: Mark3DAction,
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
    image: getThemeAssets().functionBar.rightbar_mark,
    getData: Mark3DData.getData,
    actions: Mark3DAction,
    setModuleData: setModuleData,
  }
}
