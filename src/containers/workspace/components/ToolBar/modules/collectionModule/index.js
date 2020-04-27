/**
 * 采集
 */
import CollectionData from './CollectionData'
import CollectionAction from './CollectionAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  const _data = CollectionData.getData(type)
  const containerType = ToolbarType.tabs
  const data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
    isFullScreen: true,
    containerType: ToolbarType.tabs,
    ...data,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: CollectionData.getData,
    actions: CollectionAction,
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
    image: require('../../../../../../assets/function/icon_function_symbol.png'),
    getData: CollectionData.getData,
    actions: CollectionAction,
    setModuleData,
  }
}
