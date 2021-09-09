/**
 * AI助手
 */
import AICategoryData from './AICategoryData'
import AICategoryActions from './AICategoryActions'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class AICategoryModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    // AICategoryActions.init()
    AICategoryActions.aiClassify()
  }
}

export default function() {
  return new AICategoryModule({
    type: ConstToolType.SM_MAP_AI_CATEGORY,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_CLASSIFY,
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.rightbar_ai_classify_light,
    getData: AICategoryData.getData,
    actions: AICategoryActions,
    getHeaderData: AICategoryData.getHeaderData,
    getCustomView: AICategoryData.getCustomView,
    getBottomView: AICategoryData.getBottomView,
  })
}
