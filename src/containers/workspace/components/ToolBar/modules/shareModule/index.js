import ShareData from './ShareData'
import ShareAction from './ShareAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'

class ShareModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    const _data = ShareData.getData(this.type, params)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, this.type, {
      containerType: 'table',
      isFullScreen: true,
      ...data,
    })
  }
}

export default function() {
  return new ShareModule({
    type: ConstToolType.SM_MAP_SHARE,
    title: getLanguage(GLOBAL.language).Map_Main_Menu.SHARE,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_share.png'),
    getData: ShareData.getData,
    actions: ShareAction,
  })
}
