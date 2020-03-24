/**
 * 分析
 */
import AnalysisData from './AnalysisData'
import AnalysisAction from './AnalysisAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import utils from './utils'

export async function action(type) {
  const params = ToolbarModule.getParams()
  const orientation = params.device.orientation
  const layout = utils.getLayout(type, orientation)
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    isFullScreen: true,
    height: layout.height,
    column: layout.column,
  })
}

function setModuleData (type) {
  ToolbarModule.setData({
    type: type,
    getData: AnalysisData.getData,
    // data: _data,
    actions: AnalysisAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title: title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: getThemeAssets().functionBar.rightbar_analysis,
    getData: AnalysisData.getData,
    // actions: AnalysisAction,
    getLayout: utils.getLayout,
    setModuleData: setModuleData,
  }
}
