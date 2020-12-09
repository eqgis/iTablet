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
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    NavigationService.navigate('ARWeatherView')
  }
}

export default function() {
  return new arEffect({
    type: ConstToolType.SM_MAP_AR_EFFECT,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
    size: 'large',
    image: getThemeAssets().functionBar.icon_ar_special_effects,
  })
}
