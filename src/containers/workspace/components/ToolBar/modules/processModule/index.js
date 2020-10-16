/**
 * 处理
 */
import ProcessData from './ProcessData'
import ProcessAction from './ProcessAction'
import ToolbarModule from '../ToolbarModule'
import { getThemeAssets } from '../../../../../../assets'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import { SMap } from 'imobile_for_reactnative'
import { Platform } from 'react-native'
import { Toast } from '../../../../../../utils'

class AnalysisModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    if (this.type === ConstToolType.SM_MAP_PROCESS && Platform.OS === 'android') {
      let sdk = await SMap.getPhoneSDK()
      if (sdk <= 24) {
        Toast.show(
          getLanguage(global.language).Map_Main_Menu.MAP_AR_DONT_SUPPORT_DEVICE,
        )
        return true
      }
    }
    const params = ToolbarModule.getParams()
    const _data = ProcessData.getData(this.type)
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
      data: _data.data,
      buttons: _data.buttons,
    })
  }

  //eslint-disable-next-line
  getToolbarSize = (type, orientation, additional) => {
    const _data = ToolbarModule.getData()
    let data = {}
    if (
      _data.type === ConstToolType.SM_MAP_PROCESS &&
      !(additional && additional.data && additional.data.length > 0)
    ) {
      data.height =
        ConstToolType.TOOLBAR_HEIGHT[0] *
        (orientation.indexOf('LANDSCAPE') === 0 ? 6 : 5)
    }
    return data
  }
}

export default function() {
  return new AnalysisModule({
    type: ConstToolType.SM_MAP_PROCESS,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.PROCESS,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_handle,
    getData: ProcessData.getData,
    actions: ProcessAction,
  })
}
