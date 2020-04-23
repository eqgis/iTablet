import { Platform } from 'react-native'
import { ConstPath, ChunkType } from '../../src/constants'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { Module } from '../../src/class'
import { FileTools } from '../../src/native'
import NavigationService from '../../src/containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'
import mapTabModules from '../mapTabModules'

export default class Map3DConfig extends Module {
  constructor (props) {
    super(props)
    this.key = ChunkType.MAP_3D
    this.example = {
      checkUrl: 'https://www.supermapol.com/web/datas.json?currentPage=1&filterFields=%5B%22FILENAME%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&keywords=',
      name_ios: 'OlympicGreen_ios',
      name_android: 'OlympicGreen_android',
      nickname: 'xiezhiyan123',
      type: 'zip',
    }
    this.functionModules = [
      {key: 'startModule', type: 'MAP_3D_START'},
      {key: 'mark3DModule', type: 'MAP3D_MARK'},
      {key: 'fly3DModule', type: 'MAP3D_TOOL_FLYLIST'},
      {key: 'tool3DModule', type: 'MAP3D_TOOL'},
      {key: 'shareModule', type: 'MAP_SHARE_MAP3D'},
    ]
    this.tabModules = [mapTabModules.Scene, mapTabModules.Layer3D, mapTabModules.Attribute3D, mapTabModules.Settings3D]
  }

  getChunk = language => {
    return this.createChunk(language, {
      key: ChunkType.MAP_3D,
      title: getLanguage(language).Map_Module.MAP_3D,
      moduleImage: getThemeAssets().nav.icon_map_3d,
      moduleImageTouch: getThemeAssets().nav.icon_map_3d_touch,
      defaultMapName: language === 'CN' ? '湖南' : 'LosAngeles',
      action: async () => {
        GLOBAL.Type = ChunkType.MAP_3D
        let fileName = ''
        if (Platform.OS === 'android') {
          fileName = 'OlympicGreen_android'
        } else {
          fileName = 'OlympicGreen_ios'
        }
        SMap.setCurrentModule(0x02)
        const homePath = await FileTools.appendingHomeDirectory()
        const cachePath = homePath + ConstPath.CachePath
        const fileDirPath = cachePath + fileName
        const arrFile = await FileTools.getFilterFiles(fileDirPath)
        if (arrFile.length === 0) {
          NavigationService.navigate('Map3D', {})
        } else {
          const name =
            Platform.OS === 'android'
              ? 'OlympicGreen_android'
              : 'OlympicGreen_ios'
          NavigationService.navigate('Map3D', { name })
        }
      },
    })
  }
}