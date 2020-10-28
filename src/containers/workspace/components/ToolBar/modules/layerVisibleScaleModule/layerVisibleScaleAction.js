/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import { getLanguage } from '../../../../../../language'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { Toast } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'

//判断两数相等，小数点五位以后忽略不计
function isSimilar(num1, num2) {
  return Math.abs(num1 - num2) < 0.00001
}
function pickerConfirm(item) {
  const _params = ToolbarModule.getParams()
  let data = ToolbarModule.getData()
  let { layerData, preScale } = data
  let min = item[0].selectedItem.value
  let max = item[1].selectedItem.value
  if (min !== 0 && max !== 0 && min <= max) {
    //最大比例尺必须大于最小比例尺
    Toast.show(getLanguage(GLOBAL.language).Map_Layer.LAYER_SCALE_RANGE_WRONG)
  } else {
    !isSimilar(min, item[0].initItem.value) &&
      SMap.setMinVisibleScale(layerData.path, min)
    !isSimilar(max, item[1].initItem.value) &&
      SMap.setMaxVisibleScale(layerData.path, max)
    Toast.show(getLanguage(GLOBAL.language).Prompt.SETTING_SUCCESS)
    _params.setToolbarVisible(false)
    _params.existFullMap()
    SMap.setMapScale(1 / preScale)
    // NavigationService.navigate('LayerManager')
  }
}

function pickerCancel() {
  const _params = ToolbarModule.getParams()
  let preScale = ToolbarModule.getData().preScale
  _params.existFullMap()
  _params.setToolbarVisible(false)
  SMap.setMapScale(1 / preScale)
  NavigationService.navigate('LayerManager')
}

async function rightSelect(item) {
  if (item.key === getLanguage(GLOBAL.language).Map_Layer.LAYERS_UER_DEFINE) {
    const _params = ToolbarModule.getParams()
    let currentType = item.type
    let mapScale = await SMap.getMapScale()
    ToolbarModule.addData({ currentType, mapScale: (mapScale - 0).toFixed(6) })
    _params.setToolbarVisible(
      true,
      ConstToolType.SM_MAP_LAYER_VISIBLE_USER_DEFINE,
      {
        containerType: ToolbarType.fullScreen,
        isFullScreen: false,
      },
    )
  }
}

async function commit() {
  const _params = ToolbarModule.getParams()
  let mapScale = await SMap.getMapScale()
  let currentType = ToolbarModule.getData().currentType
  ToolbarModule.addData({ [`${currentType}`]: mapScale - 0 })
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_VISIBLE_SCALE, {
    containerType: ToolbarType.multiPicker,
    isFullScreen: false,
  })
}

function close() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_VISIBLE_SCALE, {
    containerType: ToolbarType.multiPicker,
    isFullScreen: false,
  })
}
export default {
  commit,
  close,

  pickerCancel,
  pickerConfirm,
  rightSelect,
}
