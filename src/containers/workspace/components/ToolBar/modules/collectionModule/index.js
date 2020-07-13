/**
 * 采集
 */
import CollectionData from './CollectionData'
import CollectionAction from './CollectionAction'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import NavigationService from '../../../../../NavigationService'

class CollectionModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    
    if (this.type === ConstToolType.MAP_TEMPLATE_CREATE) {
      this.setModuleData(this.type)
      NavigationService.navigate('TemplateManager')
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
        image: require('../../../../../../assets/function/icon_function_module.png'),
        getData: CollectionData.getData,
        actions: CollectionAction,
      })
      break
    case ConstToolType.COLLECTION:
      return new CollectionModule({
        type,
        key: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
        title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
        size: 'large',
        image: require('../../../../../../assets/function/icon_function_symbol.png'),
        getData: CollectionData.getData,
        actions: CollectionAction,
      })
      break
  }
}
