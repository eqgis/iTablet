import StartData from './StartData'
import StartAction from './StartAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class StartModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = StartData.getData(this.type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      ...data,
      ..._data,
    })
  }
}

export default function() {
  return new StartModule({
    type: ConstToolType.MAP_START,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.START,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.START,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_start.png'),
    getData: StartData.getData,
    actions: StartAction,
  })
}
