/**
 * 声明全局GLOBAL
 */
export const GLOBAL = {
  /** 语言 */
  language: 'CN',  
  /** 是否在市场审核期间 */
  isAudit: false,           
  markerTag: '',
  /** 版本号 */
  APP_VERSION: '',          
  /** 系统版本号 x32 x64 */    
  SYSTEM_VERSION: '', 
  /** 新手引导版本号 */
  GUIDE_VERSION: '',             
  /** TODO 动态切换主题，将 global.ThemeType 放入Redux中管理 */
  ThemeType: '',               
  /** 底图数量 */
  BaseMapSize: -1,             
  /** 判断设备是否是Pad */ 
  isPad: false,                  
  /** 防止重复点击/快速点击不同组件，用于首页（模块和Tabs）和MapView */
  clickWait: false,               
  /** 是否是在线协作模式 */
  coworkMode: false,             
  /** 首页模块类型 */ 
  Type: '',                    
  /** 地图触摸事件类型 */ 
  TouchType: '',
  /** 三维Action PAN3D | PANSELECT3D | PAN3D_FIX */    
  action3d: '',                
  /** 当前导航模式 INDOOR | OUTDOOR */
  CURRENT_NAV_MODE: '',        
  /** 网络请求数据的文本信息 */
  cookie: '',                  
  /** App本地文件Home目录 */
  homePath: '',                
  /** 许可是否合法 */
  isLicenseValid: false,         
  /** 三维，是否正在绕点飞行 */
  isCircleFlying: false,         
  /** 进入地图，是否打开了工作空间 */
  openWorkspace: false,          
  /** AR和二维地图切换 */
  showAIDetect: false,  
  
  //采集属性查看 add jiakai
  /** 是否采集或者标注 */ 
  HAVEATTRIBUTE: false,
  
  // 临时数据，是否移除待定
  /** 离线导航起点x */
  STARTX: 0,                   
  /** 离线导航起点y */
  STARTY: 0,                   
  /** 离线导航终点x */
  ENDX: 0,                     
  /** 离线导航终点y */ 
  ENDY: 0,                     
  /** 导航起点层 */ 
  STARTPOINTFLOOR: 0,          
  /** 导航终点楼层 */
  ENDPOINTFLOOR: 0,            
  /** 导航起点名称 */
  STARTNAME: '',                
  /** 导航终点名称 */
  ENDNAME: '',                  
  /** 导航数据数组 */
  NAV_PARAMS: [],        
  /** 暂存点，返回地图选点时使用 */
//   SELECTPOINTLATITUDEANDLONGITUDETEMP: Point
//   /** 地图选点时使用? */
//   SELECTPOINTLATITUDEANDLONGITUDE: Point      
//   /** 标绘动画数据 */
//   animationWayData: AnimationWayData          
//   /** // TODO 待去除当前图层全局变量 */
//   currentLayer: object             
//   /** 校准类型 arNavigation ｜ arVideo ｜ arImage ｜ arWebView｜ arText */           
//   EnterDatumPointType: '',      
//   /** AR地图是否从摄像头切换到地图界面 */
//   arSwitchToMap: false,           
//   /** 导航-增量路网数据 */
//   INCREMENT_DATA: DATASET_SOURCE   
//   /** 导航-采集方式 */
//   NAVMETHOD: '',
//   /** 判断是否含有CAD图层，如果有CAD图层，屏蔽线性和二次线配准 */
//   IsHaveCadDataset: false,        
//   /** 地图xml，用于保存改变地图之前的状态 */
//   MapXmlStr: '',                
//   /** ARMapping中临时存放的数据 */
//   MeasureCollectData: object       
//   /** 是否更新属性列表 */
//   NEEDREFRESHTABLE: object         
//   /** 注册横竖屏锁 */
//   ORIENTATIONLOCKED: false,       
//   /** 配准临时数据 */
//   RectifyDatasetInfo: Array<object>     
//   /** 配准临时数据 */
//   RectifyReferDatasetInfo: Array<object>  
//   /** 配准-算法模式 */
//   RegistrationArithmeticMode: 0,   
//   /** 被选中的框选属性中的一个属性 */
//   SelectedSelectionAttribute: object   
//   /** Toolbar是否显示指滑菜单 */
//   showMenu: false,                    
//   /** 场景名字 */
//   sceneName: '',    
//   /** 离线场景 */
//   offlineScene: false,                
//   /** 专题图-地图是否由xml加载 */
//   IS_MAP_FROM_XML: false,
//   // 组件ref
//   /** 地图界面-地图组件 MapView.js SMMapView */
//   mapView: any                   
//   /** 地图界面-地图比例尺组件 MapView.js ScaleView */
//   scaleView: any                  
//   /** 地图界面-地图加载组件 App.js Loading */
//   Loading: any                   
//   /** 地图界面-半透明遮盖层 MapView.js OverlayView */ 
//   OverlayView: any                
//   /** 地图界面-用户自定义输入弹窗 MapView.js CustomInputDialog */
//   InputDialog: any                
//   /** 地图界面-用户自定义信息弹窗 MapView.js CustomAlertDialog */
//   AlertDialog: any                
//   /** 地图界面-删除地图对象弹窗 MapView.js Dialog */
//   removeObjectDialog: any         
//   /** 地图界面-导航错误提示框（起始点不在路网数据集范围内或起始点附近无路网，是否使用在线路径分析？）Dialog */
//   NavDialog: any          
//   /** 地图界面-地图控制器 MapView.js MapController */        
//   mapController: any              
//   /** TODO 待用Toolbar替换。地图界面-工具栏 MapView.js Toolbar */
//   toolBox: any             
//   /** 地图界面-工具栏 MapView.js Toolbar */        
//   ToolBar: any           
//   /** 地图界面-目标识别header MapView.js MapSelectPoint */
//   AIDETECTCHANGE: any             
//   /** 地图界面-地图选点header MapView.js MapSelectPoint */
//   MAPSELECTPOINT: any             
//   /** 地图界面-地图选点底部组件 MapSelectPointButton */ 
//   MAPSELECTPOINTBUTTON: any       
//   /** 含按钮的提示框 App.js SimpleDialog */ 
//   SimpleDialog: any               
//   /** AR支持设备提示框 App.js SimpleDialog */
//   ARDeviceListDialog: any         
//   /** 地图界面-地图气泡提示消息 MapView.js BubblePane */
//   bubblePane: any                 
//   /** 地图界面-画图组件（画框：RECTANGLE，画圆：CIRCLE） MapView.js SurfaceView */
//   MapSurfaceView: any             
//   /** 地图界面-室内外路网采集的弹框 MapView.js IncrementRoadDialog */ 
//   IncrementRoadDialog: any        
//   /** 地图界面-图例组件 MapView.js RNLegendView */ 
//   legend: any                     
//   /** 地图界面-导航顶部组件 MapView.js NavigationStartHead */ 
//   NAVIGATIONSTARTHEAD: any        
//   /** 地图界面-POI界面容器 MapView.js PoiInfoContainer */ 
//   PoiInfoContainer: any           
//   /** 地图界面-POI搜索组件 MapView.js PoiTopSearchBar */ 
//   PoiTopSearchBar: any             
//   // TODO 以下组件ref是否移除待定
//   /** 投影消息提示框 MapView.js Dialog */
//   prjDialog: any                   
//   /** 地图界面专题图预览时的header MapView.js PreviewHeader */
//   PreviewHeader: any              
//   /** 地图选点界面 EnterDatumPoint.js MapSelectPointLatitudeAndLongitude */
//   DATUMPOINTVIEW: any      
  
//   /** 框选点选属性界面 当前页浏览属性数据 LayerSelectionAttribute.js*/
//   layerSelection: any

//   currentUser: any
//  /** 三维AR管线header ARSceneView.js Container */
//   ARContainer: any
//   /** 三维AR管线判断数据是否打开 ARSceneView.js*/
//   isSceneOpen: false,
//   /** AR模块判断是否定位*/
//   haslocation: false,
//   // 全局方法
//   /** 获取设备信息，待优化 App.js*/
//   function getDevice(): Device        
//   /** 全局返回，返回事件在redux中backActions App.js */
//   function back(): false,            
//   /** 清理地图在redux中保存的数据 App.js */ 
//   function clearMapData(): false,   
//   // 待移除方法
//   /** 获取通讯录类 Friend.js*/
//   function getFriend(): any,          
  /** 许可获取事件 LicensePage.js */
  recycleCloudLicense: () => {},  
}


// /** 点类型 */
// type Point = {
//   x: 0,
//   y: 0,
// }

// /** 设备数据类型 */
// declare interface Device {
//   orientation: '',
//   width: 0,
//   height: 0,
// }

// /** 标绘动画数据类型 */
// declare interface AnimationWayData {
//   animationMode: 0,
//   startTime: '',
//   durationTime: '',
//   startMode: 0,
//   wayPoints: Array<Point>,
// }

// /** 数据源/数据集名称 */
// declare interface DATASET_SOURCE {
//   datasetName: '',
//   datasourceName: '',
//   layerName: '',
// }