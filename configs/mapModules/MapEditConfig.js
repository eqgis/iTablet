import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'
import mapTabModules from '../mapTabModules'

export default class MapEditConfig extends Module {
  constructor (props) {
    super(props)
    this.key = ChunkType.MAP_EDIT
    this.example = {
      name_en: 'LosAngeles',
      name_cn: '湖南',
    }
    this.functionModules = [
      {key: 'startModule', type: 'MAP_START'},
      {key: 'addModule', type: 'MAP_ADD'},
      {key: 'markModule', type: 'MAP_MARKS'},
      {key: 'toolModule', type: 'MAP_TOOLS'},
      {key: 'shareModule', type: 'MAP_SHARE'},
    ]
    this.tabModules = [mapTabModules.MapView, mapTabModules.LayerManager, mapTabModules.LayerAttribute, mapTabModules.MapSetting]
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_EDIT,
      title: getLanguage(language).Map_Module.MAP_EDIT,
      moduleImage: getThemeAssets().nav.icon_map_edit,
      moduleImageTouch: getThemeAssets().nav.icon_map_edit_touch,
      defaultMapName: language === 'CN' ? '湖南' : 'LosAngeles',
      baseMapSource: {...ConstOnline.Google},
      baseMapIndex: 3,
      licenceType: 0x01,
    })
  }
}