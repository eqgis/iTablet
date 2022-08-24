import { ChunkType, MapTabs } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import Toast from '../../utils/Toast'
import { SAIDetectView, SMap } from 'imobile_for_reactnative'
import {
  startModule,
  addModule,
  styleModule,
  // arEffecModule,
  markModule,
  toolModule,
  arDrawingModule,
  arStartModule,
  arEditModule,
  arStyleModule,
  arNaviModule,
  changeMapModule,
  arToolbox,
} from '../../containers/workspace/components/ToolBar/modules'
import { LayerUtils, screen } from '../../utils'
import { Platform } from 'react-native'

export default class MapARConfig extends Module {
  static key = ChunkType.MAP_AR
  constructor() {
    super({
      key: MapARConfig.key,
      // functionModules: modules,
      mapType: Module.MapType.AR,
    })
    this.functionModules = this.getFunctionModules('ar')
  }

  getTabModules = (type = 'map') => {
    let modules = []
    switch (type) {
      case 'map':
        modules = [
          MapTabs.MapView,
          MapTabs.LayerManager,
          MapTabs.LayerAttribute,
          MapTabs.MapSetting,
        ]
        break
      case 'ar':
        modules = [
          MapTabs.MapView,
          MapTabs.ARLayerManager,
          MapTabs.ARMapSetting,
        ]
        break
    }
    return modules
  }

  getFunctionModules = (type = 'map') => {
    let modules = []
    switch(type) {
      case 'ar':
        modules = Platform.OS === 'android' ? [
          arStartModule,
          arDrawingModule,
          arEditModule,
          arStyleModule,
          arNaviModule,
          arToolbox,
        ] : [
          arStartModule,
          arDrawingModule,
          arEditModule,
          arStyleModule,
          arNaviModule,
        ]
        break
      case 'map':
        modules = [
          startModule,
          changeMapModule,
          addModule,
          markModule,
          styleModule,
          toolModule,
        ]
        break
    }
    return modules
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: MapARConfig.key,
      title: getLanguage(language).Map_Module.MAP_AR,
      moduleImage: getThemeAssets().module.icon_map_vedio,
      moduleImageTouch: getThemeAssets().module.icon_map_vedio_touch,
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