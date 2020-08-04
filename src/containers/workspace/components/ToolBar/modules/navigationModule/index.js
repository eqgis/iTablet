import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class MarkModule extends FunctionModule {
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
  return new MarkModule({
    type: ConstToolType.MAP_NAVIGATION_MODULE,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.NAVIGATION_START,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.NAVIGATION_START,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_navigation,
  })
}
