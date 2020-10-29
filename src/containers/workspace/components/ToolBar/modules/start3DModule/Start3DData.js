import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import Start3DAction from './Start3DAction'

function getData(type, params) {
  ToolbarModule.setParams(params)
  let data = []
  const buttons = []
  if (type !== ConstToolType.SM_MAP3D_START) return { data, buttons }
  data = [
    // {
    //   key: constants.CREATE,
    //   title: '导入场景',
    //   size: 'large',
    //   action: () => {
    //     if (!ToolbarModule.getParams().setToolbarVisible) return
    //     // ToolbarModule.getParams().setToolbarVisible(false)
    //     // NavigationService.navigate('WorkspaceFileList', { type: 'MAP_3D' })
    //     ToolbarModule.getParams().setToolbarVisible(
    //       true,
    //       ConstToolType.SM_MAP3D_IMPORTWORKSPACE,
    //       {
    //         containerType: 'list',
    //       },
    //     )
    //   },
    //   image: require('../../../../assets/mapTools/icon_create.png'),
    // },
    {
      key: constants.OPEN,
      title: getLanguage(global.language).Map_Main_Menu.START_OPEN_SENCE,
      // '打开场景',
      action: Start3DAction.getSceneData,
      size: 'large',
      image: require('../../../../../../assets/mapTools/icon_open_black.png'),
    },
    // {
    //   key: constants.BASE_MAP,
    //   title: constants.BASE_MAP,
    //   size: 'large',
    //   action: () => {
    //     changeBaseLayer('MAP_3D')
    //   },
    //   image: require('../../../../assets/mapTools/icon_base_black.png'),
    // },
  ]
  return { data, buttons }
}

export default {
  getData,
}
