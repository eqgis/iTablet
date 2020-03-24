import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation) {
  let height, column
  switch (type) {
    case ConstToolType.MAP3D_TOOL_FLYLIST:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
      }
      column = orientation === 'PORTRAIT' ? 4 : 5
      break
    case ConstToolType.MAP3D_TOOL_NEWFLY:
      height = ConstToolType.HEIGHT[0]
      column = 3
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
