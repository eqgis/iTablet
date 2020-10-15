import ARMappingAction from './ARMappingAction'
import ARMappingData from './ARMappingData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'

class arMapping extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = ARMappingData.getData()
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      data: _data.data,
      ...data,
    })
  }
}

export default function() {
  return new arMapping({
    type: ConstToolType.SM_MAP_AR_MAPPING,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_MAPPING,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_ar_mapping,
    getData: ARMappingData.getData,
    actions: ARMappingAction,
  })
}
