import { getLanguage } from '@/language'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import { getImage } from '../../assets/Image'
import NavigationService from '@/containers/NavigationService'
import CallDetailData from './CallDetailData'
import CallDetailAction from './CallDetailAction'
import { AppletsToolType } from '../../constants'
import { dp } from '@/utils'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'

const defaultCallDetailModule = function () {
  return _CallDetailModule
}

/**
 * 呼叫详情页面
 */
class CallDetailModule extends CustomFunctionModule {
  constructor(props: {
      type: string // 自定义类型
      title: string // title
      size: string // 图片尺寸
      image: any // 图片
      getData: (type: string | number) => { data: any[]; buttons: any[]; } // 当前Function模块获取数据的方法
      actions: any,
      getHeaderData?: (type: string | number) => unknown,  // 类型参考Header
      getHeaderView?: (type: string | number) => unknown,  // 返回一个组件

    }) {
    super(props)
  }

  action = () => {
    this.setModuleData(this.type)
    // NavigationService.navigate('ContactsList')
  }


  getToolbarSize = (type: string,  orientation, additional: Object) => {
    let data = {}
    switch (additional.type) {
      case AppletsToolType.APPLETS_CALL_DETAIL_HOME:
        data.height = dp(88) * 3
        break
      default:
        data.height = 0
        break
    }
    return data
  }
}

const _CallDetailModule = function () {
  return new CallDetailModule({
    type: AppletsToolType.APPLETS_CALL_DETAIL_HOME,                               // 自定义类型
    title: "呼叫详情", // getLanguage(global.language).Prompt.CALL, // title
    size: 'large',                                      // 图片尺寸
    image: getImage().telephone1,             // 图片
    // getHeaderData: CallDetailData.getHeaderData,
    getHeaderView: CallDetailData.getHeaderView,
    getData: CallDetailData.getData,                          // 当前Function模块获取数据的方法
    actions: CallDetailAction,                                // 当前Function模块所有事件
  })
}

export default defaultCallDetailModule