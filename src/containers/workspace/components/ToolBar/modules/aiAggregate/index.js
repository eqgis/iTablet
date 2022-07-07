/**
 * AI助手
 */
import AiAggregateData from './AiAggregateData'
import AiAggregateActions from './AiAggregateActions'
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
      actionAble = layerType === 'TAGGINGLAYER' || layerType === 'CADLAYER' || layerType === 'POINTLAYER'
    }
    if (!actionAble) {
      Toast.show(getLanguage(global.language).AI.SUPPORT_POINT_AND_CAD)
      return
    }
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    AiAggregateActions.polymerizeCollect()
  }
}

export default function() {
  return new AICollectionModule({
    type: ConstToolType.SM_MAP_AI_AGGREGATE,
    title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.rightbar_ai_aggregate_collect_light,
    getData: AiAggregateData.getData,
    actions: AiAggregateActions,
    getHeaderData: AiAggregateData.getHeaderData,
    getCustomView: AiAggregateData.getCustomView,
    getBottomView: AiAggregateData.getBottomView,
  })
}
