import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import constants from '../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import EditAction from './EditAction'

/**
 * 获取编辑操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type) {
  let data = []
  let buttons = []
  if (typeof type === 'string' && type.indexOf(ConstToolType.SM_MAP_EDIT) === -1) {
    return { data, buttons }
  }
  switch (type) {
    case ConstToolType.SM_MAP_EDIT_POINT:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: EditAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: EditAction.remove,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => EditAction.undo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => EditAction.redo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      break
    case ConstToolType.SM_MAP_EDIT_LINE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: EditAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: EditAction.remove,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: EditAction.undo,
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: EditAction.redo,
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          action: EditAction.editNode,
          size: 'large',
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          action: EditAction.deleteNode,
          size: 'large',
          image: getThemeAssets().edit.icon_delete_node,
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          action: EditAction.addNode,
          size: 'large',
          image: getThemeAssets().edit.icon_add_node,
        },
      ]
      break
    case ConstToolType.SM_MAP_EDIT_REGION:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: EditAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          size: 'large',
          action: EditAction.remove,
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: EditAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: EditAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: EditAction.editNode,
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          size: 'large',
          action: EditAction.deleteNode,
          image: getThemeAssets().edit.icon_delete_node,
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          size: 'large',
          action: EditAction.addNode,
          image: getThemeAssets().edit.icon_add_node,
        },
      ]
      //协作时暂不支持以下操作
      if(!global.coworkMode) {
        data.push(
          {
            key: constants.ERASE_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_ERASE,
            size: 'large',
            action: EditAction.eraseRegion,
            image: getThemeAssets().edit.icon_erase_noodles,
          },
          {
            key: constants.SPLIT_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_SPLIT,
            size: 'large',
            action: EditAction.splitRegion,
            image: getThemeAssets().edit.icon_cutting,
          },
          {
            key: constants.MERGE,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_UNION,
            size: 'large',
            action: EditAction.merge,
            image: getThemeAssets().edit.icon_merge,
          },
          {
            key: constants.DRAWREGION_ERASE_REGION,
            title: getLanguage(global.language).Map_Main_Menu.FREE_DRAW_ERASE,
            size: 'large',
            action: EditAction.drawRegionEraseRegion,
            image: getThemeAssets().edit.icon_erase_spot,
          },
          {
            key: constants.DRAWREGION_HOLLOW_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_DRAW_HOLLOW,
            size: 'large',
            action: EditAction.drawRegionHollowRegion,
            image: getThemeAssets().edit.icon_hand_painted_Island_cave,
          },
          {
            key: constants.FILL_HOLLOW_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_FILL_HOLLOW,
            size: 'large',
            action: EditAction.fillHollowRegion,
            image: getThemeAssets().edit.icon_filling_Island_hole,
          },
          {
            key: constants.PATCH_HOLLOW_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_PATCH_HOLLOW,
            size: 'large',
            action: EditAction.patchHollowRegion,
            image: getThemeAssets().edit.icon_supplement_Island_cave,
          },
        )
      }
      break
    case ConstToolType.SM_MAP_EDIT_TEXT:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: EditAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: EditAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => EditAction.undo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => EditAction.redo(type),
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      break
    case ConstToolType.SM_MAP_EDIT_PLOT:
      data = [
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: EditAction.editNode,
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: EditAction.remove,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: EditAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: EditAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      break
  }
  if (type === ConstToolType.SM_MAP_EDIT) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else if (type === ConstToolType.SM_MAP_EDIT_TAGGING) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else if (type === ConstToolType.SM_MAP_EDIT_TAGGING_SETTING) {
    buttons = [
      ToolbarBtnType.TAGGING_BACK,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else {
    buttons = [
      ToolbarBtnType.TOOLBAR_BACK,
      ToolbarBtnType.FLEX,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  }
  return { data, buttons }
}

export default {
  getData,
}
