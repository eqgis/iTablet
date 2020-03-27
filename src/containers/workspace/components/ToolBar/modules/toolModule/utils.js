import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP_TOOL:
    case ConstToolType.MAP_TOOLS:
      height = ConstToolType.TOOLBAR_HEIGHT[6]
      if (orientation === 'PORTRAIT') {
        column = 4
      } else {
        column = 5
      }
      break
    case ConstToolType.MAP_TOOL_TAGGING_SETTING:
      if (orientation === 'LANDSCAPE') {
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      }
      break
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.STYLE_TRANSFER_PICKER:
      height = ConstToolType.TOOLBAR_HEIGHT_2[3]
      break
    case ConstToolType.MAP_TOOL_ATTRIBUTE_RELATE:
    case ConstToolType.MAP_TOOL_ATTRIBUTE_SELECTION_RELATE:
      height = 0
      break
  }
  return { height, column }
}

export default {
  getLayout,
}
