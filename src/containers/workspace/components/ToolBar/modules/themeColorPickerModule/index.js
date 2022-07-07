/**
 * @description 专题图颜色设置模块
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import ThemeColorPickerData from './ThemeColorPickerData'
import ThemeColorPickerAction from './ThemeColorPickerAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'

function setModuleData(type) {
  let customModeData = ToolbarModule.getData().customModeData
  let customType = ToolbarModule.getData().customType
  let mapXml = ToolbarModule.getData().mapXml
  let index = ToolbarModule.getData().index
  ToolbarModule.setData({
    type,
    getData: ThemeColorPickerData.getData,
    actions: ThemeColorPickerAction,
  })
  if (customModeData && index !== undefined) {
    ToolbarModule.addData({ customModeData, index, customType, mapXml })
  }
}

// export default function(type,title) {
//   setModuleData(ConstToolType.SM_MAP_COLOR_PICKER)
//   return {
//     key: title,
//     title,
//     size: 'large',
//     getData: ThemeColorPickerData.getData,
//     actions: ThemeColorPickerAction,
//     setModuleData,
//   }
// }

class themeColorPickerModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  setModuleData = setModuleData
}

export default function() {
  return new themeColorPickerModule({
    type: ConstToolType.SM_MAP_COLOR_PICKER,
    getData: ThemeColorPickerData.getData,
    actions: ThemeColorPickerAction,
  })
}
