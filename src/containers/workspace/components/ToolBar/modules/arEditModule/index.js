import AREditData from './AREditData'
import AREditAction from './AREditAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import { SARMap, ARAction } from 'imobile_for_reactnative'

class ArEditModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = (containerType, orientation, additional) => {
    let data = {}
    switch (additional.type) {
      case ConstToolType.SM_AR_EDIT_SCALE:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3 / 2
        break
      case ConstToolType.SM_AR_EDIT_POSITION:
      case ConstToolType.SM_AR_EDIT_ROTATION:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3
        break
      case ConstToolType.SM_AR_EDIT:
      default:
        data.height = 0
        break
    }
    return data
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = await AREditData.getData(this.type, params)
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      isFullScreen: false,
      buttons: _data.buttons,
    })

    SARMap.clearSelection()
    SARMap.setAction(ARAction.SELECT)
  }
}

export default function() {
  return new ArEditModule({
    type: ConstToolType.SM_AR_EDIT,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_edit,
    getData: AREditData.getData,
    // getHeaderData: AREditData.getHeaderData,
    getMenuData: AREditData.getMenuData,
    actions: AREditAction,
  })
}
