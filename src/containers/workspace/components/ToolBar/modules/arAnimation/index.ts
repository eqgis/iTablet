import { getImage } from "@/assets";
import FunctionModule from "@/class/FunctionModule";
import { getLanguage } from "@/language";
import { AppToolBar } from "@/utils";



class ArAnimation extends FunctionModule {

  action = (type: any) => {
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