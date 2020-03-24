import StartData from './StartData'
import StartAction from './StartAction'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  const orientation = params.device.orientation
  const layout = utils.getLayout(type, orientation)
  params.showFullMap && params.showFullMap(true)
  // const _data = StartData.getData(type)
  setModuleData(type)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.table,
    column: layout.column,
    height: layout.height,
    // data: _data.data,
    // buttons: _data.buttons,
  })
}

function setModuleData (type) {
  ToolbarModule.setData({
    type: type,
    getData: StartData.getData,
    actions: StartAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title: title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_start.png'),
    getData: StartData.getData,
    actions: StartAction,
    setModuleData: setModuleData,
    getLayout: utils.getLayout,
  }
}
