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
import { CallModule, PositionSubmitModule } from '../mapFunctionModules'
import { getImage } from '../assets/Image'
import { AppToolBar, Toast, NavigatorUtil, dataUtil } from '@/utils'
import {
  Linking,
} from 'react-native'
import { getThemeAssets } from '@/assets'
import TourAction from '../mapFunctionModules/Langchao/TourAction'
import { DatasetType, EngineType, FileTools, SMap, SProcess, SMCollectorType, SCollector, Action } from 'imobile_for_reactnative'
import NavigationService from '@/containers/NavigationService'
import navigators from '../containers/index'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { injectReducer } from "@/redux/store"
import { langchao } from '../reduxModels'
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
        PositionSubmitModule(),
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

    /**
     * 注入第定义redux
     */
    injectReducer({
      key: 'langchao',
      reducer: langchao,
      list: 'whitelist', //白名单,持久化数据
    })

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

  /** 添加属性字段 **/
  addAttributeField = async (fieldInfo, path: string) => {
    // let path = this.props.currentLayer.path
    const checkName = dataUtil.isLegalName(fieldInfo.name, this.props.language)
    if (!checkName.result) {
      Toast.show(getLanguage(this.props.language).Map_Attribute.NAME + checkName.error)
      return false
    }
    const checkCaption = dataUtil.isLegalName(fieldInfo.caption, this.props.language)
    if (!checkCaption.result) {
      Toast.show(getLanguage(this.props.language).Map_Attribute.ALIAS + checkCaption.error)
      return false
    }
    const result = await SMap.addAttributeFieldInfo(path, false, fieldInfo)
    // if (result) {
    //   Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_SUCCESS)
    //   // this.refresh()
    // } else {
    //   Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_FAILED)
    // }
    return result
  }

  getTrimSmStr = (text: string): string => {
    if (text.length < 2) {
      return text
    }
    const tempStr = text.toLowerCase()
    if (tempStr.substring(0, 2) == 'sm') {
      const endStr = text.substring(2, text.length)
      if (endStr.length < 2) {
        return endStr
      } else {
        return this.getTrimSmStr(endStr)
      }
    } else {
      return text
    }
  }


  onMapOpenSuccess = async () => {
    // console.warn("in onMapOpenSuccess")
    // const typeP = SMCollectorType.POINT_GPS
    // const dataP = {name:"destination",type:"marker",id:118081}

    // AppToolBar.getProps().setCurrentSymbol(dataP)

    // ToolbarModule.addData({
    //   lastType: typeP,
    //   lastLayer:undefined,
    // })

    // await collectionModule().actions.createCollector(typeP, undefined)
    // await collectionModule().actions.cancel(typeP)
    // // console.warn("layer: " + JSON.stringify(ToolbarModule.getParams().currentLayer))
    // // await SMap.renameLayer(this.state.layerData.path, value)
    // // await collectionModule().actions.collectionSubmit(typeP)

    // const typePm = SMCollectorType.POINT
    // const dataPm = {name:"高程点",type:"marker",id:322}

    // AppToolBar.getProps().setCurrentSymbol(dataPm)

    // ToolbarModule.addData({
    //   lastType: typePm,
    //   lastLayer:undefined,
    // })

    // await collectionModule().actions.createCollector(typePm, undefined)
    // await collectionModule().actions.cancel(typePm)

    // const dataL = {"name":"专用公路","type":"line","id":965018}

    // AppToolBar.getProps().setCurrentSymbol(dataL)
    // const typeL = SMCollectorType.LINE_GPS_PATH
    // ToolbarModule.addData({
    //   lastType: typeL,
    //   lastLayer:undefined,
    // })
    // await collectionModule().actions.createCollector(typeL, undefined)
    // // await collectionModule().actions.collectionSubmit(typeL)
    // await collectionModule().actions.cancel(typeL)
    // await SMap.setAction(Action.PAN)

    const layers = await AppToolBar.getProps().getLayers()

    // const CallContentsObj = {
    //   myName: '',           // 呼叫人姓名
    //   myPhoneNumber: '',    // 呼叫人电话
    //   callName: '',         // 被呼叫人姓名
    //   callPhoneNumber: '',  // 被呼叫人电话
    //   localTime: '',        // 当地时间
    //   bjTime: '',           // 北京时间
    //   durationTime: '',     // 时长
    // }
    // 添加属性 字段
    // const attributeObj = {
    //   caption: this.getTrimSmStr("CallContents"),
    //   name: this.getTrimSmStr("CallContents"),
    //   type: 10,
    //   maxLength: 255,
    //   required: false,
    //   // defaultValue: JSON.stringify(jsonStr)
    // }

    // const mediaPath = ""
    // const positionPath = ""
    // const trackpath = ""
    // for(let i = 0; i < layers.length; i ++) {
    //   const layerDatasetName = layers[i].datasetName
    //   console.warn("layerDatasetName: " + layerDatasetName + " - " + layers[i].caption + " - " + layers[i].name)
    //   // if(layerDatasetName === "marker_322") {
    //   //   await SMap.renameLayer(layers[i].path, "多媒体")
    //   //   mediaPath = layers[i].path
    //   // } else if(layerDatasetName === "marker_118081") {
    //   //   await SMap.renameLayer(layers[i].path, "位置")
    //   //   positionPath = layers[i].path
    //   // } else if(layerDatasetName === "line_965018") {
    //   //   await SMap.renameLayer(layers[i].path, "轨迹")
    //   //   trackpath = layers[i].path
    //   // }
    // }

    const position = await SMap.getCurrentLocation()
    // 地图定位到指定点位置
    await SMap.toLocationPoint({
      x: position.longitude,
      y: position.latitude,
    })

    const countryCode = await TourAction.getCountryCode(position.longitude, position.latitude)
    // const countryCode = await TourAction.getCountryCode(40.7143528, 74.0059731)
    // const countryCode = await TourAction.getCountryCode(-90.7143528, 40.0059731)
    // const countryCode = await TourAction.getCountryCode(-20.7143528, 40.0059731)
    console.warn("countryCode: " + countryCode)

    // await this.addAttributeField(attributeObj, mediaPath)
    // setTimeout(async () => {
    //   await this.addAttributeField(attributeObj, positionPath)
    //   setTimeout(async () => {
    //     await this.addAttributeField(attributeObj, trackpath)
    //   },500)
    // },500)
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
