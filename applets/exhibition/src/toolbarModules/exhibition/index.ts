import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { getImage } from "../../assets"
import { getData } from "./Data"
import ExhibitionView from "./ExhibitionView"


export interface KEYS {
  //首页
  EXHIBITION_HOME: 'EXHIBITION_HOME'
  // AR识别模块
  EXHIBITION_SCAN: 'EXHIBITION_SCAN'
  // 地图集模块
  EXHIBITION_PRESENTATION: 'EXHIBITION_PRESENTATION'
  // 隐蔽设置，室内管线模块
  EXHIBITION_INFRA:'EXHIBITION_INFRA'
  // 超超博士
  EXHIBITION_DR_SUPERMAP: 'EXHIBITION_DR_SUPERMAP'
  // 超图大厦
  EXHIBITION_SUPERMAP_BUILDING: 'EXHIBITION_SUPERMAP_BUILDING'
  // AR景区沙盘
  EXHIBITION_SANDBOX: 'EXHIBITION_SANDBOX'
  // 立体地图
  EXHIBTION_AR_3D_MAP: 'EXHIBTION_AR_3D_MAP'
  // 平面地图模块
  EXHIBITION_FLAT_MAP: 'EXHIBITION_FLAT_MAP'
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