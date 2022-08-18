import StartData from './ARStartData'
import StartAction from './ARStartAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import { AppToolBar } from "@/utils"
import { SARMap } from "imobile_for_reactnative"
import { Platform } from 'react-native'

class StartModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {

    const preElement = AppToolBar.getData().selectARElement
    if(preElement && Platform.OS === 'android') {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])

    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = StartData.getData(this.type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
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
  return new StartModule({
    type: ConstToolType.SM_AR_START,
    title: getLanguage(global.language).Map_Main_Menu.START,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_start,
    getData: StartData.getData,
    actions: StartAction,
  })
}
