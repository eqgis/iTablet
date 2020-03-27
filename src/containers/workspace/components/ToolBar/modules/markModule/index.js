/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import MarkData from './MarkData'
import MarkAction from './MarkAction'
import ToolbarModule from '../ToolbarModule'
import utils from './utils'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'

function action(type) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  const layout = utils.getLayout(type, orientation)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_MARKS, {
    isFullScreen: true,
    column: layout.column,
    height: layout.height,
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
    getLayout: utils.getLayout,
  }
}
