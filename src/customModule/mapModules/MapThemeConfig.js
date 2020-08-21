import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  themeModule,
  styleModule,
  toolModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapThemeConfig extends Module {
  static key = ChunkType.MAP_THEME
  constructor() {
    super({
      key: MapThemeConfig.key,
      example: {
        EN: {
          name: 'PrecipitationOfUSA',
          mapName: 'PrecipitationOfUSA',
        },
        DEFAULT: {
          name: '湖北',
          mapName: 'LandBuild',
        },
        JA: {
          name: 'YamanashiMap_示范数据',
          mapName: '土地利用・植生図',
        },
      },
      functionModules: [
        startModule,
        addModule,
        markModule,
        themeModule,
        styleModule,
        toolModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapThemeConfig.key,
      title: getLanguage(language).Map_Module.MAP_THEME,
      moduleImage: getThemeAssets().nav.icon_map_theme,
      moduleImageTouch: getThemeAssets().nav.icon_map_theme_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 3,
      licenceType: 0x04,
      mapType: this.mapType,
    })
  }
}
