import { getImage } from "@/assets"
import { getLanguage } from "@/language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import {  AppToolBar } from "@/utils"
import ARMapAddView from "./ARMapAddView"
import { getData } from "./Data"
import FunctionModule from "@/class/FunctionModule"
import { getThemeAssets } from '../../../../../../assets'
import { Actions } from "./Actions"

interface KEYS {
  // 添加对象
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


// const arMapAddData: ToolbarModuleData<ARMAP_ADD> = {
//   name: 'ARMAP_ADD',
//   image: getImage().add,
//   getTitle: () => getLanguage().ADD,
//   action: () => {
//     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD')
//   },
//   getData: getData,
//   customView: ARMapAddView
// }

// export {
//   arMapAddData
// }

class ARMapAdd extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = () => {
    console.warn("surver toolbar add")
    AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD')
  }

}

export default function() {
  return new ARMapAdd({
    type: 'ARMAP_ADD',
    title: getLanguage().ADD,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_add,
    getData: getData,
    actions: Actions,
    customView: ARMapAddView,
  })
}
