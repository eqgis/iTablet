/**
 * 编辑
 */
import EditData from './EditData'
import EditAction from './EditAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import { SMap, Action } from 'imobile_for_reactnative'
import utils from './utils'

export async function action(type) {
  const params = ToolbarModule.getParams()
  const orientation = params.device.orientation
  const layout = utils.getLayout(type, orientation)
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    isFullScreen: false,
    height: layout.height,
    column: layout.column,
    cb: () => SMap.setAction(Action.SELECT),
  })
  Toast.show(getLanguage(params.language).Prompt.PLEASE_SELECT_OBJECT)
}

function setModuleData (type) {
  ToolbarModule.setData({
    type: type,
    getData: EditData.getData,
    actions: EditAction,
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
    image: require('../../../../../../assets/function/icon_edit.png'),
    getData: EditData.getData,
    actions: EditAction,
    setModuleData: setModuleData,
    getLayout: utils.getLayout,
  }
}
