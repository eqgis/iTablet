/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import { LayerUtils } from '../../../../../../utils'
import MarkAction from './MarkAction'
import constants from '../../../../constants'
import { getThemeAssets } from '../../../../../../assets'

function getData(type, params) {
  let data = []
  let buttons = []
  ToolbarModule.setParams(params)
  GLOBAL.MapToolType = type
  let layerType = ''
  // if (type.indexOf(ConstToolType.MAP_TOOL) === -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_TOOL_TAGGING:
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_TOOL_TAGGING_SETTING:
      data = [
        {
          title: getLanguage(global.language).Map_Label.ATTRIBUTE,
          // '属性记录',
          data: [
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
              // '名称',
              value: '',
              // action: name,
            },
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS,
              // '备注',
              value: '',
              // action: remark,
            },
            // { title: '风格', action: remark },
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP,
              // 'http地址',
              value: '',
              // action: address,
            },
            // { title: '图片', action: address },
          ],
        },
      ]
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS:
      layerType = LayerUtils.getLayerType(
        ToolbarModule.getParams().currentLayer,
      )
      data = [
        {
          key: constants.POINT,
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_CREATE_POINT,
          // constants.POINT,
          action: MarkAction.point,
          disable:
            (layerType !== 'TAGGINGLAYER' &&
              layerType !== 'CADLAYER' &&
              layerType !== 'POINTLAYER') ||
            ToolbarModule.getParams().currentLayer.isHeatmap,
          size: 'large',
          image:
            (layerType !== 'TAGGINGLAYER' &&
              layerType !== 'CADLAYER' &&
              layerType !== 'POINTLAYER') ||
            ToolbarModule.getParams().currentLayer.isHeatmap
              ? getThemeAssets().mapTools.icon_point_disable
              : require('../../../../../../assets/mapTools/icon_point_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_point_black.png'),
        },
        {
          key: constants.WORDS,
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          // constants.WORDS,
          size: 'large',
          action: MarkAction.words,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'TEXTLAYER',
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'TEXTLAYER'
              ? getThemeAssets().mapTools.icon_text_disable
              : require('../../../../../../assets/mapTools/icon_words_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_words_black.png'),
        },
        {
          key: constants.POINTLINE,
          title: getLanguage(global.language).Map_Main_Menu.DOT_LINE,
          // constants.POINTLINE,
          size: 'large',
          action: MarkAction.pointline,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER',
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER'
              ? getThemeAssets().mapTools.icon_point_line_disable
              : require('../../../../../../assets/mapTools/icon_point_line_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_point_line_black.png'),
        },
        {
          key: constants.FREELINE,
          title: getLanguage(global.language).Map_Main_Menu.FREE_LINE,
          // constants.FREELINE,
          size: 'large',
          action: MarkAction.freeline,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER',
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER'
              ? getThemeAssets().mapTools.icon_free_line_disable
              : require('../../../../../../assets/mapTools/icon_free_line_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_free_line_black.png'),
        },
        {
          key: constants.POINTCOVER,
          title: getLanguage(global.language).Map_Main_Menu.DOT_REGION,
          // constants.POINTCOVER,
          size: 'large',
          action: MarkAction.pointcover,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER',
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER'
              ? getThemeAssets().mapTools.icon_region_disable
              : require('../../../../../../assets/mapTools/icon_point_cover_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_point_cover_black.png'),
        },
        {
          key: constants.FREECOVER,
          title: getLanguage(global.language).Map_Main_Menu.FREE_REGION,
          // constants.FREECOVER,
          size: 'large',
          action: MarkAction.freecover,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER',
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER'
              ? getThemeAssets().mapTools.icon_free_region_disable
              : require('../../../../../../assets/mapTools/icon_free_cover_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_free_cover_black.png'),
        },
      ]
      break
  }
  return { data, buttons }
}

export default {
  getData,
}
