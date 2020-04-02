import StartData from './StartData'
import StartAction from './StartAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ToolbarType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  const _data = StartData.getData(type, params)
  const containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: true,
    column: data.column,
    height: data.height,
    data: _data.data,
    buttons: _data.buttons,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: StartData.getData,
    actions: StartAction,
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
    image: require('../../../../../../assets/function/icon_function_start.png'),
    getData: StartData.getData,
    actions: StartAction,
    setModuleData,
  }
}
