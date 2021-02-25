/**
 * 声明全局GLOBAL
 */
declare namespace GLOBAL {
  /** 语言 */
  let language: string  
  /** 是否在市场审核期间 */
  let isAudit:boolean           
  let markerTag: string
  /** 版本号 */
  let APP_VERSION: string          
  /** 系统版本号 x32 x64 */    
  let SYSTEM_VERSION: string 
  /** 新手引导版本号 */
  let GUIDE_VERSION: string             
  /** TODO 动态切换主题，将 GLOBAL.ThemeType 放入Redux中管理 */
  let ThemeType: string               
  /** 底图数量 */
  let BaseMapSize: number             
  /** 判断设备是否是Pad */ 
  let isPad: boolean                  
  /** 防止重复点击/快速点击不同组件，用于首页（模块和Tabs）和MapView */
  let clickWait: boolean               
  /** 是否是在线协作模式 */
  let coworkMode: boolean             
  /** 首页模块类型 */ 
  let Type: string                    
  /** 地图触摸事件类型 */ 
  let TouchType: string
  /** 三维Action PAN3D | PANSELECT3D | PAN3D_FIX */    
  let action3d: string                
  /** 当前导航模式 INDOOR | OUTDOOR */
  let CURRENT_NAV_MODE: string        
  /** 网络请求数据的文本信息 */
  let cookie: string                  
  /** App本地文件Home目录 */
  let homePath: string                
  /** 许可是否合法 */
  let isLicenseValid: boolean         
  /** 三维，是否正在绕点飞行 */
  let isCircleFlying: boolean         
  /** 进入地图，是否打开了工作空间 */
  let openWorkspace: boolean          
  /** AR和二维地图切换 */
  let showAIDetect: boolean           
  
  // 临时数据，是否移除待定
  /** 离线导航起点x */
  let STARTX: number                   
  /** 离线导航起点y */
  let STARTY: number                   
  /** 离线导航终点x */
  let ENDX: number                     
  /** 离线导航终点y */ 
  let ENDY: number                     
  /** 导航起点层 */ 
  let STARTPOINTFLOOR: number          
  /** 导航终点楼层 */
  let ENDPOINTFLOOR: number            
  /** 导航起点名称 */
  let STARTNAME: string                
  /** 导航终点名称 */
  let ENDNAME: string                  
  /** 导航数据数组 */
  let NAV_PARAMS: Array<object>        
  /** 暂存点，返回地图选点时使用 */
  let SELECTPOINTLATITUDEANDLONGITUDETEMP: Point
  /** 地图选点时使用? */
  let SELECTPOINTLATITUDEANDLONGITUDE: Point      
  /** 标绘动画数据 */
  let animationWayData: AnimationWayData          
  /** // TODO 待去除当前图层全局变量 */
  let currentLayer: object             
  /** 校准类型 arNavigation ｜ arVideo ｜ arImage ｜ arWebView｜ arText */           
  let EnterDatumPointType: string      
  /** AR地图是否从摄像头切换到地图界面 */
  let arSwitchToMap: boolean           
  /** 导航-增量路网数据 */
  let INCREMENT_DATA: DATASET_SOURCE   
  /** 判断是否含有CAD图层，如果有CAD图层，屏蔽线性和二次线配准 */
  let IsHaveCadDataset: boolean        
  /** 地图xml，用于保存改变地图之前的状态 */
  let MapXmlStr: string                
  /** ARMapping中临时存放的数据 */
  let MeasureCollectData: object       
  /** 是否更新属性列表 */
  let NEEDREFRESHTABLE: object         
  /** 注册横竖屏锁 */
  let ORIENTATIONLOCKED: boolean       
  /** 配准临时数据 */
  let RectifyDatasetInfo: Array<object>     
  /** 配准临时数据 */
  let RectifyReferDatasetInfo: Array<object>  
  /** 配准-算法模式 */
  let RegistrationArithmeticMode: number   
  /** 被选中的框选属性中的一个属性 */
  let SelectedSelectionAttribute: object   
  /** Toolbar是否显示指滑菜单 */
  let showMenu: boolean                    
  /** 场景名字 */
  let sceneName: string                   
  /** 专题图-地图是否由xml加载 */
  let IS_MAP_FROM_XML: boolean
  // 组件ref
  /** 地图界面-地图组件 MapView.js SMMapView */
  let mapView: any                   
  /** 地图界面-地图比例尺组件 MapView.js ScaleView */
  let scaleView: any                  
  /** 地图界面-地图加载组件 App.js Loading */
  let Loading: any                   
  /** 地图界面-半透明遮盖层 MapView.js OverlayView */ 
  let OverlayView: any                
  /** 地图界面-用户自定义输入弹窗 MapView.js CustomInputDialog */
  let InputDialog: any                
  /** 地图界面-用户自定义信息弹窗 MapView.js CustomAlertDialog */
  let AlertDialog: any                
  /** 地图界面-删除地图对象弹窗 MapView.js Dialog */
  let removeObjectDialog: any         
  /** 地图界面-导航错误提示框（起始点不在路网数据集范围内或起始点附近无路网，是否使用在线路径分析？）Dialog */
  let NavDialog: any          
  /** 地图界面-地图控制器 MapView.js MapController */        
  let mapController: any              
  /** TODO 待用Toolbar替换。地图界面-工具栏 MapView.js Toolbar */
  let toolBox: any             
  /** 地图界面-工具栏 MapView.js Toolbar */        
  let Toolbar: any           
  /** 地图界面-目标识别header MapView.js MapSelectPoint */
  let AIDETECTCHANGE: any             
  /** 地图界面-地图选点header MapView.js MapSelectPoint */
  let MAPSELECTPOINT: any             
  /** 地图界面-地图选点底部组件 MapSelectPointButton */ 
  let MAPSELECTPOINTBUTTON: any       
  /** 含按钮的提示框 App.js SimpleDialog */ 
  let SimpleDialog: any               
  /** AR支持设备提示框 App.js SimpleDialog */
  let ARDeviceListDialog: any         
  /** 地图界面-地图气泡提示消息 MapView.js BubblePane */
  let bubblePane: any                 
  /** 地图界面-画图组件（画框：RECTANGLE，画圆：CIRCLE） MapView.js SurfaceView */
  let MapSurfaceView: any             
  /** 地图界面-室内外路网采集的弹框 MapView.js IncrementRoadDialog */ 
  let IncrementRoadDialog: any        
  /** 地图界面-图例组件 MapView.js RNLegendView */ 
  let legend: any                     
  /** 地图界面-导航顶部组件 MapView.js NavigationStartHead */ 
  let NAVIGATIONSTARTHEAD: any        
  /** 地图界面-POI界面容器 MapView.js PoiInfoContainer */ 
  let PoiInfoContainer: any           
  /** 地图界面-POI搜索组件 MapView.js PoiTopSearchBar */ 
  let PoiTopSearchBar: any             
  // TODO 以下组件ref是否移除待定
  /** 投影消息提示框 MapView.js Dialog */
  let prjDialog: any                   
  /** 地图界面专题图预览时的header MapView.js PreviewHeader */
  let PreviewHeader: any              
  /** 地图选点界面 EnterDatumPoint.js MapSelectPointLatitudeAndLongitude */
  let DATUMPOINTVIEW: any             

  let currentUser: any
 /** 三维AR管线header ARSceneView.js Container */
  let ARContainer: any
  /** 三维AR管线判断数据是否打开 ARSceneView.js*/
  let isSceneOpen: boolean
  // 全局方法
  /** 获取设备信息，待优化 App.js*/
  function getDevice(): Device        
  /** 全局返回，返回事件在redux中backActions App.js */
  function back(): boolean            
  /** 清理地图在redux中保存的数据 App.js */ 
  function clearMapData(): boolean   
  // 待移除方法
  /** 获取通讯录类 Friend.js*/
  function getFriend(): boolean           
  /** 许可获取事件 LicensePage.js */
  function recycleCloudLicense(): number  
}

/** 点类型 */
type Point = {
  x: number
  y: number
}

/** 设备数据类型 */
declare interface Device {
  orientation: string,
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
}