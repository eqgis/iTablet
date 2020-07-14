import ARMeasureAction from './ARMeasureAction'
import ARMeasureData from './ARMeasureData'
import { ConstToolType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import { getThemeAssets } from '../../../../../../assets'

class LayerSettingImageModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = () => {
    Toast.show('TODO')
  }
}

export default function() {
  return new LayerSettingImageModule({
    type: ConstToolType.MAP_AR_MEASURE,
    key: ConstToolType.MAP_AR_MEASURE,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_MEASURE,
    size: 'large',
    image: getThemeAssets().ar.ar_view_mode,
    getData: ARMeasureData.getData,
    actions: ARMeasureAction,
  })
}
