/**
 * @description 标注Action
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import {
  SMap,
  SCollector,
  SMediaCollector,
} from 'imobile_for_reactnative'
import { Action,  } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { DatasetType,GeometryType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SDataType'
import ToolbarModule from '../ToolbarModule'
import { LayerUtils, Toast, StyleUtils, SCoordinationUtils } from '../../../../../../utils'
import {
  ConstToolType,
  TouchType,
  ToolbarType,
  Const,
} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import Utils from '../../utils'
import NavigationService from '../../../../../NavigationService'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'

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
    ToolbarModule.addData({MarkType:'CREATEPOINT'})
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
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
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_MARKS_DRAW_TEXT, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    global.TouchType = TouchType.MAP_MARKS_TAGGING
    ToolbarModule.addData({MarkType:'MAP_MARKS_TAGGING'})
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
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYLINE)
    ToolbarModule.addData({MarkType:'CREATEPOLYLINE'})
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
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.FREEDRAW)
    ToolbarModule.addData({MarkType:'FREEDRAW'})
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
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYGON)
    ToolbarModule.addData({MarkType:'CREATEPOLYGON'})
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}
async function move() {
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
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_MARKS_DRAW, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWPLOYGON)
    ToolbarModule.addData({MarkType:'DRAWPLOYGON'})
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}
async function commit(type) {
  try {
    const _params = ToolbarModule.getParams()
    if (type === ConstToolType.SM_MAP_MARKS_DRAW) {
      let have = await SMap.haveCurrentGeometry()
      if(have){
        // 是否有新的采集或标注
        global.HAVEATTRIBUTE = true
      }
      let currentLayer = _params.currentLayer
      SMap.setTaggingGrid(
        currentLayer.datasetName,
        _params.user.currentUser.userName,
      )
      SMap.setLayerEditable(currentLayer.name, true).then(() => {
        SMap.submit().then(result => {
          if (result) {
            SMap.refreshMap()
            //提交标注后 需要刷新属性表
            global.NEEDREFRESHTABLE = true
            if (global.coworkMode && global.getFriend) {
              let currentTaskInfo = _params.coworkInfo?.[_params.user.currentUser.userName]?.[_params.currentTask.groupID]?.[_params.currentTask.id]
              let isRealTime = currentTaskInfo?.isRealTime === undefined ? false : currentTaskInfo.isRealTime
              if (isRealTime) {
                let layerType = LayerUtils.getLayerType(currentLayer)
                if (layerType !== 'TAGGINGLAYER') {
                  let friend = global.getFriend()
                  friend.onGeometryAdd(currentLayer)
                }
              }
            }
          }
        })
      })
    } else {
      SMap.submit().then(async result => {
        if (result) {
          const type = ConstToolType.SM_MAP_MARKS_TAGGING_SELECT
          try {
            if (global.coworkMode && global.getFriend) {
              let currentTaskInfo = _params.coworkInfo?.[_params.user.currentUser.userName]?.[_params.currentTask.groupID]?.[_params.currentTask.id]
              let isRealTime = currentTaskInfo?.isRealTime === undefined ? false : currentTaskInfo.isRealTime
              if (isRealTime) {
                let event = ToolbarModule.getData().event
                let layerType = LayerUtils.getLayerType(event.layerInfo)
                if (layerType !== 'TAGGINGLAYER') {
                  let friend = global.getFriend()
                  friend.onGeometryEdit(
                    event.layerInfo,
                    event.fieldInfo,
                    event.id,
                    event.geometryType,
                  )
                }
              }
            }

            if (
              _params.selection[0] &&
              _params.selection[0].layerInfo &&
              (await SMediaCollector.isTourLayer(
                _params.selection[0].layerInfo.name,
              ))
            ) {
              // 编辑旅行轨迹对象后，更新位置
              await SMediaCollector.updateTour(_params.selection[0].layerInfo.name)
            } else if (
              _params.selection?.[0]?.layerInfo?.name &&
              await SMediaCollector.isMediaLayer(_params.selection[0].layerInfo.name)
            ) {
              // 编辑多媒体对象后，更新位置
              let geoID = _params.selection[0].ids[0] || -1
              geoID > -1 &&
              (await SMediaCollector.updateMedia(_params.selection[0].layerInfo.name, [geoID]))
            }
          } catch(e) {
            //
          }
          _params.setToolbarVisible(true, type, {
            isFullScreen: false,
            // height: 0,
            cb: select,
          })
        }
      })
      // return false
    }
  } catch (e) {
    // console.warn(e)
  }
}

async function showAttribute() {
  let have = await SMap.haveCurrentGeometry()
  if(have){
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SUBMIT_EDIT_GEOMETRY)
  }else{
    if(global.HAVEATTRIBUTE){
      NavigationService.navigate('LayerSelectionAttribute',{isCollection:true,preType:'SM_MAP_MARKS_DRAW'})
    }
  }
  return true
}

async function showAttribute1() {
  let have = await SMap.haveCurrentGeometry()
  if(have){
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SUBMIT_EDIT_GEOMETRY)
  }else{
    if(global.HAVEATTRIBUTE){
      NavigationService.navigate('LayerSelectionAttribute',{isCollection:true,preType:'SM_MAP_MARKS_DRAW_TEXT'})
    }
  }
  return true
}

function undo() {
  SMap.undo()
}
function redo() {
  SMap.redo()
}
function addNode() {
  return SMap.setAction(Action.VERTEXADD)
}

function editNode() {
  return SMap.setAction(Action.VERTEXEDIT)
}

function deleteNode() {
  return SMap.setAction(Action.VERTEXDELETE)
}
function back() {
  const _params = ToolbarModule.getParams()
  if (
    _params.type.indexOf('MAP_MARKS_TAGGING_SELECT_') !== -1 ||
    _params.type.indexOf('MAP_MARKS_TAGGING_EDIT_') !== -1 ||
    _params.type.indexOf('MAP_MARKS_TAGGING_STYLE') !== -1
  ) {
    SMap.cancel()
    SMap.clearSelection()
    _params.setSelection()
    const type = ConstToolType.SM_MAP_MARKS_TAGGING_SELECT

    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
      // height: 0,
      cb: select,
    })
  }
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_MARKS, {
    isFullScreen: true,
  })
   // 是否有新的采集或标注
   global.HAVEATTRIBUTE = false
}
/**
 * 显示编辑标注菜单
 */
function showEditLabel() {
  const _params = ToolbarModule.getParams()
  _params.setSelection()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  const type = ConstToolType.SM_MAP_MARKS_TAGGING_SELECT

  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    // height: 0,
    cb: select,
  })

  // let layers = _params.layers.layers
  // 其他图层设置为不可选
  // _setMyLayersSelectable(layers, false)

  // Toast.show(
  //   global.language === 'CN'
  //     ? '点击文字左上角以选中文字'
  //     : 'Tap top-right of text to select it',
  // )
}

function select() {
  SMap.setAction(Action.SELECT)
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
    toolType = _params.type
  }
  switch (toolType) {
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_POINT:
      type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_POINT_NOSTYLE
      // height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_LINE:
      type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_LINE_NOSTYLE
      // height = ConstToolType.HEIGHT[2]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_REGION:
      type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_REGION_NOSTYLE
      // height = ConstToolType.HEIGHT[2]
      // containerType = ToolbarType.scrollTable
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_TEXT:
      type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_TEXT_NOSTYLE
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
  switch (_params.type) {
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_POINT:
      containerType = ToolbarType.symbol
      type = ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_LINE:
      containerType = ToolbarType.symbol
      type = ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_REGION:
      containerType = ToolbarType.symbol
      type = ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_TEXT:
      showMenuDialog = true
      // height = 0
      isFullScreen = true
      type = ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT
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
            _params.type === ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT
          ) {
            SMap.appointEditGeometry(event.id, event.layerInfo.path)
          } else {
            StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
            SMap.setLayerEditable(event.layerInfo.path, false)
          }
          SMap.setAction(Action.SELECT)
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
  try {
    const _params = ToolbarModule.getParams()
    const _selection = _params.selection
    if (_selection.length === 0) {
      Toast.show(getLanguage(global.language).Prompt.NON_SELECTED_OBJ)
      return
    }
    let result = true
    //使用for循环等待，在forEach里await没有用
    for (let i = 0; i < _selection.length; i++) {
      let item = _selection[i]
      if (item.ids.length > 0) {
        result = result && (await SCollector.removeByIds(item.ids, item.layerInfo.path))
        result = result && (await SMediaCollector.removeByIds(item.ids, item.layerInfo.name))
      }
    }
    // _selection.forEach(async item => {
    // })
    if(result){
      _params.setSelection()
      const type = ConstToolType.SM_MAP_MARKS_TAGGING_SELECT
      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        // height: 0,
        cb: select,
      })
    }
  } catch (e) {
    //
  }
}
function colorAction(params) {
  const { event } = ToolbarModule.getData()
  switch (params.type) {
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_COLOR_SET:
      SMap.setTaggingMarkerColor(params.key, event.layerInfo.path, event.id)
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDERCOLOR_SET:
      SMap.setTaggingLineColor(params.key, event.layerInfo.path, event.id)
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_FORECOLOR_SET:
      SMap.setTaggingFillForeColor(params.key, event.layerInfo.path, event.id)
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_COLOR_SET:
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
  const _params = ToolbarModule.getParams()
  if (_params.type === ConstToolType.SM_MAP_MARKS_TAGGING_SELECT) {
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
        type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_POINT
        // height = ConstToolType.HEIGHT[0]
        break
      case DatasetType.LINE:
        type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_LINE
        // height = ConstToolType.HEIGHT[2]
        break
      case DatasetType.REGION:
        type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_REGION
        // height = ConstToolType.HEIGHT[2]
        // containerType = ToolbarType.scrollTable
        break
      case DatasetType.TEXT:
        type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_TEXT
        // height = ConstToolType.HEIGHT[0]
        break
      case GeometryType.GEOGRAPHICOBJECT:
        type = ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_PLOT
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
  const _data = ToolbarModule.getData()
  const _params = ToolbarModule.getParams()
  if (type === ConstToolType.SM_MAP_MARKS_TAGGING_SETTING) {
    await SMap.undo()
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.SM_MAP_MARKS_TAGGING_SELECT) {
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
  } else if (type === ConstToolType.SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE) {
    // 返回框选/点选属性界面，并清除属性关联选中的对象
    NavigationService.navigate('LayerSelectionAttribute', {
      isCollection:true,
      preType:_data.preType,
    })
    await SNavigationInner.clearTrackingLayer()
    global.toolBox &&
        global.toolBox.setVisible(true, _data.preType, {
          containerType: 'table',
          isFullScreen: false,
        })
    switch (_data.MarkType) {
      case 'CREATEPOINT':
        SMap.setAction(Action.CREATEPOINT)
        break
      case 'MAP_MARKS_TAGGING':
        global.TouchType = TouchType.MAP_MARKS_TAGGING
        break
      case 'CREATEPOLYLINE':
        SMap.setAction(Action.CREATEPOLYLINE)
        break
      case 'FREEDRAW':
        SMap.setAction(Action.FREEDRAW)
        break
      case 'CREATEPOLYGON':
        SMap.setAction(Action.CREATEPOLYGON)
        break
      case 'DRAWPLOYGON':
        SMap.setAction(Action.DRAWPLOYGON)
        break
    }
    // NavigationService.goBack()
  } else {
    return false
  }
}
function menu(type, selectKey, params = {}) {
  let isFullScreen
  let showMenuDialog
  let isTouchProgress
  const showBox = function() {
    if (type.indexOf('MAP_MARKS_TAGGING_STYLE') !== -1) {
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
function showMenuBox(type, selectKey, params = {}) {
  if (type.indexOf('MAP_MARKS_TAGGING_STYLE') !== -1) {
    if (Utils.isTouchProgress(selectKey)) {
      params.setData &&
        params.setData({
          isTouchProgress: !global.ToolBar.state.isTouchProgress,
          showMenuDialog: false,
          isFullScreen: !global.ToolBar.state.isTouchProgress,
        })
    } else if (!global.ToolBar.state.showMenuDialog) {
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
    _params.type.indexOf('MAP_MARKS_TAGGING_SELECT_') !== -1 ||
    _params.type.indexOf('MAP_MARKS_TAGGING_EDIT_') !== -1 ||
    _params.type.indexOf('MAP_MARKS_TAGGING_STYLE') !== -1
  ) {
    SMap.cancel()
    SMap.clearSelection()
    _params.setSelection()
    const type = ConstToolType.SM_MAP_MARKS_TAGGING_SELECT

    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
      // height: 0,
      cb: select,
    })
  }
}

/**
 * 获取Touchprogress的初始信息
 *
 * @returns {{
 * title: String,     提示消息标题
 * value: Number,     当前值
 * tips: String,      当前信息
 * step: Number,      步长 最小改变单位,默认值1
 * range: Array,      数值范围
 * unit: String,      单位（可选）
 * }}
 */
async function getTouchProgressInfo() {
  const data = ToolbarModule.getData()
  let event = data.event
  let tips = ''
  let range = [1, 100]
  let value = 0
  let step = 1
  let unit = ''
  let title = global.toolBox?.state?.selectName
  switch (title) {
    //线宽 边框宽度
    case getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH:
    case getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
      value = await SMap.getTaggingLineWidth(event.layerInfo.path, event.id)
      range = [1, 20]
      unit = 'mm'
      break
    //符号大小
    case getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
      value = await SMap.getTaggingMarkerSize(event.layerInfo.path, event.id)
      range = [1, 100]
      unit = 'mm'
      break
    //旋转角度
    case getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION:
      if (event.geometryType === GeometryType.GEOTEXT) {
        //文本旋转角度
        value = await SMap.getTaggingTextAngle(event.layerInfo.path, event.id)
      } else {
        value = await SMap.getTaggingAngle(event.layerInfo.path, event.id)
      }
      range = [0, 360]
      unit = '°'
      break
    //透明度
    case getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY:
      value = await SMap.getTaggingAlpha(event.layerInfo.path, event.id)
      range = [0, 100]
      unit = '%'
      break
    //字号
    case getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE:
      value = await SMap.getTaggingTextSize(event.layerInfo.path, event.id)
      range = [1, 20]
      unit = 'mm'
      break
  }
  return { title, value, tips, range, step, unit }
}

/**
 * 设置TouchProgress的值到地图对应的属性
 * @param title
 * @param value
 */
function setTouchProgressInfo(title, value) {
  const data = ToolbarModule.getData()
  let event = data.event
  // switch (global.ToolBar?.state?.selectName) {
  switch (title) {
    case getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH:
    case getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
      SMap.setTaggingLineWidth(value, event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
      SMap.setTaggingMarkerSize(value, event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION:
      if (event.geometryType === GeometryType.GEOTEXT) {
        SMap.setTaggingTextAngle(value, event.layerInfo.path, event.id)
      } else {
        SMap.setTaggingAngle(value, event.layerInfo.path, event.id)
      }
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY:
      SMap.setTaggingAlpha(value, event.layerInfo.path, event.id)
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE:
      SMap.setTaggingTextSize(value, event.layerInfo.path, event.id)
      break
  }
}

function remove() {
  global.removeObjectDialog && global.removeObjectDialog.setDialogVisible(true)
}

/**
 * 获取Progress的tips
 * @param value
 * @returns {string}
 */
// function getTouchProgressTips(value) {
//   let tips = ''
//   switch (global.ToolBar?.state?.selectName) {
//     case getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH:
//     case getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
//       tips =
//         getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH +
//         '     ' +
//         parseInt(value) +
//         'mm'
//       break
//     case getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
//       tips =
//         getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
//         '     ' +
//         parseInt(value) +
//         'mm'
//       break
//     case getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION:
//       tips =
//         getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
//         '     ' +
//         parseInt(value) +
//         '°'
//       break
//     case getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY:
//       tips =
//         getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
//         '     ' +
//         parseInt(value) +
//         '%'
//       break
//     case getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE:
//       tips =
//         getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
//         '     ' +
//         parseInt(value)
//       break
//     case 'TEXT_ROTATION':
//       tips =
//         getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
//         '     ' +
//         parseInt(value) +
//         '°'
//       break
//   }
//   return tips
// }
export default {
  menu,
  showMenuBox,
  toolbarBack,
  commit,
  close,

  getTouchProgressInfo,
  setTouchProgressInfo,
  // getTouchProgressTips,

  undo,
  redo,
  move,
  editNode,
  addNode,
  deleteNode,
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
  showAttribute,
  showAttribute1,
  remove,
}
