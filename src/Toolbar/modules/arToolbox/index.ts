import { getThemeAssets } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import { getData } from "./Data"



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
  action: () => {
    AppToolBar.getProps().setPipeLineAttribute([])
    AppToolBar.getProps().changeShowAttributeElement()
    AppToolBar.show('ARMAP_TOOLBOX', 'AR_MAP_TOOL_SELECT')
  },
  getData: getData,
}

export {
  arMapToolbox
}