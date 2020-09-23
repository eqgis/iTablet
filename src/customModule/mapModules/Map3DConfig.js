import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  start3DModule,
  mark3DModule,
  fly3DModule,
  tool3DModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class Map3DConfig extends Module {
  static key = ChunkType.MAP_3D
  constructor() {
    super({
      key: Map3DConfig.key,
      is3D: true,
      example: {
        DEFAULT: [
          {
            name: 'OlympicGreen',
            mapName: 'OlympicGreen',
          },
          {
            name: 'SunCBD',
            mapName: 'SunCBD_webp',
          },
          {
            name: 'SKYCBD',
            mapName: 'SKYCBD_webp',
          },
          {
            name: '珠峰',
            mapName: '珠峰',
          },
        ],
      },
      functionModules: [start3DModule, mark3DModule, fly3DModule, tool3DModule],
      mapType: Module.MapType.SCENE,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: Map3DConfig.key,
      title: getLanguage(language).Map_Module.MAP_3D,
      moduleImage: getThemeAssets().nav.icon_map_3d,
      moduleImageTouch: getThemeAssets().nav.icon_map_3d_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      mapType: this.mapType,
      licenceType: 0x02,
    })
  }
}
