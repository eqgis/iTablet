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
import { colors, colorsWithNull, line, point, region, text } from './data'

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
    case ConstToolType.MAP_MARKS_TAGGING_SELECT:
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_POINT:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => MarkAction.undo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => MarkAction.redo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: 'tagging_style',
          title: getLanguage(global.language).Map_Main_Menu.STYLE_EDIT,
          action: MarkAction.selectLabelToStyle,
          size: 'large',
          image: require('../../../../../../assets/function/icon_function_style.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_LINE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: MarkAction.undo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: MarkAction.redo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          action: MarkAction.editNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          action: MarkAction.deleteNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          action: MarkAction.addNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_add_node_black.png'),
        },
        {
          key: 'tagging_style',
          title: getLanguage(global.language).Map_Main_Menu.STYLE_EDIT,
          action: MarkAction.selectLabelToStyle,
          size: 'large',
          image: require('../../../../../../assets/function/icon_function_style.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_REGION:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          // constants.DELETE,
          size: 'large',
          action: MarkAction.deleteLabel,
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: MarkAction.undo,
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: MarkAction.redo,
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: MarkAction.editNode,
          image: require('../../../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          size: 'large',
          action: MarkAction.deleteNode,
          image: require('../../../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          // constants.ADD_NODE,
          size: 'large',
          action: MarkAction.addNode,
          image: require('../../../../../../assets/mapTools/icon_add_node_black.png'),
        },
        {
          key: 'tagging_style',
          title: getLanguage(global.language).Map_Main_Menu.STYLE_EDIT,
          action: MarkAction.selectLabelToStyle,
          size: 'large',
          image: require('../../../../../../assets/function/icon_function_style.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_TEXT:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => MarkAction.undo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => MarkAction.redo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: 'tagging_style',
          title: getLanguage(global.language).Map_Main_Menu.STYLE_EDIT,
          action: MarkAction.selectLabelToStyle,
          size: 'large',
          image: require('../../../../../../assets/function/icon_function_style.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_POINT_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => MarkAction.undo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => MarkAction.redo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_LINE_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: MarkAction.undo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: MarkAction.redo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          action: MarkAction.editNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          action: MarkAction.deleteNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          action: MarkAction.addNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_add_node_black.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_REGION_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          //constants.DELETE,
          size: 'large',
          action: MarkAction.deleteLabel,
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: MarkAction.undo,
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: MarkAction.redo,
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: MarkAction.editNode,
          image: require('../../../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          size: 'large',
          action: MarkAction.deleteNode,
          image: require('../../../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          //constants.ADD_NODE,
          size: 'large',
          action: MarkAction.addNode,
          image: require('../../../../../../assets/mapTools/icon_add_node_black.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_EDIT_TEXT_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => MarkAction.undo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => MarkAction.redo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_SIZE:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_ROTATION:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_TRANSPARENCY:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_LINE:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_LINE_WIDTH:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_BORDER_WIDTH:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_TRANSPARENCY:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_FONT_SIZE:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_ROTATION:
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.MENU,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_FONT:
      data = [
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_BOLD,
          title: getLanguage(global.language).Map_Main_Menu.STYLE_BOLD,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_bold.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_bold.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_ITALIC,
          title: getLanguage(global.language).Map_Main_Menu.STYLE_ITALIC,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_italic.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_italic.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_UNDERLINE,
          title: getLanguage(global.language).Map_Main_Menu.STYLE_UNDERLINE,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_underline.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_underline.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_STRIKEOUT,
          title: getLanguage(global.language).Map_Main_Menu.STYLE_STRIKEOUT,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_SHADOW,
          title: getLanguage(global.language).Map_Main_Menu.STYLE_SHADOW,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_shadow.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_shadow.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_OUTLINE,
          title: getLanguage(global.language).Map_Main_Menu.STYLE_OUTLINE,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_outline.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_outline.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.MENU,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_COLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_COLOR_SET:
      data = colors
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.MENU,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_FORECOLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_BORDERCOLOR_SET:
      data = colorsWithNull
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.MENU,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  return { data, buttons }
}
function getMenuData(type) {
  const _params = ToolbarModule.getParams()
  let data = []
  switch (type) {
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_COLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_SIZE:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_ROTATION:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_POINT_TRANSPARENCY:
      data = point(_params.language, _params.device.orientation)
      break
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_LINE:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_LINE_WIDTH:
      data = line(_params.language, _params.device.orientation)
      break
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_FORECOLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_BORDERCOLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_BORDER_WIDTH:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_REGION_TRANSPARENCY:
      data = region(_params.language, _params.device.orientation)
      break
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_FONT:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_COLOR_SET:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_FONT_SIZE:
    case ConstToolType.MAP_MARKS_TAGGING_STYLE_TEXT_ROTATION:
      data = text(_params.language, _params.device.orientation)
      break
  }
  return data
}
export default {
  getData,
  getMenuData,
}
