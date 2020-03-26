import { ConstToolType } from '../../../../../../constants'

function getLayout(type, orientation) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP_MARKS:
      height = ConstToolType.TOOLBAR_HEIGHT[2]
      if (orientation === 'PORTRAIT') {
        column = 4
      } else {
        column = 5
      }
      break
  }
  return { height, column }
}

export default {
  getLayout,
}
