import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"
import ARMapEditView from "./ARMapEditView"
import { getData } from "./Data"
import ARMapEditBottom from "./ARMapEditBottom"
import { ARLayerType } from "imobile_for_reactnative"


interface KEYS {
  //编辑对象
  AR_MAP_EDIT_ELEMENT: 'AR_MAP_EDIT_ELEMENT'
  AR_MAP_EDIT_3DLAYER: 'AR_MAP_EDIT_3DLAYER'
  AR_MAP_EDIT_GEOMETRY: 'AR_MAP_EDIT_GEOMETRY'  // 矢量线的编辑
  AR_MAP_EDIT_GEOMETRY_LINE_ADD: 'AR_MAP_EDIT_GEOMETRY_LINE_ADD'  // 矢量线节点在编辑里的添加

  AR_MAP_EDIT_ELEMENT_SETTING: 'AR_MAP_EDIT_ELEMENT_SETTING'
  AR_MAP_EDIT_ELEMENT_SETTING_ARRAY:'AR_MAP_EDIT_ELEMENT_SETTING_ARRAY'
  AR_MAP_EDIT_ELEMENT_SETTING_IITLE:'AR_MAP_EDIT_ELEMENT_SETTING_IITLE'
  AR_MAP_EDIT_ELEMENT_SETTING_BACKGROUND:'AR_MAP_EDIT_ELEMENT_SETTING_BACKGROUND'

  //动画创建
  AR_MAP_EDIT_ADD_ANIME_NODE: 'AR_MAP_EDIT_ADD_ANIME_NODE'
  AR_MAP_EDIT_ADD_ANIME_MODEL: 'AR_MAP_EDIT_ADD_ANIME_MODEL'
  AR_MAP_EDIT_ADD_ANIME_TRANSLATION :'AR_MAP_EDIT_ADD_ANIME_TRANSLATION'
  AR_MAP_EDIT_ADD_ANIME_ROTATION: 'AR_MAP_EDIT_ADD_ANIME_ROTATION'

}

export interface ARMAP_EDIT {
  ARMAP_EDIT: keyof KEYS
}

const arMapEditData: ToolbarModuleData<ARMAP_EDIT> = {
  name: 'ARMAP_EDIT',
  image: getImage().icon_edit,
  getTitle: () => getLanguage().EDIT,
  action: () => {
    AppToolBar.getProps().changeShowAttributeElement()
    AppToolBar.getProps().setPipeLineAttribute([])

    const currentLayer = AppToolBar.getProps().arMapInfo?.currentLayer
    if(currentLayer && (currentLayer.type === ARLayerType.AR3D_LAYER || currentLayer.type === ARLayerType.AR_SCENE_LAYER)) {
      AppToolBar.addData({selectARLayer: currentLayer})
      AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_3DLAYER')
    } else {
      AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ELEMENT')
    }
  },
  getData: getData,
  customView: ARMapEditView,
  customViewBottom: ARMapEditBottom,
}

export {
  arMapEditData
}