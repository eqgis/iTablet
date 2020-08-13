// import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
// import { ToolbarType } from '../../../src/constants'
import { getLanguage } from '../../../src/language'
import { getPublicAssets } from '../../../src/assets'
import { Height, ToolbarType } from '../../../src/constants'
import { screen } from '../../../src/utils'
import FunctionModule from '../../../src/class/FunctionModule'
import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import TourData from './TourData'
import TourAction from './TourAction'

/**
 * 地图右侧工具栏创建旅行轨迹功能
 */
class TourCreate extends FunctionModule {
  constructor (props) {
    super(props)
  }

  getToolbarSize = (containerType, orientation) => { // containerType, orientation, additional
    return { height: Math.max(screen.getScreenHeight(), screen.getScreenWidth()) - Height.TOOLBAR_BUTTONS }
  }

  action = () => {
    this.setModuleData(this.type)
    TourAction.tour()
  }
}

export default function () {
  return new TourCreate({
    type: 'TourCreate',                                 // 自定义类型
    key: getLanguage(GLOBAL.language).Profile.CREATE,   // 组件key
    title: getLanguage(GLOBAL.language).Profile.CREATE, // title
    size: 'large',                                      // 图片尺寸
    image: getPublicAssets().mapTools.tour,             // 图片
    getData: TourData.getData,                          // 当前Function模块获取数据的方法
    actions: TourAction,                                // 当前Function模块所有事件
  })
}
