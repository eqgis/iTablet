/* global GLOBAL */
import {
  SARMap,
  ARAction,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
} from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'
import ARStyleData from './ARStyleData'

async function toolbarBack() {
  const _params: any = ToolbarModule.getParams()

  if (_params.type === ConstToolType.SM_AR_STYLE) {
    _params.setToolbarVisible(false)
    return
  }
  const _data = await ARStyleData.getData(ConstToolType.SM_AR_STYLE, _params)
  _params.setToolbarVisible(true, ConstToolType.SM_AR_STYLE, {
    isFullScreen: false,
    buttons: _data.buttons,
  })
  SARMap.clearSelection()
  ToolbarModule.addData({selectARElement: null})
}

async function tableAction(type: string, params: { key: any; layerName: any; action: (arg0: any) => void }) {
  let result = false
  const _params: any = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
      result = await SARMap.setLayerBorderColor(_params.arlayer.currentLayer.name, params.key)
      break
  }
  if (!result && params.action) {
    params.action(params)
  }
}

function menu(type: string, selectKey: string, params = {}) {
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
  // switch(type) {
  //   case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
  //   case ConstToolType.SM_AR_STYLE_BORDER_WIDTH:
  //   case ConstToolType.SM_AR_STYLE_TRANSFROM:
  //   case ConstToolType.SM_AR_STYLE_EFFECT:
  //     if (!GLOBAL.ToolBar.state.showMenuDialog) {
  //       params.showBox && params.showBox()
  //     } else {
  //       params.setData && params.setData({
  //         showMenuDialog: false,
  //         isFullScreen: false,
  //       })
  //       params.showBox && params.showBox()
  //     }
  //     break
  // }
  if (!GLOBAL.ToolBar.state.showMenuDialog) {
    params.showBox && params.showBox()
  } else {
    params.setData && params.setData({
      showMenuDialog: false,
      isFullScreen: false,
    })
    params.showBox && params.showBox()
  }
}

function commit() {
  SARMap.clearSelection()
  // SARMap.setAction(ARAction.NULL)
  SARMap.setAction(ARAction.SELECT)
  return false
}

export default {
  toolbarBack,
  tableAction,
  menu,
  showMenuBox,
  commit,
}
