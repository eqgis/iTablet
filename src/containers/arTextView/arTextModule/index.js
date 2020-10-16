import actions from './action'
import data from './data'
import FunctionModule from '../../../class/FunctionModule'

class arTextModule extends FunctionModule {
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
  return new arTextModule({
    type: 'SM_ARTEXTMODULE',
    getData: data.getData,
    actions: actions,
    getMenuData: data.getMenuData,
  })
}
