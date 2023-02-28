/**
 * 编辑
 */
import { SMap } from 'imobile_for_reactnative'
import EditData from './EditData'
import EditAction from './EditAction'
import ToolbarModule from '../ToolbarModule'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import { getThemeAssets } from '../../../../../../assets'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'
import { Action } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'

class EditModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = EditData.getData(this.type)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: false,
      ...data,
      cb: () => SMap.setAction(Action.SELECT),
    })
    Toast.show(getLanguage(params.language).Prompt.PLEASE_SELECT_OBJECT)
  }
}

export default function() {
  return new EditModule({
    type: ConstToolType.SM_MAP_EDIT,
    title: getLanguage(global.language).Map_Main_Menu.EDIT,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_edit,
    getData: EditData.getData,
    actions: EditAction,
  })
}
