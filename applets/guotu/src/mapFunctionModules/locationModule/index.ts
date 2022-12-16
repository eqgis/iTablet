import { getLanguage } from '@/language'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import LocationData from './LocationData'
import LocationAction from './LocationAction'
import { AppletsToolType } from '../../constants'
import { getImage } from '../../assets'
import NavigationService from '@/containers/NavigationService'

const defaultLocationModule = function () {
  return _LocationModule
}

/**
 * 地图右侧工具栏创建旅行轨迹功能
 */
class LocationModule extends CustomFunctionModule {
  constructor(props: {
      type: string // 自定义类型
      title: string // title
      size: string // 图片尺寸
      image: any // 图片
      getData: (type: string) => { data: any[]; buttons: any[]; } // 当前Function模块获取数据的方法
      actions: any,
    }) {
    super(props)
  }

  action = () => {
    this.setModuleData(this.type)
    NavigationService.navigate('GuoTuLocation')
  }
}

const _LocationModule = new LocationModule({
  type: AppletsToolType.APPLETS_LOCATION,                               // 自定义类型
  title: '地区', // title
  size: 'large',                                      // 图片尺寸
  image: getImage().location,             // 图片
  getData: LocationData.getData,                          // 当前Function模块获取数据的方法
  actions: LocationAction,                                // 当前Function模块所有事件
})

export default defaultLocationModule
