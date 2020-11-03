import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
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
        // {
        //   key: constants.NAVIGATION,
        //   title: constants.NAVIGATION,
        //   action: naviWorkSpace,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_open_black.png'),
        // },
        {
          key: constants.OPEN,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.START_OPEN_MAP,
          // constants.OPEN,
          action: StartAction.openMap,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_open_black.png'),
        },
        {
          key: constants.CREATE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.START_NEW_MAP,
          // constants.CREATE,
          size: 'large',
          action: () => StartAction.isNeedToSave(StartAction.create),
          image: require('../../../../../../assets/mapTools/icon_create_black.png'),
        },
        {
          key: constants.HISTORY,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.START_RECENT,
          // constants.HISTORY,
          size: 'large',
          action: StartAction.showHistory,
          image: require('../../../../../../assets/mapTools/icon_history_black.png'),
        },
        // {
        //   key: constants.BASE_MAP,
        //   title: constants.BASE_MAP,
        //   size: 'large',
        //   action: changeBaseLayer,
        //   image: require('../../../../assets/mapTools/icon_base.png'),
        // },
        // {
        //   key: constants.ADD,
        //   title: constants.ADD,
        //   size: 'large',
        //   action: add,
        //   image: require('../../../../assets/mapTools/icon_add_white.png'),
        // },
        {
          key: constants.SAVE,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_MAP,
          // constants.SAVE,
          size: 'large',
          // TODO 保存地图
          action: () => StartAction.saveMap('TempMap'),
          image: require('../../../../../../assets/mapTools/icon_save_black.png'),
        },
        {
          key: constants.SAVE_AS,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_AS_MAP,
          // constants.SAVE_AS,
          size: 'large',
          action: StartAction.saveMapAs,
          image: require('../../../../../../assets/mapTools/icon_save_as_black.png'),
        },
      ]
      if (GLOBAL.coworkMode && CoworkInfo.coworkId !== '') {
        data = [
          {
            key: constants.SAVE,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_MAP,
            // constants.SAVE,
            size: 'large',
            // TODO 保存地图
            action: () => StartAction.saveMap('TempMap'),
            image: require('../../../../../../assets/mapTools/icon_save_black.png'),
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
