import { getThemeAssets } from "@/assets"
import FunctionModule from "@/class/FunctionModule"
import { getLanguage } from "@/language"
import { arMapToolbox } from "@/Toolbar/modules"



class ArToolbox extends FunctionModule {

  action = async (type: any) => {
    arMapToolbox.action()
  }
}


export default function() {
  return new ArToolbox({
    type: 'AR_ATTRIBUTE',
    title: getLanguage().TOOL_BOX,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_tools,
  })
}