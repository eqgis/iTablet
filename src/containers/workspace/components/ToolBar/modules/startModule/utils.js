import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP_3D_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[1]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.PLOT_ANIMATION_START:
      height = ConstToolType.HEIGHT[4]
      break
    case ConstToolType.MAP_EDIT_START:
    case ConstToolType.MAP_THEME_START:
    case ConstToolType.MAP_COLLECTION_START:
    case ConstToolType.MAP_PLOTTING_START:
    case ConstToolType.MAP_NAVIGATION_START:
    case ConstToolType.MAP_ANALYST_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 5
      }
      break
    case ConstToolType.MAP_CHANGE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
      }
      break
    case ConstToolType.MAP3D_WORKSPACE_LIST:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
      }
      break
  }
  return { height, column }
}

export default {
  getLayout,
}
