import { getImage } from "@/assets"
import { IToolbarOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppEvent, AppToolBar } from "@/utils"
import { ARAction } from "imobile_for_reactnative"
import { SARMap } from "imobile_for_reactnative"
import { ModuleList } from ".."
import { ARAnimationViewOption } from "./ARAnimationView"

export function getData(key: ModuleList['ARANIMATION']): IToolbarOption {
  const option = new ToolbarOption<ARAnimationViewOption>()
  option.showBackground = false
  option.moduleData = {
    arAnimation: 'null',
  }
  switch (key) {
    case 'AR_MAP_ANIMATION_HOME':
      animationHomeOption(option)
      break
    case 'AR_MAP_ANIMATION_LIST':
      option.moduleData.arAnimation = 'list'
      option.showBackground = true
      animationBackOption(option)
      break
    case 'AR_MAP_ANIMATION_ADD':
      option.moduleData.arAnimation = 'add'
      option.showBackground = true
      animationBackOption(option)
      break
    case 'AR_MAP_ANIMATION_DETAIL':
      option.moduleData.arAnimation = 'detail'
      option.showBackground = true
      animationBackOption(option)
      break
    case 'AR_MAP_ANIMATION_PLAY':
      option.moduleData.arAnimation = 'playing'
      break
  }

  return option
}

/** 推演动画入口 */
function animationHomeOption(option: IToolbarOption) {
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
        AppEvent.emitEvent('ar_animation_exit')
        AppToolBar.goBack()
      }
    }, {
      image: getImage().icon_list,
      onPress: () => {
        AppToolBar.show('ARANIMATION', 'AR_MAP_ANIMATION_LIST')
      }
    }, {
      image: getImage().icon_play,
      onPress: () => {
        AppEvent.emitEvent('ar_animation_play')
      }
    }, {
      image: getImage().setting,
      onPress: () => {
        AppToolBar.show('ARANIMATION', 'AR_MAP_ANIMATION_DETAIL')
      }
    }, {
      image: getImage().icon_submit,
      onPress: () => {
        SARMap.setAction(ARAction.NULL)
        SARMap.clearSelection()
        AppEvent.emitEvent('ar_animation_save')
      }
    }
  ]
}

function animationBackOption(option: ToolbarOption<ARAnimationViewOption>) {

  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    ability: 'back',
    onPress: AppToolBar.goBack
  }]
}

