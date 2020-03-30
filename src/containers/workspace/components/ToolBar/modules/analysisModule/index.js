/**
 * 分析
 */
import AnalysisData from './AnalysisData'
import AnalysisAction from './AnalysisAction'
import ToolbarModule from '../ToolbarModule'
import { getThemeAssets } from '../../../../../../assets'
import { ToolbarType } from '../../../../../../constants'
import ToolBarHeight from '../ToolBarHeight'

export async function action(type) {
  const params = ToolbarModule.getParams()
  const _data = AnalysisData.getData(type)
  const containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: true,
    height: data.height,
    column: data.column,
    data: _data.data,
    buttons: _data.buttons,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: AnalysisData.getData,
    // data: _data,
    actions: AnalysisAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
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
    setModuleData,
  }
}
