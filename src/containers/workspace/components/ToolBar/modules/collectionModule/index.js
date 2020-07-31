/**
 * 采集
 */
import CollectionData from './CollectionData'
import CollectionAction from './CollectionAction'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import NavigationService from '../../../../../NavigationService'
import ToolbarModule from '../ToolbarModule'

class CollectionModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    if (this.type === ConstToolType.MAP_TEMPLATE_CREATE) {
      if (params && params.map && params.map.currentMap.path) {
        this.setModuleData(this.type)
        NavigationService.navigate('TemplateManager')
      } else {
        Toast.show(getLanguage(params.language).Template.TEMPLATE_ERROR)
      }
    } else {
      CollectionAction.openTemplate(this.type)
    }
  }
}

export default function(type = ConstToolType.COLLECTION) {
  switch (type) {
    case ConstToolType.MAP_TEMPLATE_CREATE:
      return new CollectionModule({
        type: ConstToolType.MAP_TEMPLATE_CREATE,
        key: getLanguage(GLOBAL.language).Profile.TEMPLATE,
        title: getLanguage(GLOBAL.language).Profile.TEMPLATE,
        size: 'large',
        image: getThemeAssets().functionBar.icon_tool_template,
        getData: CollectionData.getData,
        actions: CollectionAction,
      })
    case ConstToolType.COLLECTION:
      return new CollectionModule({
        type,
        key: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
        title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
        size: 'large',
        image: getThemeAssets().functionBar.icon_tool_collection,
        getData: CollectionData.getData,
        actions: CollectionAction,
      })
  }
}
