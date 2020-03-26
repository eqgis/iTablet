/**
 * @description 三维标注模块
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import Mark3DData from './Mark3DData'
import Mark3DAction from './Mark3DAction'
import ToolbarModule from '../ToolbarModule'
import utils from './utils'
import { ToolbarType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'

function action(type) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  const layout = utils.getLayout(type, orientation)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.table,
    isFullScreen: true,
    column: layout.column,
    height: layout.height,
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
    getLayout: utils.getLayout,
  }
}
