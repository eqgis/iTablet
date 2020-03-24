import ToolbarModule from "../ToolbarModule"
import {ConstToolType} from "../../../../../../constants"
import {getLanguage} from "../../../../../../language"
import Tool3DAction from "../tool3DModule/Tool3DAction"
import { SScene } from "imobile_for_reactnative"

/**
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

async function getData(type, params) {
  if (params) {
    ToolbarModule.setParams(params)
  } else {
    params = ToolbarModule.getParams()
  }
  let data = [],
    buttons = []
  switch (type) {
    case ConstToolType.MAP3D_MARK:
      data = [
        {
          key: 'map3DPoint',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_3D_CREATE_POINT,
          //'兴趣点',
          action: Tool3DAction.createPoint,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_favorite.png'),
        },
        {
          key: 'map3DText',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          //''文字',
          action: Tool3DAction.createText,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_text.png'),
        },
        {
          key: 'map3DPiontLine',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_LINE,
          //''点绘线',
          action: Tool3DAction.createLine,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_pointLine.png'),
        },
        {
          key: 'map3DPointSurface',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_REGION,
          //''点绘面',
          action: Tool3DAction.createRegion,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_pointSuerface.png'),
        },
        {
          key: 'closeAllLabel',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_CLEAN_PLOTTING,
          //''清除标注',
          action: Tool3DAction.clearPlotting,
          size: 'large',
          image: require('../../../../../../assets/mapEdit/Frenchgrey/icon_clear.png'),
        },
      ]
      break
  }
  return { data, buttons }
}

export default {
  getData,
}