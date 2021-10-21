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
import { SMediaCollector } from 'imobile_for_reactnative'

async function getData(type, params) {
  let data = []
  let buttons = []
  ToolbarModule.setParams(params)
  const event = ToolbarModule.getData().event
  let layerType = '', isTourLayer = false
  switch (type) {
    case ConstToolType.SM_MAP_MARKS_DRAW:
      buttons = [
        {
          type: ToolbarBtnType.CANCEL,
          action: MarkAction.back,
        },
        {
          type: constants.UNDO,
          action: MarkAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          type: constants.REDO,
          action: MarkAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
        {
          type: ToolbarBtnType.SHOW_ATTRIBUTE,
          action: MarkAction.showAttribute,
          image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_DRAW_TEXT:
      buttons = [
        {
          type: ToolbarBtnType.CANCEL,
          action: MarkAction.back,
        },
        {
          type: ToolbarBtnType.SHOW_ATTRIBUTE,
          action: MarkAction.showAttribute1,
          image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
        },
      ]
      break
    case ConstToolType.SM_MAP_MARKS: {
      layerType = LayerUtils.getLayerType(
        ToolbarModule.getParams().currentLayer,
      )
      isTourLayer = await SMediaCollector.isTourLayer(ToolbarModule.getParams().currentLayer.name)
      const datasetDescription = LayerUtils.getDatasetDescriptionByLayer(ToolbarModule.getParams().currentLayer)
      data = [
        {
          key: constants.POINT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.TOOLS_CREATE_POINT,
          action: MarkAction.point,
          disable:
            (layerType !== 'TAGGINGLAYER' &&
              layerType !== 'CADLAYER' &&
              layerType !== 'POINTLAYER') ||
            isTourLayer ||
            ToolbarModule.getParams().currentLayer.isHeatmap,
          size: 'large',
          image:
            (layerType !== 'TAGGINGLAYER' &&
              layerType !== 'CADLAYER' &&
              layerType !== 'POINTLAYER') ||
            isTourLayer ||
            ToolbarModule.getParams().currentLayer.isHeatmap
              ? getThemeAssets().mark.icon_mark_manage_ash
              : getThemeAssets().mark.icon_mark_manage,
          selectedImage: getThemeAssets().mark.icon_mark_manage,
        },
        {
          key: constants.WORDS,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          size: 'large',
          action: MarkAction.words,
          disable:
            datasetDescription?.type === 'onlineService' || // 数据服务图层不支持文字
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'TEXTLAYER' ||
            isTourLayer,
          image:
            datasetDescription?.type === 'onlineService' || // 数据服务图层不支持文字
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'TEXTLAYER' ||
            isTourLayer
              ? getThemeAssets().mark.icon_text_ash
              : getThemeAssets().mark.icon_text,
          selectedImage: getThemeAssets().mark.icon_text,
        },
        {
          key: constants.POINTLINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.DOT_LINE,
          size: 'large',
          action: MarkAction.pointline,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER' ||
            isTourLayer,
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER' ||
            isTourLayer
              ? getThemeAssets().mark.icon_dotted_lines_ash
              : getThemeAssets().mark.icon_dotted_lines,
          selectedImage: getThemeAssets().mark.icon_dotted_lines,
        },
        {
          key: constants.FREELINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.FREE_LINE,
          size: 'large',
          action: MarkAction.freeline,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER' ||
            isTourLayer,
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'LINELAYER' ||
            isTourLayer
              ? getThemeAssets().mark.icon_free_line_ash
              : getThemeAssets().mark.icon_free_line,
          selectedImage: getThemeAssets().mark.icon_free_line,
        },
        {
          key: constants.POINTCOVER,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.DOT_REGION,
          size: 'large',
          action: MarkAction.pointcover,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER' ||
            isTourLayer,
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER' ||
            isTourLayer
              ? getThemeAssets().mark.icon_frame_ash
              : getThemeAssets().mark.icon_frame,
          selectedImage: getThemeAssets().mark.icon_frame,
        },
        {
          key: constants.FREECOVER,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.FREE_REGION,
          size: 'large',
          action: MarkAction.freecover,
          disable:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER' ||
            isTourLayer,
          image:
            layerType !== 'TAGGINGLAYER' &&
            layerType !== 'CADLAYER' &&
            layerType !== 'REGIONLAYER' ||
            isTourLayer
              ? getThemeAssets().mark.icon_free_region_ash
              : getThemeAssets().mark.icon_free_region,
          selectedImage: getThemeAssets().mark.icon_free_region,
        },
        {
          key: 'showEditLabel',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.OBJ_EDIT,
          action: MarkAction.showEditLabel,
          size: 'large',
          image: getThemeAssets().mark.icon_edit,
        },
      ]
      break
    }
    case ConstToolType.SM_MAP_MARKS_TAGGING_SELECT:
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_POINT:
      // isTourLayer = await SMediaCollector.isTourLayer(ToolbarModule.getParams().currentLayer.name)
      isTourLayer = await SMediaCollector.isTourLayer(event?.layerInfo?.name)
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        // {
        //   key: 'tagging_style',
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_EDIT,
        //   action: MarkAction.selectLabelToStyle,
        //   size: 'large',
        //   image: require('../../../../../../assets/function/icon_function_style.png'),
        // },
      ]
      // if (!LayerUtils.isMediaData(event?.fieldInfo)) {
      if (!isTourLayer) {
        data = data.concat([
          {
            key: constants.UNDO,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
            action: () => MarkAction.undo(type),
            size: 'large',
            image: getThemeAssets().edit.icon_undo,
          },
          {
            key: constants.REDO,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
            action: () => MarkAction.redo(type),
            size: 'large',
            image: getThemeAssets().edit.icon_redo,
          },
          {
            key: 'tagging_style',
            title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_EDIT,
            action: MarkAction.selectLabelToStyle,
            size: 'large',
            image: require('../../../../../../assets/function/icon_function_style.png'),
          },
        ])
      }
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_LINE:
      // isTourLayer = await SMediaCollector.isTourLayer(ToolbarModule.getParams().currentLayer.name)
      isTourLayer = await SMediaCollector.isTourLayer(event?.layerInfo?.name)
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
          selectMode: 'flash',
        },
        // {
        //   key: 'tagging_style',
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_EDIT,
        //   action: MarkAction.selectLabelToStyle,
        //   size: 'large',
        //   image: require('../../../../../../assets/function/icon_function_style.png'),
        // },
      ]
      // if (!LayerUtils.isMediaData(event?.fieldInfo)&&!isTourLayer) {
      if (!isTourLayer) {
        data = data.concat([
          {
            key: constants.UNDO,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
            action: MarkAction.undo,
            size: 'large',
            image: getThemeAssets().edit.icon_undo,
            selectMode: 'flash',
          },
          {
            key: constants.REDO,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
            action: MarkAction.redo,
            size: 'large',
            image: getThemeAssets().edit.icon_redo,
            selectMode: 'flash',
          },
          {
            key: constants.EDIT_NODE,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_NODES,
            action: MarkAction.editNode,
            size: 'large',
            image: getThemeAssets().edit.icon_edit_node,
          },
          {
            key: constants.DELETE_NODE,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE_NODES,
            action: MarkAction.deleteNode,
            size: 'large',
            image: getThemeAssets().edit.icon_delete_node,
          },
          {
            key: constants.ADD_NODE,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_ADD_NODES,
            action: MarkAction.addNode,
            size: 'large',
            image: getThemeAssets().edit.icon_add_node,
          },
          {
            key: 'tagging_style',
            title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_EDIT,
            action: MarkAction.selectLabelToStyle,
            size: 'large',
            image: require('../../../../../../assets/function/icon_function_style.png'),
          },
        ])
      }
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_REGION:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          // constants.DELETE,
          size: 'large',
          action: MarkAction.deleteLabel,
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: MarkAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: MarkAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: MarkAction.editNode,
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE_NODES,
          size: 'large',
          action: MarkAction.deleteNode,
          image: getThemeAssets().edit.icon_delete_node,
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_ADD_NODES,
          // constants.ADD_NODE,
          size: 'large',
          action: MarkAction.addNode,
          image: getThemeAssets().edit.icon_add_node,
        },
        {
          key: 'tagging_style',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_EDIT,
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
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_PLOT:
      // isTourLayer = await SMediaCollector.isTourLayer(ToolbarModule.getParams().currentLayer.name)
      isTourLayer = await SMediaCollector.isTourLayer(event?.layerInfo?.name)
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: MarkAction.undo,
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: MarkAction.redo,
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_NODES,
          action: MarkAction.editNode,
          size: 'large',
          image: getThemeAssets().edit.icon_edit_node,
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_TEXT:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => MarkAction.undo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: 'redo',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => MarkAction.redo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: 'tagging_style',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_EDIT,
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
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_POINT_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => MarkAction.undo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: 'redo',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => MarkAction.redo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_LINE_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: MarkAction.undo,
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: MarkAction.redo,
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_NODES,
          action: MarkAction.editNode,
          size: 'large',
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE_NODES,
          action: MarkAction.deleteNode,
          size: 'large',
          image: getThemeAssets().edit.icon_delete_node,
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_ADD_NODES,
          action: MarkAction.addNode,
          size: 'large',
          image: getThemeAssets().edit.icon_add_node,
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_REGION_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          //constants.DELETE,
          size: 'large',
          action: MarkAction.deleteLabel,
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: MarkAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: MarkAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: MarkAction.editNode,
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE_NODES,
          size: 'large',
          action: MarkAction.deleteNode,
          image: getThemeAssets().edit.icon_delete_node,
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_ADD_NODES,
          //constants.ADD_NODE,
          size: 'large',
          action: MarkAction.addNode,
          image: getThemeAssets().edit.icon_add_node,
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_EDIT_TEXT_NOSTYLE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MOVE,
          action: MarkAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
          action: MarkAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => MarkAction.undo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: 'redo',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => MarkAction.redo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_SIZE:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_ROTATION:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_TRANSPARENCY:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE_WIDTH:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDER_WIDTH:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_TRANSPARENCY:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT_SIZE:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_ROTATION:
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.MENU,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT:
      data = [
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_BOLD,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BOLD,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_bold.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_bold.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_ITALIC,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_ITALIC,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_italic.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_italic.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_UNDERLINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_UNDERLINE,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_underline.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_underline.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_STRIKEOUT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_STRIKEOUT,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_SHADOW,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_SHADOW,
          action: MarkAction.setTaggingTextFont,
          size: 'large',
          image: require('../../../../../../assets/mapTools/style_font_shadow.png'),
          selectedImage: require('../../../../../../assets/mapTools/style_font_shadow.png'),
        },
        {
          key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_OUTLINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_OUTLINE,
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
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_COLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_COLOR_SET:
      data = colors
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.MENU,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_FORECOLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDERCOLOR_SET:
      data = colorsWithNull
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.MENU,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE:
      buttons = [ToolbarBtnType.CANCEL]
      break
  }
  return { data, buttons }
}

function getMenuData(type) {
  const _params = ToolbarModule.getParams()
  let data = []
  switch (type) {
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_COLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_SIZE:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_ROTATION:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT_TRANSPARENCY:
      data = point(_params.language, _params.device.orientation)
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE_WIDTH:
      data = line(_params.language, _params.device.orientation)
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_FORECOLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDERCOLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDER_WIDTH:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION_TRANSPARENCY:
      data = region(_params.language, _params.device.orientation)
      break
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_COLOR_SET:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT_SIZE:
    case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_TEXT_ROTATION:
      data = text(_params.language, _params.device.orientation)
      break
  }
  return data
}
export default {
  getData,
  getMenuData,
}
