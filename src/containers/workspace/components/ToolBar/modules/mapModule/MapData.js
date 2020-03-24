import { ConstToolType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'

function getData(type) {
  let data = [],
    buttons = []

  switch (type) {
    case ConstToolType.MAP_TOOL_ATTRIBUTE_RELATE:
    case ConstToolType.MAP_TOOL_ATTRIBUTE_SELECTION_RELATE:
      buttons = [ToolbarBtnType.CANCEL]
      break
  }
  return { data, buttons }
}

export default {
  getData,
}
