import { getImage } from "@/assets"
import FunctionModule from "@/class/FunctionModule"
import { getLanguage } from "@/language"
import { AppToolBar } from "@/utils"
import { SARMap } from "imobile_for_reactnative"
import { Platform } from "react-native"



class ArAnimation extends FunctionModule {

  action = async (type: any) => {
    const preElement = AppToolBar.getData().selectARElement
    if(preElement && Platform.OS === 'android') {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])

    AppToolBar.show('ARANIMATION', 'AR_MAP_ANIMATION_HOME')
  }
}


export default function() {
  return new ArAnimation({
    type: 'AR_ANIMATION',
    title: getLanguage().ANIMATION,
    size: 'large',
    image: getImage().ar_animation
  })
}