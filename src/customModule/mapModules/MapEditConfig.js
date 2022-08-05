import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  toolModule,
  changeMapModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapEditConfig extends Module {
  static key = ChunkType.MAP_EDIT

  constructor() {
    super({
      key: MapEditConfig.key,
      example: {
        DEFAULT: [
          {
            name: 'PrecipitationOfUSA',
            mapName: 'LosAngeles',
          },
          {
            name: 'USA',
            mapName: 'USA',
          },
          {
            name: 'LosAngles',
            mapName: 'LosAngles',
          },
        ],
        CN: [
          {
            name: '湖南',
            mapName: '湖南',
          },
          {
            name: '浙江省黑色风格',
            mapName: '浙江省',
          },
        ],
        JA: {
          name: 'YamanashiMap',
          mapName: 'yamanashi',
        },
      },
      functionModules: [startModule, changeMapModule,addModule, markModule, toolModule],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapEditConfig.key,
      title: getLanguage(language).Map_Module.MAP_EDIT,
      moduleImage: getThemeAssets().module.icon_map_edit,
      moduleImageTouch: getThemeAssets().module.icon_map_edit_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 3,
      mapType: this.mapType,
    })
  }
}
