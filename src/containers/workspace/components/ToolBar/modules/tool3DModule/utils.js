import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP3D_SYMBOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP3D_TOOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[2]
        column = 8
      }
      break
    case ConstToolType.MAP3D_SYMBOL_SELECT:
      height = ConstToolType.HEIGHT[0]
      column = 3
      break
    case ConstToolType.MAP3D_CIRCLEFLY:
      height = ConstToolType.HEIGHT[0]
      column = 1
      break
    case ConstToolType.MAP3D_IMPORTWORKSPACE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
      } else {
        height = ConstToolType.HEIGHT[1]
      }
      break
    // case ConstToolType.MAP3D_CLIP_SHOW:
    //   height = ConstToolType.TOOLBAR_HEIGHT[5]
    //   break
    // case ConstToolType.MAP3D_CLIP_HIDDEN:
    //   height = ConstToolType.HEIGHT[5]
    //   break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
