/**
 * AI助手
 */
import AiData from './AiData'
import AiActions from './AiActions'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import utils from './utils'

export async function action(type) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  const data = utils.getLayout(type, orientation)
  setModuleData(type, data)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_AR_AI_ASSISTANT, {
    containerType: 'table',
    isFullScreen: true,
    height: data.height,
    column: data.column,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: AiData.getData,
    actions: AiActions,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
    action: () => {
      if (customAction === false) {
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: getThemeAssets().ar.icon_ai_assistant,
    getData: AiData.getData,
    // actions: AnalysisAction,
    getLayout: utils.getLayout,
    setModuleData,
  }
}
