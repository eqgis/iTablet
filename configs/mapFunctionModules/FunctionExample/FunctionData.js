import { getLanguage } from '../../../src/language'
import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import FunctionAction from './FunctionAction'

function getData(type, params) {
  ToolbarModule.setParams(params)
  let data = [
    {
      key: 'OPEN',
      title: getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
      // constants.OPEN,
      action: FunctionAction.openMap,
      size: 'large',
      image: require('../../../src/assets/mapTools/icon_open_black.png'),
    },
  ]
  const buttons = []

  return { data, buttons }
}

export default {
  getData,
}
