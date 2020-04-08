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
   }
 *    自定义高度，table列数
 * @returns {{height: number, column: number}}
 */
function getToolbarSize(type, additional = {}) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  let height = 0,
    column = 0
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
    case ToolbarType.table: {
      // 固定表格
      if (additional.column !== undefined) {
        column = additional.column
      } else {
        column = orientation.indexOf('LANDSCAPE') === 0 ? 5 : 4
        // column = 4
      }
      if (additional.data === undefined) additional.data = []
      let row = Math.ceil(additional.data.length / column)
      let maxRow = orientation.indexOf('LANDSCAPE') === 0 ? 4 : 6
      row = row > maxRow ? maxRow : row // 限制最大高度/宽度
      height = Height.TABLE_ROW_HEIGHT_4 * row
      break
    }
    case ToolbarType.scrollTable: // 纵向滚动表格
      if (additional.column !== undefined) {
        column = additional.column
      } else {
        column = orientation.indexOf('LANDSCAPE') === 0 ? 2 : 4
        // column = 4
      }
      height = Height.COLOR_TABLE_HEIGHT_L
      break
    case ToolbarType.colorTable: // 颜色表格
      height = Height.LIST_HEIGHT_L
      break
    case ToolbarType.horizontalTable: // 横向滚动表格
      height = Height.TABLE_ROW_HEIGHT_2
      break
    case ToolbarType.createPlotAnimation: // 创建标绘推演
    case ToolbarType.animationNode: // 态势推演
      height = Height.TABLE_ROW_HEIGHT_2 * 5
      break
    case ToolbarType.picker: // 选择器
      height = Height.TABLE_ROW_HEIGHT_1 * 2
      break
    case ToolbarType.tabs: // 符号标签栏
      height =
        params.device.orientation.indexOf('PORTRAIT') >= 0
          ? Height.TABLE_ROW_HEIGHT_2 * 8
          : Height.TABLE_ROW_HEIGHT_2 * 5
      break
  }
  if (additional.height !== undefined) {
    height = additional.height
  }
  return { height, column }
}

export default {
  // getToolbarHeight,
  getToolbarSize,
}
