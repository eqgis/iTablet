/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import React from 'react'
import ToolbarBtnType from "../../ToolbarBtnType"
import {getPublicAssets} from "../../../../../../assets"
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
      image: getPublicAssets().navigation.increment_switch_network,
      action: IncrementAction.changeNetwork,
    },
    {
      type: ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD,
      image: IncrementAction.getTypeImage(type),
      //toolbarBottomButtons里面默认传了type，此处不传type
      action: () => IncrementAction.changeMethod(),
    },
    ToolbarBtnType.MENU_FLEX,
    {
      type: ToolbarBtnType.MAP_SYMBOL,
      image: getPublicAssets().navigation.btn_increment_topo_edit,
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
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: IncrementAction.undo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: IncrementAction.redo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: constants.MAP_INCREMENT_CANCEL,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_CANCEL,
          action: IncrementAction.cancel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_close_black.png'),
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: IncrementAction.submit,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_POINT:
      data = [
        {
          key: constants.UNDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_UNDO,
          action: IncrementAction.undo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION_REDO,
          action: IncrementAction.redo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: constants.MAP_INCREMENT_ADD_POINT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_ADD_POINT,
          action: IncrementAction.addPoint,
          size: 'large',
          image: getPublicAssets().navigation.increment_add_point,
        },
        {
          key: constants.MAP_INCREMENT_CANCEL,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_CANCEL,
          action: IncrementAction.cancel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_close_black.png'),
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: IncrementAction.submit,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
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
          key: constants.MAP_INCREMENT_CANCEL,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_CANCEL,
          action: IncrementAction.cancel,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_close_black.png'),
        },
        {
          key: constants.MAP_INCREMENT_COMMIT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_COMMIT,
          action: IncrementAction.submit,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD:
      data = [
        {
          key: constants.MAP_INCREMENT_GPS_POINT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_GPS_POINT,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_GPS_POINT,
            ),
          size: 'large',
          image: getPublicAssets().navigation.increment_add_point,
        },
        {
          key: constants.MAP_INCREMENT_GPS_TRACK,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_GPS_TRACK,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_GPS_TRACK,
            ),
          size: 'large',
          image: getPublicAssets().navigation.increment_gps_track,
        },
        {
          key: constants.MAP_INCREMENT_POINTLINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_POINTLINE,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_POINTLINE,
            ),
          size: 'large',
          image: getPublicAssets().navigation.increment_pointline,
        },
        {
          key: constants.MAP_INCREMENT_FREELINE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_INCREMENT_FREELINE,
          action: () =>
            IncrementAction.methodSelected(
              ConstToolType.SM_MAP_INCREMENT_FREELINE,
            ),
          size: 'large',
          image: getPublicAssets().navigation.increment_freeline,
        },
      ]
      break
    case ConstToolType.SM_MAP_INCREMENT_CHANGE_NETWORK:
      data = await SMap.getLineDataset()
      //eslint-disable-next-line
      customView = props => <LineList data={data} device={props.device} selectedItem={GLOBAL.INCREMENT_DATA}/>
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
