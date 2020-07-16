import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import NavigationService from '../../containers/NavigationService'

export default class AppletAdd extends Module {
  static key = ChunkType.APPLET_ADD
  constructor() {
    super({
      key: AppletAdd.key,
    })
  }
  
  getChunk = language => {
    return this.createChunk(language, {
      key: AppletAdd.key,
      title: getLanguage(language).Map_Module.APPLET_ADD,
      moduleImage: getThemeAssets().nav.icon_map_add,
      moduleImageTouch: getThemeAssets().nav.icon_map_3d_touch,
      action: () => {
        NavigationService.navigate('Applet', { type: 'APPLET' })
      },
    })
  }
}


