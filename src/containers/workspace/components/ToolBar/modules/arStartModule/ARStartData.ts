import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ARStartAction from './ARStartAction'
import CoworkInfo from '../../../../../tabs/Friend/Cowork/CoworkInfo'
import { DATA_ITEM } from '../types'


function getData(type: string, params: any) {
  ToolbarModule.setParams(params)
  let data: DATA_ITEM[] = []
  const buttons: string[] = []
  switch (type) {
    case ConstToolType.SM_AR_START:
      data = [
        {
          key: constants.OPEN,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.START_OPEN_MAP,
          action: ARStartAction.openMap,
          size: 'large',
          image: getThemeAssets().start.icon_open_map,
        },
        // {
        //   key: constants.CREATE,
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu.START_NEW_MAP,
        //   size: 'large',
        //   action: () => ARStartAction.isNeedToSave(ARStartAction.create),
        //   image: getThemeAssets().start.icon_new_map,
        // },
        // {
        //   key: constants.HISTORY,
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu.START_RECENT,
        //   size: 'large',
        //   action: ARStartAction.showHistory,
        //   image: getThemeAssets().start.icon_historical_records,
        // },
        {
          key: constants.SAVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_MAP,
          size: 'large',
          action: () => ARStartAction.saveMap(),
          image: getThemeAssets().start.icon_save,
        },
        // {
        //   key: constants.SAVE_AS,
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_AS_MAP,
        //   size: 'large',
        //   action: ARStartAction.saveMapAs,
        //   image: getThemeAssets().start.icon_save_as,
        // },
        {
          key: constants.CLOSE,
          title: getLanguage(GLOBAL.language).ARMap.CLOSE_MAP,
          size: 'large',
          action: () => ARStartAction.isNeedToSave(ARStartAction.closeMap),
          image: getThemeAssets().publicAssets.icon_cancel,
        },
      ]
      break
  }
  return { data, buttons }
}

export default {
  getData,
}
