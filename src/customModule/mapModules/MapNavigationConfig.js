import { ConstOnline, ChunkType } from '../../constants'
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
  shareModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class MapNavigationConfig extends Module {
  static key = ChunkType.MAP_NAVIGATION
  constructor() {
    super({
      key: MapNavigationConfig.key,
      example: {
        DEFAULT: {
          name: 'Navigation_示范数据',
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
        shareModule,
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
      defaultMapName: this.getExampleName(language).mapName,
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 1,
      licenceType: 0x20,
      mapType: this.mapType,
    })
  }
}
