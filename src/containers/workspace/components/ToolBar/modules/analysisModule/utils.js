import { SMCollectorType } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP_ANALYSIS:
      if (orientation === 'PORTRAIT') {
        column = 4
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      } else {
        column = 5
        height = ConstToolType.TOOLBAR_HEIGHT[2]
      }
      break
    case ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH:
    case ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
    case ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH:
      height = ConstToolType.HEIGHT[0]
      column = 5
      break
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.POINT_GPS:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 5
      }
      break
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.LINE_HAND_PATH:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.REGION_HAND_POINT:
    case SMCollectorType.REGION_HAND_PATH:
    case SMCollectorType.POINT_HAND:
      column = 4
      height = ConstToolType.HEIGHT[0]
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
