import actions from './action'
import data from './data'
import FunctionModule from '../../../class/FunctionModule'

class arVideoModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = type => {
    let size
    switch (type) {
      case 'xyzslide':
        size = { height: 100 }
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
