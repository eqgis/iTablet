// import { SCartography, SMap } from 'imobile_for_reactnative'
import { DatasetType, GeoTextStyle, TextFont } from 'imobile_for_reactnative/NativeModule/interfaces/data/SDataType'
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
import { SMap } from 'imobile_for_reactnative'

async function commit() {
  const _params = ToolbarModule.getParams()

  if (global.Type === ChunkType.MAP_EDIT) {
    global.showMenu = true
  }

  ToolbarModule.setData()

  _params.setToolbarVisible(false, '', {
    isTouchProgress: false,
    showMenuDialog: false,
    selectKey: '',
  })
  global.TouchType = TouchType.NORMAL
}

async function close() {
  const _params = ToolbarModule.getParams()

  const _data = ToolbarModule.getData()
  if (_data.currentLayerStyle) {
    await SMap.setLayerStyleXml(
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
      // result = await SCartography.setLineColor(params.key, params.layerName)
      result = await SMap.setLayerStyle(params.layerName, {
        LineColor: params.key,
      })
      break
    case ConstToolType.SM_MAP_STYLE_POINT_COLOR:
      // result = await SCartography.setMarkerColor(params.key, params.layerName)
      result = await SMap.setLayerStyle(params.layerName, {
        LineColor: params.key,
      })
      break
    case ConstToolType.SM_MAP_STYLE_REGION_BEFORE_COLOR:
      // result = await SCartography.setFillForeColor(params.key, params.layerName)
      result = await SMap.setLayerStyle(params.layerName, {
        FillForeColor: params.key,
      })
      break
    case ConstToolType.SM_MAP_STYLE_REGION_AFTER_COLOR:
      // result = await SCartography.setFillBackColor(params.key, params.layerName)
      result = await SMap.setLayerStyle(params.layerName, {
        FillBackColor: params.key,
      })
      break
    case ConstToolType.SM_MAP_STYLE_REGION_BORDER_COLOR:
      // result = await SCartography.setFillBorderColor(params.key, params.layerName)
      result = await SMap.setLayerStyle(params.layerName, {
        setLineColor: params.key,
      })
      break
    case ConstToolType.SM_MAP_STYLE_TEXT_COLOR:
      // result = await SCartography.setTextColorOfLayer(params.key, params.layerName)
      const rgb = SMap._translate16ToRgb(params.key)
      if (rgb) {
        const geoTextStyle: GeoTextStyle = { TextColor: rgb }
        result = await SMap.setLayerTextStyle(params.layerName, geoTextStyle)
      }
      break
  
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
  let fontName:TextFont = 'NULL'
  switch (param.title) {
    case getLanguage(global.language).Map_Main_Menu.STYLE_BOLD:
      // SCartography.setTextFontOfLayer('BOLD', layerName)
      fontName = 'BOLD'
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_ITALIC:
      // SCartography.setTextFontOfLayer('ITALIC', layerName)
      fontName = 'ITALIC'
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_UNDERLINE:
      // SCartography.setTextFontOfLayer('UNDERLINE', layerName)
      fontName = 'UNDERLINE'
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_STRIKEOUT:
      // SCartography.setTextFontOfLayer('STRIKEOUT', layerName)
      fontName = 'STRIKEOUT'
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_SHADOW:
      // SCartography.setTextFontOfLayer('SHADOW', layerName)
      fontName = 'SHADOW'
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_OUTLINE:
      // SCartography.setTextFontOfLayer('OUTLINE', layerName)
      fontName = 'OUTLINE'
      break
  }
  SMap.setLayerTextStyle(layerName||"", {
    TextFont: [fontName],
  })
}

function menu(type, selectKey, params = {}) {
  const _params = ToolbarModule.getParams()
  let isFullScreen
  let showMenuDialog
  let isTouchProgress
  // const isBoxShow = global.ToolBar && global.ToolBar.getBoxShow()
  const showBox = function() {
    if (
      global.Type === ChunkType.MAP_EDIT ||
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
      global.Type === ChunkType.MAP_EDIT ||
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
        if (_params.mapLegend[global.Type].isShow) {
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
    showMenuDialog = !global.ToolBar.state.showMenuDialog
    isTouchProgress = global.ToolBar.state.showMenuDialog
    setData()
  } else {
    isFullScreen = !global.ToolBar.state.showMenuDialog
    showMenuDialog = !global.ToolBar.state.showMenuDialog
    isTouchProgress = false
    if (!global.ToolBar.state.showMenuDialog) {
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

/**
 * @author ysl
 * 获取TouchProgress的初始信息
 * @param title
 * @returns {Promise.<{
 * title,                   提示消息标题
 * value: number,           当前值
 * tips: string,            当前信息
 * range: [number,number],  步长 最小改变单位,默认值1
 * step: number,            数值范围
 * unit: string             单位（可选）
 * }>}
 */
async function getTouchProgressInfo(title) {
  const _params = ToolbarModule.getParams()
  let layerType = _params.currentLayer.type
  let tips = ''
  let range = [1, 100]
  let value = 0
  let step = 1
  let unit = ''
  switch (title) {
    case getLanguage(_params.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
      range = [1, 100]
      // value = await SCartography.getMarkerSize(_params.currentLayer.name)
      value = (await SMap.getLayerStyle(_params.currentLayer.name)).MarkerSize.width
      unit = 'mm'
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_TRANSPARENCY:
      range = [0, 100]
      if (layerType === DatasetType.POINT) {
        // value = await SCartography.getMarkerAlpha(_params.currentLayer.name)
        value = (await SMap.getLayerStyle(_params.currentLayer.name)).FillOpaqueRate
      } else if (layerType === DatasetType.REGION) {
        // value = await SCartography.getFillOpaqueRate(_params.currentLayer.name)
        value = (await SMap.getLayerStyle(_params.currentLayer.name)).FillOpaqueRate
      } else if (layerType === DatasetType.GRID) {
        // value = await SCartography.getGridOpaqueRate(_params.currentLayer.name)
        value = (await SMap.getLayerGridStyle(_params.currentLayer.name)).OpaqueRate
      }
      unit = '%'
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_ROTATION:
      range = [0, 360]
      if (layerType === DatasetType.POINT) {
        // value = await SCartography.getMarkerAngle(_params.currentLayer.name)
        value = (await SMap.getLayerStyle(_params.currentLayer.name)).MarkerAngle
      } else if (layerType === DatasetType.TEXT) {
        // value = await SCartography.getTextAngleOfLayer(_params.currentLayer.name)
        value = (await SMap.getLayerTextStyle(_params.currentLayer.name)).TextAngle
      }
      unit = '°'
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_LINE_WIDTH:
      range = [1, 20]
      // value = await SCartography.getLineWidth(_params.currentLayer.name)
      value = (await SMap.getLayerStyle(_params.currentLayer.name)).LineWidth
      unit = 'mm'
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
      range = [0, 100]
      // value = await SCartography.getLineWidth(_params.currentLayer.name)
      value = (await SMap.getLayerStyle(_params.currentLayer.name)).LineWidth
      unit = 'mm'
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_FONT_SIZE:
      range = [1, 20]
      // value = await SCartography.getTextSizeOfLayer(_params.currentLayer.name)
      value = (await SMap.getLayerTextStyle(_params.currentLayer.name)).TextSize
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_BRIGHTNESS:
      range = [0, 200]
      // 亮度范围是 -100 至 100
      // value = await SCartography.getGridBrightness(_params.currentLayer.name) + 100
      value = (await SMap.getLayerGridStyle(_params.currentLayer.name)).Brightness + 100
      break
    case getLanguage(_params.language).Map_Main_Menu.CONTRAST:
      range = [0, 200]
      // 对比度范围是 -100 至 100
      // value = await SCartography.getGridContrast(_params.currentLayer.name) + 100
      value = (await SMap.getLayerGridStyle(_params.currentLayer.name)).Contrast + 100
      break
  }
  return { title, value, tips, range, step, unit }
}

/**
 * @author ysl
 * 设置TouchProgress的值到地图对应的属性
 * @param title
 * @param value
 */
function setTouchProgressInfo(title, value) {
  const _params = ToolbarModule.getParams()
  let layerType = _params.currentLayer.type
  let range = [1, 100]
  switch (title) {
    case getLanguage(_params.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
      range = [1, 100]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      // SCartography.setMarkerSize(value, _params.currentLayer.name)
      SMap.setLayerStyle(_params.currentLayer.name, {
        MarkerSize: {height: value, width: value},
      })
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_TRANSPARENCY:
      // 相同标题，当前根据图层类型来区分使用方法
      range = [0, 100]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      if (layerType === DatasetType.POINT) {
        // SCartography.setMarkerAlpha(value, _params.currentLayer.name)
        SMap.setLayerStyle(_params.currentLayer.name, {
          FillOpaqueRate: 100 - value,
        })
      } else if (layerType === DatasetType.REGION) {
        // SCartography.setFillOpaqueRate(value, _params.currentLayer.name)
        SMap.setLayerStyle(_params.currentLayer.name, {
          FillOpaqueRate: 100 - value,
        })
      } else if (layerType === DatasetType.GRID) {
        // SCartography.setGridOpaqueRate(value, _params.currentLayer.name)
        SMap.setLayerGridStyle(_params.currentLayer.name, {
          OpaqueRate: 100 - value,
        })
      }
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_ROTATION:
      range = [0, 360]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      if (layerType === DatasetType.POINT) {
        // SCartography.setMarkerAngle(value, _params.currentLayer.name)
        SMap.setLayerStyle(_params.currentLayer.name, {
          MarkerAngle: value,
        })
      } else if (layerType === DatasetType.TEXT) {
        // SCartography.setTextAngleOfLayer(value, _params.currentLayer.name)
        SMap.setLayerTextStyle(_params.currentLayer.name||"", {
          TextAngle: value,
        })
      }
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_LINE_WIDTH:
      range = [1, 20]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      // SCartography.setLineWidth(value, _params.currentLayer.name)
      SMap.setLayerStyle(_params.currentLayer.name, {
        LineWidth: value,
      })
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
      range = [0, 100]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      // SCartography.setLineWidth(value, _params.currentLayer.name)
      SMap.setLayerStyle(_params.currentLayer.name, {
        LineWidth: value,
      })
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_FONT_SIZE:
      range = [1, 20]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      // SCartography.setTextSizeOfLayer(value, _params.currentLayer.name)
      SMap.setLayerTextStyle(_params.currentLayer.name||"", {
        TextFont: value,
      })
      break
    case getLanguage(_params.language).Map_Main_Menu.STYLE_BRIGHTNESS:
      range = [0, 200]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
  
      value -= 100 // 亮度范围是 -100 至 100
      
      // SCartography.setGridBrightness(value, _params.currentLayer.name)
      SMap.setLayerGridStyle(_params.currentLayer.name, {
        Brightness: value,
      })
      break
    case getLanguage(_params.language).Map_Main_Menu.CONTRAST:
      range = [0, 200]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
  
      value -= 100 // 对比度范围是 -100 至 100
      
      // SCartography.setGridContrast(value, _params.currentLayer.name)
      SMap.setLayerGridStyle(_params.currentLayer.name, {
        Contrast: value,
      })
      break
  }
}

export default {
  commit,
  close,
  tableAction,
  layerListAction,
  menu,
  // TouchProgress数据和事件
  getTouchProgressInfo,
  setTouchProgressInfo,
  
  setTextFont,
}
