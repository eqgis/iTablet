/** 路网采集、编辑模块 todo 需要合并室内增量路网
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import IncrementData from './IncrementData'
import IncrementAction from './IncrementAction'
import ToolbarModule from "../ToolbarModule"

function action() {
  GLOBAL.IncrementRoadDialog && GLOBAL.IncrementRoadDialog.setVisible(true)
}
function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: IncrementData.getData,
    getMenuData: IncrementAction.getMenuData,
    actions: IncrementAction,
  })
}
export default function(type, title) {
  return {
    key: title,
    title: title,
    action: action,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_symbol.png'),
    setModuleData,
    getData: IncrementData.getData,
    actions: IncrementAction,
  }
}