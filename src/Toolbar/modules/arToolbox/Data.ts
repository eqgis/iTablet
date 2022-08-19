import { ModuleList } from ".."
import { getImage } from "../../../assets"
import { IToolbarOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import { getLanguage } from "@/language"
import { Platform } from "react-native"
import { SARMap } from "imobile_for_reactnative"


export function getData(key: ModuleList['ARMAP_TOOLBOX']): IToolbarOption {
  const option = new ToolbarOption()
  option.showBackground = true

  switch(key) {
    case 'AR_MAP_TOOL_SELECT':
      selectTool(option)
      break
  }

  return option
}

/** 选择工具 */
function selectTool(option: IToolbarOption) {

  option.listData.data = [
    {
      image: getImage().icon_bar_attribute,
      text: getLanguage().ATTRIBUTE_MAKE,
      onPress: () => {
        AppToolBar.show('ARATTRIBUTE', 'AR_MAP_ATTRIBUTE_SELECTED')
      }
    },
    {
      image: getImage().ar_sandtable,
      text: getLanguage().SAND_TABLE_MAKE,
      onPress: () => {
        AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_CREATE')
      }
    },
    {
      image: getImage().ar_animation,
      text: getLanguage().PANE_ANIMATION,
      onPress: () => {
        AppToolBar.show('ARANIMATION', 'AR_MAP_ANIMATION_HOME')
      }
    },
  ]
}


