import ShareData from './ShareData'
import ShareAction from './ShareAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'
import ToolBarHeight from '../ToolBarHeight'

function action(type) {
  const params = ToolbarModule.getParams()
  const _data = ShareData.getData(type, params)
  const containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: 'table',
    isFullScreen: true,
    column: data.column,
    height: data.height,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: ShareData.getData,
    actions: ShareAction,
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
    getData: ShareData.getData,
    actions: ShareAction,
    setModuleData,
  }
}
