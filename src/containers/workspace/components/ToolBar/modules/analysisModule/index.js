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

class AnalysisModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = () => {
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

  //eslint-disable-next-line
  getToolbarSize = (type, orientation, additional) => {
    const _data = ToolbarModule.getData()
    let data = {}
    if (_data.type === ConstToolType.MAP_ANALYSIS) {
      data.height =
        ConstToolType.TOOLBAR_HEIGHT[0] *
        (orientation.indexOf('LANDSCAPE') === 0 ? 6 : 8)
    }
    return data
  }
}

export default function() {
  return new AnalysisModule({
    type: ConstToolType.MAP_ANALYSIS,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.ANALYSIS,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.ANALYSIS,
    size: 'large',
    image: getThemeAssets().functionBar.rightbar_analysis,
    getData: AnalysisData.getData,
    actions: AnalysisAction,
  })
}
