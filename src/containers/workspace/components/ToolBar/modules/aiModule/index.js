/**
 * AI助手
 */
import AiData from './AiData'
import AiActions from './AiActions'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class AIModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = AiData.getData()
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
    })
  }
}

export default function() {
  return new AIModule({
    type: ConstToolType.MAP_AR_AI_ASSISTANT,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT,
    size: 'large',
    image: getThemeAssets().ar.icon_ai_assistant,
    getData: AiData.getData,
    actions: AiActions,
  })
}
