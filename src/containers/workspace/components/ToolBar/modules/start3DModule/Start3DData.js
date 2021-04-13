import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import Start3DAction from './Start3DAction'

function getData(type, params) {
  ToolbarModule.setParams(params)
  let data = []
  const buttons = []
  if (type !== ConstToolType.SM_MAP3D_START) return { data, buttons }
  data = [
    {
      key: constants.OPEN,
      title: getLanguage(GLOBAL.language).Map_Main_Menu.START_OPEN_SENCE,
      // '打开场景',
      action: Start3DAction.getSceneData,
      size: 'large',
      image: getThemeAssets().start.icon_open_scene,
    },
  ]
  return { data, buttons }
}

export default {
  getData,
}
