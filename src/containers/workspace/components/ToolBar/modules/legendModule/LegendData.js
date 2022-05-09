import React from 'react'
import {
  ConstToolType,
  legendColor,
  ToolbarType,
} from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
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
    case ConstToolType.SM_MAP_LEGEND_POSITION:
      {
        let currentPopData
        if (global.Type) {
          data = getPickerData(_params.mapLegend[global.Type].legendPosition)
          currentPopData = _params.mapLegend[global.Type].legendPosition
        } else {
          data = []
          currentPopData = {}
        }
        customView = () => (
          <MultiPicker
            language={global.language}
            confirm={LegendAction.changePosition}
            cancel={LegendAction.cancelSelect}
            popData={data}
            currentPopData={currentPopData}
            viewableItems={3}
          />
        )
      }
      break
    case ConstToolType.SM_MAP_LEGEND:
    default:
      data = legendColor
      break
  }
  return { data, buttons, customView }
}

function getPickerData(selectKey) {
  const options = [
    {
      key: getLanguage(global.language).Map_Main_Menu.TOP_LEFT,
      value: 'topLeft',
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.TOP_RIGHT,
      value: 'topRight',
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.LEFT_BOTTOM,
      value: 'leftBottom',
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.RIGHT_BOTTOM,
      value: 'rightBottom',
    },
  ]
  const selectedItem = options.filter(item => item.value === selectKey)[0]
  return [
    {
      key: getLanguage(global.language).Map_Main_Menu.LEGEND_POSITION,
      value: getLanguage(global.language).Map_Main_Menu.LEGEND_POSITION,
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
        global.toolBox && global.toolBox.menu({
          type: ConstToolType.SM_MAP_LEGEND,
          selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_COLOR
        })
        global.toolBox &&
          global.toolBox.setVisible(true, ConstToolType.SM_MAP_LEGEND, {
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
        global.toolBox &&
          global.toolBox.setState({
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
        global.toolBox &&
          global.toolBox.setState({
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
        global.toolBox &&
          global.toolBox.setState({
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
        global.toolBox &&
          global.toolBox.setState({
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
        global.toolBox &&
          global.toolBox.setState({
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
    // {
    //   key: getLanguage(_params.language).Map_Main_Menu.LEGEND_POSITION,
    //   action: () => {
    //     const _data = getData(ConstToolType.SM_MAP_LEGEND_POSITION)
    //     global.toolBox &&
    //       global.toolBox.setVisible(true, ConstToolType.SM_MAP_LEGEND_POSITION, {
    //         containerType: ToolbarType.picker,
    //         isFullScreen: false,
    //         selectName: getLanguage(_params.language).Map_Main_Menu
    //           .LEGEND_POSITION,
    //         selectKey: getLanguage(_params.language).Map_Main_Menu
    //           .LEGEND_POSITION,
    //         ..._data,
    //       })
    //   },
    //   selectName: getLanguage(_params.language).Map_Main_Menu.LEGEND_POSITION,
    //   selectKey: getLanguage(_params.language).Map_Main_Menu.LEGEND_POSITION,
    // },
  ]
  return data
}

function getButtons(type) {
  const _params = ToolbarModule.getParams()
  const legendData = _params.mapLegend
  let buttons = []
  switch (type) {
    case ConstToolType.SM_MAP_LEGEND:
    default:
      if (legendData[global.Type].isShow) {
        buttons = [
          ToolbarBtnType.CANCEL,
          {
            type: ToolbarBtnType.VISIBLE,
            action: LegendAction.changeLegendVisible,
            // image: getPublicAssets().mapTools.tools_legend_on,
            image: getThemeAssets().layer.icon_visible,
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
            image: getThemeAssets().layer.icon_invisible,
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
