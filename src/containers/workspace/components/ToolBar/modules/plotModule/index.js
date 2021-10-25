import { SMap, Action, DatasetType } from 'imobile_for_reactnative'
import PlotData from './PlotData'
import PlotAction from './PlotAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { Toast } from '../../../../../../utils'
import FunctionModule from '../../../../../../class/FunctionModule'
import NavigationService from '../../../../../NavigationService'

class PlotModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    if (params.currentLayer?.type !== DatasetType.CAD) {
      NavigationService.navigate('LayerManager')
      Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_SELECT_CAD_LAYER)
      return
    }
    let _data = PlotData.getData(this.type, params)
    let containerType, data
    this.setModuleData(this.type)
    switch (this.type) {
      case ConstToolType.SM_MAP_PLOT:
        containerType = ToolbarType.tabs
        data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
        params.showFullMap && params.showFullMap(true)
        params.setToolbarVisible(true, ConstToolType.SM_MAP_COLLECTION_SYMBOL, {
          isFullScreen: true,
          containerType,
          ...data,
        })
        break
      case ConstToolType.SM_MAP_PLOT_ANIMATION:
        params.showFullMap && params.showFullMap(true)
        params.setToolbarVisible(true, ConstToolType.SM_MAP_PLOT_ANIMATION_START, {
          isFullScreen: false,
          cb: () => SMap.setAction(Action.SELECT),
        })
        break
    }
  }

  //eslint-disable-next-line
  getToolbarSize = (type, orientation, additional) => {
    // const _data = ToolbarModule.getData()
    let data = {}
    if (
      type === ToolbarType.animationNode &&
      (additional && additional.data && additional.data.length === 1)
    ) {
      data.height =
        ConstToolType.TOOLBAR_HEIGHT[0] *
        (orientation.indexOf('LANDSCAPE') === 0 ? 6 : 8)
    }
    return data
  }
}

export default function(type) {
  let image, title
  if (type === ConstToolType.SM_MAP_PLOT_ANIMATION) {
    title = getLanguage(GLOBAL.language).Map_Main_Menu.PLOTTING_ANIMATION
    image = getThemeAssets().functionBar.icon_tool_deduction
  } else {
    type = ConstToolType.SM_MAP_PLOT
    title = getLanguage(GLOBAL.language).Map_Main_Menu.PLOT
    image = getThemeAssets().functionBar.icon_tool_plotting
  }
  return new PlotModule({
    type: type,
    title: title,
    size: 'large',
    image: image,
    getData: PlotData.getData,
    actions: PlotAction,
  })
}
