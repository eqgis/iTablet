import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import StartAction from './StartAction'
import CoworkInfo from '../../../../../tabs/Friend/Cowork/CoworkInfo'

function getData(type, params) {
  ToolbarModule.setParams(params)
  let data = []
  const buttons = []
  switch (type) {
    case ConstToolType.SM_MAP_START:
      data = [
        {
          key: constants.OPEN,
          title: getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
          action: StartAction.openMap,
          size: 'large',
          image: getThemeAssets().start.icon_open_map,
        },
        {
          key: constants.CREATE,
          title: getLanguage(global.language).Map_Main_Menu.START_NEW_MAP,
          size: 'large',
          action: () => StartAction.isNeedToSave(StartAction.create),
          image: getThemeAssets().start.icon_new_map,
        },
        {
          key: constants.HISTORY,
          title: getLanguage(global.language).Map_Main_Menu.START_RECENT,
          size: 'large',
          action: StartAction.showHistory,
          image: getThemeAssets().start.icon_historical_records,
        },
        {
          key: constants.SAVE,
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_MAP,
          size: 'large',
          action: () => StartAction.saveMap('TempMap'),
          image: getThemeAssets().start.icon_save,
        },
        {
          key: constants.SAVE_AS,
          title: getLanguage(global.language).Map_Main_Menu.START_SAVE_AS_MAP,
          size: 'large',
          action: StartAction.saveMapAs,
          image: getThemeAssets().start.icon_save_as,
        },
      ]
      if (global.coworkMode && CoworkInfo.coworkId !== '') {
        data = [
          {
            key: constants.SAVE,
            title: getLanguage(global.language).Map_Main_Menu.START_SAVE_MAP,
            size: 'large',
            action: () => StartAction.saveMap('TempMap'),
            image: getThemeAssets().start.icon_save,
          },
        ]
      }
      break
  }
  return { data, buttons }
}

export default {
  getData,
}
