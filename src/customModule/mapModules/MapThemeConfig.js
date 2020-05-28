import { ConstOnline, ChunkType } from '../../constants'
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
  shareModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class MapThemeConfig extends Module {
  static key = ChunkType.MAP_THEME
  constructor() {
    super({
      key: MapThemeConfig.key,
      example: {
        name_en: 'PrecipitationOfUSA',
        name_cn: '湖北',
      },
      functionModules: [
        startModule,
        addModule,
        markModule,
        themeModule,
        styleModule,
        toolModule,
        shareModule,
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
      defaultMapName:
        GLOBAL.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 3,
      licenceType: 0x04,
      mapType: this.mapType,
    })
  }
}
