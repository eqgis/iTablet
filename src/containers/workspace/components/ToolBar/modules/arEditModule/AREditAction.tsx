/* global GLOBAL */
import {
  SARMap,
  ARAction,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
} from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'
import AREditData from './AREditData'

async function toolbarBack() {
  const _params: any = ToolbarModule.getParams()
  const _data = await AREditData.getData(ConstToolType.SM_AR_EDIT, _params)
  _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT, {
    isFullScreen: false,
    buttons: _data.buttons,
  })
  SARMap.clearSelection()
  ToolbarModule.addData({selectARElement: null})
}

function menu(type: string, selectKey: string, params = {}) {
  const _params: any = ToolbarModule.getParams()

  let showMenu = false

  if (GLOBAL.ToolBar) {
    if (GLOBAL.ToolBar.state.showMenuDialog) {
      showMenu = false
    } else {
      showMenu = true
    }
    GLOBAL.ToolBar.setState({
      isFullScreen: showMenu,
      showMenuDialog: showMenu,
      selectKey: selectKey,
      selectName: selectKey,
    })
  }
}

function showMenuBox(type: string, selectKey: string, params: any) {
  switch(type) {
    case ConstToolType.SM_AR_EDIT_ROTATION:
    case ConstToolType.SM_AR_EDIT_POSITION:
    case ConstToolType.SM_AR_EDIT_SCALE:
      if (!GLOBAL.ToolBar.state.showMenuDialog) {
        params.showBox && params.showBox()
      } else {
        params.setData && params.setData({
          showMenuDialog: false,
          isFullScreen: false,
        })
        params.showBox && params.showBox()
      }
      break
  }
}

function commit() {
  SARMap.clearSelection()
  SARMap.setAction(ARAction.NULL)
  return false
}

export default {
  toolbarBack,
  menu,
  showMenuBox,
  commit,
}
