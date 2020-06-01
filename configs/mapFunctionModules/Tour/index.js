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

class TourCreate extends FunctionModule {
  constructor (props) {
    super(props)
  }

  getToolbarSize = (containerType, orientation) => { // containerType, orientation, additional
    switch (this.type) {
      case 'TourCreate':
        return { height: Math.max(screen.getScreenHeight(), screen.getScreenWidth()) - Height.TOOLBAR_BUTTONS }
      case 'TourBrowse':
        if (orientation.indexOf('LANDSCAPE') >= 0) {
          return { height: Height.TABLE_ROW_HEIGHT_1 * 8 }
        }
        return null
      default:
        return null
    }
  }

  action = () => {
    this.setModuleData(this.type)
    switch (this.type) {
      case 'TourCreate':
        TourAction.tour()
        break
      case 'TourBrowse': {
        const params = ToolbarModule.getParams()
        // const _data = TourData.getData(this.type, params)
        const containerType = ToolbarType.list
        const data = ToolbarModule.getToolbarSize(containerType, {
          // data: _data.data,
        })
        this.setModuleData(this.type)
        params.showFullMap && params.showFullMap(true)
        params.setToolbarVisible(true, this.type, {
          containerType,
          ...data,
          // data: _data.data,
          // buttons: _data.buttons,
        })
        break
      }
    }
  }
}

export default function (type) {
  switch (type) {
    case 'TourCreate':
      return new TourCreate({
        type: 'TourCreate',
        key: getLanguage(GLOBAL.language).Profile.CREATE,
        title: getLanguage(GLOBAL.language).Profile.CREATE,
        size: 'large',
        image: getPublicAssets().mapTools.tour,
        getData: TourData.getData, // 当前Function模块获取数据的方法
        actions: TourAction, // 当前Function模块所有事件
      })
    case 'TourBrowse':
      return new TourCreate({
        type: 'TourBrowse',
        key: getLanguage(GLOBAL.language).Profile.CREATE,
        title: getLanguage(GLOBAL.language).Profile.CREATE,
        size: 'large',
        image: require('../../../src/assets/function/Frenchgrey/icon_symbolFly.png'),
        getData: TourData.getData, // 当前Function模块获取数据的方法
        actions: TourAction, // 当前Function模块所有事件
      })
  }
}
