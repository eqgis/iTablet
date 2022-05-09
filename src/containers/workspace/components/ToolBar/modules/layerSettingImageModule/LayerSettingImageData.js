import React from 'react'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import { SinglePicker } from '../../../../../../components'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import Data from './data'
import LayerSettingImageAction from './LayerSettingImageAction'
import { getLanguage } from '../../../../../../language'

async function getData(type) {
  let data = []
  let buttons = []
  let customView

  const _params = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_MENU:
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_STRETCH_TYPE:
      {
        let mode = await SMap.getImageDisplayMode(_params.currentLayer.path)
        let stretchType = await SMap.getImageStretchType(
          _params.currentLayer.path,
        )
        let popData = Data.getStretchType()
        //暂时屏蔽
        if (mode === 1) {
          popData = popData.filter(item => {
            return item.value !== 3
          })
        }
        let currentItem
        popData.forEach(item => {
          if (item.value === stretchType) {
            currentItem = item
          }
        })
        customView = () => (
          <SinglePicker
            language={global.language}
            popData={popData}
            confirm={LayerSettingImageAction.setStretchType}
            cancel={LayerSettingImageAction.onPickerCancel}
            viewableItems={3}
            initialKey={currentItem && currentItem.key}
          />
        )
      }
      break
    case ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_DISPLAY_MODE:
      {
        let mode = await SMap.getImageDisplayMode(_params.currentLayer.path)
        let stretchType = await SMap.getImageStretchType(
          _params.currentLayer.path,
        )
        let popData = Data.getDisplayMode()
        //暂时屏蔽
        if (stretchType === 3) {
          popData = popData.filter(item => {
            return item.value !== 1
          })
        }
        let currentItem
        popData.forEach(item => {
          if (item.value === mode) {
            currentItem = item
          }
        })
        customView = () => (
          <SinglePicker
            language={global.language}
            popData={popData}
            confirm={LayerSettingImageAction.setDisplayMode}
            cancel={LayerSettingImageAction.onPickerCancel}
            viewableItems={3}
            initialKey={currentItem && currentItem.key}
          />
        )
      }
      break
  }
  return { data, buttons, customView }
}

function getMenuData() {
  let data = [
    {
      key: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_DISPLAY_MODE,
      action: () => {
        const _params = ToolbarModule.getParams()
        _params.setToolbarVisible(
          true,
          ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_DISPLAY_MODE,
          {
            isFullScreen: false,
            showMenuDialog: false,
            containerType: ToolbarType.multiPicker,
            selectKey: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_DISPLAY_MODE,
            selectName: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_DISPLAY_MODE,
          },
        )
      },
      selectKey: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_DISPLAY_MODE,
      selectName: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_DISPLAY_MODE,
    },
    {
      key: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_STRETCH_TYPE,
      action: () => {
        const _params = ToolbarModule.getParams()
        _params.setToolbarVisible(
          true,
          ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_STRETCH_TYPE,
          {
            isFullScreen: false,
            showMenuDialog: false,
            containerType: ToolbarType.multiPicker,
            selectKey: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_STRETCH_TYPE,
            selectName: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_STRETCH_TYPE,
          },
        )
      },
      selectKey: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_STRETCH_TYPE,
      selectName: getLanguage(global.language).Map_Layer.LAYER_SETTING_IMAGE_STRETCH_TYPE,
    },
  ]
  return data
}

export default {
  getData,
  getMenuData,
}
