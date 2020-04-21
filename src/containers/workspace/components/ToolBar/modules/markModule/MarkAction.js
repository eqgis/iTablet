import {
  SMap,
  Action,
  DatasetType,
  SCollector,
  SMediaCollector,
} from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { LayerUtils, Toast, StyleUtils } from '../../../../../../utils'
import {
  ConstToolType,
  TouchType,
  ToolbarType,
  Const,
} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import Utils from '../../utils'

/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

async function point() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  const { currentLayer } = _params
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'POINTLAYER'
  ) {
    SMap.setAction(Action.CREATEPOINT)
    _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}
async function words() {
  const _params = ToolbarModule.getParams()
  const { currentLayer } = _params
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'TEXTLAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW_TEXT, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    GLOBAL.TouchType = TouchType.MAP_TOOL_TAGGING
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function pointline() {
  const _params = ToolbarModule.getParams()
  const { currentLayer } = _params
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'LINELAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYLINE)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function freeline() {
  const _params = ToolbarModule.getParams()
  const { currentLayer } = _params
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'LINELAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.FREEDRAW)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function pointcover() {
  const _params = ToolbarModule.getParams()
  const { currentLayer } = _params
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'REGIONLAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}
async function move() {
  const _params = ToolbarModule.getParams()
  // const { currentLayer } = _params
  // let reg = /^Label_(.*)#$/
  _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW, {
    isFullScreen: false,
    // height: ConstToolType.HEIGHT[4],
  })
  SMap.setAction(Action.MOVE_GEOMETRY)
}
async function freecover() {
  const _params = ToolbarModule.getParams()
  const { currentLayer } = _params
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'REGIONLAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWPLOYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}
function commit(type) {
  try {
    const _params = ToolbarModule.getParams()
    if (type === ConstToolType.MAP_MARKS_DRAW) {
      let currentLayer = _params.currentLayer
      SMap.setTaggingGrid(
        currentLayer.datasetName,
        _params.user.currentUser.userName,
      )
      SMap.setLayerEditable(currentLayer.name, true).then(() => {
        SMap.submit()
        SMap.refreshMap()
        //提交标注后 需要刷新属性表
        GLOBAL.NEEDREFRESHTABLE = true
      })
    } else {
      SMap.submit().then(() => {
        const type = ConstToolType.MAP_TOOL_TAGGING_SELECT

        _params.setToolbarVisible(true, type, {
          isFullScreen: false,
          // height: 0,
          cb: () => select(type),
        })
      })
      // return false
    }
  } catch (e) {
    // console.warn(e)
  }
}
function undo() {
  SMap.undo()
}
function redo() {
  SMap.redo()
}
function back() {
  if (
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_SELECT_') !== -1 ||
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_EDIT_') !== -1 ||
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1
  ) {
    SMap.cancel()
    SMap.clearSelection()
    _params.setSelection()
    const type = ConstToolType.MAP_TOOL_TAGGING_SELECT

    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
      // height: 0,
      cb: () => select(type),
    })
  }

  const _params = ToolbarModule.getParams()
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.MAP_MARKS, {
    isFullScreen: true,
  })
}
/**
 * 显示编辑标注菜单
 */
function showEditLabel() {
  const _params = ToolbarModule.getParams()
  _params.setSelection()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  const type = ConstToolType.MAP_TOOL_TAGGING_SELECT

  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    // height: 0,
    cb: () => select(type),
  })

  // let layers = _params.layers.layers
  // 其他图层设置为不可选
  // _setMyLayersSelectable(layers, false)

  Toast.show(
    global.language === 'CN'
      ? '点击文字左上角以选中文字'
      : 'Tap top-right of text to select it',
  )
}

function select(type) {
  if (type === undefined) {
    type = ToolbarModule.getParams().type
  }
  switch (type) {
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE:
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      SMap.setAction(Action.SELECT_BY_RECTANGLE)
      // SMap.selectByRectangle()
      break
    case ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT:
    case ConstToolType.MAP_TOOL_TAGGING_SELECT:
    case ConstToolType.MAP_TOOL_POINT_SELECT:
    default:
      SMap.setAction(Action.SELECT)
      break
  }
}
/**
 * 选择标注_编辑
 */
function selectLabelToEdit(toolType = '') {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  const { event } = ToolbarModule.getData()

  // const column = 4
  // let height = ConstToolType.HEIGHT[3]
  let containerType = ToolbarType.table
  let type = ''

  if (toolType === '') {
    toolType = global.MapToolType
  }
  switch (toolType) {
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_POINT:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_POINT_NOSTYLE
      // height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_LINE:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_LINE_NOSTYLE
      // height = ConstToolType.HEIGHT[2]
      break
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_REGION:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_REGION_NOSTYLE
      // height = ConstToolType.HEIGHT[2]
      // containerType = ToolbarType.scrollTable
      break
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_TEXT:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_TEXT_NOSTYLE
      // height = ConstToolType.HEIGHT[0]
      break
  }
  if (type !== '') {
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        // column,
        // height,
        containerType,
        cb: () => SMap.appointEditGeometry(event.id, event.layerInfo.path),
      })
  }
}

/**
 * 选择标注_设置风格
 */
function selectLabelToStyle() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  const { event } = ToolbarModule.getData()
  let showMenuDialog = false
  let isFullScreen = false
  let containerType = ''
  // let height = ConstToolType.THEME_HEIGHT[3]
  let type = ''
  switch (global.MapToolType) {
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_POINT:
      containerType = ToolbarType.symbol
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT
      break
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_LINE:
      containerType = ToolbarType.symbol
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE
      break
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_REGION:
      containerType = ToolbarType.symbol
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION
      break
    case ConstToolType.MAP_TOOL_TAGGING_EDIT_TEXT:
      showMenuDialog = true
      // height = 0
      isFullScreen = true
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT
      break
  }

  if (type !== '') {
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, type, {
        containerType,
        isFullScreen,
        // column: 4,
        // height,
        showMenuDialog,
        cb: () => {
          if (
            global.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT
          ) {
            SMap.appointEditGeometry(event.id, event.layerInfo.path)
          } else {
            StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
            SMap.setLayerEditable(event.layerInfo.path, false)
          }
          SMap.setAction(Action.PAN)
        },
      })
  }
}

// 设置我的图层的可选择性
// function _setMyLayersSelectable(layers, selectable) {
//   for (let i = 0; i < layers.length; i++) {
//     if (layers[i].type === 'layerGroup') {
//       _setMyLayersSelectable(layers[i].child, selectable)
//     } else if (
//       LayerUtils.getLayerType(layers[i]) !== 'TAGGINGLAYER' &&
//       layers[i].isSelectable
//     ) {
//       SMap.setLayerSelectable(layers[i].path, selectable)
//     }
//   }
// }

/**
 * 删除标注
 */
async function deleteLabel() {
  const _params = ToolbarModule.getParams()
  const _selection = _params.selection
  if (_selection.length === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  _selection.forEach(async item => {
    if (item.ids.length > 0) {
      await SCollector.removeByIds(item.ids, item.layerInfo.path)
      await SMediaCollector.removeByIds(item.ids, item.layerInfo.name)
    }
  })
  _params.setSelection()
  const type = ConstToolType.MAP_TOOL_TAGGING_SELECT

  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    // height: 0,
    cb: () => select(type),
  })
}
function colorAction(params) {
  const { event } = ToolbarModule.getData()
  switch (params.type) {
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET:
      SMap.setTaggingMarkerColor(params.key, event.layerInfo.path, event.id)
      break
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET:
      SMap.setTaggingLineColor(params.key, event.layerInfo.path, event.id)
      break
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET:
      SMap.setTaggingFillForeColor(params.key, event.layerInfo.path, event.id)
      break
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET:
      SMap.setTaggingTextColor(params.key, event.layerInfo.path, event.id)
      break
    default:
      break
  }
}

function setTaggingTextFont(param) {
  const { event } = ToolbarModule.getData()
  switch (param.title) {
    case getLanguage(global.language).Map_Main_Menu.STYLE_BOLD:
      SMap.setTaggingTextFont('BOLD', event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_ITALIC:
      SMap.setTaggingTextFont('ITALIC', event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_UNDERLINE:
      SMap.setTaggingTextFont('UNDERLINE', event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_STRIKEOUT:
      SMap.setTaggingTextFont('STRIKEOUT', event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_SHADOW:
      SMap.setTaggingTextFont('SHADOW', event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_OUTLINE:
      SMap.setTaggingTextFont('OUTLINE', event.layerInfo.path, event.id)
      break
  }
}
function geometrySelected(event) {
  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_SELECT) {
    ToolbarModule.addData({
      event,
    })
    const _params = ToolbarModule.getParams()
    let type = ''
    const layerType = event.layerInfo.type
    let geoType
    for (let i = 0; i < event.fieldInfo.length; i++) {
      if (event.fieldInfo[i].name === 'SmGeoType') {
        geoType = event.fieldInfo[i].value
        break
      }
    }
    if (!geoType) {
      geoType = layerType
    }
    let containerType = ''
    // let height = ConstToolType.THEME_HEIGHT[3]
    switch (geoType) {
      case DatasetType.POINT:
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_POINT
        // height = ConstToolType.HEIGHT[0]
        break
      case DatasetType.LINE:
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_LINE
        // height = ConstToolType.HEIGHT[2]
        break
      case DatasetType.REGION:
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_REGION
        // height = ConstToolType.HEIGHT[2]
        // containerType = ToolbarType.scrollTable
        break
      case DatasetType.TEXT:
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_TEXT
        // height = ConstToolType.HEIGHT[0]
        break
    }
    if (type !== '' && layerType !== DatasetType.CAD) {
      this.selectLabelToEdit(type)
      return
    }

    if (type !== '') {
      StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        // column: 5,
        containerType,
        // height,
        cb: () => {
          SMap.appointEditGeometry(event.id, event.layerInfo.path)
          // SMap.setLayerEditable(event.layerInfo.path, false)
          // SMap.setAction(Action.PAN)
        },
      })
    }
  }
}

async function close(type) {
  const _params = ToolbarModule.getParams()
  if (type === ConstToolType.MAP_TOOL_TAGGING_SETTING) {
    await SMap.undo()
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_TAGGING_SELECT) {
    SMap.setAction(Action.PAN)
    const { layers } = _params.layers
    // 还原其他图层的选择状态
    // _setMyLayersSelectable(layers, true)
    for (let i = 0; i < layers.length; i++) {
      if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
        if (
          _params.currentLayer &&
          _params.currentLayer.name &&
          _params.currentLayer.name === layers[i].name
        ) {
          SMap.setLayerEditable(layers[i].path, true)
        }
      }
    }
    _params.setToolbarVisible(false)
  } else {
    return false
  }
}
function menu(type, selectKey, params = {}) {
  let isFullScreen
  let showMenuDialog
  let isTouchProgress
  const showBox = function() {
    if (type.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1) {
      params.showBox && params.showBox()
    }
  }

  const setData = function() {
    params.setData &&
      params.setData({
        isFullScreen,
        showMenuDialog,
        isTouchProgress,
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
function showMenuBox(type, selectKey, params = {}) {
  if (type.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1) {
    if (Utils.isTouchProgress(selectKey)) {
      params.setData &&
        params.setData({
          isTouchProgress: !GLOBAL.ToolBar.state.isTouchProgress,
          showMenuDialog: false,
          isFullScreen: !GLOBAL.ToolBar.state.isTouchProgress,
        })
    } else if (!GLOBAL.ToolBar.state.showMenuDialog) {
      params.showBox && params.showBox()
    } else {
      params.setData &&
        params.setData({
          showMenuDialog: false,
          isFullScreen: false,
        })
      params.showBox && params.showBox()
    }
    return
  }
}
function toolbarBack() {
  const _params = ToolbarModule.getParams()
  if (
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_SELECT_') !== -1 ||
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_EDIT_') !== -1 ||
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1
  ) {
    //todo 取消标注风格
    SMap.cancel()
    SMap.clearSelection()
    _params.setSelection()
    const type = ConstToolType.MAP_TOOL_TAGGING_SELECT

    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
      // height: 0,
      cb: () => select(type),
    })
  } /*else if (
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1
  ) {
    let type = ''
    let layerType = ToolbarModule.getData().event.layerInfo.type
    let height = ConstToolType.THEME_HEIGHT[3]
    let containerType = ''
    if (layerType === DatasetType.CAD) {
      if (GLOBAL.MapToolType.indexOf('_POINT') !== -1) {
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_POINT
        height = ConstToolType.HEIGHT[0]
      } else if (GLOBAL.MapToolType.indexOf('_LINE') !== -1) {
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_LINE
        height = ConstToolType.HEIGHT[2]
      } else if (GLOBAL.MapToolType.indexOf('_REGION') !== -1) {
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_REGION
        height = ConstToolType.HEIGHT[2]
        containerType = ToolbarType.scrollTable
      } else if (GLOBAL.MapToolType.indexOf('_TEXT') !== -1) {
        type = ConstToolType.MAP_TOOL_TAGGING_EDIT_TEXT
        height = ConstToolType.HEIGHT[0]
      }
      if (type !== '') {
        const { event } = ToolbarModule.getData()
        _params.setToolbarVisible(true, type, {
          isFullScreen: false,
          column: 5,
          height,
          containerType,
          cb: () => {
            StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
            // SMap.setLayerEditable(event.layerInfo.path, false)
            // SMap.setAction(Action.PAN)
          },
        })
      }
    } else {
      SMap.clearSelection()
      _params.setSelection()
      const type = ConstToolType.MAP_TOOL_TAGGING_SELECT

      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        height: 0,
        cb: () => select(type),
      })
    }
  }*/
}
export default {
  menu,
  showMenuBox,
  toolbarBack,
  commit,
  close,

  undo,
  redo,
  move,
  back,
  point,
  words,
  pointline,
  freeline,
  pointcover,
  freecover,
  showEditLabel,
  selectLabelToEdit,
  selectLabelToStyle,
  deleteLabel,
  geometrySelected,
  colorAction,
  setTaggingTextFont,
}
