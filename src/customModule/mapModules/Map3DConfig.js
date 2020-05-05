import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  start3DModule,
  mark3DModule,
  fly3DModule,
  tool3DModule,
  share3DModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class Map3DConfig extends Module {
  constructor() {
    super({
      key: ChunkType.MAP_3D,
      is3D: true,
      example: {
        name_ios: 'OlympicGreen_ios',
        name_android: 'OlympicGreen_android',
      },
      functionModules: [
        start3DModule,
        mark3DModule,
        fly3DModule,
        tool3DModule,
        share3DModule,
      ],
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_3D,
      title: getLanguage(language).Map_Module.MAP_3D,
      moduleImage: getThemeAssets().nav.icon_map_3d,
      moduleImageTouch: getThemeAssets().nav.icon_map_3d_touch,
      defaultMapName: language === 'CN' ? '湖南' : 'LosAngeles',
      is3D: this.is3D,
      licenceType: 0x02,
    })
  }
}
