import { getLanguage } from '@/language'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import { getImage } from '../../assets/Image'
import NavigationService from '@/containers/NavigationService'
import { AppletsToolType } from '../../constants'
import { dp } from '@/utils'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { getThemeAssets } from '@/assets'
import { ConstToolType, Height, OpenData, ToolbarType } from '@/constants'
import { DatasetType } from 'imobile_for_reactnative'
import ChangeBaseLayerData from './ChangeBaseLayerData'
import ChangeBaseLayerAction from './ChangeBaseLayerAction'

const defaultChangeBaseLayerModule = function () {
  return _ChangeBaseLayerModule
}

/**
 * 呼叫详情页面
 */
class ChangeBaseLayerModule extends CustomFunctionModule {
  constructor(props: {
      type: string // 自定义类型
      title: string // title
      size: string // 图片尺寸
      image: any // 图片
      getData: (type: string | number) => { data: any[]; buttons: any[]; } // 当前Function模块获取数据的方法
      actions: any,
    }) {
    super(props)
  }

  action = () => {
    this.setModuleData(this.type)
    // NavigationService.navigate('ContactsList')


    const _params = ToolbarModule.getParams()
    //底图
    let curUserBaseMaps = _params.baseMaps && _params.baseMaps[
      _params.user.currentUser.userId
    ]
    if (!curUserBaseMaps) {
      curUserBaseMaps = _params.baseMaps['default'] || []
    }
    const layerManagerDataArr = [...(ChangeBaseLayerAction.layerManagerData())]
    console.warn("layerManagerDataArr: " + JSON.stringify(layerManagerDataArr))
    for (let i = 0, n = curUserBaseMaps.length; i < n; i++) {
      const baseMap = curUserBaseMaps[i]
      //只保留用户添加的 zhangxt
      if (
        baseMap.DSParams.engineType === 227 ||
        baseMap.DSParams.engineType === 223 ||
        !baseMap.userAdd
      ) {
        continue
      }
      const layerManagerData = {
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




    const type = AppletsToolType.APPLETS_CHANGE_BASE_LAYER_HOME
    const { buttons, customView } = ChangeBaseLayerData.getData(type)
    ToolbarModule.getParams().showFullMap(true)
    ToolbarModule.getParams().setToolbarVisible(true, type, {
      isFullScreen: true,
      // height: dp(88 * 10),
      // data,
      buttons,
      containerType: ToolbarType.list,
      customView: customView && (() => customView(layerManagerDataArr)),
      // column,
      cb: () => {
      },
    })

  }

  // action01 = async () => {
  //   const _params = ToolbarModule.getParams()
  //   //底图
  //   let curUserBaseMaps = _params.baseMaps && _params.baseMaps[
  //     _params.user.currentUser.userId
  //   ]
  //   if (!curUserBaseMaps) {
  //     curUserBaseMaps = _params.baseMaps['default'] || []
  //   }
  //   let data
  //   const layerManagerDataArr = [...layerManagerData()]
  //   for (let i = 0, n = curUserBaseMaps.length; i < n; i++) {
  //     const baseMap = curUserBaseMaps[i]
  //     //只保留用户添加的 zhangxt
  //     if (
  //       baseMap.DSParams.engineType === 227 ||
  //       baseMap.DSParams.engineType === 223 ||
  //       !baseMap.userAdd
  //     ) {
  //       continue
  //     }
  //     const layerManagerData = {
  //       title: baseMap.mapName,
  //       action: () => {
  //         return OpenData(baseMap, baseMap.layerIndex)
  //       },
  //       data: [],
  //       image: getThemeAssets().layerType.layer_image,
  //       type: DatasetType.IMAGE,
  //       themeType: -1,
  //     }
  //     layerManagerDataArr.push(layerManagerData)
  //   }
  //   data = [
  //     {
  //       title: '',
  //       data: layerManagerDataArr,
  //     },
  //   ]
  //   //'切换底图') {
  //   ToolbarModule.setData({ type: ConstToolType.SM_MAP_LAYER_BASE_CHANGE }) //切换底图前先清空一下module数据避免点击方法调用错误 add jiakai
  //   _params.showFullMap(true)
  //   _params.setToolbarVisible(true, ConstToolType.SM_MAP_LAYER_BASE_CHANGE, {
  //     height: ConstToolType.TOOLBAR_HEIGHT[2],
  //     containerType: 'list',
  //     data: data,
  //     isFullScreen: true,
  //   })
  // }


  getToolbarSize = (type: string,  orientation, additional: Object) => {
    const data = {}
    switch (additional.type) {
      case AppletsToolType.APPLETS_CHANGE_BASE_LAYER_HOME:
        data.height = dp(88) * 2
        break
      default:
        data.height = 0
        break
    }
    console.warn("change base layer size" + type + " - " + additional.type + " - " +  data.height)
    return data
  }
}

const _ChangeBaseLayerModule = function () {
  return new ChangeBaseLayerModule({
    type: AppletsToolType.APPLETS_CHANGE_BASE_LAYER_HOME,                               // 自定义类型
    title: getLanguage(global.language).Profile.LAYER, // title
    size: 'large',                                      // 图片尺寸
    image: getThemeAssets().mine.my_basemap,             // 图片
    getData: ChangeBaseLayerData.getData,                          // 当前Function模块获取数据的方法
    actions: ChangeBaseLayerAction,                                // 当前Function模块所有事件
  })
}

export default defaultChangeBaseLayerModule