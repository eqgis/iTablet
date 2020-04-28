import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'

export default class MapCollectionConfig extends Module {
  constructor () {
    super({
      key: ChunkType.MAP_COLLECTION,
      example: {
        name: '地理国情普查_示范数据',
      },
      functionModules: [
        {key: 'startModule', type: 'MAP_START'},
        {key: 'addModule', type: 'MAP_ADD'},
        {key: 'markModule', type: 'MAP_MARKS'},
        {key: 'collectionModule', type: 'MAP_SYMBOL'},
        {key: 'editModule', type: 'MAP_EDIT'},
        {key: 'toolModule', type: 'MAP_TOOLS'},
        {key: 'shareModule', type: 'MAP_SHARE'},
      ],
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_COLLECTION,
      title: getLanguage(language).Map_Module.MAP_COLLECTION,
      moduleImage: getThemeAssets().nav.icon_map_collection,
      moduleImageTouch: getThemeAssets().nav.icon_map_collection_touch,
      defaultMapName: '国情普查_示范数据',
      baseMapSource: {...ConstOnline.Google},
      baseMapIndex: 1,
      licenceType: 0x08,
    })
  }
}