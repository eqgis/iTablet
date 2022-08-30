import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { getData } from "./Data"

/** AR 地图 */
export interface KEYS {
  //选择对象
  AR_MAP_SELECT_ELEMENT: 'AR_MAP_SELECT_ELEMENT'
}

export interface ARMAP {
  ARMAP: keyof KEYS
}


const arMapData: ToolbarModuleData<ARMAP> = {
  name: 'ARMAP',
  image: getImage().my_armap, //todo
  getTitle: () => getLanguage().ARMAP,
  action: () => {},
  getData: getData,
}

export {
  arMapData
}