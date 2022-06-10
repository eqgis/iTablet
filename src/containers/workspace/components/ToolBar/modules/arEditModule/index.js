import AREditData from './AREditData'
import AREditAction from './AREditAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import { SARMap, ARAction, ARLayerType } from 'imobile_for_reactnative'

class ArEditModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  getToolbarSize = (containerType, orientation, additional) => {
    let data = {}
    data.autoShowBox = false
    const params = ToolbarModule.getParams()
    switch (additional.type) {
      case ConstToolType.SM_AR_EDIT_SETTING:
        data.autoShowBox = true
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 4 / 2
        data.column = 3
        data.row = 1
        break
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE:
      case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND:
      case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_COLOR:
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_COLOR:
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_LINE_COLOR:
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_TIME_COLOR:
      case ConstToolType.SM_AR_EDIT_ANIMATION_BONE_ANIMATION:
        data.autoShowBox = true
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 5 / 2
        data.column = 3
        data.row = 1
        break
      case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_OPACITY:
        data.autoShowBox = true
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3 / 2
        data.column = 3
        data.row = 1
        break
      case ConstToolType.SM_AR_EDIT_SETTING_ARRAY:
        data.autoShowBox = true
        data.height = ConstToolType.TOOLBAR_HEIGHT[2]
        data.column = 4
        data.row = 2
        break
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_COLOR:
        data.autoShowBox = true
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 6 / 2
        break
      case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_WIDTH:
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT_SIZE:
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ROTATION_ANGLE:
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_BUTTON_TEXT_SIZE:
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_OPACITY:
        data.autoShowBox = true
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3 / 2
        break
      case ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT:
        data.autoShowBox = true
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 2 / 2
        break
      case ConstToolType.SM_AR_EDIT_SCALE:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3 / 2
        break
      case ConstToolType.SM_AR_EDIT_POSITION:
      case ConstToolType.SM_AR_EDIT_ROTATION:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 3
        break
      case ConstToolType.SM_AR_EDIT_ANIMATION:
      case ConstToolType.SM_AR_EDIT_ANIMATION_TYPE:
      case ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION:
      case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION:
      case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION_AXIS:
        data.height = ConstToolType.TOOLBAR_HEIGHT[0] * 5 / 2
        break
      case ConstToolType.SM_AR_EDIT:
      default:
        data.height = 0
        data.autoShowBox = true
        break
    }
    if (
      params.arlayer.currentLayer?.type === ARLayerType.AR_SCENE_LAYER ||
      params.arlayer.currentLayer?.type === ARLayerType.AR3D_LAYER
    ) {
      data.autoShowBox = true
    }
    return data
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    const _data = await AREditData.getData(this.type, params)

    params.showFullMap && params.showFullMap(true)
    if (
      params.arlayer.currentLayer?.type === ARLayerType.AR_SCENE_LAYER ||
      params.arlayer.currentLayer?.type === ARLayerType.AR3D_LAYER
    ) {
      SARMap.setAction(ARAction.MOVE)

      ToolbarModule.addData({selectARElement: params.arlayer.currentLayer.name})
      SARMap.appointEditAR3DLayer(params.arlayer.currentLayer.name)
      params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT, {
        isFullScreen: false,
        showMenuDialog: true,
      })
      return
    }

    params.setToolbarVisible(true, this.type, {
      isFullScreen: false,
      buttons: _data.buttons,
    })

    // SARMap.clearSelection()
    // SARMap.setAction(ARAction.MOVE)
    SARMap.setAction(ARAction.SELECT)
  }
}

export default function() {
  return new ArEditModule({
    type: ConstToolType.SM_AR_EDIT,
    title: getLanguage(global.language).Map_Main_Menu.EDIT,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_edit,
    getData: AREditData.getData,
    getHeaderData: AREditData.getHeaderData,
    getHeaderView: AREditData.getHeaderView,
    getMenuData: AREditData.getMenuData,
    actions: AREditAction,
  })
}
