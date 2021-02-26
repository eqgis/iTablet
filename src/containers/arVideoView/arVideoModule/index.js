import actions from './action'
import data from './data'
import FunctionModule from '../../../class/FunctionModule'
import { scaleSize } from '../../../utils'

class arVideoModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = type => {
    let size
    switch (type) {
      case 'xyzslide':
        size = { height: scaleSize(200) }
        break
      case 'slide':
        size = { height: scaleSize(120) }
        break
    }
    return size
  }
}

export default function() {
  return new arVideoModule({
    type: 'SM_ARVIDEOMODULE',
    getData: data.getData,
    actions: actions,
    getMenuData: data.getMenuData,
  })
}
