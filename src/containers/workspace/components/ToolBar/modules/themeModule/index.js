import { SMap } from 'imobile_for_reactnative'
import ThemeAction from './ThemeAction'
import ThemeData from './ThemeData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'

async function action(type) {
  const params = ToolbarModule.getParams()
  const _type = ConstToolType.MAP_THEME_CREATE
  const _data = ThemeData.getData(_type, params)
  const containerType = ToolbarType.table
  const data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
  params.showFullMap && params.showFullMap(true)
  await setModuleData(type)
  params.setToolbarVisible(true, _type, {
    containerType,
    isFullScreen: true,
    ...data,
    data: _data.data,
    buttons: _data.buttons,
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
        return
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
  }
}
