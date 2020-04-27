import Tool3DData from './Tool3DData'
import Tool3DAction from './Tool3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'

async function action(type) {
  const params = ToolbarModule.getParams()
  const _data = await Tool3DData.getData(type, params)
  const containerType = ToolbarType.table
  const data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.table,
    isFullScreen: true,
    column: data.column,
    height: data.height,
    ..._data,
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
    actions: Tool3DAction,
  }
}
