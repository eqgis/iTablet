/**
 * 采集
 */
import CollectionData from './CollectionData'
import CollectionAction from './CollectionAction'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { Toast, LayerUtils } from '../../../../../../utils'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import NavigationService from '../../../../../NavigationService'
import ToolbarModule from '../ToolbarModule'
import { SMCollectorType } from 'imobile_for_reactnative'

class CollectionModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    if (this.type === ConstToolType.SM_MAP_COLLECTION_TEMPLATE_CREATE) {
      if (params && params.map && params.map.currentMap.path) {
        this.setModuleData(this.type)
        NavigationService.navigate('TemplateManager')
      } else {
        Toast.show(getLanguage(params.language).Template.TEMPLATE_ERROR)
      }
    } else {
      if (params.currentTask.id) {
        // 若没有当前图层或者当前图层不是我的图层
        let layerType = LayerUtils.getLayerType(params.currentLayer)
        if (layerType === '' || layerType === 'TAGGINGLAYER' || layerType === 'CADLAYER' || layerType === 'TEXTLAYER' ) {
          let info = ''
          switch(layerType) {
            case 'TAGGINGLAYER':
              info = getLanguage(params.language).Analyst_Labels.REGISTRATION_PLEASE_SELECT + getLanguage(params.language).Map_Layer.LAYERS
              break
            case 'CADLAYER':
              info = getLanguage(params.language).Prompt.CANNOT_COLLECT_IN_CAD_LAYERS
              break
            case 'TEXTLAYER':
              info = getLanguage(params.language).Prompt.CANNOT_COLLECT_IN_TEXT_LAYERS
              break
            case '':
              info = getLanguage(params.language).Prompt.CHOOSE_LAYER
              break
          }
          NavigationService.navigate('LayerManager')
          Toast.show(info, {
            duration: 3500,
          })
          return
        }
        // 不能在专题图层采集
        if (
          params.currentLayer.themeType > 0 ||
          params.currentLayer.isHeatmap
        ) {
          NavigationService.navigate('LayerManager')
          Toast.show(getLanguage(global.language).Prompt.CANNOT_COLLECT_IN_THEMATIC_LAYERS, {
            duration: 3500,
          })
          return
        }
        let type = ''
        switch (params.currentLayer.type) {
          case 1:
            type = SMCollectorType.POINT_HAND
            break
          case 3:
            type = SMCollectorType.LINE_HAND_POINT
            break
          case 5:
            type = SMCollectorType.REGION_HAND_POINT
            break
        }
        CollectionAction.showCollection(
          type,
          params.currentLayer.name,
        )
      } else {
        CollectionAction.openTemplate(this.type)
      }
    }
  }
}

export default function(type = ConstToolType.SM_MAP_COLLECTION) {
  switch (type) {
    case ConstToolType.SM_MAP_COLLECTION_TEMPLATE_CREATE:
      return new CollectionModule({
        type: ConstToolType.SM_MAP_COLLECTION_TEMPLATE_CREATE,
        title: getLanguage(global.language).Profile.TEMPLATE,
        size: 'large',
        image: getThemeAssets().functionBar.icon_tool_template,
        getData: CollectionData.getData,
        actions: CollectionAction,
      })
    case ConstToolType.SM_MAP_COLLECTION:
    default:
      return new CollectionModule({
        type: ConstToolType.SM_MAP_COLLECTION,
        title: getLanguage(global.language).Map_Main_Menu.COLLECTION,
        size: 'large',
        image: getThemeAssets().functionBar.icon_tool_collection,
        getData: CollectionData.getData,
        actions: CollectionAction,
      })
  }
}
