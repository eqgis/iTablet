import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'
import { ConstToolType } from '../../../../../../constants'

function showSetting(back = false) {
  const _params = ToolbarModule.getParams()
  _params.showFullMap(true)
  _params.setToolbarVisible(true, ConstToolType.LAYER_SETTING_IMAGE_MENU, {
    showMenuDialog: true,
  })
  if (back) {
    NavigationService.navigate('MapView')
  }
}

function close() {
  const _params = ToolbarModule.getParams()
  ToolbarModule.setData()
  _params.setToolbarVisible(false)
}

function memu() {}

function showMenuBox() {}

function commit() {
  const _params = ToolbarModule.getParams()
  ToolbarModule.setData()
  _params.setToolbarVisible(false)
}

export default {
  close,
  memu,
  showMenuBox,
  commit,

  showSetting,
}
