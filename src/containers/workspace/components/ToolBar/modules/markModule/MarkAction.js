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
import NavigationService from '../../../../../NavigationService'

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
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
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
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
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
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
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
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWLINE)
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
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
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
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
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
  if (type === ConstToolType.MAP_TOOL_TAGGING) {
    ;(async function() {
      const { currentLayer } = _params
      // let reg = /^Label_(.*)#$/
      let layerType
      if (currentLayer && !currentLayer.themeType) {
        layerType = LayerUtils.getLayerType(currentLayer)
      }
      // if (
      //   isTaggingLayer||
      //   isPointLayer ||
      //   isLineLayer ||
      //   isRegionLayer ||
      //   isTextLayer
      // ) {
      layerType === 'TAGGINGLAYER' &&
        SMap.setTaggingGrid(
          currentLayer.datasetName,
          _params.user.currentUser.userName,
        )
      SMap.submit()
      SMap.refreshMap()
      SMap.setAction(Action.PAN)
      if (type === ConstToolType.MAP_TOOL_TAGGING) {
        _params.setToolbarVisible(
          true,
          ConstToolType.MAP_TOOL_TAGGING_SETTING,
          {
            isFullScreen: false,
            containerType: 'list',
            height:
              _params.device.orientation === 'LANDSCAPE'
                ? ConstToolType.TOOLBAR_HEIGHT[3]
                : ConstToolType.TOOLBAR_HEIGHT[3],
            column: _params.device.orientation === 'LANDSCAPE' ? 8 : 4,
          },
        )
      }
      // } else {
      //   Toast.show(
      //     getLanguage(_params.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
      //   )
      // }
    })()
  } else if (type === ConstToolType.MAP_TOOL_TAGGING_SETTING) {
    const datasourceName = GLOBAL.currentLayer.datasourceAlias
    const { datasetName } = GLOBAL.currentLayer
    const name = ToolbarModule.getData().tools_name || ''
    const remark = ToolbarModule.getData().tools_remarks || ''
    const address = ToolbarModule.getData().tools_http || ''
    ;(async function() {
      name !== '' &&
        (await SMap.addRecordset(
          datasourceName,
          datasetName,
          'name',
          name,
          _params.user.currentUser.userName,
        ))
      remark !== '' &&
        (await SMap.addRecordset(
          datasourceName,
          datasetName,
          'remark',
          remark,
          _params.user.currentUser.userName,
        ))
      address !== '' &&
        (await SMap.addRecordset(
          datasourceName,
          datasetName,
          'address',
          address,
          _params.user.currentUser.userName,
        ))
    })()
    // getParams.taggingBack()
    _params.setToolbarVisible(false, type, {
      height: 0,
    })
    ToolbarModule.setData()
    // 提交标注后 需要刷新属性表
    GLOBAL.NEEDREFRESHTABLE = true
  }
}
export default {
  commit,

  point,
  words,
  pointline,
  freeline,
  pointcover,
  freecover,
}
