/**
 * @description 图层可见范围设置模块
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import LayerVisibleScaleData from './layerVisibleScaleData'
import LayerVisibleScaleAction from './layerVisibleScaleAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, Height, ToolbarType } from '../../../../../../constants'
import { screen } from '../../../../../../utils'
import FunctionModule from '../../../../../../class/FunctionModule'

function setModuleData(type) {
  //需要存储之前的一些数据 图层数据 选中的最小比例尺 最大比例尺等
  const preData = ToolbarModule.getData()
  ToolbarModule.setData({
    ...preData,
    type,
    getData: LayerVisibleScaleData.getData,
    actions: LayerVisibleScaleAction,
    getToolbarSize,
  })
}

function getToolbarSize(type, orientation) {
  let height = 0,
    animationTime
  switch (type) {
    case ToolbarType.multiPicker:
      height =
        Height.TABLE_ROW_HEIGHT_1 *
        (orientation.indexOf('LANDSCAPE') === 0 ? 8 : 4)
      animationTime = 0
      break
    default:
      height =
        orientation.indexOf('LANDSCAPE') === 0
          ? screen.getScreenWidth(orientation) - Height.TOOLBAR_BUTTONS
          : screen.getScreenHeight(orientation) - Height.TOOLBAR_BUTTONS
      animationTime = 0
      break
  }
  return { height, animationTime }
}

// export default function(type, title) {
//   setModuleData(ConstToolType.SM_MAP_LAYER_VISIBLE_SCALE)
//   return {
//     key: title,
//     title,
//     size: 'large',
//     image: getThemeAssets().functionBar.icon_tool_mark,
//     getData: LayerVisibleScaleData.getData,
//     actions: LayerVisibleScaleAction,
//     setModuleData,
//     getToolbarSize,
//   }
// }

class layerVisibleScaleModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  setModuleData = setModuleData
  getToolbarSize = getToolbarSize
}

export default function() {
  return new layerVisibleScaleModule({
    type: ConstToolType.SM_MAP_LAYER_VISIBLE_SCALE,
    getData: LayerVisibleScaleData.getData,
    actions: LayerVisibleScaleAction,
  })
}
