import { ChunkType, ConstToolType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  collectionModule,
  editModule,
  toolModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapCollectionConfig extends Module {
  static key = ChunkType.MAP_COLLECTION
  constructor() {
    super({
      key: MapCollectionConfig.key,
      example: {
        DEFAULT: [
          {
            name: '地理国情普查',
            mapName: '国情普查_示范数据',
          },
        ],
        JA: {
          name: 'KibanchizuKihonMinato',
          mapName: '基盤地図情報_基本項目',
        },
      },
      functionModules: [
        startModule,
        addModule,
        () => collectionModule(ConstToolType.COLLECTION),
        editModule,
        () => collectionModule(ConstToolType.MAP_TEMPLATE_CREATE),
        toolModule,
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
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      licenceType: 0x08,
      mapType: this.mapType,
    })
  }
}
