import { SMap } from 'imobile_for_reactnative'
import ThemeAction from './ThemeAction'
import ThemeData from './ThemeData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class ThemeModule extends FunctionModule {
  constructor(props) {
    super(props)
    this.getMenuData = ThemeData.getMenuData
  }

  setModuleData = async type => {
    const xml = await SMap.mapToXml()
    ToolbarModule.setData({
      type,
      getData: ThemeData.getData,
      actions: ThemeAction,
      mapXml: xml,
    })
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    const _type = ConstToolType.MAP_THEME_CREATE
    const _data = ThemeData.getData(_type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    await this.setModuleData(this.type)
    params.setToolbarVisible(true, _type, {
      containerType,
      isFullScreen: true,
      ...data,
      data: _data.data,
      buttons: _data.buttons,
    })
  }
}

export default function() {
  return new ThemeModule({
    type: ConstToolType.MAP_THEME,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.THEME,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.THEME,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_thematic,
    getData: ThemeData.getData,
    getMenuData: ThemeData.getMenuData,
    actions: ThemeAction,
  })
}
