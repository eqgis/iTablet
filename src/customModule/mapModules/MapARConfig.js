import { ChunkType, MapTabs, ConstToolType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import FunctionModule from '../../class/FunctionModule'
import Toast from '../../utils/Toast'
import { SAIDetectView, SMap } from 'imobile_for_reactnative'
import {
  startModule,
  addModule,
  styleModule,
  // arEffecModule,
  // arToolModule,
  markModule,
  toolModule,
  arDrawingModule,
  arStartModule,
  arEditModule,
  arStyleModule,
} from '../../containers/workspace/components/ToolBar/modules'
import Orientation from 'react-native-orientation'
import { LayerUtils } from '../../utils'
import NavigationService from '../../containers/NavigationService'

// class ARStartModule extends FunctionModule {
//   constructor(props) {
//     super(props)
//   }

//   action = () => {
//     NavigationService.navigate('MyARMap', {
//       showMode: 'tap',
//     })
//   }
// }

// function arStartModule() {
//   return new ARStartModule({
//     type: ConstToolType.SM_AR_DRAWING_START,
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.START,
//     size: 'large',
//     image: getThemeAssets().functionBar.icon_tool_start,
//   })
// }

export default class MapARConfig extends Module {
  static key = ChunkType.MAP_AR
  constructor() {
    super({
      key: MapARConfig.key,
      // functionModules: modules,
      mapType: Module.MapType.AR,
      example: {
        DEFAULT: [
          {
            name: '3Dpipe',
            mapName: '3Dpipe',
          },
          {
            name: 'Pipe66',
            mapName: 'Pipe66',
          },
        ],
      },
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
        modules = [
          arStartModule,
          arDrawingModule,
          arEditModule,
          arStyleModule,
        ]
        break
      case 'map':
        modules = [
          startModule,
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