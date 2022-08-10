import { ConstToolType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import NavigationService from '../../../../../NavigationService'
import { SARMap } from 'imobile_for_reactnative'

class arEffect extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    let isSupportedARCore = await SARMap.isARAvailable()
    if (!isSupportedARCore) {
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    global.toolBox && global.toolBox.removeAIDetect(true)
    if (global.showAIDetect) {
      global.arSwitchToMap = true
      ;(await global.toolBox) && global.toolBox.switchAr()
    }

    NavigationService.navigate('ARWeatherView')
  }
}

export default function() {
  return new arEffect({
    type: ConstToolType.SM_MAP_AR_EFFECT,
    title: getLanguage(global.language).Map_Main_Menu.MAP_AR_EFFECT,
    size: 'large',
    image: getThemeAssets().functionBar.icon_ar_special_effects,
  })
}
