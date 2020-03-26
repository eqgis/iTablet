import { SMap, Action } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { LayerUtils, Toast } from '../../../../../../utils'
import { ConstToolType, TouchType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'

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
      height: ConstToolType.HEIGHT[4],
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
    _params.setToolbarVisible(true, ConstToolType.MAP_MARKS_DRAW, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
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
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYLINE)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function freeline() {
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
      height: ConstToolType.HEIGHT[4],
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
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
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
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWPLOYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}
function commit(type) {
  const _params = ToolbarModule.getParams()
  if (type === ConstToolType.MAP_MARKS_DRAW) {
    let currentLayer = _params.currentLayer
    SMap.setTaggingGrid(
      currentLayer.datasetName,
      _params.user.currentUser.userName,
    )
    SMap.submit()
    SMap.refreshMap()
    //提交标注后 需要刷新属性表
    GLOBAL.NEEDREFRESHTABLE = true
  }
}

function back() {
  const _params = ToolbarModule.getParams()
  SMap.setAction(Action.PAN)
  _params.setToolbarVisible(true, ConstToolType.MAP_MARKS, {
    isFullScreen: true,
  })
}

export default {
  commit,

  back,
  point,
  words,
  pointline,
  freeline,
  pointcover,
  freecover,
}
