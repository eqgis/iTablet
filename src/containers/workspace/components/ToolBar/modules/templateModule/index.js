import TempletData from './TemplateData'
import TempletAction from './TemplateAction'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import NavigationService from '../../../../../NavigationService'

class TemplateModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    NavigationService.navigate('TemplateManager')
  }
}

export default function() {
  return new TemplateModule({
    type: ConstToolType.SM_MAP_COLLECTION_TEMPLATE_CREATE,
    title: getLanguage(global.language).Profile.TEMPLATE,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_module.png'),
    getData: TempletData.getData,
    actions: TempletAction,
  })
}
