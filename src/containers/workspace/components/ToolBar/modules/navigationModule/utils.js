import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation, currentHeight) {
  let height, column
  switch (type) {
    case ConstToolType.MAP_NAVIGATION_MODULE:
    case ConstToolType.MAP_NAVIGATION_ADD_UDB:
    case ConstToolType.MAP_NAVIGATION_SELECT_MODEL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[5]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[3]
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
