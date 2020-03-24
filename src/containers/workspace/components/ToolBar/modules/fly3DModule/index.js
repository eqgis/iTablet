/**
 * 飞行轨迹
 */
import Fly3DData from './Fly3DData'
import Fly3DAction from './Fly3DAction'
import utils from './utils'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { SScene } from 'imobile_for_reactnative'

function action(type) {
  const params = ToolbarModule.getParams()
  const orientation = params.device.orientation
  const data = utils.getLayout(type, orientation)
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  SScene.checkoutListener('startMeasure')
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    column: data.column,
    height: data.height,
  })
}

function setModuleData (type) {
  ToolbarModule.setData({
    type: type,
    getData: Fly3DData.getData,
    actions: Fly3DAction,
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
    image: require('../../../../../../assets/function/Frenchgrey/icon_symbolFly.png'),
    getData: Fly3DData.getData,
    actions: Fly3DAction,
    setModuleData: setModuleData,
    getLayout: utils.getLayout,
  }
}
