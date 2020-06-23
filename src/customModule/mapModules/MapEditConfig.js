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
  static key = ChunkType.MAP_EDIT

  constructor() {
    super({
      key: MapEditConfig.key,
      example: {
        EN: {
          name: 'PrecipitationOfUSA',
          mapName: 'LosAngeles',
        },
        DEFAULT: {
          name: '湖南',
          mapName: '湖南',
        },
        JA: {
          name: 'YamanashiMap_示范数据',
          mapName: 'yamanashi',
        },
      },
      functionModules: [
        startModule,
        addModule,
        markModule,
        toolModule,
        shareModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapEditConfig.key,
      title: getLanguage(language).Map_Module.MAP_EDIT,
      moduleImage: getThemeAssets().nav.icon_map_edit,
      moduleImageTouch: getThemeAssets().nav.icon_map_edit_touch,
      defaultMapName: this.getExampleName(language).mapName,
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 3,
      licenceType: 0x01,
      mapType: this.mapType,
    })
  }
}
