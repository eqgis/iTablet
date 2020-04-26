import { ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'
import mapTabModules from '../mapTabModules'

export default class Map3DConfig extends Module {
  constructor (props) {
    super(props)
    this.key = ChunkType.MAP_3D
    this.example = {
      name_ios: 'OlympicGreen_ios',
      name_android: 'OlympicGreen_android',
    }
    this.functionModules = [
      {key: 'start3DModule', type: 'MAP_3D_START'},
      {key: 'mark3DModule', type: 'MAP3D_MARK'},
      {key: 'fly3DModule', type: 'MAP3D_TOOL_FLYLIST'},
      {key: 'tool3DModule', type: 'MAP3D_TOOL'},
      {key: 'share3DModule', type: 'MAP_SHARE_MAP3D'},
    ]
    this.tabModules = [mapTabModules.Scene, mapTabModules.Layer3DManager, mapTabModules.LayerAttribute3D, mapTabModules.Map3DSetting]
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_3D,
      title: getLanguage(language).Map_Module.MAP_3D,
      moduleImage: getThemeAssets().nav.icon_map_3d,
      moduleImageTouch: getThemeAssets().nav.icon_map_3d_touch,
      defaultMapName: language === 'CN' ? '湖南' : 'LosAngeles',
      is3D: true,
      licenceType: 0x02,
    })
  }
}