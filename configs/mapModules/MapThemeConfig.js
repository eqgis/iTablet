import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'

export default class MapThemeConfig extends Module {
  constructor () {
    super({
      key: ChunkType.MAP_THEME,
      example: {
        name_en: 'PrecipitationOfUSA',
        name_cn: '湖北',
      },
      functionModules: [
        {key: 'startModule', type: 'MAP_START'},
        {key: 'addModule', type: 'MAP_ADD'},
        {key: 'markModule', type: 'MAP_MARKS'},
        {key: 'themeModule', type: 'MAP_THEME'},
        {key: 'styleModule', type: 'MAP_STYLE'},
        {key: 'toolModule', type: 'MAP_TOOLS'},
        {key: 'shareModule', type: 'MAP_SHARE'},
      ],
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_THEME,
      title: getLanguage(language).Map_Module.MAP_THEME,
      moduleImage: getThemeAssets().nav.icon_map_theme,
      moduleImageTouch: getThemeAssets().nav.icon_map_theme_touch,
      defaultMapName: GLOBAL.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      baseMapSource: {...ConstOnline.Google},
      baseMapIndex: 3,
      licenceType: 0x04,
    })
  }
}