/**
 * 添加
 */
import AddData from './AddData'
import AddAction from './AddAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import CoworkInfo from '../../../../../tabs/Friend/Cowork/CoworkInfo'
import { Toast } from '../../../../../../utils'

class AddModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  setModuleData = async (type, data) => {
    let _data = data
    if (!_data) {
      _data = await AddData.getData(type)
    }
    ToolbarModule.setData({
      type,
      getData: AddData.getData,
      data: _data,
      actions: AddAction,
    })
  }

  action = async () => {
    if (global.coworkMode && CoworkInfo.coworkId !== '') {
      Toast.show(getLanguage(global.language).Friends.ONLINECOWORK_DISABLE_ADD)
      return
    }
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = await AddData.getData(this.type, params)
    const containerType = ToolbarType.list
    const data = ToolbarModule.getToolbarSize(containerType, {})
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      isTouchProgress: false,
      showMenuDialog: false,
      ...data,
      ..._data,
    })
  }
}

export default function() {
  return new AddModule({
    type: ConstToolType.MAP_ADD,
    key: getLanguage(GLOBAL.language).Map_Main_Menu.OPEN,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.OPEN,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_add.png'),
    getData: AddData.getData,
    actions: AddAction,
  })
}
