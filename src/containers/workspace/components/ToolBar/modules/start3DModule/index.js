import Star3DtData from './Start3DData'
import Start3DAction from './Start3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class Start3DModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    const _data = Star3DtData.getData(this.type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      ...data,
      ..._data,
    })
  }
}

export default function() {
  return new Start3DModule({
    type: ConstToolType.SM_MAP3D_START,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.START,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_start,
    getData: Star3DtData.getData,
    actions: Start3DAction,
  })
}
