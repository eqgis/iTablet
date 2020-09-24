import { ConstToolType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import NavigationService from '../../../../../NavigationService'
import { SMeasureView } from 'imobile_for_reactnative'

class arEffect extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    let isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    NavigationService.navigate('ARWeatherView')
  }
}

export default function() {
  return new arEffect({
    type: ConstToolType.MAP_AR_EFFECT,
    key: ConstToolType.MAP_AR_EFFECT,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.ar_effect,
  })
}
