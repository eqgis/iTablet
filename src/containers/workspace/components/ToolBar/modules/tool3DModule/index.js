import Tool3DData from './Tool3DData'
import Tool3DAction from './Tool3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class Tool3DModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    const _data = await Tool3DData.getData(this.type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType: ToolbarType.table,
      isFullScreen: true,
      ...data,
      ..._data,
    })
  }
}

export default function() {
  return new Tool3DModule({
    type: ConstToolType.SM_MAP3D_TOOL,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.TOOLS,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_tools,
    getData: Tool3DData.getData,
    actions: Tool3DAction,
  })
}
