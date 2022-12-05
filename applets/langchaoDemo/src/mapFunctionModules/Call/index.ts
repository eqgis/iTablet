import { getLanguage } from '@/language'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import { getImage } from '../../assets/Image'
import NavigationService from '@/containers/NavigationService'

const defaultCallModule = function () {
  return _CallModule
}

/**
 * 地图右侧工具栏创建旅行轨迹功能
 */
class CallModule extends CustomFunctionModule {
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
    // this.setModuleData(this.type)
    NavigationService.navigate('ContactsList')
  }
}

const _CallModule = function () {
  return new CallModule({
    type: "CALL",                               // 自定义类型
    title: getLanguage(global.language).Prompt.CALL, // title
    size: 'large',                                      // 图片尺寸
    image: getImage().telephone1,             // 图片
    getData: () => {
      return {data: [], buttons: [],}
    },                          // 当前Function模块获取数据的方法
    actions: () => {},                                // 当前Function模块所有事件
  })
}

export default defaultCallModule