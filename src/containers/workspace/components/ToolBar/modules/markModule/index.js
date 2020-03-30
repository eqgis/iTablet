/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import MarkData from './MarkData'
import MarkAction from './MarkAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import ToolBarHeight from '../ToolBarHeight'

function action(type) {
  const params = ToolbarModule.getParams()
  const _data = MarkData.getData(type, params)
  const containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_MARKS, {
    containerType,
    isFullScreen: true,
    column: data.column,
    height: data.height,
    data: _data.data,
    buttons: _data.buttons,
  })
  // 重置canUndo和canRedo
  if (params.toolbarStatus.canUndo || params.toolbarStatus.canRedo) {
    params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
  }
  setModuleData(type)
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: MarkData.getData,
    actions: MarkAction,
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
    getData: MarkData.getData,
    getMenuData: MarkData.getMenuData,
    actions: MarkAction,
    setModuleData: setModuleData,
  }
}
