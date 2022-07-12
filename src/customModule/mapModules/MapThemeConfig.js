import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  themeModule,
  styleModule,
  toolModule,
  changeMapModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapThemeConfig extends Module {
  static key = ChunkType.MAP_THEME
  constructor() {
    super({
      key: MapThemeConfig.key,
      example: {
        DEFAULT: [
          {
            name: 'PrecipitationOfUSA',
            mapName: 'PrecipitationOfUSA',
          },
          {
            name: 'SanFrancisco',
            mapName: 'SanFrancisco',
          },
          {
            name: 'Australia',
            mapName: 'LandUse_800m_Secondary',
          },
        ],
        CN: [
          {
            name: '湖北',
            mapName: 'LandBuild',
          },
          {
            name: '长江三角洲区域图',
            mapName: '长江三角洲区域图',
          },
          {
            name: '中国省级区划图',
            mapName: 'China1',
          },
          {
            name: '北京统计专题地图',
            mapName: '北京统计专题',
          },
          {
            name: '江苏',
            mapName: '江苏省级黑色风格',
          },
          {
            name: '江苏餐馆分布格网图',
            mapName: '餐馆密度网格图',
          },
          {
            name: 'Australia',
            mapName: 'LandUse_800m_Secondary',
          },
        ],
        JA: [
          {
            name: 'YamanashiMap',
            mapName: '土地利用・植生図',
          },
          {
            name: 'Australia',
            mapName: 'LandUse_800m_Secondary',
          },
        ],
      },
      functionModules: [
        startModule,
        changeMapModule,
        addModule,
        markModule,
        themeModule,
        styleModule,
        toolModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapThemeConfig.key,
      title: getLanguage(language).Map_Module.MAP_THEME,
      moduleImage: getThemeAssets().module.icon_map_theme,
      moduleImageTouch: getThemeAssets().module.icon_map_theme_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 3,
      mapType: this.mapType,
    })
  }
}
