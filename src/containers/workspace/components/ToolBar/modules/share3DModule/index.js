import Share3DData from './Share3DData'
import Share3DAction from './Share3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  const _data = Share3DData.getData(type, params)
  const containerType = ToolbarType.table
  const data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: 'table',
    isFullScreen: true,
    ...data,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: Share3DData.getData,
    actions: Share3DAction,
    isSharing: false,
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
    image: require('../../../../../../assets/function/icon_function_share.png'),
    getData: Share3DData.getData,
    actions: Share3DAction,
    setModuleData,
  }
}
