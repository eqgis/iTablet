import LayerSettingImageAction from './LayerSettingImageAction'
import LayerSettingImageData from './LayerSettingImageData'
import { ConstToolType } from '../../../../../../constants'
import FunctionModule from '../../../../../../class/FunctionModule'

class LayerSettingImageModule extends FunctionModule {
  constructor(props) {
    super(props)
  }
}

export default function() {
  return new LayerSettingImageModule({
    type: ConstToolType.LAYER_SETTING_IMAGE,
    key: ConstToolType.LAYER_SETTING_IMAGE,
    title: ConstToolType.LAYER_SETTING_IMAGE,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_style.png'),
    getData: LayerSettingImageData.getData,
    actions: LayerSettingImageAction,
    getMenuData: LayerSettingImageData.getMenuData,
  })
}
