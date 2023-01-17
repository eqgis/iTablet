/**
 * 飞行轨迹
 */
import { SScene } from 'imobile_for_reactnative'
import Fly3DData from './Fly3DData'
import Fly3DAction from './Fly3DAction'
import ToolbarModule from '../ToolbarModule'
import { ToolbarType, ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class Fly3DModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    const params = ToolbarModule.getParams()
    const _data = await Fly3DData.getData(this.type, params)
    const containerType = ToolbarType.list
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    this.setModuleData(this.type)
    params.showFullMap && params.showFullMap(true)
    SScene.setOperation('startMeasure')
    params.setToolbarVisible(true, this.type, {
      containerType,
      ...data,
      data: _data.data,
      buttons: _data.buttons,
    })
  }
}

export default function() {
  return new Fly3DModule({
    type: ConstToolType.SM_MAP3D_FLY_LIST,
    title: getLanguage(global.language).Map_Main_Menu.FLY,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_flight,
    getData: Fly3DData.getData,
    actions: Fly3DAction,
  })
}
