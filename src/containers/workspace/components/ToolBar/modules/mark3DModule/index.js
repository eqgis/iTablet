/**
 * @description 三维标注模块
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import Mark3DData from './Mark3DData'
import Mark3DAction from './Mark3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class Mark3DModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = await Mark3DData.getData(this.type, params)
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
  }
}

export default function() {
  return new Mark3DModule({
    type: ConstToolType.SM_MAP3D_MARK,
    title: getLanguage(global.language).Map_Main_Menu.PLOTS,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_mark,
    getData: Mark3DData.getData,
    actions: Mark3DAction,
  })
}
