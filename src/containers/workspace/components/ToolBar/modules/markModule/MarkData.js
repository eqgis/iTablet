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
// import EditAction from '../editModule/EditAction'
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
    case ConstToolType.MAP_MARKS_DRAW:
      buttons = [
        {
          type: ToolbarBtnType.CANCEL,
          action: MarkAction.back,
        },
        {
          type: constants.UNDO,
          action: MarkAction.undo,
          image: require('../../../../../../assets/mapTools/icon_undo_white.png'),
        },
        {
          type: constants.REDO,
          action: MarkAction.redo,
          image: require('../../../../../../assets/mapTools/icon_recover_white.png'),
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_DRAW_TEXT:
      buttons = [
        {
          type: ToolbarBtnType.CANCEL,
          action: MarkAction.back,
        },
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
        // {
        //   key: constants.MOVE,
        //   title: getLanguage(global.language).Map_Main_Menu.OBJMOVE,
        //   action: MarkAction.move,
        //   size: 'large',
        //   image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        // },
        {
          key: 'showEditLabel',
          title: getLanguage(global.language).Map_Main_Menu.OBJ_EDIT,
          action: MarkAction.showEditLabel,
          size: 'large',
          image: require('../../../../../../assets/function/icon_edit.png'),
        },
      ]
      break
  }
  return { data, buttons }
}

export default {
  getData,
}
