import { ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import Toast from '../../utils/Toast'
import { SAIDetectView, SARMap, SMap } from 'imobile_for_reactnative'
import {
  startModule,
  addModule,
  // aiModule,
  aiCollection,
  aiVehicle,
  aiCategory,
  markModule,
  toolModule,
  changeMapModule,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils, screen } from '../../utils'

export default class MapARAnalysis extends Module {
  static key = ChunkType.MAP_AR_ANALYSIS
  constructor() {
    super({
      key: MapARAnalysis.key,
      mapType: Module.MapType.MAP,
    })
    this.functionModules = this.getFunctionModules('ar')
  }

  getFunctionModules = (type = 'map') => {
    let modules = []
    switch(type) {
      case 'ar':
        modules = [
          // aiModule,
          aiCollection, // AI目标识别
          aiVehicle,
          aiCategory,
          // aiAggregate, // AI聚合
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
      key: MapARAnalysis.key,
      title: getLanguage(language).Map_Module.MAP_AR_ANALYSIS,
      moduleImage: getThemeAssets().module.icon_map_ar_analysis,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      openDefaultMap: false,
      mapType: this.mapType,
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
        SARMap.setIs3dSceneFirst(false)
        // 竖屏时,锁定竖屏
        if (screen.getOrientation().indexOf('LANDSCAPE') < 0) {
          screen.lockToPortrait()
        }
        return isAvailable
      },
      afterAction: async () => {
        // 横屏时,等跳转后,再锁定竖屏
        if (screen.getOrientation().indexOf('LANDSCAPE') >= 0) {
          let timer = setTimeout(() => {
            screen.lockToPortrait()
            clearTimeout(timer)
          }, 100)
        }
        return true
      },
    })
  }
}
