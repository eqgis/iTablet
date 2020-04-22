import ToolbarModule from './ToolbarModule'
import { ToolbarType, Height } from '../../../../../constants'

/**
 * 统一ToolbarContentView高度（table类型自适应大小）
 * @param type
 * @param additional
   {
     data: Array | 建议table类型必传，以便计算列数，默认3列,
     height: number | option,
     column: number | option,
     row: number | option,
   }
 *    自定义高度，table列数
 * @returns {{height: number, column: number}}
 */
function getToolbarSize(type, additional = {}) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  let height = 0,
    column = -1,
    row = -1
  switch (type) {
    case ToolbarType.list: // 列表
    case ToolbarType.selectableList: // 可选择列表，每行左方多选框
      height =
        orientation.indexOf('LANDSCAPE') === 0
          ? Height.LIST_HEIGHT_L
          : Height.LIST_HEIGHT_P
      break
    case ToolbarType.symbol: // 符号库容器
      height = Height.LIST_HEIGHT_L
      break
    case ToolbarType.scrollTable: // 纵向滚动表格
    case ToolbarType.table: {
      if (additional.data === undefined) additional.data = []
      let maxLimit = type === ToolbarType.scrollTable ? 2 : 6
      if (orientation.indexOf('LANDSCAPE') === 0) {
        row = additional.row !== undefined ? additional.row : 5
        column = Math.ceil(additional.data.length / row)
        column = column > maxLimit ? maxLimit : column // 限制最大高度
        height = Height.TABLE_ROW_HEIGHT_5 * column
      } else {
        column = additional.column !== undefined ? additional.column : 4
        row = Math.ceil(additional.data.length / column)
        row = row > maxLimit ? maxLimit : row // 限制最大宽度
        height = Height.TABLE_ROW_HEIGHT_4 * row
      }
      break
    }
    case ToolbarType.colorTable: // 颜色表格
      height = Height.LIST_HEIGHT_L
      break
    case ToolbarType.horizontalTable: // 横向滚动表格
      height = Height.TABLE_ROW_HEIGHT_4
      column = 8
      break
    case ToolbarType.createPlotAnimation: // 创建标绘推演
    case ToolbarType.animationNode: // 态势推演
      height = Height.TABLE_ROW_HEIGHT_2 * 5
      break
    case ToolbarType.picker: // 选择器
      height =
        Height.TABLE_ROW_HEIGHT_1 *
        (orientation.indexOf('LANDSCAPE') === 0 ? 6 : 4)
      break
    case ToolbarType.multiPicker: //两列选择器
      height = Height.TABLE_ROW_HEIGHT_1 * 4
      break
    case ToolbarType.tabs: // 符号标签栏
      height =
        Height.TABLE_ROW_HEIGHT_2 *
        (orientation.indexOf('LANDSCAPE') === 0 ? 8 : 12)
      column = 4
      break
    case ToolbarType.colorPicker: //颜色选择器 色盘
      height =
        orientation.indexOf('LANDSCAPE') === 0
          ? Height.TABLE_ROW_HEIGHT_3 * 6
          : Height.TABLE_ROW_HEIGHT_3 * 4
      break
    case ToolbarType.buttons: //自定义buttons
      height = Height.TOOLBAR_BUTTONS
      break
    case ToolbarType.typeNull:
      height = 0
      break
  }
  if (additional.height !== undefined) {
    height = additional.height
  }
  return { height, column, row }
}

export default {
  // getToolbarHeight,
  getToolbarSize,
}
