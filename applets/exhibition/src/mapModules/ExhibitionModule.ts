import { Module } from '@/class'
import { getImage } from '../assets'
import { AppToolBar, LayerUtils } from '@/utils'
import { exhibitionData } from '../toolbarModules/exhibition'

/**
 * 首页显示的旅行轨迹模块
 */
export default class ExhibitionModule extends Module {
  static key = 'exhibition'
  constructor() {
    super({
      key: ExhibitionModule.key,
      // 右侧工具条加载项
      functionModules: [
        // startModule(),      // 开始
        // addModule(),        // 添加
        // markModule(),       // 标注
        // Tour(),             // 创建轨迹
      ],
      // 地图类型（三维/二维）
      mapType: Module.MapType.AR,
    })
  }

  getTabModules = () => {
    return []
  }

  getDefaultData = () => {
    return {
      key: ExhibitionModule.key,
      // 根据语言获取地图模块名称
      title: 'AR展厅',
      // 模块图片
      moduleImage: getImage().scan,
      // 点击时模块高亮图片
      moduleImageTouch: getImage().scan,
      baseMapSource: LayerUtils.getDefaultBaseMapData(language),
      baseMapIndex: 1,
      mapType:  Module.MapType.AR,
      onMapLoad: (type) => { // ar, map
        if(type === 'map') {
          AppToolBar.show('EXHIBITION', 'EXHIBITION_HOME')
        }
      },
      toolbarModuleData: [exhibitionData],
    }
  }

  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}