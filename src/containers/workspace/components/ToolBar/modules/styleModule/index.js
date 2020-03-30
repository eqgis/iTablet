import StyleAction from './StyleAction'
import StyleData from './StyleData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'

function action(type) {
  const params = ToolbarModule.getParams()
  setModuleData(type)
  let _type,
    _params = {}
  if (params.currentLayer.themeType <= 0 && !params.currentLayer.isHeatmap) {
    if (params.currentLayer.type === 83) {
      _type = ConstToolType.GRID_STYLE
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
      _type = ConstToolType.MAP_STYLE
      _params = {
        containerType: ToolbarType.symbol,
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      }
    } else if (params.currentLayer.type === 7) {
      _type = ConstToolType.MAP_STYLE
      _params = {
        containerType: ToolbarType.list,
        isFullScreen: true,
        column: 4,
        height: 0,
        showMenuDialog: true,
      }
    } else {
      NavigationService.navigate('LayerManager')
      Toast.show(
        getLanguage(params.language).Prompt.THE_CURRENT_LAYER_CANNOT_BE_STYLED,
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

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: StyleData.getData,
    actions: StyleAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_style.png'),
    getData: StyleData.getData,
    getMenuData: StyleData.getMenuData,
    actions: StyleAction,
    setModuleData,
  }
}
