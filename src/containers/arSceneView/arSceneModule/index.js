import actions from './action'
import data from './data'
import FunctionModule from '../../../class/FunctionModule'

class arSceneModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = type => {
    let size
    switch (type) {
      case 'xyzslide':
        size = { height: 350 }
        break
    }
    return size
  }
}

export default function() {
  return new arSceneModule({
    type: 'SM_ARSCENEMODULE',
    getData: data.getData,
    actions: actions,
    getMenuData: data.getMenuData,
  })
}
