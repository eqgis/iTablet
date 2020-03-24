import ToolbarModule from './ToolbarModule'
import * as modules from './index'

/**
 * 根据类型查找对应ToolbarContentView高度和内容列数
 * @param type
 * @param currentHeight (option，当前高度，用于部分逻辑判断)
 * @returns {*}
 */
function getToolbarHeight(type, currentHeight) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  let height = 0
  let column
  const keys = Object.keys(modules)
  let i = 0
  if (type === undefined) {
    column = 0
    return { height, column }
  }
  while (keys[i] && keys[i] !== 'default' && modules[keys[i]]) {
    const moduleFunc = modules[keys[i]]
    const module = moduleFunc()
    if (module.getLayout) {
      const layout = module.getLayout(type, orientation, currentHeight)
      if (layout.height !== undefined && layout.column !== undefined) {
        height = layout.height
        column = layout.column
        break
      }
    }
    i++
  }

  return { height, column }
}

export default {
  getToolbarHeight,
}
