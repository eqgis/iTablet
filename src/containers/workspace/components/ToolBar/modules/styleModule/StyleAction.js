import { SCartography, SMap } from 'imobile_for_reactnative'
import {
  ConstToolType,
  TouchType,
  ToolbarType,
  Const,
  ChunkType,
} from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import Utils from '../../utils'

async function commit() {
  const _params = ToolbarModule.getParams()

  if (GLOBAL.Type === ChunkType.MAP_EDIT) {
    GLOBAL.showMenu = true
  }

  ToolbarModule.setData()

  _params.setToolbarVisible(false, '', {
    isTouchProgress: false,
    showMenuDialog: false,
    selectKey: '',
  })
  GLOBAL.TouchType = TouchType.NORMAL
}

async function close() {
  const _params = ToolbarModule.getParams()

  const _data = ToolbarModule.getData()
  if (_data.currentLayerStyle) {
    await SCartography.setLayerStyle(
      _params.currentLayer.name,
      _data.currentLayerStyle,
    )
  }
  ToolbarModule.setData()
  _params.setToolbarVisible(false)
}

async function tableAction(type, params) {
  let result = false
  switch (type) {
    case ConstToolType.SM_MAP_STYLE_LINE_COLOR:
      result = await SCartography.setLineColor(params.key, params.layerName)
      break
    case ConstToolType.SM_MAP_STYLE_POINT_COLOR:
      result = await SCartography.setMarkerColor(params.key, params.layerName)
      break
    case ConstToolType.SM_MAP_STYLE_REGION_BEFORE_COLOR:
      result = await SCartography.setFillForeColor(params.key, params.layerName)
      break
    case ConstToolType.SM_MAP_STYLE_REGION_AFTER_COLOR:
      result = await SCartography.setFillBackColor(params.key, params.layerName)
      break
    case ConstToolType.SM_MAP_STYLE_REGION_BORDER_COLOR:
      result = await SCartography.setFillBorderColor(params.key, params.layerName)
      break
    case ConstToolType.SM_MAP_STYLE_TEXT_COLOR:
      result = await SCartography.setTextColorOfLayer(params.key, params.layerName)
      break
  }
  if (!result && params.action) {
    params.action(params)
  }
}

function layerListAction(data) {
  const _params = ToolbarModule.getParams()
  SMap.setLayerEditable(data.path, true)
  if (data.type === 83) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_STYLE_GRID, {
      containerType: ToolbarType.list,
      isFullScreen: false,
      resetToolModuleData: true,
    })
    _params.showFullMap(true)
    _params.navigation.navigate('MapView')
  } else if (data.type === 1 || data.type === 3 || data.type === 5) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_STYLE, {
      containerType: ToolbarType.symbol,
      isFullScreen: false,
      resetToolModuleData: true,
    })
    _params.showFullMap(true)
    _params.navigation.navigate('MapView')
  } else if (data.type === 7) {
    _params.showFullMap && _params.showFullMap(true)
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_STYLE, {
      containerType: ToolbarType.list,
      isFullScreen: true,
      resetToolModuleData: true,
      showMenuDialog: true,
    })
    _params.navigation.navigate('MapView')
  } else {
    Toast.show(
      getLanguage(_params.language).Prompt.THE_CURRENT_LAYER_CANNOT_BE_STYLED,
    )
    // '当前图层无法设置风格')
  }
}

function setTextFont(param) {
  const layerName = ToolbarModule.getParams().currentLayer.name
  switch (param.title) {
    case getLanguage(global.language).Map_Main_Menu.STYLE_BOLD:
      SCartography.setTextFontOfLayer('BOLD', layerName)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_ITALIC:
      SCartography.setTextFontOfLayer('ITALIC', layerName)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_UNDERLINE:
      SCartography.setTextFontOfLayer('UNDERLINE', layerName)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_STRIKEOUT:
      SCartography.setTextFontOfLayer('STRIKEOUT', layerName)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_SHADOW:
      SCartography.setTextFontOfLayer('SHADOW', layerName)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_OUTLINE:
      SCartography.setTextFontOfLayer('OUTLINE', layerName)
      break
  }
}

function menu(type, selectKey, params = {}) {
  const _params = ToolbarModule.getParams()
  let isFullScreen
  let showMenuDialog
  let isTouchProgress
  const isBoxShow = GLOBAL.ToolBar && GLOBAL.ToolBar.getBoxShow()
  const showBox = function() {
    if (
      GLOBAL.Type === ChunkType.MAP_EDIT ||
      type === ConstToolType.SM_MAP_STYLE_GRID ||
      type === ConstToolType.SM_MAP_STYLE ||
      type === ConstToolType.SM_MAP_LAYER_BASE_DEFAULT ||
      type === ConstToolType.SM_MAP_LAYER_BASE_CHANGE ||
      ((type === ConstToolType.SM_MAP_STYLE_LINE_COLOR ||
        type === ConstToolType.SM_MAP_STYLE_POINT_COLOR ||
        type === ConstToolType.SM_MAP_STYLE_REGION_BEFORE_COLOR ||
        type === ConstToolType.SM_MAP_STYLE_REGION_AFTER_COLOR ||
        type === ConstToolType.SM_MAP_STYLE_REGION_BORDER_COLOR ||
        type === ConstToolType.SM_MAP_STYLE_TEXT_COLOR ||
        type === ConstToolType.SM_MAP_STYLE_TEXT_FONT ||
        type === ConstToolType.SM_MAP_LEGEND))
    ) {
      params.showBox && params.showBox()
    }
  }

  const setData = function() {
    let buttons
    if (
      GLOBAL.Type === ChunkType.MAP_EDIT ||
      type === ConstToolType.SM_MAP_STYLE_GRID ||
      type === ConstToolType.SM_MAP_STYLE ||
      type === ConstToolType.SM_MAP_LAYER_BASE_DEFAULT ||
      type === ConstToolType.SM_MAP_LAYER_BASE_CHANGE ||
      type === ConstToolType.SM_MAP_STYLE_LINE_COLOR ||
      type === ConstToolType.SM_MAP_STYLE_POINT_COLOR ||
      type === ConstToolType.SM_MAP_STYLE_REGION_BEFORE_COLOR ||
      type === ConstToolType.SM_MAP_STYLE_REGION_AFTER_COLOR ||
      type === ConstToolType.SM_MAP_STYLE_REGION_BORDER_COLOR ||
      type === ConstToolType.SM_MAP_STYLE_TEXT_COLOR ||
      type === ConstToolType.SM_MAP_STYLE_TEXT_FONT ||
      type === ConstToolType.SM_MAP_LEGEND
    ) {
      if (type.indexOf('LEGEND') >= 0) {
        if (_params.mapLegend[GLOBAL.Type].isShow) {
          buttons = [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ]
        } else {
          buttons = [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ]
        }
      } else {
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.TOOLBAR_COMMIT,
        ]
      }
    }
    params.setData &&
      params.setData({
        isFullScreen,
        showMenuDialog,
        isTouchProgress,
        buttons,
      })
  }

  if (Utils.isTouchProgress(selectKey)) {
    isFullScreen = true
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = GLOBAL.ToolBar.state.showMenuDialog
    setData()
  } else {
    isFullScreen = !GLOBAL.ToolBar.state.showMenuDialog
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = false
    if (!GLOBAL.ToolBar.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }
}

export default {
  commit,
  close,
  tableAction,
  layerListAction,
  menu,
  setTextFont,
}
