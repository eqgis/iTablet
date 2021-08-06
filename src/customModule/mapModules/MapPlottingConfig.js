import { ChunkType, ConstToolType } from '../../constants'
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
  changeMapModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils } from '../../utils'

export default class MapPlottingConfig extends Module {
  static key = ChunkType.MAP_PLOTTING
  constructor() {
    super({
      key: MapPlottingConfig.key,
      example: {
        DEFAULT: [
          {
            name: '福建',
            mapName: 'TourLine',
          },
          {
            name: '强渡乌江',
            mapName: '强渡乌江',
          },
        ],
      },
      functionModules: [
        startModule,
        changeMapModule,
        addModule,
        markModule,
        () => plotModule(ConstToolType.SM_MAP_PLOT),
        editModule,
        () => plotModule(ConstToolType.SM_MAP_PLOT_ANIMATION),
        toolModule,
      ],
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapPlottingConfig.key,
      title: getLanguage(language).Map_Module.MAP_PLOTTING,
      moduleImage: getThemeAssets().module.icon_map_plot,
      moduleImageTouch: getThemeAssets().module.icon_map_plot_touch,
      defaultMapName: this.getExampleName(language)[0].mapName,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      licenceType: 0x80,
      mapType: this.mapType,
    })
  }
}
