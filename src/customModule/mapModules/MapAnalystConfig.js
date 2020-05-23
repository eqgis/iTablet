import { ConstOnline, ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  analysisModule,
  styleModule,
  toolModule,
  shareModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class MapAnalystConfig extends Module {
  constructor() {
    super({
      key: ChunkType.MAP_ANALYST,
      example: {
        name: '数据分析数据',
      },
      functionModules: [
        startModule,
        addModule,
        markModule,
        () => analysisModule('MAP_ANALYSIS'),
        () => analysisModule('MAP_PROCESS'),
        styleModule,
        toolModule,
        shareModule,
      ],
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_ANALYST,
      title: getLanguage(language).Map_Module.MAP_ANALYST,
      moduleImage: getThemeAssets().nav.icon_map_analysis,
      moduleImageTouch: getThemeAssets().nav.icon_map_analysis_touch,
      defaultMapName: 'TracingAnalysis',
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 1,
      licenceType: 0x40,
    })
  }
}
