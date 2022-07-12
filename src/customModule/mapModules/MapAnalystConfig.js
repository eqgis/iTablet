import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  analysisModule,
  processModule,
  styleModule,
  toolModule,
  changeMapModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapAnalystConfig extends Module {
  static key = ChunkType.MAP_ANALYST
  constructor() {
    super({
      key: MapAnalystConfig.key,
      example: {
        DEFAULT: {
          name: '数据分析数据',
          mapName: 'TracingAnalysis',
        },
      },
      functionModules: [
        startModule,
        changeMapModule,
        addModule,
        markModule,
        analysisModule,
        processModule,
        styleModule,
        toolModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapAnalystConfig.key,
      title: getLanguage(language).Map_Module.MAP_ANALYST,
      moduleImage: getThemeAssets().module.icon_map_analysis,
      moduleImageTouch: getThemeAssets().module.icon_map_analysis_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      mapType: this.mapType,
    })
  }
}
