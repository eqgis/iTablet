import { ConstOnline } from '../../src/constants'
import { Module } from '../../src/class'
import {
  startModule,
  markModule,
  toolModule,
  shareModule,
} from '../../src/containers/workspace/components/ToolBar/modules'
import { functionExample } from '../mapFunctionModules'

export default class MapExample extends Module {
  static key = 'MapExample' // key值，必须
  constructor () {
    super({
      key: MapExample.key,
      example: {
        DEFAULT: { // 默认/中文数据名称
          name: '湖北',
          mapName: 'LandBuild',
        },
        EN: { // 英文数据名称
          name: 'PrecipitationOfUSA',
          mapName: 'LosAngeles',
        },
      },
      //工具条加载项
      functionModules: [
        startModule,
        // addModule,
        markModule,
        toolModule,
        shareModule,
        functionExample,
      ],
      mapType: Module.MapType.MAP,
      //  tabModules: [mapTabModules.MapView, mapTabModules.LayerManager, mapTabModules.LayerAttribute, mapTabModules.MapSetting]
    })
  }

  // 首页模块数据
  getChunk = language => {
    return this.createChunk(language, {
      key: MapExample.key,
      // 根据语言获取地图模块名称
      title:'Gis小程序',
      // 模块图片
      moduleImage: require('../../src/assets/userDefine/userDefineTab.png'),
      // 点击时模块高亮图片
      moduleImageTouch: require('../../src/assets/userDefine/userDefineTab.png'),
      // 默认地图名称
      defaultMapName: global.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      // 地图默认底图数据
      baseMapSource: {...ConstOnline.Google},
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      // 地图类型，二维/三维
      mapType: this.mapType,
    })
  }
}