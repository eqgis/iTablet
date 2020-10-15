/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
// import React from 'react'
import { ConstToolType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getPublicAssets } from '../../../../../../assets'
import TopoEditAction from './TopoEditAction'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
// import MergeDatasetView from './customView/MergeDatasetView'

async function getData(type) {
  let data = []
  let buttons = [
    ToolbarBtnType.CANCEL,
    // {
    //   type: ToolbarBtnType.MENU,
    //   image: getPublicAssets().navigation.btn_increment_merge_dataset,
    //   action: TopoEditAction.showMerge,
    // },
    {
      type: ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD,
      image: getPublicAssets().navigation.btn_increment_change_type,
      action: TopoEditAction.changeEditType,
    },
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  let customView
  switch (type) {
    case ConstToolType.SM_MAP_TOPO_EDIT:
    case ConstToolType.SM_MAP_TOPO_OBJECT_EDIT:
      break
    case ConstToolType.SM_MAP_TOPO_SWITCH_TYPE:
      data = [
        {
          key: constants.MAP_TOPO_SMOOTH,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_SMOOTH,
          action: TopoEditAction.switchType,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_smooth,
        },
        {
          key: constants.MAP_TOPO_SPLIT_LINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_SPLIT_LINE,
          action: TopoEditAction.switchType,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_line_split_line,
        },
        {
          key: constants.MAP_TOPO_SPLIT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_SPLIT,
          action: TopoEditAction.switchType,
          size: 'large',
          image: getPublicAssets().navigation.icon_incremnent_split,
        },
        {
          key: constants.MAP_TOPO_EXTEND,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_EXTEND,
          action: TopoEditAction.switchType,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_extend,
        },
        {
          key: constants.MAP_TOPO_TRIM,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_TRIM,
          action: TopoEditAction.switchType,
          size: 'large',
          image: getPublicAssets().navigation.icon_incremnent_trim,
        },
        {
          key: constants.MAP_TOPO_RESAMPLE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_RESAMPLE,
          action: TopoEditAction.switchType,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_resample,
        },
        {
          key: constants.MAP_TOPO_CHANGE_DIRECTION,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_TOPO_CHANGE_DIRECTION,
          action: TopoEditAction.switchType,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_change_direction,
        },
        {
          key: constants.MAP_TOPO_OBJECT_EDIT,
          title: getLanguage(global.language).Map_Main_Menu.OBJ_EDIT,
          action: TopoEditAction.switchType,
          size: 'large',
          image: require('../../../../../../assets/function/icon_edit.png'),
        },
      ]
      break
    case ConstToolType.SM_MAP_TOPO_OBJECT_EDIT_SELECTED:
      data = [
        {
          key: constants.MAP_TOPO_MOVE_OBJECT,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: TopoEditAction.changeAction,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.MAP_TOPO_DELETE_OBJECT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_TOPO_DELETE_OBJECT,
          action: TopoEditAction.changeAction,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_delete_object,
        },
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: TopoEditAction.undo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: TopoEditAction.redo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: constants.MAP_TOPO_ADD_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_ADD_NODE,
          action: TopoEditAction.changeAction,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_add_node,
        },
        {
          key: constants.MAP_TOPO_EDIT_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_TOPO_EDIT_NODE,
          action: TopoEditAction.changeAction,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_edit_node,
        },
        {
          key: constants.MAP_TOPO_DELETE_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_TOPO_DELETE_NODE,
          action: TopoEditAction.changeAction,
          size: 'large',
          image: getPublicAssets().navigation.icon_increment_delete_node,
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: TopoEditAction.submit,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      break
    // case ConstToolType.SM_MAP_TOPO_MERGE_DATASET:
    //   {
    //     data = []
    //     buttons = []
    //     customView = () => <MergeDatasetView />
    //   }
    //   break
    case ConstToolType.SM_MAP_TOPO_SPLIT_LINE:
    case ConstToolType.SM_MAP_TOPO_EXTEND_LINE:
    case ConstToolType.SM_MAP_TOPO_TRIM_LINE:
      data = [
        {
          key: constants.CANCEL_SELECT,
          title: getLanguage(global.language).Prompt.CANCEL,
          // constants.CANCEL_SELECT,
          action: TopoEditAction.editCancel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_cancel_1.png'),
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: TopoEditAction.editConfirm,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      break
  }
  return { data, buttons, customView }
}

export default {
  getData,
}
