import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation, currentHeight) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP3D_MARK:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.TOOLBAR_HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT[1]
        column = 5
      }
      break
    case ConstToolType.MAP_MARKS:
      height = ConstToolType.TOOLBAR_HEIGHT[2]
      if (orientation === 'PORTRAIT') {
        column = 4
      } else {
        column = 5
      }
      break
  }
  return { height, column }
}

export default {
  getLayout,
}
