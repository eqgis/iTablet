import { SMap, Action } from 'imobile_for_reactnative'
import PlotData from './PlotData'
import PlotAction from './PlotAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolBarHeight from '../ToolBarHeight'

export async function action(type) {
  const params = ToolbarModule.getParams()
  let _data = PlotData.getData(type, params)
  let containerType, data
  setModuleData(type)
  switch (type) {
    case ConstToolType.PLOTTING:
      if (!GLOBAL.isInitSymbolPlotsEnd) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.MAP_LOADING)
        return
      }
      containerType = ToolbarType.tabs
      data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
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

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: PlotData.getData,
    actions: PlotAction,
  })
}

export default function(type, title, customAction) {
  let image
  if (type === ConstToolType.PLOTTING_ANIMATION) {
    image = require('../../../../../../assets/function/icon_function_theme_param.png')
  } else {
    image = require('../../../../../../assets/function/icon_function_symbol.png')
  }
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
    image,
    getData: PlotData.getData,
    actions: PlotAction,
    setModuleData,
  }
}
