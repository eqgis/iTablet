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
import { arMapStyleData } from '@/Toolbar/modules'

class ArStyleModule extends FunctionModule {
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
    if (!_params.arlayer.currentLayer) {
      Toast.show(getLanguage(_params.language).Prompt.CHOOSE_LAYER)
      NavigationService.navigate('ARLayerManager')
      return
    }
    if (
      _params.arlayer.currentLayer.type !== ARLayerType.AR_MEDIA_LAYER ||
      _params.arlayer.currentLayer.type === ARLayerType.EFFECT_LAYER
    ) {
      // 除了 poi 和 特效图层， 其他由新的 toobar 处理
      arMapStyleData.action()
      return
    }
    this.setModuleData(this.type)
    _params.showFullMap && _params.showFullMap(true)

    if (_params.arlayer.currentLayer.type === ARLayerType.EFFECT_LAYER) {
      _params.setToolbarVisible(true, ConstToolType.SM_AR_STYLE_EFFECT, {
        containerType: ToolbarType.tableTabs,
        isFullScreen: false,
      })
      return
    }

    const layerStyle = await SARMap.getLayerStyle(_params.arlayer.currentLayer.name)
    ToolbarModule.addData({currentARElementStyle: layerStyle})

    const _data = await ARStyleData.getData(this.type, _params)
    _params.setToolbarVisible(true, this.type, {
      isFullScreen: true,
      showMenuDialog: true,
      buttons: _data.buttons,
    })

    SARMap.clearSelection()
    // SARMap.setAction(ARAction.SELECT)
  }
}

export default function() {
  return new ArStyleModule({
    type: ConstToolType.SM_AR_STYLE,
    title: getLanguage(global.language).Map_Main_Menu.STYLE,
    size: 'large',
    image: getThemeAssets().mine.my_color,
    getData: ARStyleData.getData,
    getMenuData: ARStyleData.getMenuData,
    actions: ARStyleAction,
  })
}
