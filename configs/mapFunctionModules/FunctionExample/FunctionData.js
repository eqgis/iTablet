import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import FunctionAction from './FunctionAction'

function getData(type, params) {
  ToolbarModule.setParams(params)
  let data = [
    {
      key: 'OPEN',
      title: "Location",
      // constants.OPEN,
      action: FunctionAction.location,
      size: 'large',
      image: require('../../../src/assets/userDefine/userDefineTab.png'),
    },
  ]
  const buttons = []

  return { data, buttons }
}

export default {
  getData,
}
