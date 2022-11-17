import { ConstOnline } from '@/constants'
import { MapHeaderButton, MapTabs } from '@/constants'
import { Module } from '@/class'
import { getLanguage } from '@/language'
import {
  startModule,
  addModule,
  markModule,
  toolModule,
  changeMapModule,
} from '@/containers/workspace/components/ToolBar/modules'
// import { Tour } from '../mapFunctionModules'
import { getImage } from '../assets'
import { Toast } from '@/utils'
import {
  Linking,
} from 'react-native'
/**
 * 首页显示的旅行轨迹模块
 */
export default class LangChaoDemoModule extends Module {
  static key = 'langchao'
  constructor() {
    super({
      key: LangChaoDemoModule.key,
      // 右侧工具条加载项
      functionModules: [
        startModule(),      // 开始
        addModule(),        // 添加
        markModule(),       // 标注
        toolModule(), 
        changeMapModule(),
        // Tour(),             // 创建轨迹
      ],
      // 地图类型（三维/二维）
      mapType: Module.MapType.MAP,
    })

        // 自定义地图右上角按钮
        this.headerButtons = [
          // MapHeaderButton 中自带功能
          MapHeaderButton.Audio,  // 语音
          MapHeaderButton.Undo,   // 回退
          MapHeaderButton.Search, // 搜索
          // MapHeaderButton.Share,  // 分享
    
          // to do 自定义功能
          // {
          //   key: 'save',//地图保存
          //   image: getImage().save,
          //   action: this.save,
          // }, 
        ]
    
        // 自定义地图底部Tab
        this.tabModules = [
          // 系统自带Tab
          MapTabs.MapView,          // 系统自带Tab-地图
          MapTabs.LayerManager,     // 系统自带Tab-图层
          // MapTabs.LayerAttribute,   // 系统自带Tab-属性
      
          // todo 用户自定义Tab页面
          {
            key: module,
            title: "呼叫中心",
            //'属性',
            image: getImage().telephone1,
            selectedImage: getImage().telephone2,
            btnClick: () => {
             Toast.show("呼叫中心")
             Linking.openURL('tel:10086')
            },
          },

          MapTabs.MapSetting,       // 系统自带Tab-设置
        ]

  }
  getDefaultData = () => {
    return {
      key: LangChaoDemoModule.key,
      // 根据语言获取地图模块名称
      title: "浪潮呼叫中心",
      // 模块图片
      moduleImage: getImage().flight,
      // 点击时模块高亮图片
      moduleImageTouch: getImage().flight,
      // 默认地图名称
      defaultMapName: global.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      // 地图默认底图数据
      baseMapSource: [ConstOnline.tiandituImg()],
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      mapType: this.mapType,
      isExample: false,
      openDefaultMap: true,
      // action: this.action,
    }
  }

  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}