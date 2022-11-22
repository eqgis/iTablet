import FunctionModule from '../../../../../../class/FunctionModule'
import TourAction from 'applets/langchaoDemo/src/mapFunctionModules/Langchao/TourAction'
import { getImage } from 'applets/langchaoDemo/src/assets'
import Toast from '@/utils/Toast'
import { SMap, SMCollectorType } from 'imobile_for_reactnative'
import { getThemeAssets } from '@/assets'
import collectionModule from '../collectionModule'
import AppToolBar from '@/utils/AppToolBar'

class TrackModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const data = {"name":"专用公路","type":"line","id":965018}

    AppToolBar.getProps().setCurrentSymbol(data)
    const type = SMCollectorType.LINE_GPS_PATH
    collectionModule().actions.showCollection(type)
  }
}

export default function() {
  return new TrackModule({
    type: "POSITIONSUBMIT",
    title: "轨迹",
    size: 'large',
    image: getThemeAssets().module.icon_map_navigation,
  })
}
