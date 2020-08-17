import { ConstOnline } from '../../src/constants'
import { Module } from '../../src/class'
import { getLanguage } from '../../src/language'
import { getPublicAssets } from '../../src/assets'
import {
  startModule,
  addModule,
  markModule,
} from '../../src/containers/workspace/components/ToolBar/modules'
import { Tour } from '../mapFunctionModules'

/**
 * 首页显示的旅行轨迹模块
 */
export default class TourModule extends Module {
  static key = 'Tour'
  constructor () {
    super({
      key: TourModule.key,
      // 右侧工具条加载项
      functionModules: [
        startModule(),      // 开始
        addModule(),        // 添加
        markModule(),       // 标注
        Tour(),             // 创建轨迹
      ],
      // 地图类型（三维/二维）
      mapType: Module.MapType.MAP,
    })
  }

  // 首页模块数据
  getChunk = language => {
    return this.createChunk(language, {
      key: TourModule.key,
      // 根据语言获取地图模块名称
      title: getLanguage(GLOBAL.language).Map_Main_Menu.TOUR,
      // 模块图片
      moduleImage: getPublicAssets().mapTools.tour,
      // 点击时模块高亮图片
      moduleImageTouch: getPublicAssets().mapTools.tour,
      // 默认地图名称
      defaultMapName: GLOBAL.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      // 地图默认底图数据
      baseMapSource: {...ConstOnline.Google},
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      mapType: this.mapType,
    })
  }
}