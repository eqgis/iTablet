import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class ArNaviModule extends FunctionModule {
  constructor(props) {
    super(props)
  }



  action = async () => {
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
