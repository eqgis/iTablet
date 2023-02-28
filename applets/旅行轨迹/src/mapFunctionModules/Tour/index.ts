// import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
// import { ToolbarType } from '@/constants'
import { getLanguage } from '@/language'
import { getThemeAssets } from '@/assets'
import { Height } from '@/constants'
import { screen } from '@/utils'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import TourData from './TourData'
import TourAction from './TourAction'

export const TourTypes = {
  TOUR: 'TOUR',
}

/**
 * 地图右侧工具栏创建旅行轨迹功能
 */
class TourCreate extends CustomFunctionModule {
  constructor(props: {
      type: string // 自定义类型
      title: string // title
      size: string // 图片尺寸
      image: any // 图片
      getData: (type: any) => Promise<{ data: any[]; buttons: any[]; customView: ((_props: any) => JSX.Element) | null }> // 当前Function模块获取数据的方法
      actions: { tour: () => Promise<void> }
    }) {
    super(props)

    this.setTypes(TourTypes) // 用于检测Type是否可用，避免与系统自带类型冲突
  }

  getToolbarSize = () => { // containerType, orientation, additional
    return { height: Math.max(screen.getScreenHeight(), screen.getScreenWidth()) - Height.TOOLBAR_BUTTONS }
  }

  action = () => {
    this.setModuleData(this.type)
    TourAction.tour()
  }

  getTitle = () => getLanguage(global.language).Profile.CREATE
}

const _TourCreate = new TourCreate({
  type: TourTypes.TOUR,                               // 自定义类型
  title: getLanguage(global.language).Profile.CREATE, // title
  size: 'large',                                      // 图片尺寸
  image: getThemeAssets().mapTools.icon_tool_flightpath,             // 图片
  getData: TourData.getData,                          // 当前Function模块获取数据的方法
  actions: TourAction,                                // 当前Function模块所有事件
})

export default function () {
  return _TourCreate
}
