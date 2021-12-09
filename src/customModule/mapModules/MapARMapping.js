import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import Toast from '../../utils/Toast'
import { SAIDetectView, SMap } from 'imobile_for_reactnative'
import {
  startModule,
  addModule,
  arMappingModule,
  arMeasureModule,
  markModule,
  toolModule,
  changeMapModule,
} from '../../containers/workspace/components/ToolBar/modules'
import Orientation from 'react-native-orientation'
import { LayerUtils } from '../../utils'

export default class MapARMapping extends Module {
  static key = ChunkType.MAP_AR_MAPPING
  constructor() {
    super({
      key: MapARMapping.key,
      mapType: Module.MapType.MAP,
    })
    this.functionModules = this.getFunctionModules('ar')
  }

  getFunctionModules = (type = 'map') => {
    let modules = []
    switch(type) {
      case 'ar':
        modules = [
          arMeasureModule,
          arMappingModule,
        ]
        break
      case 'map':
        modules = [
          startModule,
          changeMapModule,
          addModule,
          markModule,
          toolModule,
        ]
        break
    }
    return modules
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapARMapping.key,
      title: getLanguage(language).Map_Module.MAP_AR_MAPPING,
      moduleImage: getThemeAssets().module.icon_map_ar_mapping,
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
        //Orientation.lockToPortrait()
        return isAvailable
      },
    })
  }
}
