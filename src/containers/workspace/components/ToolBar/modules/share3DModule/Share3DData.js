/**
 * 获取地图分享数据
 */
import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import Share3DAction from './Share3DAction'

function getData(type, params) {
  let data = []
  const buttons = []
  ToolbarModule.setParams(params)
  if (type !== ConstToolType.MAP_SHARE_MAP3D) return { data, buttons }
  data = [
    {
      key: constants.SUPERMAP_ONLINE,
      title: constants.SUPERMAP_ONLINE,
      action: () => Share3DAction.show3DSaveDialog(constants.SUPERMAP_ONLINE),
      size: 'large',
      image: getThemeAssets().share.online,
    },
    {
      key: constants.SUPERMAP_IPORTAL,
      title: constants.SUPERMAP_IPORTAL,
      action: () => Share3DAction.show3DSaveDialog(constants.SUPERMAP_IPORTAL),
      size: 'large',
      image: getThemeAssets().share.iportal,
    },
  ]

  return { data, buttons }
}

export default {
  getData,
}
