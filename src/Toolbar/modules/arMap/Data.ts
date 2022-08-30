import { ARAction, SARMap } from "imobile_for_reactnative"
import { getImage } from "../../../assets"
import { IToolbarOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import { ModuleList } from ".."


export function getData(key: ModuleList['ARMAP']): IToolbarOption {
  const option = new ToolbarOption()
  option.showBackground = false
  option.moduleData = {
    showFunction: false,
  }
  switch (key) {
    case 'AR_MAP_SELECT_ELEMENT':
      selectElementOption(option)
      break

  }

  return option
}


function selectElementOption(option: IToolbarOption) {
  option.pageAction = () => {
    SARMap.clearSelection()
    SARMap.setAction(ARAction.SELECT)
  }
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
