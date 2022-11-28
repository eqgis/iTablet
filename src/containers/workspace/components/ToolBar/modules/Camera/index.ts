import { ConstToolType} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import ToolAction from '../toolModule/ToolAction'
import collectionModule from '../collectionModule'
import { SCollector, SMCollectorType } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import LayerSelectionAttribute from '@/containers/layerAttribute/pages/layerSelectionAttribute/LayerSelectionAttribute'
import { AppToolBar } from '@/utils'

class CameraModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    // 将点采集图层设为当前图层
    const _params = ToolbarModule.getParams()
    const layers = await (_params.getLayers())

    let datasetName = "marker_322"
    for(let i = 0; i < layers.length; i ++) {
      let layerDatasetName = layers[i].datasetName
      if(layerDatasetName === datasetName) {
        ToolbarModule.getParams().setCurrentLayer(layers[i])
      }
    }

    ToolAction.captureImage()
  }
}

export default function() {
  return new CameraModule({
    type: "CAMERA",
    title: "相机",
    size: 'large',
    image: getThemeAssets().mapTools.icon_tool_multi_media,
  })
}
