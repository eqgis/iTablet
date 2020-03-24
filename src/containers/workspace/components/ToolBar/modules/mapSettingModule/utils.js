import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation, currentHeight) {
  let height, column
  switch (type) {
    case ConstToolType.MAP_COLOR_MODE:
    case ConstToolType.MAP_BACKGROUND_COLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 16
      }
      if (currentHeight === 0) {
        height = 0
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
