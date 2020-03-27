/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import { ConstToolType } from '../../../../../../constants'

function getLayout(type) {
  let height
  let column
  switch (type) {
    case ConstToolType.MAP_INCREMENT_OUTTER:
    case ConstToolType.MAP_INCREMENT_EDIT:
      height = ConstToolType.TOOLBAR_HEIGHT[0]
      column = 5
      break
    case ConstToolType.MAP_INCREMENT_CHANGE_METHOD:
      height = ConstToolType.TOOLBAR_HEIGHT[0]
      column = 4
      break
  }
  return { height, column }
}

export default {
  getLayout,
}
