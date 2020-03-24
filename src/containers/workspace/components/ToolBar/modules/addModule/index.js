/**
 * 添加
 */
import AddData from './AddData'
import AddAction from './AddAction'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'

export async function action(type) {
  const _data = await AddData.getData(type)
  const params = ToolbarModule.getParams()
  const { orientation } = params.device
  const data = utils.getLayout(type, orientation)
  await setModuleData(type, _data)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    isFullScreen: true,
    isTouchProgress: false,
    showMenuDialog: false,
    height: data.height,
    column: data.column,
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
    getLayout: utils.getLayout,
    setModuleData,
  }
}
