import { getImage } from "@/assets"
import { ModuleList } from "@/Toolbar/modules"
import { AppToolBar } from "@/utils"
import { ARAction, SARMap } from "imobile_for_reactnative"
import { IToolbarOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"


export function getData(key: ModuleList['EXHIBITION']): IToolbarOption {
  const option = new ToolbarOption()
  option.showBackground = false
  switch (key) {
    case 'EXHIBITION_HOME':
      homeOption(option)
      break

  }

  return option
}


function homeOption(option: IToolbarOption) {

  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        SARMap.setAction(ARAction.NULL)
        SARMap.clearSelection()
        AppToolBar.hide()
      }
    }
  ]
}
