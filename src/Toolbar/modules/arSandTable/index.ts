import { getImage } from "@/assets"
import { AppToolBar } from "@/utils"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import BottomView from "./BottomView"
import { getData } from "./Data"
import SandTableView from "./SandTableView"

/** AR 地图 */
export interface KEYS {
  //创建沙盘模型
  AR_SAND_TABLE_CREATE: 'AR_SAND_TABLE_CREATE'
  AR_SAND_TABLE_MODIFY: 'AR_SAND_TABLE_MODIFY'

  AR_SAND_TABLE_MODEL_LIST: 'AR_SAND_TABLE_MODEL_LIST'

  AR_SAND_TABLE_ADD: 'AR_SAND_TABLE_ADD'
  AR_SAND_TABLE_ADD_MODEL: 'AR_SAND_TABLE_ADD_MODEL'

  AR_SAND_TABLE_EDIT: 'AR_SAND_TABLE_EDIT'
  AR_SAND_TABLE_EDIT_ALIGN: 'AR_SAND_TABLE_EDIT_ALIGN'
}

export interface ARSANDTABLE {
  ARSANDTABLE: keyof KEYS
}


const arSandTableData: ToolbarModuleData<ARSANDTABLE> = {
  name: 'ARSANDTABLE',
  image: getImage().ar_sandtable,
  getTitle: () => getLanguage().SAND_TABLE,
  action: () => {
    AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_ADD')
  },
  getData: getData,
  customView: SandTableView,
  customViewBottom: BottomView,
}

export {
  arSandTableData
}