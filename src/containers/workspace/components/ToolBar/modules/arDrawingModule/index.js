import React from 'react'
import ARDrawingData from './ARDrawingData'
import ARDrawingAction from './ARDrawingAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import Tabs from '../../../Tabs'
import { SARMap, ARAction } from 'imobile_for_reactnative'

class ArDrawingModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = (containerType, orientation, additional) => {
    let data = {}
    switch (additional.type) {
      case ConstToolType.SM_AR_DRAWING_IMAGE:
      case ConstToolType.SM_AR_DRAWING_VIDEO:
      case ConstToolType.SM_AR_DRAWING_WEB:
        data.height = 0
        break
      case ConstToolType.SM_AR_DRAWING_EDIT:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0]
        break
      case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 4
        break
      case ConstToolType.SM_AR_DRAWING:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 5 / 2
        break
      case ConstToolType.SM_AR_DRAWING_STYLE_TRANSFROM:
      case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_WIDTH:
      case ConstToolType.SM_AR_DRAWING_STYLE_SCALE:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3 / 2
        break
      case ConstToolType.SM_AR_DRAWING_STYLE_POSITION:
      case ConstToolType.SM_AR_DRAWING_STYLE_ROTATION:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3
        break
      // default:
      //   data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3
      //   break
    }
    return data
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = await ARDrawingData.getData(this.type, params)
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      isFullScreen: false,
      buttons: _data.buttons,
      customView: () => {
        return (
          <Tabs
            data={_data.data}
            device={params.device}
          />
        )
      },
    })

    SARMap.clearSelection()
    SARMap.setAction(ARAction.SELECT)
  }
}

export default function() {
  return new ArDrawingModule({
    type: ConstToolType.SM_AR_DRAWING,
    title: getLanguage(GLOBAL.language).ARMap.ARDRAWING,
    size: 'large',
    image: getThemeAssets().ar.icon_tool_ardrawing,
    getData: ARDrawingData.getData,
    getHeaderData: ARDrawingData.getHeaderData,
    getMenuData: ARDrawingData.getMenuData,
    actions: ARDrawingAction,
  })
}
