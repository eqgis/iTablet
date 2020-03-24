import { ConstToolType } from '../../../../../../constants'

function getLayout (type, orientation) {
  let height, column
  switch (type) {
    case ConstToolType.MAP_AR_AI_ASSISTANT:
      height = ConstToolType.HEIGHT[2]
      column = orientation === 'LANDSCAPE' ? 5 : 4
      break
    // default:
    //   height = 0
  }
  return { height, column }
}

export default {
  getLayout,
}
