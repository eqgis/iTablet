import ToolAction from './ToolAction'
import ToolData from './ToolData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class ToolModule extends FunctionModule {
  constructor(props) {
    super(props)
    this.getMenuData = ToolData.getMenuData
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    const _data = ToolData.getData(this.type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, ConstToolType.MAP_TOOLS, {
      containerType,
      isFullScreen: true,
      ...data,
      ..._data,
    })
    // 重置canUndo和canRedo
    if (params.toolbarStatus.canUndo || params.toolbarStatus.canRedo) {
      params.setToolbarStatus({
        canUndo: false,
        canRedo: false,
      })
    }
  }
}

export default function() {
  return new ToolModule({
    type: ConstToolType.MAP_TOOLS,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.TOOLS,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.TOOLS,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_tools,
    getData: ToolData.getData,
    actions: ToolAction,
  })
}
