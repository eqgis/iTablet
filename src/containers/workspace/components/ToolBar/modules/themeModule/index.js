import { SMap } from 'imobile_for_reactnative'
import ThemeAction from './ThemeAction'
import ThemeData from './ThemeData'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'

async function action(type) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  const layout = utils.getLayout(type, orientation)
  params.showFullMap && params.showFullMap(true)
  await setModuleData(type)
  params.setToolbarVisible(true, ConstToolType.MAP_THEME_CREATE, {
    isFullScreen: true,
    column: layout.column,
    height: layout.height,
  })
}

async function setModuleData(type) {
  const xml = await SMap.mapToXml()
  ToolbarModule.setData({
    type,
    getData: ThemeData.getData,
    actions: ThemeAction,
    mapXml: xml,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
    action: () => {
      if (customAction === false) {
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_theme_create.png'),
    getData: ThemeData.getData,
    getMenuData: ThemeData.getMenuData,
    actions: ThemeAction,
    setModuleData,
    getLayout: utils.getLayout,
  }
}
