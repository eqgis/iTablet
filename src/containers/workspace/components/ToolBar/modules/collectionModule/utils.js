import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation) {
  let height, column
  switch (type) {
    case ConstToolType.MAP_SYMBOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
        column = 8
      }
      break
    case ConstToolType.MAP_COLLECTION_REGION:
    case ConstToolType.MAP_COLLECTION_LINE:
    case ConstToolType.MAP_COLLECTION_POINT:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[0]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      column = 4
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
