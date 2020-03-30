/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import ToolbarBtnType from "../../ToolbarBtnType"
import {getPublicAssets} from "../../../../../../assets"
import constants from "../../../../constants"
import {getLanguage} from "../../../../../../language"
import {ConstToolType} from "../../../../../../constants"
import IncrementAction from "./IncrementAction"

function getData(type) {
  let data = []

  switch(type) {
    case ConstToolType.MAP_INCREMENT_OUTTER:
      data = [
        {
          key: constants.MAP_INCREMENT_START,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_START,
          action: IncrementAction.start,
          size: 'large',
          image: getPublicAssets().navigation.increment_start,
        },
        {
          key: constants.MAP_INCREMENT_STOP,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_STOP,
          action: IncrementAction.stop,
          size: 'large',
          image: getPublicAssets().navigation.increment_stop,
        },
        {
          key: constants.MAP_INCREMENT_ADD_POINT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_ADD_POINT,
          action: IncrementAction.addPoint,
          size: 'large',
          image: getPublicAssets().navigation.increment_add_point,
        },
        {
          key: constants.MAP_INCREMENT_CANCEL,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_CANCEL,
          // constants.CANCEL,
          action: IncrementAction.cancel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_close_black.png'),
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_COMMIT,
          //constants.SUBMIT,
          action: IncrementAction.submit,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      break
    case ConstToolType.MAP_INCREMENT_CHANGE_METHOD:
      data = [
        {
          key: constants.MAP_INCREMENT_GPS_POINT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_GPS_POINT,
          action: () => IncrementAction.methodSelected(constants.MAP_INCREMENT_GPS_POINT),
          size: 'large',
          image: getPublicAssets().navigation.increment_add_point,
        },
        {
          key: constants.MAP_INCREMENT_GPS_TRACK,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_GPS_TRACK,
          action: () => IncrementAction.methodSelected(constants.MAP_INCREMENT_GPS_TRACK),
          size: 'large',
          image: getPublicAssets().navigation.increment_gps_track,
        },
        {
          key: constants.MAP_INCREMENT_POINTLINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_POINTLINE,
          action: () => IncrementAction.methodSelected(constants.MAP_INCREMENT_POINTLINE),
          size: 'large',
          image: getPublicAssets().navigation.increment_pointline,
        },
        {
          key: constants.MAP_INCREMENT_FREELINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_FREELINE,
          action: () => IncrementAction.methodSelected(constants.MAP_INCREMENT_FREELINE),
          size: 'large',
          image: getPublicAssets().navigation.increment_freeline,
        },
      ]
      break
    case ConstToolType.MAP_INCREMENT_EDIT:
      data = [
        {
          key: constants.MAP_INCREMENT_ADD_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_ADD_NODE,
          action: IncrementAction.addNode,
          size: 'large',
          image: getPublicAssets().navigation.increment_add_node,
        },
        {
          key: constants.MAP_INCREMENT_EDIT_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_EDIT_NODE,
          action: IncrementAction.editNode,
          size: 'large',
          image: getPublicAssets().navigation.increment_edit_node,
        },
        {
          key: constants.MAP_INCREMENT_DELETE_NODE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_DELETE_NODE,
          action: IncrementAction.deleteNode,
          size: 'large',
          image: getPublicAssets().navigation.increment_delete_node,
        },
        {
          key: constants.MAP_INCREMENT_DELETE_OBJECT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_DELETE_OBJECT,
          // constants.CANCEL,
          action: IncrementAction.deleteObject,
          size: 'large',
          image: getPublicAssets().navigation.increment_delete_object,
        },
        {
          key: constants.MAP_INCREMENT_ADD_ATTRIBUTE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_INCREMENT_ADD_ATTRIBUTE,
          //constants.SUBMIT,
          action: IncrementAction.addAttribute,
          size: 'large',
          image: getPublicAssets().navigation.increment_add_attribute,
        },
      ]
      break
  }
  const buttons = [
    ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.MENU,
      image: getPublicAssets().navigation.increment_switch_network,
      action: IncrementAction.changeNetwork,
    },
    {
      type: ToolbarBtnType.MENU_FLEX,
      image: require('../../../../../../assets/mapEdit/icon_function_theme_param_style.png'),
      action: IncrementAction.changeMethod,
    },
    ToolbarBtnType.MENU_FLEX,
    {
      type: ToolbarBtnType.MAP_SYMBOL,
      image: require('../../../../../../assets/mapEdit/icon_function_symbol.png'),
      // action: IncrementAction.showSymbol,
    },
  ]
  return {data, buttons}
}
export default {
  getData,
}