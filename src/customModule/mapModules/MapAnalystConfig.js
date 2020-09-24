import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import { SMap } from 'imobile_for_reactnative'
import {
  startModule,
  addModule,
  markModule,
  analysisModule,
  styleModule,
  toolModule,
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
        addModule,
        markModule,
        () => analysisModule('MAP_ANALYSIS'),
        () => analysisModule('MAP_PROCESS'),
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
      moduleImage: getThemeAssets().nav.icon_map_analysis,
      moduleImageTouch: getThemeAssets().nav.icon_map_analysis_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      mapType: this.mapType,
      licenceType: 0x40,
      preAction: async () => {
        let sdk = await SMap.getPhoneSDK()
        if (sdk <= 24) {
          Toast.show(
            getLanguage(language).Map_Main_Menu.MAP_AR_DONT_SUPPORT_DEVICE,
          )
          return false
        }
        return true
      },
    })
  }
}
