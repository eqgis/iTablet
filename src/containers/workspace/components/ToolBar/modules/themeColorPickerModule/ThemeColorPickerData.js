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
import { GeoStyle } from 'imobile_for_reactnative'

function getData(type) {
  let data,
    buttons = [],
    customView
  if (type === ConstToolType.SM_MAP_COLOR_PICKER) {
    const params = ToolbarModule.getParams()
    {
      const modeData = ToolbarModule.getData()
      data = modeData.customModeData
      const index = modeData.index
      const geostyle = new GeoStyle(modeData.customModeData[index].style)
      const color = geostyle.getFillForeColor() || geostyle.getLineColor() || geostyle.getPointColor()
      const { r, g, b } = color
      customView = () => (
        <PreviewColorPicker
          data={modeData.customModeData}
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