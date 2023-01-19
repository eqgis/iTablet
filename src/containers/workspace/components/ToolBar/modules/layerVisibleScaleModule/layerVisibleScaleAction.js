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
  if(data.selectmin){
    min = data.selectmin
  }
  if(data.selectmax){
    max = data.selectmax
  }
  if(data.min){
    min = data.min
  }
  if(data.max){
    max = data.max
  }
  if (min !== 0 && max !== 0 && min <= max) {
    //最大比例尺必须大于最小比例尺
    Toast.show(getLanguage(global.language).Map_Layer.LAYER_SCALE_RANGE_WRONG)
  } else {
    !isSimilar(min, item[0].initItem.value) &&
      SMap.setLayerMinVisibleScale(layerData.path, min)
    !isSimilar(max, item[1].initItem.value) &&
      SMap.setLayerMaxVisibleScale(layerData.path, max)
    Toast.show(getLanguage(global.language).Prompt.SETTING_SUCCESS)
    _params.setToolbarVisible(false)
    _params.existFullMap()
    SMap.setMapScale(1 / preScale)
    ToolbarModule.addData({min:false,max:false,selectmin:false ,selectmax:false })
    // NavigationService.navigate('LayerManager')
  }
}

function pickerCancel() {
  const _params = ToolbarModule.getParams()
  let preScale = ToolbarModule.getData().preScale
  if(_params.device.orientation.indexOf('LANDSCAPE') === 0){
    _params.setToolbarVisible(false, ConstToolType.SM_MAP_LAYER_VISIBLE_SCALE, {
      isExistFullMap: false,
    })
  }else{
    _params.existFullMap()
    _params.setToolbarVisible(false)
  }
  SMap.setMapScale(1 / preScale)
  NavigationService.navigate('LayerManager')
}

async function rightSelect(item) {
  if (item.key === getLanguage(global.language).Map_Layer.LAYERS_UER_DEFINE) {
    const _params = ToolbarModule.getParams()
    let currentType = item.type
    let mapScale = await SMap.getMapScale()
    ToolbarModule.addData({ currentType, mapScale: (mapScale - 0).toFixed(6) })
    _params.setToolbarVisible(
      true,
      ConstToolType.SM_MAP_LAYER_VISIBLE_SCALE_USER_DEFINE,
      {
        containerType: ToolbarType.buttons,
        isFullScreen: false,
      },
    )
  }
}

async function commit() {
  const _params = ToolbarModule.getParams()
  let data = ToolbarModule.getData()
  let { layerData } = data
  let mapScale = await SMap.getMapScale()
  let currentType = ToolbarModule.getData().currentType
  ToolbarModule.addData({ [`${currentType}`]: mapScale - 0 })
  let min = await SMap.getLayerMinVisibleScale(layerData.path)
  let max = await SMap.getLayerMaxVisibleScale(layerData.path)
  if(currentType==='min'){
    if ( mapScale !== 0 && max!==0 && mapScale <= max) {
      //最大比例尺必须大于最小比例尺
      Toast.show(getLanguage(global.language).Map_Layer.LAYER_SCALE_RANGE_WRONG)
    }else{
      SMap.setLayerMinVisibleScale(layerData.path, mapScale-0)
    }
  }else{
    if (mapScale !== 0 && min!==0 && min <= mapScale) {
      //最大比例尺必须大于最小比例尺
      Toast.show(getLanguage(global.language).Map_Layer.LAYER_SCALE_RANGE_WRONG)
    }else{
      SMap.setLayerMaxVisibleScale(layerData.path, mapScale-0)
    }
  }
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
