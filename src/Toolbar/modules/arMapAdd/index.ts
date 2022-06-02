import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import ARMapAddView from "./ARMapAddView"

interface KEYS {
 //todo 现在使用 iTablet 以前的 toolbar 实现添加功能
 AR_MAP_ADD: 'AR_MAP_ADD'
}

export interface ARMAP_ADD {
  ARMAP_ADD: keyof KEYS
}


const arMapAddData: ToolbarModuleData<ARMAP_ADD> = {
  name: 'ARMAP_ADD',
  image: getImage().icon_add,
  getTitle: () => getLanguage().ADD,
  action: () => {
    AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD')
  },
  getData: () => new ToolbarOption(),
  customView: ARMapAddView
}

export {
  arMapAddData
}