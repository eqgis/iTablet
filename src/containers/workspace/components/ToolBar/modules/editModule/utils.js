import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP_EDIT_DEFAULT:
      height = 0
      break
    case ConstToolType.MAP_EDIT_POINT:
      height = ConstToolType.HEIGHT[0]
      column = orientation === 'PORTRAIT' ? 4 : 5
      break
    case ConstToolType.MAP_EDIT_CAD:
      height = ConstToolType.HEIGHT[0]
      column = 5
      break
    case ConstToolType.MAP_EDIT_LINE:
    case ConstToolType.MAP_EDIT_REGION:
      height = ConstToolType.HEIGHT[2]
      column = orientation === 'PORTRAIT' ? 4 : 5
      break
    case ConstToolType.MAP_EDIT_TAGGING:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 8
      }
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
