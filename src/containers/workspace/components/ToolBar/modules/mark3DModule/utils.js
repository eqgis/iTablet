import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
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
    case ConstToolType.MAP3D_SYMBOL_POINT:
    case ConstToolType.MAP3D_SYMBOL_TEXT:
    case ConstToolType.MAP3D_SYMBOL_POINTLINE:
    case ConstToolType.MAP3D_SYMBOL_POINTSURFACE:
      height = 0
      break
  }
  return { height, column }
}

export default {
  getLayout,
}
