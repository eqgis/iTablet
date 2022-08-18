import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import ARMapAddView from "./ARMapAddView"
import { getData } from "./Data"
import { SARMap } from "imobile_for_reactnative"

interface KEYS {
 //todo 现在使用 iTablet 以前的 toolbar 实现添加功能
 AR_MAP_ADD: 'AR_MAP_ADD'
 AR_MAP_ADD_IMAGE: 'AR_MAP_ADD_IMAGE'
  AR_MAP_ADD_VIDEO: 'AR_MAP_ADD_VIDEO'
  AR_MAP_ADD_TEXT: 'AR_MAP_ADD_TEXT'
  AR_MAP_ADD_BUBBLE_TEXT: 'AR_MAP_ADD_BUBBLE_TEXT'
  AR_MAP_ADD_LINE: 'AR_MAP_ADD_LINE'  // 矢量线
  AR_MAP_ADD_MARKER_LINE: 'AR_MAP_ADD_MARKER_LINE' // 矢量符号线
  AR_MAP_ADD_WEBVIEW: 'AR_MAP_ADD_WEBVIEW'
  AR_MAP_ADD_MODEL: 'AR_MAP_ADD_MODEL'
  AR_MAP_ADD_SCENE: 'AR_MAP_ADD_SCENE'
  AR_MAP_ADD_WIDGET: 'AR_MAP_ADD_WIDGET'
  AR_MAP_ADD_ATTRIBUT_WIDGET: 'AR_MAP_ADD_ATTRIBUT_WIDGET'
  AR_MAP_ADD_VIDEO_ALBUM: 'AR_MAP_ADD_VIDEO_ALBUM'
  AR_MAP_ADD_BROCHORE: 'AR_MAP_ADD_BROCHORE'
  AR_MAP_ADD_SANDTABLE: 'AR_MAP_ADD_SANDTABLE'
  AR_MAP_ADD_CHART: 'AR_MAP_ADD_CHART' // 柱状图
  AR_MAP_ADD_PIE_CHART: 'AR_MAP_ADD_PIE_CHART' // 饼图

  AR_MAP_AR_SWITCH_ALBUM:'AR_MAP_AR_SWITCH_ALBUM'
  AR_MAP_AR_SWITCH_VIDEO_ALBUM:'AR_MAP_AR_SWITCH_VIDEO_ALBUM'
  AR_MAP_ADD_SAND_TABLE_ALBUM:'AR_MAP_ADD_SAND_TABLE_ALBUM'
}

export interface ARMAP_ADD {
  ARMAP_ADD: keyof KEYS
}


const arMapAddData: ToolbarModuleData<ARMAP_ADD> = {
  name: 'ARMAP_ADD',
  image: getImage().icon_add,
  getTitle: () => getLanguage().ADD,
  action: async () => {
    const preElement = AppToolBar.getData().selectARElement
    if(preElement) {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])

    AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD')
  },
  getData: getData,
  customView: ARMapAddView
}

export {
  arMapAddData
}