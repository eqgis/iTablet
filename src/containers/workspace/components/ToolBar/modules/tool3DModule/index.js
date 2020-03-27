import Tool3DData from './Tool3DData'
import Tool3DAction from './Tool3DAction'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  const data = utils.getLayout(type, orientation)
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.table,
    isFullScreen: true,
    column: data.column,
    height: data.height,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: Tool3DData.getData,
    actions: Tool3DAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
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
    image: require('../../../../../../assets/function/icon_function_tool.png'),
    getData: Tool3DData.getData,
    // getMenuData: Tool3DData.getMenuData,
    actions: Tool3DAction,
    getLayout: utils.getLayout,
  }
}
