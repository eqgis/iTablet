import { ConstToolType } from '../../../../../../constants'

function getLayout (type) { // orientation, currentHeight
  let height, column = 0
  switch (type) {
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
