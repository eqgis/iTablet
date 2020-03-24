import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation) {
  let height, column
  switch (type) {
    case ConstToolType.MAP_THEME_CREATE:
    case ConstToolType.MAP_THEME_CREATE_BY_LAYER:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[10]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_ADD_DATASET:
    case ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS:
    case ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[5]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[5]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_RANGE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR:
    case ConstToolType.MAP_THEME_PARAM_RANGELABEL_COLOR:
    case ConstToolType.MAP_THEME_PARAM_GRID_RANGE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_COLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[7]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[7]
        column = 12
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION:
      height = ConstToolType.THEME_HEIGHT[0]
      column = 4
      break
    case ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE:
      height = ConstToolType.THEME_HEIGHT[8]
      column = 4
      break
    case ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE:
    case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE:
      height = ConstToolType.HEIGHT[0]
      column = 3
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE:
    case ConstToolType.MAP_THEME_PARAM:
    case ConstToolType.MAP_THEME_PARAM_RANGE_PARAM:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_VALUE:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SIZE:
    case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE:
      height = 0
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
