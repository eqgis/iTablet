import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'
import mapTabModules from '../mapTabModules'

export default class MapPlottingConfig extends Module {
  constructor (props) {
    super(props)
    this.key = ChunkType.MAP_PLOTTING
    this.example = {
      name: '福建_示范数据',
    }
    this.functionModules = [
      {key: 'startModule', type: 'MAP_START'},
      {key: 'addModule', type: 'MAP_ADD'},
      {key: 'markModule', type: 'MAP_MARKS'},
      {key: 'plotModule', type: 'PLOTTING'},
      {key: 'editModule', type: 'MAP_EDIT'},
      {key: 'plotModule', type: 'PLOTTING_ANIMATION'},
      {key: 'toolModule', type: 'MAP_TOOLS'},
      {key: 'shareModule', type: 'MAP_SHARE'},
    ]
    this.tabModules = [mapTabModules.MapView, mapTabModules.LayerManager, mapTabModules.LayerAttribute, mapTabModules.MapSetting]
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_PLOTTING,
      title: getLanguage(language).Map_Module.MAP_PLOTTING,
      moduleImage: getThemeAssets().nav.icon_map_plot,
      moduleImageTouch: getThemeAssets().nav.icon_map_plot_touch,
      defaultMapName: 'TourLine',
      baseMapSource: {...ConstOnline.Google},
      baseMapIndex: 1,
      licenceType: 0x80,
    })
  }
}