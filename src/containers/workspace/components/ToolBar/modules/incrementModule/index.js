/** 路网采集、编辑模块 todo 需要合并室内增量路网
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import IncrementData from './IncrementData'
import IncrementAction from './IncrementAction'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import { ConstToolType } from '../../../../../../constants'

class IncrementModule extends FunctionModule {
  constructor(props) {
    super(props)
    this.getMenuData = IncrementAction.getMenuData
  }

  action = () => {
    GLOBAL.IncrementRoadDialog && GLOBAL.IncrementRoadDialog.setVisible(true)
  }
}

export default function() {
  return new IncrementModule({
    type: ConstToolType.SM_MAP_INCREMENT,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_collection,
    getData: IncrementData.getData,
    actions: IncrementAction,
  })
}
