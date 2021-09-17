/**
 * AI助手
 */
import AiCollectionData from './AiCollectionData'
import AiCollectionActions from './AiCollectionActions'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import { Toast, LayerUtils } from '../../../../../../utils'

class AICollectionModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    let actionAble = false
    if (params.currentLayer) {
      let layerType = LayerUtils.getLayerType(params.currentLayer)
      actionAble = layerType === 'TAGGINGLAYER' || layerType === 'CAD' || layerType === 'POINTLAYER'
    }
    if (!actionAble) {
      Toast.show(getLanguage(GLOBAL.language).AI.SUPPORT_POINT_AND_CAD)
      return
    }
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    AiCollectionActions.aiDetect()
  }
}

export default function() {
  return new AICollectionModule({
    type: ConstToolType.SM_MAP_AI_ANALYSIS,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.rightbar_ai_collect_light,
    getData: AiCollectionData.getData,
    actions: AiCollectionActions,
    getHeaderData: AiCollectionData.getHeaderData,
    getCustomView: AiCollectionData.getCustomView,
    getBottomView: AiCollectionData.getBottomView,
  })
}
