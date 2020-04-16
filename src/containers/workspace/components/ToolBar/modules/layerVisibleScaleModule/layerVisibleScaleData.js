/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React from 'react'
import LayerVisibleScaleAction from './layerVisibleScaleAction'
import { ConstToolType } from '../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import { MultiPicker } from '../../../../../../components'
import dataUtil from '../../../../../../utils/dataUtil'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import LayerVisibilityView from './customView/LayerVisibilityView'

async function getData(type) {
  let data = []
  let buttons = []
  let customView
  switch (type) {
    case ConstToolType.MAP_LAYER_VISIBLE_SCALE:
      data = await getVisibleScalePickerData()
      customView = () => (
        <MultiPicker
          language={GLOBAL.language}
          confirm={LayerVisibleScaleAction.pickerConfirm}
          cancel={LayerVisibleScaleAction.pickerCancel}
          popData={data}
          onRightSelect={LayerVisibleScaleAction.rightSelect}
          viewableItems={3}
        />
      )
      break
    case ConstToolType.MAP_LAYER_VISIBLE_USER_DEFINE:
      {
        let currentType = ToolbarModule.getData().currentType
        let mapScale = ToolbarModule.getData().mapScale
        customView = () => (
          <LayerVisibilityView currentType={currentType} mapScale={mapScale} />
        )
      }
      break
  }
  return { data, buttons, customView }
}

async function getVisibleScalePickerData() {
  const data = ToolbarModule.getData()
  let customMin = data.min
  let customMax = data.max
  let layerData = data.layerData
  let min = await SMap.getMinVisibleScale(layerData.path)
  let max = await SMap.getMaxVisibleScale(layerData.path)
  let pickerData = await getBasicData(min, max, customMin, customMax)
  return pickerData
}
async function getBasicData(min, max, customMin, customMax) {
  const option = [
    {
      key: '1 : 2,500',
      value: 2500,
    },
    {
      key: '1 : 5,000',
      value: 5000,
    },
    {
      key: '1 : 10,000',
      value: 10000,
    },
    {
      key: '1 : 20,000',
      value: 20000,
    },
    {
      key: '1 : 25,000',
      value: 25000,
    },
    {
      key: '1 : 50,000',
      value: 50000,
    },
    {
      key: '1 : 100,000',
      value: 100000,
    },
    {
      key: '1 : 200,000',
      value: 200000,
    },
    {
      key: '1 : 500,000',
      value: 500000,
    },
    {
      key: '1 : 1,000,000',
      value: 1000000,
    },
    {
      key: '1 : 2,000,000',
      value: 2000000,
    },
    {
      key: '1 : 5,000,000',
      value: 5000000,
    },
    {
      key: '1 : 10,000,000',
      value: 10000000,
    },
    {
      key: '1 : 20,000,000',
      value: 20000000,
    },
    {
      key: '1 : 50,000,000',
      value: 50000000,
    },
    {
      key: '1 : 100,000,000',
      value: 100000000,
    },
    {
      key: '1 : 200,000,000',
      value: 200000000,
    },
  ]
  const minOption = option.clone()
  let minInitItem =
    min === 0
      ? { key: '0', value: 0 }
      : { key: `1 : ${dataUtil.NumberWithThousandSep(min)}`, value: min }
  let n = 0
  for (; n < minOption.length; n++) {
    if (minInitItem.value < minOption[n].value) {
      minOption.splice(n, 0, minInitItem)
      break
    } else if (minInitItem.value === minOption[n].value) {
      minInitItem = minOption[n]
      break
    }
  }
  if (n === minOption.length) {
    minOption.push(minInitItem)
  }
  const maxOption = option.clone()
  let maxInitItem =
    max === 0
      ? { key: getLanguage(GLOBAL.language).Map_Layer.LAYER_NONE, value: 0 }
      : { key: `1 : ${dataUtil.NumberWithThousandSep(max)}`, value: max }
  n = 0
  for (; n < maxOption.length; n++) {
    if (maxInitItem.value < maxOption[n].value) {
      maxOption.splice(n, 0, maxInitItem)
      break
    } else if (maxInitItem.value === maxOption[n].value) {
      maxInitItem = maxOption[n]
      break
    }
  }
  if (n === maxOption.length) {
    maxOption.push(maxInitItem)
  }
  const customOptionMin = {
    key: getLanguage(GLOBAL.language).Map_Layer.LAYERS_UER_DEFINE,
    value: customMin || 0,
    type: 'min',
  }
  const customOptionMax = {
    key: getLanguage(GLOBAL.language).Map_Layer.LAYERS_UER_DEFINE,
    value: customMax || 0,
    type: 'max',
  }
  minOption.unshift(customOptionMin)
  maxOption.unshift(customOptionMax)
  const pickerData = [
    {
      key: getLanguage(global.language).Map_Layer.LAYERS_MINIMUM,
      value: '最小可见比例尺',
      children: minOption,
      initItem: minInitItem,
      selectedItem: customMin ? customOptionMin : minInitItem,
    },
    {
      key: getLanguage(global.language).Map_Layer.LAYERS_MAXIMUM,
      value: '最大可见比例尺',
      children: maxOption,
      initItem: maxInitItem,
      selectedItem: customMax ? customOptionMax : maxInitItem,
    },
  ]
  return pickerData
}
export default {
  getData,
}
