import ARDrawingData from './ARDrawingData'
import ARDrawingAction from './ARDrawingAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import { SARMap } from 'imobile_for_reactnative'

class ArDrawingModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = (containerType, orientation, additional) => {
    let data = {}
    switch (additional.type) {
      case ConstToolType.SM_AR_DRAWING_IMAGE:
      case ConstToolType.SM_AR_DRAWING_VIDEO:
      case ConstToolType.SM_AR_DRAWING_WEB:
      case ConstToolType.SM_AR_DRAWING_SCENE:
      case ConstToolType.SM_AR_DRAWING_MODAL:
        data.height = 0
        break
      case ConstToolType.SM_AR_DRAWING:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 5 / 2
        break
      case ConstToolType.SM_AR_ATTRIBUTE_ALBUM:
      case ConstToolType.SM_AR_VIDEO_ALBUM:
        data.height = ConstToolType.TOOLBAR_HEIGHT[1]
        data.column = 2
        data.row = 1
        break
      default:
        data.height = 0
        break
    }
    return data
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType: ToolbarType.tableTabs,
      isFullScreen: false,
    })

    SARMap.clearSelection()
  }
}

export default function() {
  return new ArDrawingModule({
    type: ConstToolType.SM_AR_DRAWING,
    title: getLanguage(global.language).Map_Main_Menu.OPEN,
    size: 'large',
    // image: getThemeAssets().ar.icon_tool_ardrawing,
    image: getThemeAssets().functionBar.icon_tool_add,
    getData: ARDrawingData.getData,
    getHeaderData: ARDrawingData.getHeaderData,
    getMenuData: ARDrawingData.getMenuData,
    actions: ARDrawingAction,
  })
}
