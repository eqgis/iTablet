import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation) {
  let height, column
  switch (type) {
    case ConstToolType.MAP_STYLE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 8
      }
      break
    case ConstToolType.GRID_STYLE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[4]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[4]
        column = 8
      }
      break
    case ConstToolType.LINECOLOR_SET:
    case ConstToolType.POINTCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 12
      }
      break
    case ConstToolType.REGIONBEFORECOLOR_SET:
    case ConstToolType.REGIONBORDERCOLOR_SET:
    case ConstToolType.REGIONAFTERCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 12
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
