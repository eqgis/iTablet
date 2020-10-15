import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'
import { ConstToolType } from '../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'

function showSetting(back = false) {
  const _params = ToolbarModule.getParams()
  _params.showFullMap(true)
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_MENU, {
    showMenuDialog: true,
  })
  if (back) {
    NavigationService.navigate('MapView')
  }
}

function setDisplayMode(item) {
  const _params = ToolbarModule.getParams()
  if (item) {
    SMap.setImageDisplayMode(_params.currentLayer.path, item.value)
  }
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_MENU, {
    showMenuDialog: true,
  })
}

function setStretchType(item) {
  const _params = ToolbarModule.getParams()
  if (item) {
    SMap.setImageStretchType(_params.currentLayer.path, item.value)
  }
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_MENU, {
    showMenuDialog: true,
    selectKey: GLOBAL.ToolBar.state.selectKey,
  })
}

function onPickerCancel() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_SETTING_IMAGE_MENU, {
    showMenuDialog: true,
    selectKey: GLOBAL.ToolBar.state.selectKey,
  })
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
  setDisplayMode,
  setStretchType,
  onPickerCancel,
}
