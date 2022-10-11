import { ModuleList } from "@/Toolbar/modules"
import { SARMap } from "imobile_for_reactnative"
import { IToolbarOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { ExhibitionViewOption } from "./ExhibitionView"


export function getData(key: ModuleList['EXHIBITION']): IToolbarOption {
  const option = new ToolbarOption<ExhibitionViewOption>()
  option.moduleData = {
    page: 'home'
  }
  option.showBackground = false
  switch (key) {
    case 'EXHIBITION_HOME':
      option.moduleData.page = 'home'
      break
    case 'EXHIBITION_SCAN':
      option.moduleData.page = 'scan'
      scanOption(option)
      break
    case 'EXHIBITION_PRESENTATION':
      option.moduleData.page = 'show'
      break
    case 'EXHIBITION_INFRA':
      option.moduleData.page = 'infa'
      break
  }

  return option
}


function scanOption(option: IToolbarOption) {

  option.pageAction = () => {
    SARMap.setAREnhancePosition()
    SARMap.setImageTrackingMode(2)
  }

}
