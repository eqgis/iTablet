import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'

export default class MapAnalystConfig extends Module {
  constructor () {
    super({
      key: ChunkType.MAP_ANALYST,
      example: {
        name: '数据分析数据',
      },
      functionModules: [
        {key: 'startModule', type: 'MAP_START'},
        {key: 'addModule', type: 'MAP_ADD'},
        {key: 'markModule', type: 'MAP_MARKS'},
        {key: 'analysisModule', type: 'MAP_ANALYSIS'},
        {key: 'styleModule', type: 'MAP_STYLE'},
        {key: 'toolModule', type: 'MAP_TOOLS'},
        {key: 'shareModule', type: 'MAP_SHARE'},
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
      baseMapSource: {...ConstOnline.Google},
      baseMapIndex: 1,
      licenceType: 0x40,
    })
  }
}