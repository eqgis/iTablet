import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation, currentHeight) {
  let height, column
  switch (type) {
    case ConstToolType.LEGEND:
    case ConstToolType.LEGEND_NOT_VISIBLE:
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
    case ConstToolType.LEGEND_POSITION:
      height = ConstToolType.TOOLBAR_HEIGHT[1]
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
