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
  PositionSubmitModule,
  collectionModule,
  TrackModule,
  CallModule,
} from '@/containers/workspace/components/ToolBar/modules'
// import { Tour } from '../mapFunctionModules'
import { getImage } from '../assets'
import { AppToolBar, Toast, NavigatorUtil } from '@/utils'
import {
  Linking,
} from 'react-native'
import { getThemeAssets } from '@/assets'
import TourAction from '../mapFunctionModules/Langchao/TourAction'
import { DatasetType, EngineType, FileTools, SMap, SProcess, SMCollectorType, SCollector } from 'imobile_for_reactnative'
import NavigationService from '@/containers/NavigationService'
import navigators from '../mapFunctionModules/Langchao/views/index'
import { ToolbarModule } from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
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
        CallModule,
        PositionSubmitModule,
        // collectionModule,
        TrackModule,
        CameraModule,
        changeMapModule,
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
      //   key: 'positionUpload',// 位置上报
      //   // image: getThemeAssets().publicAssets.icon_data_upload,
      //   image: getImage().icon_upload,
      //   action: TourAction.positionUpload,
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
      MapTabs.LayerManager,     // 系统自带Tab-图层
      MapTabs.LayerAttribute,   // 系统自带Tab-属性

      // todo 用户自定义Tab页面
      // {
      //   key: module,
      //   title: "呼叫中心",
      //   //'属性',
      //   image: getImage().telephone1,
      //   selectedImage: getImage().telephone2,
      //   btnClick: () => {
      //     Toast.show("呼叫中心")
      //     // Linking.openURL('tel:10086')
      //     NavigationService.navigate('ContactsList')
      //   },
      // },

      MapTabs.MapSetting,       // 系统自带Tab-设置
    ]

    // 添加新的页面导航
    NavigatorUtil.addNavigator(navigators)

  }

  /**
   * 获取某路径下可用文件名 zhangxt
   * @param {*} path 路径
   * @param {*} name 文件名 abc
   * @param {*} ext 扩展名 udb
   * @returns abc.udb 有重名的在文件名后加“_1”,仍重名则改为"_2"，依此类推
   */
  _getAvailableFileName = async (path: string, name: string, ext: string) => {
    const result = await FileTools.fileIsExist(path)
    if (!result) {
      await FileTools.createDirectory(path)
    }
    let availableName = name + '.' + ext
    if (await FileTools.fileIsExist(path + '/' + availableName)) {
      for (let i = 1; ; i++) {
        availableName = name + '_' + i + '.' + ext
        if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
          return availableName
        }
      }
    } else {
      return availableName
    }
  }

  action = async () => {
    // // console.warn("11111" + JSON.stringify( AppToolBar.getProps().currentUser))
    // // 建数据源
    // const homePath = await FileTools.appendingHomeDirectory()
    // const datasourcePath =
    //   homePath +
    //   ConstPath.UserPath +
    //   "Customer" +
    //   // AppToolBar.getProps().currentUser.userName +
    //   // this.props.currentUser.userName +
    //   '/' +
    //   ConstPath.RelativePath.Datasource
    // const datasourceName = 'langchaoDataSource'
    // let availableName = await this._getAvailableFileName(
    //   datasourcePath,
    //   datasourceName,
    //   'udb',
    // )
    // availableName = availableName.substring(0, availableName.lastIndexOf('.'))

    // const param = {
    //   server: datasourcePath + availableName + '.udb',
    //   engineType: EngineType.UDB,
    //   alias: availableName,
    //   description: 'Label',
    // }
    // const result = await SMap.createDatasource(param,true)

    // // 建数据集
    // const newDatasets =  [
    //   {
    //     key: new Date().getTime(),
    //     datasetName: "pointUpLoad",
    //     datasetType: DatasetType.POINT,
    //     datasetPrjName: "PCS_SPHERE_MERCATOR", // 投影坐标系
    //     datasetPrjValue: 53004,
    //   },
    //   {
    //     key: new Date().getTime(),
    //     datasetName: "mediaPoint",
    //     datasetType: DatasetType.POINT,
    //     datasetPrjName: "PCS_SPHERE_MERCATOR", // 投影坐标系
    //     datasetPrjValue: 53004,
    //   },
    //   {
    //     key: new Date().getTime(),
    //     datasetName: "trackLine",
    //     datasetType: DatasetType.LINE,
    //     datasetPrjName: "PCS_SPHERE_MERCATOR", // 投影坐标系
    //     datasetPrjValue: 53004,
    //   },
    // ]
    // // 数据源新建成功
    // if(result) {
    //   for (const newDataset of newDatasets) {
    //     const datasetResult = await SMap.createDataset(
    //       availableName,
    //       newDataset.datasetName,
    //       newDataset.datasetType,
    //       true,
    //     )
    //     if(datasetResult){
    //       await SProcess.setPrjCoordSys(
    //         availableName,
    //         newDataset.datasetName,
    //         newDataset.datasetPrjValue+"",
    //         true,
    //       )
    //     }
    //   }

    //   // AppToolBar.show('LANGCHAODEMO', 'LANGCHAODEMO_HOME')
    // }

    AppToolBar.show('LANGCHAODEMO', 'LANGCHAODEMO_HOME')



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
      onMapLoad: this.action
    }
  }

  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}
