import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'

export default class MapEditConfig extends Module {
  constructor () {
    super({
      key: ChunkType.MAP_EDIT,
      example: {
        name_en: 'LosAngeles',
        name_cn: '湖南',
      },
      functionModules: [
        {key: 'startModule', type: 'MAP_START'},
        {key: 'addModule', type: 'MAP_ADD'},
        {key: 'markModule', type: 'MAP_MARKS'},
        {key: 'toolModule', type: 'MAP_TOOLS'},
        {key: 'shareModule', type: 'MAP_SHARE'},
      ],
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_EDIT,
      title: getLanguage(language).Map_Module.MAP_EDIT,
      moduleImage: getThemeAssets().nav.icon_map_edit,
      moduleImageTouch: getThemeAssets().nav.icon_map_edit_touch,
      defaultMapName: language === 'CN' ? '湖南' : 'LosAngeles',
      baseMapSource: {...ConstOnline.Google},
      baseMapIndex: 3,
      licenceType: 0x01,
    })
  }
}