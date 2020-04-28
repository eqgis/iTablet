import { SMap, Action } from 'imobile_for_reactnative'
import PlotData from './PlotData'
import PlotAction from './PlotAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class PlotModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async type => {
    const params = ToolbarModule.getParams()
    let _data = PlotData.getData(type, params)
    let containerType, data
    this.setModuleData(type)
    switch (type) {
      case ConstToolType.PLOTTING:
        if (!GLOBAL.isInitSymbolPlotsEnd) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.MAP_LOADING)
          return
        }
        containerType = ToolbarType.tabs
        data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
        params.showFullMap && params.showFullMap(true)
        params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
          isFullScreen: true,
          containerType,
          ...data,
        })
        break
      case ConstToolType.PLOTTING_ANIMATION:
        params.showFullMap && params.showFullMap(true)
        params.setToolbarVisible(true, ConstToolType.PLOT_ANIMATION_START, {
          isFullScreen: false,
          height: 0,
          cb: () => SMap.setAction(Action.SELECT),
        })
        break
    }
  }
}

export default function(type) {
  let image, title
  if (type === ConstToolType.PLOTTING_ANIMATION) {
    title = getLanguage(GLOBAL.language).Map_Main_Menu.PLOTTING_ANIMATION
    image = require('../../../../../../assets/function/icon_function_theme_param.png')
  } else {
    title = getLanguage(GLOBAL.language).Map_Main_Menu.PLOT
    image = require('../../../../../../assets/function/icon_function_symbol.png')
  }
  return new PlotModule({
    type: type,
    key: title,
    title: title,
    size: 'large',
    image: image,
    getData: PlotData.getData,
    actions: PlotAction,
  })
}
