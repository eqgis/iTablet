import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import Toast from '../../utils/Toast'
import { SAIDetectView, SMap } from 'imobile_for_reactnative'
import {
  startModule,
  addModule,
  styleModule,
  arEffecModule,
  arToolModule,
  markModule,
  toolModule,
} from '../../containers/workspace/components/ToolBar/modules'
import Orientation from 'react-native-orientation'
import { LayerUtils } from '../../utils'
import { Platform } from 'react-native'

export default class MapARConfig extends Module {
  static key = ChunkType.MAP_AR
  constructor() {
    let modules = [
      startModule,
      addModule,
      markModule,
      styleModule,
      arEffecModule,
      arToolModule,
      toolModule,
    ]
//    if (Platform.OS === 'ios') {
//      modules.splice(4, 1)
//    }
    super({
      key: MapARConfig.key,
      functionModules: modules,
      mapType: Module.MapType.MAP,
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapARConfig.key,
      title: getLanguage(language).Map_Module.MAP_AR,
      moduleImage: getThemeAssets().nav.icon_map_vedio,
      moduleImageTouch: getThemeAssets().nav.icon_map_vedio_touch,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      openDefaultMap: false,
      mapType: this.mapType,
      licenceType: 0x10,
      preAction: async () => {
        let isAvailable = await SAIDetectView.checkIfAvailable()
        if (!isAvailable) {
          Toast.show(
            getLanguage(language).Map_Main_Menu.MAP_AR_DONT_SUPPORT_DEVICE,
          )
          return false
        }
        isAvailable = await SAIDetectView.checkIfSensorsAvailable()
        if (!isAvailable) {
          Toast.show(
            getLanguage(language).Map_Main_Menu.MAP_AR_DONT_SUPPORT_DEVICE,
          )
          return false
        }
        isAvailable = await SAIDetectView.checkIfCameraAvailable()
        if (!isAvailable) {
          Toast.show(
            getLanguage(language).Map_Main_Menu.MAP_AR_CAMERA_EXCEPTION,
          )
          return false
        }
        SMap.setDynamicviewsetVisible(false)
        Orientation.lockToPortrait()
        return isAvailable
      },
    })
  }
}
