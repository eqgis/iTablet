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
      option.moduleData.page = 'infra'
      break
    case 'EXHIBITION_DR_SUPERMAP':
      option.moduleData.page = 'dr_supermap'
      break
    case 'EXHIBITION_SUPERMAP_BUILDING':
      option.moduleData.page = 'supermap_building'
      break
    case 'EXHIBITION_SANDBOX':
      option.moduleData.page = 'sandbox'
      break
    case 'EXHIBTION_AR_3D_MAP':
      option.moduleData.page = 'ar_3d_map'
      break
    case 'EXHIBITION_FLAT_MAP':
      option.moduleData.page = 'flat'
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
