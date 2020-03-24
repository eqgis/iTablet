import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation) {
  let height, column
  switch (type) {
    case ConstToolType.MAP_SHARE:
    case ConstToolType.MAP_SHARE_MAP3D:
      height = ConstToolType.HEIGHT[0]
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
