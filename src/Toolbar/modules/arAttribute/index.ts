import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import ARAttributeView from "./ARAttributeView"
import { getData } from "./Data"



export interface KEYS {
  //浏览对象
  AR_MAP_BROWSE_ELEMENT: 'AR_MAP_BROWSE_ELEMENT'
  //属性
  AR_MAP_ATTRIBUTE: 'AR_MAP_ATTRIBUTE'
  AR_MAP_ATTRIBUTE_STYLE: 'AR_MAP_ATTRIBUTE_STYLE'
  /** 选择对象 */
  AR_MAP_ATTRIBUTE_SELECTED: 'AR_MAP_ATTRIBUTE_SELECTED'

}

export interface ARATTRIBUTE{
  ARATTRIBUTE: keyof KEYS
}

const arAttributeData: ToolbarModuleData<ARATTRIBUTE> = {
  name: 'ARATTRIBUTE',
  image: getImage().icon_layer_attribute, //todo image
  getTitle: () => getLanguage().ATTRIBUTE_MAKE,
  action: () => {
    AppToolBar.addData({
      selectARElement: undefined,
    })
    AppToolBar.show('ARATTRIBUTE', 'AR_MAP_ATTRIBUTE_SELECTED')
  },
  getData: getData,
  customView: ARAttributeView,
}

export {
  arAttributeData
}