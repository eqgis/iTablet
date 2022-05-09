import { SARWebView } from 'imobile_for_reactnative'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'
import NavigationService from '../../NavigationService'

let ToolbarModule = getToolbarModule('AR')

function inputUrl() {
  NavigationService.navigate('InputPage', {
    type: 'http',
    placeholder: 'http://',
    cb: result => {
      NavigationService.goBack()
      ToolbarModule.addData({ url: result })
      ToolbarModule.getParams().setToolbarVisible(
        true,
        'SM_ARWEBVIEWMODULE_add',
      )
    },
  })
}

function addAtCurrent() {
  let { url } = ToolbarModule.getData()
  SARWebView.addAtCurrentPosition(url)
  ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARWEBVIEWMODULE')
}

function addAtPoint() {
  let { url } = ToolbarModule.getData()
  SARWebView.setTapAction('ADD')
  SARWebView.setUrl(url)
  SARWebView.setPlaneVisible(true)
  SARWebView.setOnAddListener(() => {
    ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARWEBVIEWMODULE')
  })
  ToolbarModule.getParams().setToolbarVisible(
    true,
    'SM_ARWEBVIEWMODULE_addAtPlane',
  )
}

export default {
  inputUrl,
  addAtCurrent,
  addAtPoint,
}
