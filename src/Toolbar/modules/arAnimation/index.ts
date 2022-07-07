import { getImage } from "@/assets"
import { getLanguage } from "@/language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "@/utils"
import ARAnimationView from './ARAnimationView'
import BottomView from "./BottomView"
import { getData } from './Data'

interface KEYS {
  //推演动画
  AR_MAP_ANIMATION_HOME: 'AR_MAP_ANIMATION_HOME'
  AR_MAP_ANIMATION_LIST: 'AR_MAP_ANIMATION_LIST'
  AR_MAP_ANIMATION_ADD: 'AR_MAP_ANIMATION_ADD'
  AR_MAP_ANIMATION_DETAIL: 'AR_MAP_ANIMATION_DETAIL'
  AR_MAP_ANIMATION_PLAY: 'AR_MAP_ANIMATION_PLAY'
}

export interface ARANIMATION {
  ARANIMATION: keyof KEYS
}

const arAnimationData: ToolbarModuleData<ARANIMATION> = {
  name: 'ARANIMATION',
  image: getImage().ar_animation,
  getTitle: () => getLanguage().ANIMATION,
  action: () => {
    AppToolBar.show('ARANIMATION', 'AR_MAP_ANIMATION_HOME')
  },
  getData: getData,
  customView: ARAnimationView,
  customViewBottom: BottomView,
}

export {
  arAnimationData
}