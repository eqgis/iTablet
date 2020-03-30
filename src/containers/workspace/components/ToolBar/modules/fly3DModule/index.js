/**
 * 飞行轨迹
 */
import { SScene } from 'imobile_for_reactnative'
import Fly3DData from './Fly3DData'
import Fly3DAction from './Fly3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType } from '../../../../../../constants'
import ToolBarHeight from '../ToolBarHeight'

function action(type) {
  const params = ToolbarModule.getParams()
  const _data = Fly3DData.getData(type, params)
  const containerType = ToolbarType.list
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  SScene.checkoutListener('startMeasure')
  params.setToolbarVisible(true, type, {
    containerType,
    column: data.column,
    height: data.height,
    data: _data.data,
    buttons: _data.buttons,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: Fly3DData.getData,
    actions: Fly3DAction,
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
    image: require('../../../../../../assets/function/Frenchgrey/icon_symbolFly.png'),
    getData: Fly3DData.getData,
    actions: Fly3DAction,
    setModuleData,
  }
}
