/**
 * @description 导航增量 拓扑编辑模块
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import TopoEditData from './TopoEditData'
import TopoEditAction from './TopoEditAction'
import FunctionModule from '../../../../../../class/FunctionModule'
import { ConstToolType } from '../../../../../../constants'

// function setModuleData(type) {
//   ToolbarModule.setData({
//     type,
//     getData: TopoEditData.getData,
//     actions: TopoEditAction,
//   })
// }

// export default function(type, title) {
//   setModuleData(type)
//   return {
//     key: title,
//     title,
//     size: 'large',
//     image: getThemeAssets().functionBar.icon_tool_mark,
//     getData: TopoEditData.getData,
//     actions: TopoEditAction,
//     setModuleData: setModuleData,
//   }
// }

class TopoEditModule extends FunctionModule {
  constructor(props) {
    super(props)
  }
}

export default function() {
  return new TopoEditModule({
    type: ConstToolType.SM_MAP_TOPO_EDIT,
    getData: TopoEditData.getData,
    actions: TopoEditAction,
  })
}
