
import { SSceneAR ,EngineType} from 'imobile_for_reactnative'
import { ConstToolType} from '../../../constants'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'
import { Toast } from '../../../utils'
import { getLanguage } from '../../../language'


let ToolbarModule = getToolbarModule('AR')
/**
 * containerType为list时，listAction为列表行点击事件
 * @param type
 * @param params {item, section, index}
 * @returns {Promise.<void>}
 */
async function listAction(type, params = {}) {
    if(type === ConstToolType.SM_ARSCENEMODULE_CHANGE)
    {
        await SSceneAR.setSceneLayer(params.item.name)
        GLOBAL.ARContainer.setHeaderVisible(true)
        ToolbarModule.getParams().setToolbarVisible(
          true,
          ConstToolType.SM_ARSCENEMODULE,
        )
        Toast.show(getLanguage(GLOBAL.language).Prompt.SWITCHING_SUCCESS)
    } else {
        await SSceneAR.changeWorkSpace(params.item.path,params.item.name)
        // let Type
        //   if(GLOBAL.isSceneOpen){
        //     Type = ConstToolType.SM_ARSCENEMODULE
        //   }else{
        //     Type = ConstToolType.SM_ARSCENEMODULE_NOMAL
        //   }
        GLOBAL.ARContainer.setHeaderVisible(true)
        ToolbarModule.getParams().setToolbarVisible(
          true,
          ConstToolType.SM_ARSCENEMODULE_NOMAL,
        )
        Toast.show(getLanguage(GLOBAL.language).Prompt.SWITCHING_SUCCESS)
    }
    
}


const actions = {
    listAction,
  }
  export default actions