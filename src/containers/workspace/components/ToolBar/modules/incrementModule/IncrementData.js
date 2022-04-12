/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import React from 'react'
import ToolbarBtnType from "../../ToolbarBtnType"
import { getThemeAssets} from "../../../../../../assets"
import constants from "../../../../constants"
import {getLanguage} from "../../../../../../language"
import {ConstToolType} from "../../../../../../constants"
import IncrementAction from "./IncrementAction"
import {SMap} from 'imobile_for_reactnative'
import LineList from "./customView/LineList"

async function getData(type) {
  let data = []
  let buttons = [
    ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.MENU,
      // image: getThemeAssets().navigation.increment_switch_network,
      image: getThemeAssets().toolbar.icon_list,
      action: IncrementAction.changeNetwork,
    },
    {
      type: ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD,
      image: IncrementAction.getTypeImage(type),
      //toolbarBottomButtons里面默认传了type，此处不传type
      action: () => IncrementAction.changeMethod(),
    },
    {
      type: ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD,
      image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
      //toolbarBottomButtons里面默认传了type，此处不传type
      action: () => IncrementAction.showAttribute(),
    },
    // ToolbarBtnType.MENU_FLEX,
    {
      type: ToolbarBtnType.MAP_SYMBOL,
      // image: getThemeAssets().navigation.btn_increment_topo_edit,
      image: getThemeAssets().mark.icon_edit,
      action: IncrementAction.topoEdit,
    },
  ]
  let customView

  switch (type) {
    case ConstToolType.SM_MAP_INCREMENT_POINTLINE:
    case ConstToolType.SM_MAP_INCREMENT_FREELINE:
      data = [
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: IncrementAction.undo,
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: IncrementAction.redo,
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: constants.MAP_INCREMENT_CANCEL,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_CANCEL,
          action: IncrementAction.cancel,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_cancel,
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: IncrementAction.submit,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_submit,
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      data = [
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: IncrementAction.undo,
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: IncrementAction.redo,
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: constants.MAP_INCREMENT_ADD_POINT,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_ADD_POINT,
          action: IncrementAction.addPoint,
          size: 'large',
          image: getThemeAssets().navigation.increment_add_point,
        },
        {
          key: constants.MAP_INCREMENT_CANCEL,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_CANCEL,
          action: IncrementAction.cancel,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_cancel,
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: IncrementAction.submit,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_submit,
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
      data = [
        {
          key: constants.MAP_INCREMENT_START,
          title: getLanguage(global.language).Map_Main_Menu.MAP_INCREMENT_START,
          action: IncrementAction.start,
          size: 'large',
          image: getThemeAssets().navigation.increment_start,
        },
        {
          key: constants.MAP_INCREMENT_STOP,
          title: getLanguage(global.language).Map_Main_Menu.MAP_INCREMENT_STOP,
          action: IncrementAction.stop,
          size: 'large',
          image: getThemeAssets().navigation.increment_stop,
        },
        {
          key: constants.MAP_INCREMENT_CANCEL,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_CANCEL,
          action: IncrementAction.cancel,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_cancel,
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: IncrementAction.submit,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_submit,
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD:
      data = [
        {
          key: constants.MAP_INCREMENT_GPS_POINT,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_GPS_POINT,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_GPS_POINT,
            ),
          size: 'large',
          image: getThemeAssets().navigation.increment_add_point,
        },
        {
          key: constants.MAP_INCREMENT_GPS_TRACK,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_GPS_TRACK,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_GPS_TRACK,
            ),
          size: 'large',
          image: getThemeAssets().navigation.increment_gps_track,
        },
        {
          key: constants.MAP_INCREMENT_POINTLINE,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_POINTLINE,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_POINTLINE,
            ),
          size: 'large',
          image: getThemeAssets().navigation.increment_pointline,
        },
        {
          key: constants.MAP_INCREMENT_FREELINE,
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_INCREMENT_FREELINE,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_FREELINE,
            ),
          size: 'large',
          image: getThemeAssets().navigation.increment_freeline,
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_CHANGE_NETWORK:
      data = await SMap.getLineDataset()
      //eslint-disable-next-line
      customView = props => <LineList data={data} device={props.device} selectedItem={global.INCREMENT_DATA}/>
      buttons = []
      break
  }
  if(type === ConstToolType.SM_MAP_INCREMENT_EDIT){
    buttons.splice(2,1)
  }
  return {data, buttons, customView}
}
export default {
  getData,
}
