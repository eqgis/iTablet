/** 路网采集、编辑模块 todo 需要合并室内增量路网
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import IncrementData from './IncrementData'
import IncrementAction from './IncrementAction'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

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
    type: 'MAP_INCREAMENT',
    key: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_symbol.png'),
    getData: IncrementData.getData,
    actions: IncrementAction,
  })
}
