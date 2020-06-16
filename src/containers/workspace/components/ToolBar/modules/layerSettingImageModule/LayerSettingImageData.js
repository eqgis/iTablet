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
    case ConstToolType.LAYER_SETTING_IMAGE_MENU:
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.LAYER_SETTING_IMAGE_STRETCH_TYPE:
      {
        let stretchType = await SMap.getImageStretchType(
          _params.currentLayer.path,
        )
        let popData = Data.getStretchType()
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
            initialKey={currentItem.key}
          />
        )
      }
      break
    case ConstToolType.LAYER_SETTING_IMAGE_DISPLAY_MODE:
      {
        let mode = await SMap.getImageDisplayMode(_params.currentLayer.path)
        let popData = Data.getDisplayMode()
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
            initialKey={currentItem.key}
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
      key: getLanguage(global.language).Map_Layer
        .LAYER_SETTING_IMAGE_DISPLAY_MODE,
      action: () => {
        const _params = ToolbarModule.getParams()
        _params.setToolbarVisible(
          true,
          ConstToolType.LAYER_SETTING_IMAGE_DISPLAY_MODE,
          {
            isFullScreen: false,
            showMenuDialog: false,
            containerType: ToolbarType.multiPicker,
          },
        )
      },
    },
    {
      key: getLanguage(global.language).Map_Layer
        .LAYER_SETTING_IMAGE_STRETCH_TYPE,
      action: () => {
        const _params = ToolbarModule.getParams()
        _params.setToolbarVisible(
          true,
          ConstToolType.LAYER_SETTING_IMAGE_STRETCH_TYPE,
          {
            isFullScreen: false,
            showMenuDialog: false,
            containerType: ToolbarType.multiPicker,
          },
        )
      },
    },
  ]
  return data
}

export default {
  getData,
  getMenuData,
}
