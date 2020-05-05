import { ConstOnline, ChunkType } from '../../constants'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { Module } from '../../class'
import Toast from '../../utils/Toast'
import { SAIDetectView } from 'imobile_for_reactnative'
import {
  startModule,
  addModule,
  markModule,
  styleModule,
  aiModule,
} from '../../containers/workspace/components/ToolBar/modules'
import Orientation from 'react-native-orientation'

export default class MapARConfig extends Module {
  constructor() {
    super({
      key: ChunkType.MAP_AR,
      functionModules: [
        startModule(),
        addModule(),
        markModule(),
        styleModule(),
        aiModule(),
      ],
    })
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_AR,
      title: getLanguage(language).Map_Module.MAP_AR,
      moduleImage: getThemeAssets().nav.icon_map_vedio,
      moduleImageTouch: getThemeAssets().nav.icon_map_vedio_touch,
      baseMapSource: { ...ConstOnline.Google },
      baseMapIndex: 1,
      openDefaultMap: false,
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
        Orientation.lockToPortrait()
        return isAvailable
      },
    })
  }
}
