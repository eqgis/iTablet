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
  constructor() {
    super({
      key: ChunkType.MAP_NAVIGATION,
      example: {
        name: 'Navigation_示范数据',
      },
      functionModules: [
        startModule(),
        addModule(),
        markModule(),
        navigationModule(),
        roadNetModule(),
        incrementModule(),
        toolModule(),
        shareModule(),
      ],
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_NAVIGATION,
      title: getLanguage(language).Map_Module.MAP_NAVIGATION,
      moduleImage: getThemeAssets().nav.icon_map_navigation,
      moduleImageTouch: getThemeAssets().nav.icon_map_navigation_touch,
      defaultMapName: 'beijing',
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 1,
      licenceType: 0x20,
    })
  }
}
