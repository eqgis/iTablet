import ARMeasureAction from './ARMeasureAction'
import ARMeasureData from './ARMeasureData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { scaleSize } from '../../../../../../utils'

class ArMeasure extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = (type, orientation, additional = {}) => {
    let size,
      height = 0,
      column = -1,
      row = -1
    switch (type) {
      case 'arMeasure':
        if (additional.data === undefined) additional.data = []
        let maxLimit = 6
        column = additional.column !== undefined ? additional.column : 5
        row = Math.ceil(additional.data.length / column)
        row = row > maxLimit ? maxLimit : row // 限制最大宽度
        height = scaleSize(240) * row
        size = { height, column, row }
        break
      case ToolbarType.table: {
        if (additional.data === undefined) additional.data = []
        let maxLimit = type === ToolbarType.scrollTable ? 2 : 6
        column = 5
        row = Math.ceil(additional.data.length / column)
        row = row > maxLimit ? maxLimit : row // 限制最大宽度
        height = scaleSize(120) * row
        size = { height, column, row }
        break
      }
    }
    return size
  }

  action = () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = ARMeasureData.getData()
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      data: _data.data,
      ...data,
    })
  }
}

export default function() {
  return new ArMeasure({
    type: ConstToolType.SM_MAP_AR_MEASURE,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_MEASURE,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_ar_measure,
    getData: ARMeasureData.getData,
    actions: ARMeasureAction,
  })
}
