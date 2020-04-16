/**
 * @description 图层可见范围设置模块
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import LayerVisibleScaleData from './layerVisibleScaleData'
import LayerVisibleScaleAction from './layerVisibleScaleAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'

function setModuleData(type) {
  //需要存储之前的一些数据 图层数据 选中的最小比例尺 最大比例尺等
  const preData = ToolbarModule.getData()
  ToolbarModule.setData({
    ...preData,
    type,
    getData: LayerVisibleScaleData.getData,
    actions: LayerVisibleScaleAction,
  })
}

export default function(type,title) {
  setModuleData(ConstToolType.MAP_LAYER_VISIBLE_SCALE)
  return {
    key: title,
    title,
    size: 'large',
    image: getThemeAssets().functionBar.rightbar_mark,
    getData: LayerVisibleScaleData.getData,
    actions: LayerVisibleScaleAction,
    setModuleData,
  }
}
