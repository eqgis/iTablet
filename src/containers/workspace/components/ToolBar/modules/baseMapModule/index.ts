/**
 * 添加
 */
import BaseMapData from './BaseMapData'
import BaseMapAction from './BaseMapAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import CoworkInfo from '../../../../../tabs/Friend/Cowork/CoworkInfo'
import { Toast } from '../../../../../../utils'
import { getThemeAssets } from '../../../../../../assets'

class BaseMap extends FunctionModule {
  constructor(props: any) {
    super(props)
  }

  setModuleData = async (type: string, data?: any) => {
    let _data = data
    if (!_data) {
      _data = await BaseMapData.getData(type)
    }
    ToolbarModule.setData({
      type,
      getData: BaseMapData.getData,
      data: _data,
      actions: BaseMapAction,
    })
  }

  action = async () => {
    if (global.coworkMode && CoworkInfo.coworkId !== '') {
      Toast.show(getLanguage(global.language).Friends.ONLINECOWORK_DISABLE_ADD)
      return
    }
    this.setModuleData(this.type)
    const params: any = ToolbarModule.getParams()
    const _data = await BaseMapData.getData(params)
    const containerType = ToolbarType.list
    const data = ToolbarModule.getToolbarSize(containerType, {})
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      isTouchProgress: false,
      showMenuDialog: false,
      ...data,
      ..._data,
    })
  }
}

export default function() {
  return new BaseMap({
    type: ConstToolType.SM_MAP_BASE_CHANGE,
    title: getLanguage(global.language).Map_Main_Menu.OPEN,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_add,
    getData: BaseMapData.getData,
    actions: BaseMapAction,
  })
}
