import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation) {
  let height, column
  switch (type) {
    case ConstToolType.PLOTTING:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
        column = 8
      }
      break
    case ConstToolType.PLOT_ANIMATION_XML_LIST:
    case ConstToolType.MAP_PLOTTING_ANIMATION:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
      }
      break
    case ConstToolType.PLOT_ANIMATION_START:
      height = ConstToolType.HEIGHT[4]
      break
    case ConstToolType.PLOT_ANIMATION_NODE_CREATE:
      if (orientation === 'LANDSCAPE') {
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT[5]
      }
      break
    case ConstToolType.PLOT_ANIMATION_PLAY:
      height = ConstToolType.HEIGHT[4]
      column = 4
      break
    case ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST:
      height = ConstToolType.TOOLBAR_HEIGHT[5]
      // column = 4
      break
    case ConstToolType.PLOT_ANIMATION_WAY:
      height = ConstToolType.HEIGHT[0]
      // column = 4
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
