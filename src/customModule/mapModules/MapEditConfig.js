import { ConstOnline, ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  toolModule,
  shareModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class MapEditConfig extends Module {
  constructor() {
    super({
      key: ChunkType.MAP_EDIT,
      example: {
        name_en: 'LosAngeles',
        name_cn: '湖南',
      },
      functionModules: [
        startModule(),
        addModule(),
        markModule(),
        toolModule(),
        shareModule(),
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
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 3,
      licenceType: 0x01,
    })
  }
}
