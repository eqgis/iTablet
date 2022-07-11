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
  changeMapModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapCollectionConfig extends Module {
  static key = ChunkType.MAP_COLLECTION
  constructor() {
    super({
      key: MapCollectionConfig.key,
      example: {
        CN: [
          {
            name: '地理国情普查',
            mapName: '国情普查_示范数据',
          },
          {
            name: '土地规划分类',
            mapName: '土地规划分类',
          },
        ],
        JA: {
          name: 'KibanchizuKihonMinato',
          mapName: '基盤地図情報_基本項目',
        },
        DEFAULT: {
          name: 'LandCover',
          mapName: 'LandCover',
        },
      },
      functionModules: [
        startModule,
        changeMapModule,
        addModule,
        () => collectionModule(ConstToolType.SM_MAP_COLLECTION),
        editModule,
        () => collectionModule(ConstToolType.SM_MAP_COLLECTION_TEMPLATE_CREATE),
        toolModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapCollectionConfig.key,
      title: getLanguage(language).Map_Module.MAP_COLLECTION,
      moduleImage: getThemeAssets().module.icon_map_collection,
      moduleImageTouch: getThemeAssets().module.icon_map_collection_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      mapType: this.mapType,
    })
  }
}
