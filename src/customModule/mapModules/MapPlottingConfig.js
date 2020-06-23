import { ConstOnline, ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import {
  startModule,
  addModule,
  markModule,
  plotModule,
  editModule,
  toolModule,
  shareModule,
} from '../../containers/workspace/components/ToolBar/modules'

export default class MapPlottingConfig extends Module {
  static key = ChunkType.MAP_PLOTTING
  constructor() {
    super({
      key: MapPlottingConfig.key,
      example: {
        DEFAULT: {
          name: '福建_示范数据',
          mapName: 'TourLine',
        },
      },
      functionModules: [
        startModule,
        addModule,
        markModule,
        () => plotModule('PLOTTING'),
        editModule,
        () => plotModule('PLOTTING_ANIMATION'),
        toolModule,
        shareModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapPlottingConfig.key,
      title: getLanguage(language).Map_Module.MAP_PLOTTING,
      moduleImage: getThemeAssets().nav.icon_map_plot,
      moduleImageTouch: getThemeAssets().nav.icon_map_plot_touch,
      defaultMapName: this.getExampleName(language).mapName,
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 1,
      licenceType: 0x80,
      mapType: this.mapType,
    })
  }
}
