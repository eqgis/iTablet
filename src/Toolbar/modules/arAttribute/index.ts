import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "../../../SMToolbar/ToolbarModuleData"
import { AppToolBar } from "../../../utils"
import ARAttributeView from "./ARAttributeView"
import { getData } from "./Data"



export interface KEYS {
  //浏览对象
  AR_MAP_BROWSE_ELEMENT: 'AR_MAP_BROWSE_ELEMENT'
  //属性
  AR_MAP_ATTRIBUTE: 'AR_MAP_ATTRIBUTE'
  AR_MAP_ATTRIBUTE_STYLE: 'AR_MAP_ATTRIBUTE_STYLE'

}

export interface ARATTRIBUTE{
  ARATTRIBUTE: keyof KEYS
}

const arAttributeData: ToolbarModuleData<ARATTRIBUTE> = {
  name: 'ARATTRIBUTE',
  image: getImage().icon_layer_attribute, //todo image
  getTitle: () => getLanguage().ATTRIBUTE,
  action: () => {
    AppToolBar.addData({
      selectARElement: undefined,
    })
    AppToolBar.show('ARATTRIBUTE', 'AR_MAP_BROWSE_ELEMENT')
  },
  getData: getData,
  customView: ARAttributeView,
}

export {
  arAttributeData
}