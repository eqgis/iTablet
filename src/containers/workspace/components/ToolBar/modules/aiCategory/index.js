/**
 * AI助手
 */
import AICategoryData from './AICategoryData'
import AICategoryActions from './AICategoryActions'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import { Toast, LayerUtils } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'

class AICategoryModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    let actionAble = false
    if (params.currentLayer) {
      let layerType = LayerUtils.getLayerType(params.currentLayer)
      actionAble = layerType === 'TAGGINGLAYER' || layerType === 'CADLAYER' || layerType === 'POINTLAYER'
    }
    if (!actionAble) {
      Toast.show(getLanguage(global.language).AI.SUPPORT_POINT_AND_CAD)
      return
    }
    this.setModuleData(this.type)
    // AICategoryActions.init()
    AICategoryActions.aiClassify()
  }
}

export default function() {
  return new AICategoryModule({
    type: ConstToolType.SM_MAP_AI_CATEGORY,
    title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_CLASSIFY,
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.rightbar_ai_classify_light,
    getData: AICategoryData.getData,
    actions: AICategoryActions,
    getHeaderData: AICategoryData.getHeaderData,
    getCustomView: AICategoryData.getCustomView,
    getBottomView: AICategoryData.getBottomView,
  })
}
