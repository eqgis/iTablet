/**
 * 分析
 */
import AnalysisData from './AnalysisData'
import AnalysisAction from './AnalysisAction'
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
    const params = ToolbarModule.getParams()
    const _data = AnalysisData.getData(this.type)
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
}

export default function() {
  return new AnalysisModule({
    type: ConstToolType.SM_MAP_ANALYSIS,
    title: getLanguage(global.language).Map_Main_Menu.ANALYSIS,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_analysis,
    getData: AnalysisData.getData,
    actions: AnalysisAction,
  })
}
