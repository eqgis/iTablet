import { SCartography } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import StyleData from './StyleData'
import * as StyleAction from './StyleAction'
import { ConstToolType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import {
  line,
  point,
  region,
  grid,
  text,
  font,
  colors,
  colorsWithNull,
} from './data'

function getData(type, params) {
  let data = []
  switch (type) {
    case ConstToolType.SM_MAP_STYLE:
    case ConstToolType.SM_MAP_STYLE_GRID:
      if (
        ToolbarModule.getParams().currentLayer &&
        !ToolbarModule.getData().currentLayerStyle
      ) {
        SCartography.getLayerStyle(
          ToolbarModule.getParams().currentLayer.name,
        ).then(value => {
          ToolbarModule.addData({
            type,
            getData: StyleData.getData,
            actions: StyleAction.default,
            currentLayerStyle: value,
          })
        })
      }
      break
    case ConstToolType.SM_MAP_STYLE_POINT_COLOR:
    case ConstToolType.SM_MAP_STYLE_TEXT_COLOR:
      data = colors
      break
    case ConstToolType.SM_MAP_STYLE_LINE_COLOR:
    case ConstToolType.SM_MAP_STYLE_REGION_BEFORE_COLOR:
    case ConstToolType.SM_MAP_STYLE_REGION_AFTER_COLOR:
    case ConstToolType.SM_MAP_STYLE_REGION_BORDER_COLOR:
      data = colorsWithNull
      break
    case ConstToolType.SM_MAP_STYLE_TEXT_FONT:
      data = font(global.language)
      break
  }
  ToolbarModule.setParams(params)
  const buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  return { data, buttons }
}

function getMenuData() {
  const _params = ToolbarModule.getParams()
  let data = []
  if (_params.currentLayer) {
    switch (_params.currentLayer.type) {
      case 1:
        data = point(_params.language, _params.device.orientation)
        break
      case 3:
        data = line(_params.language, _params.device.orientation)
        break
      case 5:
        data = region(_params.language, _params.device.orientation)
        break
      case 7:
        data = text(_params.language, _params.device.orientation)
        break
      case 83:
        data = grid(_params.language)
        break
    }
  }
  return data
}

export default {
  getData,
  getMenuData,
}
