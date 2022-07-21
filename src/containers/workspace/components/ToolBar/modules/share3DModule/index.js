import Share3DData from './Share3DData'
import Share3DAction from './Share3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import FunctionModule from '../../../../../../class/FunctionModule'
import { Toast } from '@/utils'

class Share3DModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    if(params.sceneInfo.name === ''){
      // 无场景时，提示打开三维场景
      Toast.show(getLanguage().OPEN_3D_SCENE)
    } else if(params.sceneInfo.isOnlineScence){
      // 是在线场景，直接提示不能分享数据
      Toast.show(getLanguage().ONLINE_3D_SCENES_NOT_SUPPORT_SHARE)
    } else {
      // 有本地场景
      const _data = Share3DData.getData(this.type, params)
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
}

export default function() {
  return new Share3DModule({
    type: ConstToolType.SM_MAP3D_SHARE,
    title: getLanguage(global.language).Map_Main_Menu.SHARE,
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_share.png'),
    getData: Share3DData.getData,
    actions: Share3DAction,
  })
}
