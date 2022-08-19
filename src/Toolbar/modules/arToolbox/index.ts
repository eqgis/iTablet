import { getThemeAssets } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import { getData } from "./Data"
import { Platform } from "react-native"
import { SARMap } from "imobile_for_reactnative"



export interface KEYS {
  /** 选择工具 */
  AR_MAP_TOOL_SELECT: 'AR_MAP_TOOL_SELECT'

}

export interface ARMAP_TOOLBOX{
    ARMAP_TOOLBOX: keyof KEYS
}

const arMapToolbox: ToolbarModuleData<ARMAP_TOOLBOX> = {
  name: 'ARMAP_TOOLBOX',
  image: getThemeAssets().functionBar.icon_tool_tools,
  getTitle: () => getLanguage().TOOL_BOX,
  action: async () => {
    const preElement = AppToolBar.getData().selectARElement
    if(preElement && Platform.OS === 'android') {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])
    AppToolBar.show('ARMAP_TOOLBOX', 'AR_MAP_TOOL_SELECT')
  },
  getData: getData,
}

export {
  arMapToolbox
}