import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import { AppToolBar } from "@/utils"
import { SARMap } from "imobile_for_reactnative"
import { Platform } from 'react-native'

class ArNaviModule extends FunctionModule {
  constructor(props) {
    super(props)
  }



  action = async () => {

    const preElement = AppToolBar.getData().selectARElement
    if(preElement && Platform.OS === 'android') {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])

    const _params = ToolbarModule.getParams()

    _params.showArNavi && _params.showArNavi(true)
    _params.showFullMap && _params.showFullMap(true)

  }
}

export default function() {
  return new ArNaviModule({
    type: ConstToolType.SM_AR_NAVI,
    title: getLanguage().Map_Label.NAVIGATION,
    size: 'large',
    image: getThemeAssets().mine.ar_navigation,
    getData: () => [],
    getMenuData: () => [],
  })
}
