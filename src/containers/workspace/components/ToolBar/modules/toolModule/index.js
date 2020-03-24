import ToolAction from './ToolAction'
import ToolData from './ToolData'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  const layout = utils.getLayout(type, orientation)
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_TOOLS, {
    isFullScreen: true,
    column: layout.column,
    height: layout.height,
  })
  // 重置canUndo和canRedo
  if (params.toolbarStatus.canUndo || params.toolbarStatus.canRedo) {
    params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
  }
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: ToolData.getData,
    actions: ToolAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
    action: () => {
      if (customAction === false) {
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_tool.png'),
    getData: ToolData.getData,
    getMenuData: ToolData.getMenuData,
    actions: ToolAction,
    setModuleData,
    getLayout: utils.getLayout,
  }
}
