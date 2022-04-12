import ARStyleData from './ARStyleData'
import ARStyleAction from './ARStyleAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { Toast } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import FunctionModule from '../../../../../../class/FunctionModule'
import { SARMap, ARLayerType } from 'imobile_for_reactnative'

class ArNaviModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = (containerType, orientation, additional) => {
    let data = {}
    switch (additional.type) {
      case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
      case ConstToolType.SM_AR_STYLE_TEXT_COLOR:
      case ConstToolType.SM_AR_STYLE_BACKGROUND_COLOR:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 4
        break
      case ConstToolType.SM_AR_STYLE_TRANSFROM:
      case ConstToolType.SM_AR_STYLE_BORDER_WIDTH:
      case ConstToolType.SM_AR_STYLE_TEXT_OPACITY:
      case ConstToolType.SM_AR_STYLE_TEXT_SIZE:
      case ConstToolType.SM_AR_STYLE_BACKGROUND_OPACITY:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3 / 2
        break
      case ConstToolType.SM_AR_STYLE_EFFECT:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 5 / 2
        break
      default:
        data.height = 0
        break
    }
    return data
  }

  action = async () => {
    const _params = ToolbarModule.getParams()

    _params.showArNavi && _params.showArNavi(true)
    _params.showFullMap && _params.showFullMap(true)
    // if (!_params.arlayer.currentLayer) {
    //   Toast.show(getLanguage(_params.language).Prompt.CHOOSE_LAYER)
    //   NavigationService.navigate('ARLayerManager')
    //   return
    // }
    // if (
    //   _params.arlayer.currentLayer.type === ARLayerType.AR_SCENE_LAYER ||
    //   _params.arlayer.currentLayer.type === ARLayerType.AR_MODEL_LAYER
    // ) {
    //   Toast.show(getLanguage(_params.language).ARMap.AR_LAYER_NOT_SUPPORT_STYLE)
    //   return
    // }
    // this.setModuleData(this.type)
    // _params.showFullMap && _params.showFullMap(true)

    // if (_params.arlayer.currentLayer.type === ARLayerType.EFFECT_LAYER) {
    //   _params.setToolbarVisible(true, ConstToolType.SM_AR_STYLE_EFFECT, {
    //     containerType: ToolbarType.tableTabs,
    //     isFullScreen: false,
    //   })
    //   return
    // }

    // const _data = await ARStyleData.getData(this.type, _params)
    // _params.setToolbarVisible(true, this.type, {
    //   isFullScreen: true,
    //   showMenuDialog: true,
    //   buttons: _data.buttons,
    // })

    // SARMap.clearSelection()
    // SARMap.setAction(ARAction.SELECT)
  }
}

export default function() {
  return new ArNaviModule({
    type: ConstToolType.SM_AR_NAVI,
    title: getLanguage(global.language).Map_Label.NAVIGATION,
    size: 'large',
    image: getThemeAssets().mine.ar_navigation,
    getData: ARStyleData.getData,
    getMenuData: ARStyleData.getMenuData,
    actions: ARStyleAction,
  })
}
