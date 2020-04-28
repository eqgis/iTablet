/**
 * 采集
 */
import CollectionData from './CollectionData'
import CollectionAction from './CollectionAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class CollectionModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = CollectionData.getData(this.type)
    const containerType = ToolbarType.tabs
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
      isFullScreen: true,
      containerType: ToolbarType.tabs,
      ...data,
    })
  }
}

export default function() {
  return new CollectionModule({
    type: ConstToolType.COLLECTION,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.COLLECTION,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_symbol.png'),
    getData: CollectionData.getData,
    actions: CollectionAction,
  })
}
