/**
 * 图例
 */
import LegendData from './LegendData'
import LegendAction from './LegendAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'

async function action(type) {
  const _params = ToolbarModule.getParams()
  const { mapLegend } = _params
  if (mapLegend[GLOBAL.Type].isShow) {
    mapLegend[GLOBAL.Type] = {
      isShow: true,
      backgroundColor: mapLegend[GLOBAL.Type].backgroundColor,
      column: mapLegend[GLOBAL.Type].column,
      widthPercent: mapLegend[GLOBAL.Type].widthPercent,
      heightPercent: mapLegend[GLOBAL.Type].heightPercent,
      fontPercent: mapLegend[GLOBAL.Type].fontPercent,
      imagePercent: mapLegend[GLOBAL.Type].imagePercent,
      legendPosition: mapLegend[GLOBAL.Type].legendPosition,
    }
  } else {
    mapLegend[GLOBAL.Type] = {
      isShow: true,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    }
  }
  const _data = LegendData.getData(type)
  const containerType = ToolbarType.colorTable
  const data = ToolbarModule.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  _params.setMapLegend(mapLegend)
  _params.setToolbarVisible(true, ConstToolType.SM_MAP_LEGEND, {
    containerType,
    column: data.column,
    isFullScreen: false,
    height: data.height,
    ..._data,
  })
  _params.showFullMap && _params.showFullMap(true)
  _params.navigation.navigate('MapView')
  GLOBAL.toolBox && GLOBAL.toolBox.switchAr(false) // 若是AR地图，则切换到二维地图界面，然后显示图例
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: LegendData.getData,
    getMenuData: LegendData.getMenuData,
    actions: LegendAction,
  })
}

export default function(type, title, customAction) {
  return {
    title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/Navigation/navi_icon.png'),
    getData: LegendData.getData,
    getMenuData: LegendData.getMenuData,
    actions: LegendAction,
    setModuleData,
  }
}
