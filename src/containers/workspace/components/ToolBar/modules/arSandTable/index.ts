import { getImage } from "@/assets";
import FunctionModule from "@/class/FunctionModule";
import { getLanguage } from "@/language";
import { AppToolBar } from "@/utils";



class ArSandTable extends FunctionModule {

  
  action =  (type: any) => {
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