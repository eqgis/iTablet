import { SARText } from 'imobile_for_reactnative'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'
import NavigationService from '../../NavigationService'
import { getLanguage } from '../../../language'

let ToolbarModule = getToolbarModule('AR')

function inputText() {
  NavigationService.navigate('InputStyledText', {
    placeholder: getLanguage(global.language).Prompt.PLEASE_ENTER,
    cb: (result, styles) => {
      NavigationService.goBack()
      ToolbarModule.addData({ text: result, styles: styles })
      ToolbarModule.getParams().setToolbarVisible(true, 'ARTEXTMODULE_add')
    },
  })
}

function addAtCurrent() {
  let { text, styles } = ToolbarModule.getData()
  SARText.addAtCurrentPosition(text, styles)
  ToolbarModule.getParams().setToolbarVisible(true, 'ARTEXTMODULE')
}

function addAtPoint() {
  let { text, styles } = ToolbarModule.getData()
  SARText.setTapAction('ADD')
  SARText.setText(text, styles)
  SARText.setPlaneVisible(true)
  SARText.setOnAddListener(() => {
    ToolbarModule.getParams().setToolbarVisible(true, 'ARTEXTMODULE')
  })
  ToolbarModule.getParams().setToolbarVisible(true, 'ARTEXTMODULE_addAtPlane')
}

export default {
  inputText,
  addAtCurrent,
  addAtPoint,
}
