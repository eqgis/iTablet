import { ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'

export default class Map3DConfig extends Module {
  constructor () {
    super({
      key: ChunkType.MAP_3D,
      is3D: true,
      example: {
        name_ios: 'OlympicGreen_ios',
        name_android: 'OlympicGreen_android',
      },
      functionModules: [
        {key: 'start3DModule', type: 'MAP_3D_START'},
        {key: 'mark3DModule', type: 'MAP3D_MARK'},
        {key: 'fly3DModule', type: 'MAP3D_TOOL_FLYLIST'},
        {key: 'tool3DModule', type: 'MAP3D_TOOL'},
        {key: 'share3DModule', type: 'MAP_SHARE_MAP3D'},
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