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
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class MarkModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    const _data = MarkData.getData(this.type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      ...data,
      ..._data,
    })
    // 重置canUndo和canRedo
    if (params.toolbarStatus.canUndo || params.toolbarStatus.canRedo) {
      params.setToolbarStatus({
        canUndo: false,
        canRedo: false,
      })
    }
    this.setModuleData(this.type)
  }
}

export default function() {
  return new MarkModule({
    type: ConstToolType.SM_MAP_MARKS,
    title: getLanguage(global.language).Map_Main_Menu.PLOTS,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_mark,
    getData: MarkData.getData,
    getMenuData: MarkData.getMenuData,
    actions: MarkAction,
  })
}
