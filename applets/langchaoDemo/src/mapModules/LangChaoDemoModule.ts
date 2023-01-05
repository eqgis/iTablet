import { ConstOnline, ConstPath } from '@/constants'
import { MapHeaderButton, MapTabs } from '@/constants'
import { Module } from '@/class'
import { getLanguage } from '@/language'
import {
  startModule,
  addModule,
  markModule,
  toolModule,
  changeMapModule,
  CameraModule,
  collectionModule,
  TrackModule,
} from '@/containers/workspace/components/ToolBar/modules'
import { CallModule, ChangeBaseLayerModule } from '../mapFunctionModules'
import { getImage } from '../assets/Image'
import { AppToolBar, NavigatorUtil } from '@/utils'
import TourAction from '../mapFunctionModules/Langchao/TourAction'
import { FileTools, SMap } from 'imobile_for_reactnative'
import navigators from '../containers/index'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { injectReducer } from "@/redux/store"
import { langchao } from '../reduxModels'
import RNFetchBlob from 'rn-fetch-blob'
import { setAppColor } from '@/styles/color'
import NavigationService from '@/containers/NavigationService'
import { getThemeAssets } from '@/assets'
/**
 * 首页显示的旅行轨迹模块
 */
export default class LangChaoDemoModule extends Module {
  static key = 'langchao'

  // ToolAction.captureImage
  constructor() {
    super({
      key: LangChaoDemoModule.key,
      // 右侧工具条加载项
      functionModules: [
        // startModule(),      // 开始
        // addModule(),        // 添加
        // markModule(),       // 标注
        CallModule(),
        TrackModule,
        // CameraModule,
        // changeMapModule,
        ChangeBaseLayerModule(),
        toolModule,
        // Tour(),             // 创建轨迹
      ],
      // 地图类型（三维/二维）
      mapType: Module.MapType.MAP,
    })

    // 自定义地图右上角按钮
    this.headerButtons = [
      // MapHeaderButton 中自带功能
      // {
      //   key: 'allUpload',// 位置上报
      //   // image: getThemeAssets().publicAssets.icon_data_upload,
      //   image: getImage().icon_upload,
      //   action: () => {
      //     // TourAction.positionUpload
      //     TourAction.uploadDialog(-1, 'all')
      //   },
      // },
      // MapHeaderButton.Audio,  // 语音
      // MapHeaderButton.Undo,   // 回退
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
      // MapTabs.LayerManager,     // 系统自带Tab-图层
      // MapTabs.LayerAttribute,   // 系统自带Tab-属性

      // todo 用户自定义Tab页面
      {
        key: module,
        title:  getLanguage(global.language).Map_Settings.HISTORICAL_RECORD,
        //'属性',
        image: getThemeAssets().tabBar.tab_attribute,
        selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
        btnClick: () => {
          NavigationService.navigate('HistoricalRecord')
        },
      },

      // MapTabs.MapSetting,       // 系统自带Tab-设置
      {
        key: module,
        title:  getLanguage(global.language).Map_Settings.SETTING,
        //'属性',
        image: getThemeAssets().tabBar.tab_setting,
        selectedImage: getThemeAssets().tabBar.tab_setting_selected,
        btnClick: () => {
          NavigationService.navigate('SettingPage')
        },
      },
    ]

    // 添加新的页面导航
    NavigatorUtil.addNavigator(navigators)

    /**
     * 注入第定义redux
     */
    injectReducer({
      key: 'langchao',
      reducer: langchao,
      list: 'whitelist', //白名单,持久化数据
    })

    // setAppColor({
    //   itemColorGray2: '#add8e6',  // 历史记录工具栏和表头的背景颜色
    //   contentColorGray: '#fff',  // 历史记录工具栏和表头的文字颜色
    //   selected: '#afeeee',  // 历史记录表格的选中行的背景颜色 图层页面，选中图层的背景颜色
    //   containerHeaderBgColor: '#add8e6', // 页面顶部容器的背景色
    //   containerTextColor: '#fff',   // 页面顶部容器的标题颜色
    //   bottomTabBgColor: '#add8e6',  // 页面底部tab的背景色
    //   bottomTabTextColor: '#fff', // 页面底部tab的文字颜色
    //   rightListBgColor: '#add8e6',  //（右）侧边栏列表的背景色
    //   rightListTextColor: '#fff',  //（右）侧边栏列表的文字万册
    //   leftBottomBtnBgColor: '#add8e6', // 左下角的按钮背景色
    //   toolbarBgColor: '#add8e6', // Toolbar的背景色
    //   MTbtnUnderLayer: '#afeeee', // MtBtn类型的按钮按下时显示的背景色
    // })

  }


  action = async () => {
    AppToolBar.show('LANGCHAODEMO', 'LANGCHAODEMO_HOME')

  }


  onMapOpenSuccess = async () => {

    const layers = await AppToolBar.getProps().getLayers()

    const datasetName = "line_965018"
    if(layers) {
      for(let i = 0; i < layers.length; i ++) {
        const layerDatasetName = layers[i].datasetName
        if(layerDatasetName === datasetName) {
          ToolbarModule.getParams().setCurrentLayer(layers[i])
        }
      }
    }

    const position = await SMap.getCurrentLocation()
    // 地图定位到指定点位置
    // await SMap.toLocationPoint({
    //   x: position.longitude,
    //   y: position.latitude,
    // }, false)

    const countryCode = await TourAction.getCountryCode(position.longitude, position.latitude)
    // const countryCode = await TourAction.getCountryCode(40.7143528, 74.0059731)
    // const countryCode = await TourAction.getCountryCode(-90.7143528, 40.0059731)
    // const countryCode = await TourAction.getCountryCode(-20.7143528, 40.0059731)
    console.warn("countryCode: " + countryCode)

    const homePath = await FileTools.getHomeDirectory()
    const path = homePath + ConstPath.CachePath + "langchaoWs/langchaoLog.txt"
    const logfileExist = await FileTools.fileIsExist(path)
    if(!logfileExist){
      await RNFetchBlob.fs.createFile(path, "", "utf8")
    }
    await FileTools.appendToFile(path, "\n================ 进入了浪潮app ================ \n国家：" + countryCode)
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
      // defaultMapName: global.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      defaultMapName: "langchaoMap",
      defaultData:/*'http://dddd'*/'assets/userData/langchaoWs.zip',
      // 地图默认底图数据
      baseMapSource: [ConstOnline.tiandituCN(), ConstOnline.tianditu()],
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      mapType: this.mapType,
      isExample: false,
      openDefaultMap: true,
      // action: this.action,
      onMapLoad: this.action,
      isEnterHome: false,
      onMapOpenSuccess: this.onMapOpenSuccess,
    }
  }

  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}
