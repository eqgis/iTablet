import ShareData from './ShareData'
import ShareAction from './ShareAction'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'

function action(type) {
  const params = ToolbarModule.getParams()
  const orientation = params.device.orientation
  const layout = utils.getLayout(type, orientation)
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: 'table',
    isFullScreen: true,
    column: layout.column,
    height: layout.height,
  })
}

function setModuleData (type) {
  ToolbarModule.setData({
    type: type,
    getData: ShareData.getData,
    actions: ShareAction,
    isSharing: false,
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
    image: require('../../../../../../assets/function/icon_function_share.png'),
    getData: ShareData.getData,
    actions: ShareAction,
    setModuleData: setModuleData,
    getLayout: utils.getLayout,
  }
}
