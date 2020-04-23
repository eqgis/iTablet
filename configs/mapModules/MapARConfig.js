import { ConstOnline, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'
import Toast from '../../src/utils/Toast'
import { SAIDetectView } from 'imobile_for_reactnative'
import mapTabModules from '../mapTabModules'

export default class MapARConfig extends Module {
  constructor (props) {
    super(props)
    this.key = ChunkType.MAP_AR
    this.functionModules = [
      {key: 'startModule', type: 'MAP_START'},
      {key: 'addModule', type: 'MAP_ADD'},
      {key: 'markModule', type: 'MAP_MARKS'},
      {key: 'styleModule', type: 'MAP_STYLE'},
      {key: 'arAIAssistant', type: 'MAP_AR_AI_ASSISTANT'},
    ]
    this.tabModules = [mapTabModules.MapView, mapTabModules.Layer, mapTabModules.Attribute, mapTabModules.Settings]
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_AR,
      title: getLanguage(language).Map_Module.MAP_AR,
      moduleImage: getThemeAssets().nav.icon_map_vedio,
      moduleImageTouch: getThemeAssets().nav.icon_map_vedio_touch,
      baseMapSource: {...ConstOnline.Google},
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
        return isAvailable
      },
    })
  }
}