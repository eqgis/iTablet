import FunctionModule from '../../../../../../class/FunctionModule'
// import TourAction from 'applets/langchaoDemo/src/mapFunctionModules/Langchao/TourAction'
import { getImage } from '../../../../../../../applets/langchaoDemo/src/assets/Image'
import Toast from '@/utils/Toast'
import { SCollector, SMap, SMCollectorType } from 'imobile_for_reactnative'
import { getThemeAssets } from '@/assets'
import collectionModule from '../collectionModule'
import AppToolBar from '@/utils/AppToolBar'
import ToolbarModule from '../ToolbarModule'
import { getLanguage } from '@/language'

class TrackModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const data = {"name":"专用公路","type":"line","id":965018}

    // 将点采集图层设为当前图层
    const _params = ToolbarModule.getParams()
    const layers = await (_params.getLayers())

    const datasetName = "line_965018"
    for(let i = 0; i < layers.length; i ++) {
      const layerDatasetName = layers[i].datasetName
      if(layerDatasetName === datasetName) {
        ToolbarModule.getParams().setCurrentLayer(layers[i])
      }
    }

    AppToolBar.getProps().setCurrentSymbol(data)
    const type = SMCollectorType.LINE_GPS_PATH
    collectionModule().actions.showCollection(type)

    const timer = setTimeout(async () => {
      await SCollector.startCollect(type)

      clearTimeout(timer)
    }, 1000)


  }
}

export default function() {
  return new TrackModule({
    type: "POSITIONSUBMIT",
    title: getLanguage(global.language).Prompt.TRACK_TOOL,
    size: 'large',
    // image: getThemeAssets().module.icon_map_navigation,
    image: getImage().icon_track,
  })
}
