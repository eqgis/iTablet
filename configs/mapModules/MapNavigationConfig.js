import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'
import mapTabModules from '../mapTabModules'

export default class MapNavigationConfig extends Module {
  constructor (props) {
    super(props)
    this.key = ChunkType.MAP_NAVIGATION
    this.example = {
      name: 'Navigation_示范数据',
    }
    this.functionModules = [
      {key: 'startModule', type: 'MAP_START'},
      {key: 'addModule', type: 'MAP_ADD'},
      {key: 'markModule', type: 'MAP_MARKS'},
      {key: 'navigationModule', type: 'MAP_NAVIGATION_MODULE'},
      {key: 'roadNetModule', type: 'MAP_ROAD_NET_MODULE'},
      {key: 'incrementModule', type: 'MAP_INCREAMENT'},
      {key: 'toolModule', type: 'MAP_TOOLS'},
      {key: 'shareModule', type: 'MAP_SHARE'},
    ]
    this.tabModules = [mapTabModules.MapView, mapTabModules.LayerManager, mapTabModules.LayerAttribute, mapTabModules.MapSetting]
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_NAVIGATION,
      title: getLanguage(language).Map_Module.MAP_NAVIGATION,
      moduleImage: getThemeAssets().nav.icon_map_navigation,
      moduleImageTouch: getThemeAssets().nav.icon_map_navigation_touch,
      defaultMapName: 'beijing',
      baseMapSource: {...ConstOnline.Google},
      baseMapIndex: 1,
      licenceType: 0x20,
    })
  }
}