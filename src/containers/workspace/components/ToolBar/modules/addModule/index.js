/**
 * 添加
 */
import AddData from './AddData'
import AddAction from './AddAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'

export async function action(type) {
  const params = ToolbarModule.getParams()
  const _data = await AddData.getData(type, params)
  const containerType = ToolbarType.list
  await setModuleData(type, _data)
  const data = ToolbarModule.getToolbarSize(containerType, {})
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: true,
    isTouchProgress: false,
    showMenuDialog: false,
    ...data,
    data: _data.data,
    buttons: _data.buttons,
  })
}

async function setModuleData(type, data) {
  let _data = data
  if (!_data) {
    _data = await AddData.getData(type)
  }
  ToolbarModule.setData({
    type,
    getData: AddData.getData,
    data: _data,
    actions: AddAction,
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
    image: require('../../../../../../assets/function/icon_function_add.png'),
    getData: AddData.getData,
    actions: AddAction,
    setModuleData,
  }
}
