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
import { ConstToolType ,ToolbarType,TouchType} from '../../../../../../constants'
import ToolbarModule from '../../../../components/ToolBar/modules/ToolbarModule'
import {
  SMap, SNavigation,
} from 'imobile_for_reactnative'
import {
  StyleUtils,
} from '../../../../../../utils'

class IncrementModule extends FunctionModule {
  constructor(props) {
    super(props)
    this.getMenuData = IncrementAction.getMenuData
  }

  action = async() => {
    const params = ToolbarModule.getParams()
    const containerType = ToolbarType.table
    const _data = await IncrementData.getData(ConstToolType.SM_MAP_INCREMENT_GPS_TRACK)
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    global.toolBox.showFullMap(true)
    SNavigation.createDefaultDataset().then(async returnData => {
      if (returnData && returnData.datasetName) {
        params.setToolbarVisible(true, ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD, {
          containerType,
          isFullScreen: false,
          resetToolModuleData: true,
          // height:data.height,
          // column:data.column,
          ...data,
        })
        global.INCREMENT_DATA = returnData
      }
    })
    //设置所有图层不可选 完成拓扑编辑或者退出增量需要设置回去
    global.TouchType = TouchType.NULL
    global.IncrementRoadDialog.setVisible(false)
    global.NAVMETHOD = ConstToolType.SM_MAP_INCREMENT_GPS_TRACK
    // global.IncrementRoadDialog && global.IncrementRoadDialog.setVisible(true)
    StyleUtils.setDefaultMapControlStyle()
  }
}

export default function() {
  return new IncrementModule({
    type: ConstToolType.SM_MAP_INCREMENT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_collection,
    getData: IncrementData.getData,
    actions: IncrementAction,
  })
}
