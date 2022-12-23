import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType ,layerManagerData,OpenData} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { Toast } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import FunctionModule from '../../../../../../class/FunctionModule'
import { DatasetType } from 'imobile_for_reactnative'

class changeMapModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const _params = ToolbarModule.getParams()
    //底图
    this.curUserBaseMaps = _params.baseMaps && _params.baseMaps[
      _params.user.currentUser.userId
    ]
    if (!this.curUserBaseMaps) {
      this.curUserBaseMaps = _params.baseMaps['default'] || []
    }
    let data
    let layerManagerDataArr = [...layerManagerData()]
    for (let i = 0, n = this.curUserBaseMaps.length; i < n; i++) {
      let baseMap = this.curUserBaseMaps[i]
      //只保留用户添加的 zhangxt
      if (
        baseMap.DSParams.engineType === 227 ||
        baseMap.DSParams.engineType === 223 ||
        !baseMap.userAdd
      ) {
        continue
      }
      let layerManagerData = {
        title: baseMap.mapName,
        action: () => {
          return OpenData(baseMap, baseMap.layerIndex)
        },
        data: [],
        image: getThemeAssets().layerType.layer_image,
        type: DatasetType.IMAGE,
        themeType: -1,
      }
      layerManagerDataArr.push(layerManagerData)
    }
    data = [
      {
        title: '',
        data: layerManagerDataArr,
      },
    ]
    //'切换底图') {
    ToolbarModule.setData({ type: ConstToolType.SM_MAP_LAYER_BASE_CHANGE }) //切换底图前先清空一下module数据避免点击方法调用错误 add jiakai
    _params.showFullMap(true)
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_BASE_CHANGE, {
      height: ConstToolType.TOOLBAR_HEIGHT[2],
      containerType: 'list',
      data: data,
      isFullScreen: true,
    })
  }
}

export default function() {
  return new changeMapModule({
    type: ConstToolType.SM_AR_NAVI,
    title: getLanguage(global.language).Profile.LAYER,
    size: 'large',
    image: getThemeAssets().mine.my_basemap,
  })
}
