import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import FunctionAction from './FunctionAction'
import { FunctionExampleTypes } from './index'

function getData(type, params) {
  ToolbarModule.setParams(params)
  let data = [], buttons = []
  switch (type) {
    case FunctionExampleTypes.FUNCTION_EXAMPLE:
      data = [
        {
          key: 'Location',
          title: "Location",
          // constants.OPEN,
          action: FunctionAction.location,
          size: 'large',
          image: require('../../../src/assets/userDefine/userDefineTab.png'),
        },
        {
          key: 'List',
          title: "Open List",
          // constants.OPEN,
          action: FunctionAction.openDataList,
          size: 'large',
          image: require('../../../src/assets/userDefine/userDefineTab.png'),
        },
        {
          key: 'Table',
          title: "Open Table",
          // constants.OPEN,
          action: FunctionAction.openDataTable,
          size: 'large',
          image: require('../../../src/assets/userDefine/userDefineTab.png'),
        },
      ]
      buttons = []
      break
  }

  return { data, buttons }
}

export default {
  getData,
}
