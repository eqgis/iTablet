/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import {getLanguage} from "../../../../../../language"
import {ConstToolType, ToolbarType} from "../../../../../../constants"
import {SMap} from 'imobile_for_reactnative'
import ToolbarModule from "../ToolbarModule"
import {Toast} from "../../../../../../utils"
import NavigationService from "../../../../../NavigationService"

function pickerConfirm(item) {
  const _params = ToolbarModule.getParams()
  let data = ToolbarModule.getData()
  let {layerData, preScale} = data
  let min = item[0].selectedItem.value
  let max = item[1].selectedItem.value
  if (min !== 0 && max !== 0 && min <= max) {
    //最大比例尺必须大于最小比例尺
    Toast.show(getLanguage(GLOBAL.language).Map_Layer.LAYER_SCALE_RANGE_WRONG)
  }else{
    min !== item[0].initItem.value && SMap.setMaxVisibleScale(layerData.path, max)
    max !== item[1].initItem.value && SMap.setMinVisibleScale(layerData.path, min)
    Toast.show(getLanguage(GLOBAL.language).Prompt.SETTING_SUCCESS)
    _params.setToolbarVisible(false)
    _params.existFullMap()
    SMap.setMapScale(1/preScale)
    NavigationService.navigate('LayerManager')
  }
}

function pickerCancel() {
  const _params = ToolbarModule.getParams()
  let preScale = ToolbarModule.getData().preScale
  _params.existFullMap()
  _params.setToolbarVisible(false)
  SMap.setMapScale(preScale)
  NavigationService.navigate('LayerManager')
}

async function rightSelect(item) {
  if (item.key === getLanguage(global.language).Map_Layer.LAYERS_UER_DEFINE) {
    const _params = ToolbarModule.getParams()
    let currentType = item.type
    let mapScale = await SMap.getMapScale()
    ToolbarModule.addData({currentType,mapScale: (mapScale - 0).toFixed(6)})
    _params.setToolbarVisible(true,ConstToolType.MAP_LAYER_VISIBLE_USER_DEFINE,{
      containerType:ToolbarType.buttons,
      isFullScreen:false,
    })
  }
}
export default {
  pickerCancel,
  pickerConfirm,
  rightSelect,
}