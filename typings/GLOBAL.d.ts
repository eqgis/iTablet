/* eslint-disable no-var */
/**
 * 声明全局GLOBAL
 */

import { orientation, specificOrientation } from 'react-native-orientation'

declare global {
  /** 语言 */
  var language: string
  /** 是否在市场审核期间 */
  var isAudit: boolean
  var markerTag: string
  /** 版本号 */
  var APP_VERSION: string
  /** 系统版本号 x32 x64 */
  var SYSTEM_VERSION: string
  /** 新手引导版本号 */
  var GUIDE_VERSION: string
  /** TODO 动态切换主题，将 global.ThemeType 放入Redux中管理 */
  var ThemeType: string
  /** 底图数量 */
  var BaseMapSize: number
  /** 判断设备是否是Pad */
  var isPad: boolean
  /** 防止重复点击/快速点击不同组件，用于首页（模块和Tabs）和MapView */
  var clickWait: boolean
  /** 是否是在线协作模式 */
  var coworkMode: boolean
  /** 首页模块类型 */
  var Type: string
  /** 地图触摸事件类型 */
  var TouchType: string
  /** 三维Action PAN3D | PANSELECT3D | PAN3D_FIX */
  var action3d: string
  /** 当前导航模式 INDOOR | OUTDOOR */
  var CURRENT_NAV_MODE: string
  /** 网络请求数据的文本信息 */
  var cookie: string
  /** App本地文件Home目录 */
  var homePath: string
  /** 许可是否合法 */
  var isLicenseValid: boolean
  /** 三维，是否正在绕点飞行 */
  var isCircleFlying: boolean
  /** 进入地图，是否打开了工作空间 */
  var openWorkspace: boolean
  /** AR和二维地图切换 */
  var showAIDetect: boolean

  //采集属性查看 add jiakai
  /** 是否采集或者标注 */
  var HAVEATTRIBUTE: boolean

  // 临时数据，是否移除待定
  /** 离线导航起点x */
  var STARTX: number
  /** 离线导航起点y */
  var STARTY: number
  /** 离线导航终点x */
  var ENDX: number
  /** 离线导航终点y */
  var ENDY: number
  /** 导航起点层 */
  var STARTPOINTFLOOR: number
  /** 导航终点楼层 */
  var ENDPOINTFLOOR: number
  /** 导航起点名称 */
  var STARTNAME: string
  /** 导航终点名称 */
  var ENDNAME: string
  /** 导航数据数组 */
  var NAV_PARAMS: Array<object>
  /** 暂存点，返回地图选点时使用 */
  var SELECTPOINTLATITUDEANDLONGITUDETEMP: Point
  /** 地图选点时使用? */
  var SELECTPOINTLATITUDEANDLONGITUDE: Point
  /** 标绘动画数据 */
  var animationWayData: AnimationWayData
  /** // TODO 待去除当前图层全局变量 */
  var currentLayer: object
  /** 校准类型 arNavigation ｜ arVideo ｜ arImage ｜ arWebView｜ arText */
  var EnterDatumPointType: string
  /** AR地图是否从摄像头切换到地图界面 */
  var arSwitchToMap: boolean
  /** 导航-增量路网数据 */
  var INCREMENT_DATA: DATASET_SOURCE
  /** 导航-采集方式 */
  var NAVMETHOD: string
  /** 判断是否含有CAD图层，如果有CAD图层，屏蔽线性和二次线配准 */
  var IsHaveCadDataset: boolean
  /** 地图xml，用于保存改变地图之前的状态 */
  var MapXmlStr: string
  /** ARMapping中临时存放的数据 */
  var MeasureCollectData: object
  /** 是否更新属性列表 */
  var NEEDREFRESHTABLE: object
  /** 注册横竖屏锁 */
  var ORIENTATIONLOCKED: boolean
  /** 配准临时数据 */
  var RectifyDatasetInfo: Array<object>
  /** 配准临时数据 */
  var RectifyReferDatasetInfo: Array<object>
  /** 配准-算法模式 */
  var RegistrationArithmeticMode: number
  /** 被选中的框选属性中的一个属性 */
  var SelectedSelectionAttribute: object
  /** Toolbar是否显示指滑菜单 */
  var showMenu: boolean
  /** 场景名字 */
  var sceneName: string
  /** 离线场景 */
  var offlineScene: boolean
  /** 专题图-地图是否由xml加载 */
  var IS_MAP_FROM_XML: boolean
  // 组件ref
  /** 地图界面-地图组件 MapView.js SMMapView */
  var mapView: any
  /** 地图界面-地图比例尺组件 MapView.js ScaleView */
  var scaleView: any
  /** 地图界面-地图加载组件 App.js Loading */
  var Loading: any
  /** 地图界面-半透明遮盖层 MapView.js OverlayView */
  var OverlayView: any
  /** 地图界面-用户自定义输入弹窗 MapView.js CustomInputDialog */
  var InputDialog: any
  /** 地图界面-用户自定义信息弹窗 MapView.js CustomAlertDialog */
  var AlertDialog: any
  /** 地图界面-删除地图对象弹窗 MapView.js Dialog */
  var removeObjectDialog: any
  /** 地图界面-导航错误提示框（起始点不在路网数据集范围内或起始点附近无路网，是否使用在线路径分析？）Dialog */
  var NavDialog: any
  /** 地图界面-地图控制器 MapView.js MapController */
  var mapController: any
  /** TODO 待用Toolbar替换。地图界面-工具栏 MapView.js Toolbar */
  var toolBox: any
  /** 地图界面-工具栏 MapView.js Toolbar */
  var ToolBar: any
  /** 地图界面-目标识别header MapView.js MapSelectPoint */
  var AIDETECTCHANGE: any
  /** 地图界面-地图选点header MapView.js MapSelectPoint */
  var MAPSELECTPOINT: any
  /** 地图界面-地图选点底部组件 MapSelectPointButton */
  var MAPSELECTPOINTBUTTON: any
  /** 含按钮的提示框 App.js SimpleDialog */
  var SimpleDialog: any
  /** AR支持设备提示框 App.js SimpleDialog */
  var ARDeviceListDialog: any
  /** 地图界面-地图气泡提示消息 MapView.js BubblePane */
  var bubblePane: any
  /** 地图界面-画图组件（画框：RECTANGLE，画圆：CIRCLE） MapView.js SurfaceView */
  var MapSurfaceView: any
  /** 地图界面-室内外路网采集的弹框 MapView.js IncrementRoadDialog */
  var IncrementRoadDialog: any
  /** 地图界面-图例组件 MapView.js RNLegendView */
  var legend: any
  /** 地图界面-导航顶部组件 MapView.js NavigationStartHead */
  var NAVIGATIONSTARTHEAD: any
  /** 地图界面-POI界面容器 MapView.js PoiInfoContainer */
  var PoiInfoContainer: any
  /** 地图界面-POI搜索组件 MapView.js PoiTopSearchBar */
  var PoiTopSearchBar: any
  // TODO 以下组件ref是否移除待定
  /** 投影消息提示框 MapView.js Dialog */
  var prjDialog: any
  /** 地图界面专题图预览时的header MapView.js PreviewHeader */
  var PreviewHeader: any
  /** 地图选点界面 EnterDatumPoint.js MapSelectPointLatitudeAndLongitude */
  var DATUMPOINTVIEW: any

  /** 框选点选属性界面 当前页浏览属性数据 LayerSelectionAttribute.js*/
  var layerSelection: any

  var currentUser: any
  /** 三维AR管线header ARSceneView.js Container */
  var ARContainer: any
  /** 三维AR管线判断数据是否打开 ARSceneView.js*/
  var isSceneOpen: boolean
  /** AR模块判断是否定位*/
  var haslocation: boolean
  /** AR特效图层是否添加完成标识 */
  var isNotEndAddEffect: boolean
  /** 特效图层的方法调用toolbar是否禁止上下位移调用dialog框  true表示禁止调用 false表示允许调用*/
  var isEffectProgress: boolean

  // 全局方法
  /** 获取设备信息，待优化 App.js*/
  function getDevice(): Device
  /** 全局返回，返回事件在redux中backActions App.js */
  function back(): boolean
  /** 清理地图在redux中保存的数据 App.js */
  function clearMapData(): boolean
  // 待移除方法
  /** 获取通讯录类 Friend.js*/
  function getFriend(): any
  /** 许可获取事件 LicensePage.js */
  function recycleCloudLicense(): number
}

/** 点类型 */
type Point = {
  x: number
  y: number
}

type OrientationType = orientation | specificOrientation

/** 设备数据类型 */
declare interface Device {
  orientation: OrientationType,
  width: number,
  height: number,
}

/** 标绘动画数据类型 */
declare interface AnimationWayData {
  animationMode: number,
  startTime: string,
  durationTime: string,
  startMode: number,
  wayPoints: Array<Point>,
}

/** 数据源/数据集名称 */
declare interface DATASET_SOURCE {
  datasetName: string,
  datasourceName: string,
  layerName: string,
}

export { }