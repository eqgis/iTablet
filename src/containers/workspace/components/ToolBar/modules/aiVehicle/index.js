/**
 * AI助手
 */
import AiVehicleData from './AiVehicleData'
import AiVehicleActions from './AiVehicleActions'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class AIVehicleModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    params.showFullMap && params.showFullMap(true)
    AiVehicleActions.illegallyParkCollect()
  }
}

export default function() {
  return new AIVehicleModule({
    type: ConstToolType.SM_MAP_AI_VEHICLE,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.rightbar_ai_violation_light,
    getData: AiVehicleData.getData,
    actions: AiVehicleActions,
    getHeaderData: AiVehicleData.getHeaderData,
    getCustomView: AiVehicleData.getCustomView,
    getBottomView: AiVehicleData.getBottomView,
  })
}
