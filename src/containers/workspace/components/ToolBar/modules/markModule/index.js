/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import MarkData from './MarkData'
import MarkAction from './MarkAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'

function action(type) {
  const data = ToolBarHeight.getToolbarHeight(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_MARKS, {
    isFullScreen: true,
    column: data.column,
    height: data.height,
  })
  // 重置canUndo和canRedo
  if (params.toolbarStatus.canUndo || params.toolbarStatus.canRedo) {
    params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
  }
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
  }
}
