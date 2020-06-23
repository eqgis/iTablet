import React from 'react'
import {
  ConstToolType,
  legendColor,
  ToolbarType,
} from '../../../../../../constants'
import { getPublicAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolbarModule from '../ToolbarModule'
import LegendAction from './LegendAction'
import { MultiPicker } from '../../../../../../components'

function getData(type) {
  const _params = ToolbarModule.getParams()
  let data = []
  const buttons = getButtons(type)
  let customView = null
  switch (type) {
    case ConstToolType.LEGEND_POSITION:
      {
        let currentPopData
        if (GLOBAL.Type) {
          data = getPickerData(_params.mapLegend[GLOBAL.Type].legendPosition)
          currentPopData = _params.mapLegend[GLOBAL.Type].legendPosition
        } else {
          data = []
          currentPopData = {}
        }
        customView = () => (
          <MultiPicker
            language={GLOBAL.language}
            confirm={LegendAction.changePosition}
            cancel={LegendAction.cancelSelect}
            popData={data}
            currentPopData={currentPopData}
            viewableItems={3}
          />
        )
      }
      break
    case ConstToolType.LEGEND:
    default:
      data = legendColor
      break
  }
  return { data, buttons, customView }
}

function getPickerData(selectKey) {
  const options = [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.TOP_LEFT,
      value: 'topLeft',
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.TOP_RIGHT,
      value: 'topRight',
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.LEFT_BOTTOM,
      value: 'leftBottom',
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.RIGHT_BOTTOM,
      value: 'rightBottom',
    },
  ]
  const selectedItem = options.filter(item => item.value === selectKey)[0]
  return [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_POSITION,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_POSITION,
      initItem: selectedItem,
      children: options,
      selectedItem,
    },
  ]
}

function getMenuData(type) {
  const _params = ToolbarModule.getParams()
  const data = [
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
      action: () => {
        GLOBAL.toolBox && GLOBAL.toolBox.menu({
          type: ConstToolType.LEGEND,
          selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR
        })
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
            containerType: ToolbarType.colorTable,
            // column,
            isFullScreen: false,
            // height,
            buttons: getButtons(type),
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_COLOR,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLUMN,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_COLUMN,
            selectKey: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_COLUMN,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLUMN,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLUMN,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_WIDTH,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_WIDTH,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_HEIGHT,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_HEIGHT,
            selectKey: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_HEIGHT,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_HEIGHT,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_HEIGHT,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_FONT,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
      action: () => {
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setState({
            isTouchProgress: true,
            showMenuDialog: false,
            selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
            selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
            buttons: getButtons(type),
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_ICON,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.LEGEND_POSITION,
      action: () => {
        const _data = getData(ConstToolType.LEGEND_POSITION)
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND_POSITION, {
            containerType: ToolbarType.picker,
            isFullScreen: false,
            selectName: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_POSITION,
            selectKey: getLanguage(_params.language).Map_Main_Menu
              .LEGEND_POSITION,
            ..._data,
          })
      },
      selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_POSITION,
      selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_POSITION,
    },
  ]
  return data
}

function getButtons(type) {
  const _params = ToolbarModule.getParams()
  const legendData = _params.mapLegend
  let buttons = []
  switch (type) {
    case ConstToolType.LEGEND:
    default:
      if (legendData[GLOBAL.Type].isShow) {
        buttons = [
          ToolbarBtnType.CANCEL,
          {
            type: ToolbarBtnType.VISIBLE,
            action: LegendAction.changeLegendVisible,
            image: getPublicAssets().mapTools.tools_legend_on,
          },
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.TOOLBAR_COMMIT,
        ]
      } else {
        buttons = [
          ToolbarBtnType.CANCEL,
          {
            type: ToolbarBtnType.NOT_VISIBLE,
            action: LegendAction.changeLegendVisible,
            image: getPublicAssets().mapTools.tools_legend_off,
          },
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.TOOLBAR_COMMIT,
        ]
      }
      break
  }
  return buttons
}

export default {
  getData,
  getMenuData,

  getButtons,
}
