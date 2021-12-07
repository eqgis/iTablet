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
  SMap,
} from 'imobile_for_reactnative'
import {
  LayerUtils,
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
    GLOBAL.toolBox.showFullMap(true)
    SMap.createDefaultDataset().then(async returnData => {
      if (returnData.datasetName) {
        params.setToolbarVisible(true, ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD, {
          containerType,
          isFullScreen: false,
          resetToolModuleData: true,
          // height:data.height,
          // column:data.column,
          ...data,
        })
        GLOBAL.INCREMENT_DATA = returnData
      }
    })
    //设置所有图层不可选 完成拓扑编辑或者退出增量需要设置回去
    GLOBAL.TouchType = TouchType.NULL
    GLOBAL.IncrementRoadDialog.setVisible(false)
    GLOBAL.NAVMETHOD = ConstToolType.SM_MAP_INCREMENT_GPS_TRACK
    // GLOBAL.IncrementRoadDialog && GLOBAL.IncrementRoadDialog.setVisible(true)
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
