/**
 * 编辑
 */
import { SMap, Action } from 'imobile_for_reactnative'
import EditData from './EditData'
import EditAction from './EditAction'
import ToolbarModule from '../ToolbarModule'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import { ToolbarType } from '../../../../../../constants'
import ToolBarHeight from '../ToolBarHeight'

export async function action(type) {
  const params = ToolbarModule.getParams()
  const _data = EditData.getData(type)
  const containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: false,
    height: data.height,
    column: data.column,
    cb: () => SMap.setAction(Action.SELECT),
  })
  Toast.show(getLanguage(params.language).Prompt.PLEASE_SELECT_OBJECT)
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: EditData.getData,
    actions: EditAction,
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
    image: require('../../../../../../assets/function/icon_edit.png'),
    getData: EditData.getData,
    actions: EditAction,
    setModuleData,
  }
}
