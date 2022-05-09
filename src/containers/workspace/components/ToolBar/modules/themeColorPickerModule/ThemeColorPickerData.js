/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React from 'react'
import {ConstToolType} from "../../../../../../constants"
import ToolbarModule from "../ToolbarModule"
import PreviewColorPicker from "./customView"
import ToolbarBtnType from "../../ToolbarBtnType"

function getData(type) {
  let data = [],
    buttons = [],
    customView
  if (type === ConstToolType.SM_MAP_COLOR_PICKER) {
    let params = ToolbarModule.getParams()
    {
      let data = ToolbarModule.getData().customModeData
      let index = ToolbarModule.getData().index
      let color = data[index].color
      let { r, g, b } = color
      customView = () => (
        <PreviewColorPicker
          data={data}
          g={g}
          r={r}
          selectedIndex={index}
          b={b}
          currentLayer={params.currentLayer}
        />
      )
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
    }
  }
  return {data, buttons, customView}
}

export default {
  getData,
}