import { SMap, Action } from 'imobile_for_reactnative'
import { getLanguage } from '@/language'
import { Height, ToolbarType } from '@/constants'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import CheckData from './CheckData'
import CheckAction from './CheckAction'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { scaleSize, screen, Toast } from '@/utils'
import { AppletsToolType } from '../../constants'
import { getImage } from '../../assets'

const defaultCheckModule = function () {
  return _CheckModule
}

/**
 * 地图右侧工具栏创建旅行轨迹功能
 */
class CheckModule extends CustomFunctionModule {
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

  getToolbarSize = (containerType, orientation, additional) => { // containerType, orientation, additional
    if (additional.type === AppletsToolType.APPLETS_CHECK_EDIT) {
      return { height: Height.TOOLBAR_BUTTONS + scaleSize(300) }
    }
    return null
  }

  action = () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    CheckAction.startCheck()
    Toast.show(getLanguage(params.language).Prompt.PLEASE_SELECT_OBJECT)
  }
}

const _CheckModule = new CheckModule({
  type: AppletsToolType.APPLETS_CHECK_EDIT,                               // 自定义类型
  title: '核查', // title
  size: 'large',                                      // 图片尺寸
  image: getImage().check,             // 图片
  getData: CheckData.getData,                          // 当前Function模块获取数据的方法
  actions: CheckAction,                                // 当前Function模块所有事件
})

export default defaultCheckModule
