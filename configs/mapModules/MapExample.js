import { ConstOnline } from '../../src/constants/index'
import { getThemeAssets } from '../../src/assets/index'
import { Module } from '../../src/class/index'
import {
  startModule,
  addModule,
  markModule,
  toolModule,
  shareModule,
} from '../../src/containers/workspace/components/ToolBar/modules'
// import { functionExample } from '../mapFunctionModules'

export default class MapExample extends Module {
  constructor () {
    super({
      key: 'MapExample',
      example: {
        name_en: 'PrecipitationOfUSA', // 英文数据名称
        name_cn: '湖北', // 中文数据名称
      },
      functionModules: [
        startModule(),
        addModule(),
        markModule(),
        toolModule(),
        shareModule(),
        // functionExample(),
      ],
      // tabModules: [mapTabModules.MapView, mapTabModules.LayerManager, mapTabModules.LayerAttribute, mapTabModules.MapSetting]
    })
  }

  // 首页模块数据
  getChunk = language => {
    return this.createChunk(language, {
      key: 'MapExample',
      // 根据语言获取地图模块名称
      title: language === 'CN' ? '示例模块' : 'Example',
      // 模块图片
      moduleImage: getThemeAssets().nav.icon_map_theme,
      // 点击时模块高亮图片
      moduleImageTouch: getThemeAssets().nav.icon_map_theme_touch,
      // 默认地图名称
      defaultMapName: GLOBAL.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      // 地图默认底图数据
      baseMapSource: {...ConstOnline.Google},
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      licenceType: 0x04,
    })
  }
}