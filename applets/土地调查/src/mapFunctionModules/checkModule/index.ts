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
 * 地图右侧工具栏核查功能
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

  /**
   * 核查中Toolbar各类型自定义高度
   * @param containerType
   * @param orientation
   * @param additional
   * @returns
   */
  getToolbarSize = (containerType, orientation, additional) => { // containerType, orientation, additional
    if (additional.type === AppletsToolType.APPLETS_CHECK_EDIT) {
      return { height: Height.TOOLBAR_BUTTONS + scaleSize(160) }
    }
    return null
  }

  /**
   * 右侧工具栏核查入口方法
   */
  action = () => {
    // 设置当前Toolbar类型
    this.setModuleData(this.type)
    // 获取iTablet公共方法,和redux持久化数据
    const params = ToolbarModule.getParams()
    // 调用核查,打开核查界面
    CheckAction.startCheck()
    Toast.show(getLanguage(params.language).Prompt.PLEASE_SELECT_OBJECT)
  }
}

const _CheckModule = new CheckModule({
  type: AppletsToolType.APPLETS_CHECK_EDIT,            // 自定义类型
  title: '核查',                                        // title
  size: 'large',                                       // 图片尺寸
  image: getImage().check,                             // 图片
  getData: CheckData.getData,                          // 当前Function模块获取数据的方法
  actions: CheckAction,                                // 当前Function模块所有事件
  getHeaderData: CheckData.getHeaderData,              // 自定义Toolbar header
})

export default defaultCheckModule
