import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  navigationModule,
  roadNetModule,
  incrementModule,
  toolModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapNavigationConfig extends Module {
  static key = ChunkType.MAP_NAVIGATION
  constructor() {
    super({
      key: MapNavigationConfig.key,
      example: {
        DEFAULT: {
          name: 'Navigation',
          mapName: 'beijing',
        },
      },
      functionModules: [
        startModule,
        addModule,
        markModule,
        navigationModule,
        roadNetModule,
        incrementModule,
        toolModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapNavigationConfig.key,
      title: getLanguage(language).Map_Module.MAP_NAVIGATION,
      moduleImage: getThemeAssets().nav.icon_map_navigation,
      moduleImageTouch: getThemeAssets().nav.icon_map_navigation_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      licenceType: 0x20,
      mapType: this.mapType,
    })
  }
}
