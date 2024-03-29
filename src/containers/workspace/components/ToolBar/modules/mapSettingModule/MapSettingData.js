/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React from 'react'
import { mapBackGroundColor } from '../../../../../../constants/ColorList'
import { ConstToolType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { colorMode } from '../../../../../mapSetting/settingData'
import SelectList from './customView'

function getData(type) {
  let data = []
  let customView = null
  switch (type) {
    case ConstToolType.SM_MAP_SETTINGS_BACKGROUND_COLOR:
      data = mapBackGroundColor
      break
    case ConstToolType.SM_MAP_SETTINGS_COLOR_MODE:
      data = colorMode()
      customView = () => <SelectList data={data} />
      break
  }
  const buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
  return { data, buttons, customView }
}

export default {
  getData,
}
