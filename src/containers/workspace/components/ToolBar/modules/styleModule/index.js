import StyleAction from './StyleAction'
import StyleData from './StyleData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import NavigationService from '../../../../../NavigationService'
import FunctionModule from '../../../../../../class/FunctionModule'

class StyleModule extends FunctionModule {
  constructor(props) {
    super(props)
    this.getMenuData = StyleData.getMenuData
    this.customAction = props && props.action
  }

  action = () => {
    if (this.customAction && typeof this.customAction === 'function') {
      this.customAction()
      return
    }
    const params = ToolbarModule.getParams()
    this.setModuleData(this.type)
    let _type,
      _params = {}
    if (params.currentLayer.themeType <= 0 && !params.currentLayer.isHeatmap) {
      if (params.currentLayer.type === 83) {
        _type = ConstToolType.SM_MAP_STYLE_GRID
        _params = {
          containerType: ToolbarType.list,
          isFullScreen: false,
          height: ConstToolType.HEIGHT[4],
        }
      } else if (
        params.currentLayer.type === 1 ||
        params.currentLayer.type === 3 ||
        params.currentLayer.type === 5
      ) {
        _type = ConstToolType.SM_MAP_STYLE
        _params = {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
        }
      } else if (params.currentLayer.type === 7) {
        _type = ConstToolType.SM_MAP_STYLE
        _params = {
          containerType: ToolbarType.list,
          isFullScreen: true,
          showMenuDialog: true,
        }
      } else {
        NavigationService.navigate('LayerManager')
        Toast.show(
          getLanguage(params.language).Prompt
            .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
        )
        return
      }
      params.showFullMap && params.showFullMap(true)
      params.setToolbarVisible(true, _type, _params)
    } else {
      NavigationService.navigate('LayerManager')
      Toast.show(
        getLanguage(params.language).Prompt.THE_CURRENT_LAYER_CANNOT_BE_STYLED,
      )
    }
  }
}

export default function() {
  return new StyleModule({
    type: ConstToolType.SM_MAP_STYLE,
    title: getLanguage(global.language).Map_Main_Menu.STYLE,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_style,
    getData: StyleData.getData,
    actions: StyleAction,
  })
}
