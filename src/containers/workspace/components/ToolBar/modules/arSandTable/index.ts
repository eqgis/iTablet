import { getImage } from "@/assets"
import FunctionModule from "@/class/FunctionModule"
import { getLanguage } from "@/language"
import { AppToolBar } from "@/utils"
import { SARMap } from "imobile_for_reactnative"



class ArSandTable extends FunctionModule {


  action = async (type: any) => {
    const preElement = AppToolBar.getData().selectARElement
    if(preElement) {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])
    AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_CREATE')
  }
}


export default function() {
  return new ArSandTable({
    type: 'AR_SAND_TABLE',
    title: getLanguage().SAND_TABLE,
    size: 'large',
    image: getImage().ar_sandtable
  })
}