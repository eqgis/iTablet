import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { getImage } from "../../assets"
import { getData } from "./Data"
import ExhibitionView from "./ExhibitionView"


export interface KEYS {
  EXHIBITION_HOME: 'EXHIBITION_HOME'
  EXHIBITION_SCAN: 'EXHIBITION_SCAN'
}

export interface EXHIBITION {
  EXHIBITION: keyof KEYS
}


const exhibitionData: ToolbarModuleData<EXHIBITION> = {
  name: 'EXHIBITION',
  image: getImage().scan,
  getTitle: () => 'test',
  action: () => {},
  getData: getData,
  customView: ExhibitionView,
}

export {
  exhibitionData
}