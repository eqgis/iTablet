import { getImage } from "@/assets";
import FunctionModule from "@/class/FunctionModule";
import { getLanguage } from "@/language";
import { AppToolBar } from "@/utils";



class ArAttribute extends FunctionModule {

  action = (type: any) => {
    AppToolBar.show('ARATTRIBUTE', 'AR_MAP_BROWSE_ELEMENT')
  }
}


export default function() {
  return new ArAttribute({
    type: 'AR_ATTRIBUTE',
    title: getLanguage().ATTRIBUTE,
    size: 'large',
    image: getImage().icon_bar_attribute
  })
}