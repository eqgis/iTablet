import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class NavigationModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = () => {
    const _params = ToolbarModule.getParams()
    NavigationService.navigate('NavigationView', {
      changeNavPathInfo: _params.changeNavPathInfo,
    })
  }
}

export default function() {
  return new NavigationModule({
    type: ConstToolType.SM_MAP_NAVIGATION_MODULE,
    title: getLanguage(global.language).Map_Main_Menu.NAVIGATION_START,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_navigation,
  })
}
