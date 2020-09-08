import { SARWebView } from 'imobile_for_reactnative'
import ToolbarModule from '../../workspace/components/ToolBar/modules/ToolbarModule'
import NavigationService from '../../NavigationService'

function inputUrl() {
  NavigationService.navigate('InputPage', {
    type: 'http',
    placeholder: 'http://',
    cb: result => {
      NavigationService.goBack()
      ToolbarModule.addData({ url: result })
      ToolbarModule.getParams().setToolbarVisible(true, 'ARWEBVIEWMODULE_add')
    },
  })
}

function addAtCurrent() {
  let { url } = ToolbarModule.getData()
  SARWebView.addAtCurrentPosition(url)
  ToolbarModule.getParams().setToolbarVisible(true, 'ARWEBVIEWMODULE')
}

function addAtPoint() {
  let { url } = ToolbarModule.getData()
  SARWebView.setTapAction('ADD')
  SARWebView.setUrl(url)
  SARWebView.setPlaneVisible(true)
  SARWebView.setOnAddListener(() => {
    ToolbarModule.getParams().setToolbarVisible(true, 'ARWEBVIEWMODULE')
  })
  ToolbarModule.getParams().setToolbarVisible(
    true,
    'ARWEBVIEWMODULE_addAtPlane',
  )
}

export default {
  inputUrl,
  addAtCurrent,
  addAtPoint,
}
