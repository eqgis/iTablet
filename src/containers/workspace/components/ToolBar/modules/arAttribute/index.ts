import { getImage } from "@/assets";
import FunctionModule from "@/class/FunctionModule";
import { getLanguage } from "@/language";
import { arMapToolbox } from "@/Toolbar/modules";
import { AppToolBar } from "@/utils";
import { SARMap } from "imobile_for_reactnative";
import { Platform } from "react-native";



class ArAttribute extends FunctionModule {

  action = async (type: any) => {
    const preElement = AppToolBar.getData().selectARElement
    if(preElement && Platform.OS === 'android') {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])

    AppToolBar.show('ARATTRIBUTE', 'AR_MAP_ATTRIBUTE_SELECTED')
  }
}


export default function() {
  return new ArAttribute({
    type: 'AR_ATTRIBUTE',
    title: getLanguage().ATTRIBUTE_MAKE,
    size: 'large',
    image: getImage().icon_bar_attribute
  })
}