import { ConstOnline, ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  collectionModule,
  editModule,
  toolModule,
  shareModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class MapCollectionConfig extends Module {
  static key = ChunkType.MAP_COLLECTION
  constructor() {
    super({
      key: MapCollectionConfig.key,
      example: {
        DEFAULT: {
          name: '地理国情普查_示范数据',
          mapName: '国情普查_示范数据',
        },
        JA: {
          name: 'KibanchizuKihonMinato_示范数据',
          mapName: '基盤地図情報_基本項目',
        },
      },
      functionModules: [
        startModule,
        addModule,
        markModule,
        collectionModule,
        editModule,
        toolModule,
        shareModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapCollectionConfig.key,
      title: getLanguage(language).Map_Module.MAP_COLLECTION,
      moduleImage: getThemeAssets().nav.icon_map_collection,
      moduleImageTouch: getThemeAssets().nav.icon_map_collection_touch,
      defaultMapName: this.getExampleName(language).mapName,
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 1,
      licenceType: 0x08,
      mapType: this.mapType,
    })
  }
}
