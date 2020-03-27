import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP_ADD:
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
