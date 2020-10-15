import { SMap, Action } from 'imobile_for_reactnative'
import PlotData from './PlotData'
import PlotAction from './PlotAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class PlotModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    let _data = PlotData.getData(this.type, params)
    let containerType, data
    this.setModuleData(this.type)
    switch (this.type) {
      case ConstToolType.SM_MAP_PLOT:
        if (!GLOBAL.isInitSymbolPlotsEnd) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.MAP_LOADING)
          return
        }
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
