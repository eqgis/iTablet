import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { getData } from "./Data"


interface KEYS {
  //图层设置
  AR_MAP_SETTING_VIEW_BOUNDS: 'AR_MAP_SETTING_VIEW_BOUNDS'
  AR_MAP_SETTING_ANIMATION: 'AR_MAP_SETTING_ANIMATION'
  AR_MAP_SECONDS_TO_PLAY: 'AR_MAP_SECONDS_TO_PLAY'  // 特效图层的播放时间(s)

}

export interface ARMAP_SETTING {
  ARMAP_SETTING: keyof KEYS
}

export const arMapSettingData: ToolbarModuleData<ARMAP_SETTING> = {
  name: 'ARMAP_SETTING',
  image: getImage().setting,
  getTitle: () => getLanguage().SETTING,
  action: () => {/** 基本从其他页面跳转过来的 */},
  getData: getData,
}