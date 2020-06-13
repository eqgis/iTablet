import React from 'react'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import { SinglePicker } from '../../../../../../components'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'

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
        let popData = [
          {
            key: '无拉伸',
            value: 0,
          },
          {
            key: '标准差拉伸',
            value: 1,
          },
          {
            key: '最值拉伸',
            value: 2,
          },
          {
            key: '直方图均衡',
            value: 3,
          },
          {
            key: '直方图规定化',
            value: 4,
          },
          {
            key: '高斯对比度拉伸',
            value: 5,
          },
        ]
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
            confirm={item => {
              const _params = ToolbarModule.getParams()
              if (item) {
                SMap.setImageStretchType(_params.currentLayer.path, item.value)
              }
              _params.setToolbarVisible(
                true,
                ConstToolType.LAYER_SETTING_IMAGE_MENU,
                {
                  showMenuDialog: true,
                },
              )
            }}
            cancel={() => {
              const _params = ToolbarModule.getParams()
              _params.setToolbarVisible(
                true,
                ConstToolType.LAYER_SETTING_IMAGE_MENU,
                {
                  showMenuDialog: true,
                },
              )
            }}
            viewableItems={3}
            initialKey={currentItem.key}
          />
        )
      }
      break
    case ConstToolType.LAYER_SETTING_IMAGE_DISPLAY_MODE:
      {
        let mode = await SMap.getImageDisplayMode(_params.currentLayer.path)
        let popData = [
          {
            key: '组合显示模式',
            value: 0,
          },
          {
            key: '拉伸显示模式',
            value: 1,
          },
        ]
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
            confirm={item => {
              const _params = ToolbarModule.getParams()
              if (item) {
                SMap.setImageDisplayMode(_params.currentLayer.path, item.value)
              }
              _params.setToolbarVisible(
                true,
                ConstToolType.LAYER_SETTING_IMAGE_MENU,
                {
                  showMenuDialog: true,
                },
              )
            }}
            cancel={() => {
              const _params = ToolbarModule.getParams()
              _params.setToolbarVisible(
                true,
                ConstToolType.LAYER_SETTING_IMAGE_MENU,
                {
                  showMenuDialog: true,
                },
              )
            }}
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
      key: '显示模式',
      selectKey: '拉伸方式',
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
      key: '拉伸方式',
      selectKey: '拉伸方式',
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
