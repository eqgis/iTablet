/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

/*global global*/
import * as React from 'react'
import {
  SMMapView,
  SMap,
  SScene,
  SCollector,
  SMediaCollector,
  SAIDetectView,
  SSpeechRecognizer,
  SMARMapView,
  SARMap,
  SMMeasureARGeneraView,
  // SCollectSceneFormView,
  SData,
  SPlot,
  SNavigation,
  SIndoorNavigation,
  GeoStyle,
  SARNavigation,
} from 'imobile_for_reactnative'
import { Action,  } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { DatasetType, GeometryType, EngineType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import { ARElementType, ARAction,} from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import PropTypes from 'prop-types'
import {
  FunctionToolbar,
  MapToolbar,
  MapNavMenu,
  MapNavIcon,
  MapController,
  ToolBar,
  OverlayView,
  BackgroundOverlay,
  AnalystMapButtons,
  AnalystMapToolbar,
  PoiInfoContainer,
  PoiTopSearchBar,
  RNLegendView,
  ScaleView,
  IncrementRoadView,
  MapSelectPoint,
  NavigationStartButton,
  NavigationStartHead,
  MapSelectPointButton,
  TrafficView,
  LocationView,
  NavigationPoiView,
  RNFloorListView,
  PreviewHeader,
  IncrementRoadDialog,
  SaveView,
  SaveListView,
} from '../../components'
import ToolbarModule from '../../components/ToolBar/modules/ToolbarModule'
import { shareModule, arEditModule } from '../../components/ToolBar/modules'
import ServiceAction from '../../components/ToolBar/modules/serviceModule/ServiceAction'
import {
  Container,
  MTBtn,
  Dialog,
  PopModal,
  SurfaceView,
  Progress,
  BubblePane,
  PopMenu,
  CustomInputDialog,
  CustomAlertDialog,
  RedDot,
  CompassView,
} from '../../../../components'
import {
  Toast,
  scaleSize,
  StyleUtils,
  setSpText,
  LayerUtils,
  FetchUtils,
  screen,
  Audio,
  DownloadUtil,
  SCoordinationUtils,
  AppToolBar,
  AppEvent,
  AppUser,
  AppLog,
} from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { FileTools } from '../../../../native'
import {
  ConstPath,
  ConstToolType,
  TouchType,
  ToolbarType,
  ChunkType,
  MapHeaderButton,
  Const,
  EventConst,
} from '../../../../constants'
import NavigationService from '../../../NavigationService'
import { setGestureDetectorListener } from '../../../GestureDetectorListener'
import {
  Platform,
  View,
  Text,
  // InteractionManager,
  Image,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  DeviceEventEmitter,
  PixelRatio,
} from 'react-native'
import { getLanguage } from '../../../../language/index'
import styles from './styles'
// import { Analyst_Types } from '../../../analystView/AnalystType'
import IncrementData from '../../components/ToolBar/modules/incrementModule/IncrementData'
import NewMessageIcon from '../../../../containers/tabs/Friend/Cowork/NewMessageIcon'
import CoworkInfo from '../../../../containers/tabs/Friend/Cowork/CoworkInfo'
import { BackHandlerUtil } from '../../util'
import { Bar } from 'react-native-progress'
import GuideViewMapArMappingModel from '../../components/GuideViewMapArMappingModel'
import GuideViewMapAnalystModel from '../../components/GuideViewMapAnalystModel'
import GuideViewMapThemeModel from '../../components/GuideViewMapThemeModel'
import GuideViewMapCollectModel from '../../components/GuideViewMapCollectModel'
import GuideViewMapEditModel from '../../components/GuideViewMapEditModel'
import ArMappingButton from '../../components/ArMappingButton'
import ImageButton from '../../../../components/ImageButton'
import Header from '../../../../components/Header'
import DatumPointCalibration from '../../../arDatumPointCalibration/'
import DataHandler from '../../../../utils/DataHandler'
import ARPoiSearchView from '../../components/ArNavigation/ARPoiSearchView'
import ARNavigationView from '../../components/ArNavigation/ARNavigationView'
import Toolbar from '@/Toolbar'
import { onAddARAnimation } from '@/Toolbar/modules/arAnimation/Actions'
import { CommonActions } from '@react-navigation/native'
import { Module } from '@/class'
import PositionStateView from '../../components/PositionStateView'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'
import { addOutdoorStartEndGuideLine } from '../../components/NavigationView/NavigationView'
import IndoorGPSCollector from '../../components/ToolBar/modules/toolModule/IndoorGPSCollector'

global.markerTag = 118082

const TOP_DEFAULT = Platform.select({
  android: screen.getHeaderHeight('PORTRAIT') + scaleSize(8),
  // ios: screen.isIphoneX() ? screen.X_TOP : screen.IOS_TOP,
  // ios: screen.isIphoneX() ? 0 : screen.IOS_TOP,
  ios: screen.getHeaderHeight('PORTRAIT') + scaleSize(8),
})

export default class MapView extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    nav: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    selection: PropTypes.array,
    latestMap: PropTypes.object,
    navigation: PropTypes.object,
    currentLayer: PropTypes.object,
    template: PropTypes.object,
    mapLegend: PropTypes.object,
    mapNavigation: PropTypes.object,
    mapScaleView: PropTypes.bool,
    navigationChangeAR: PropTypes.bool,
    navigationPoiView: PropTypes.bool,
    openOnlineMap: PropTypes.bool,
    navigationhistory: PropTypes.array,
    appConfig: PropTypes.object,
    mapModules: PropTypes.object,
    mapColumnNavBar: PropTypes.bool,
    backActions: PropTypes.object,
    navBarDisplay: PropTypes.bool,

    bufferSetting: PropTypes.object,
    overlaySetting: PropTypes.object,
    symbol: PropTypes.object,
    layers: PropTypes.object,
    map: PropTypes.object,
    collection: PropTypes.object,
    device: PropTypes.object,
    online: PropTypes.object,
    analyst: PropTypes.object,
    downloads: PropTypes.array,
    mapSearchHistory: PropTypes.array,
    toolbarStatus: PropTypes.object,
    laboratory: PropTypes.object,
    showARLabel: PropTypes.bool,

    isClassifyView: PropTypes.bool,
    mapArGuide: PropTypes.bool,
    mapArMappingGuide: PropTypes.bool,
    mapAnalystGuide: PropTypes.bool,
    themeGuide: PropTypes.bool,
    collectGuide: PropTypes.bool,
    mapEditGuide: PropTypes.bool,

    peripheralDevice: PropTypes.object,
    essentialInfo: PropTypes.object,
    pointStateText: PropTypes.string,

    coworkInfo: PropTypes.object,
    currentTask: PropTypes.object,
    coworkMessages: PropTypes.object,
    currentGroup: PropTypes.object,
    currentTaskServices: PropTypes.object,
    setCoworkService: PropTypes.func,
    clearCoworkService: PropTypes.func,

    baseMaps: PropTypes.object,

    showDatumPoint: PropTypes.bool,
    poiSearch: PropTypes.bool,
    isAR: PropTypes.bool,
    setDatumPoint: PropTypes.func,
    showAR: PropTypes.func,
    arPoiSearch: PropTypes.func,

    setNavBarDisplay: PropTypes.func,
    setEditLayer: PropTypes.func,
    setSelection: PropTypes.func,
    setLatestMap: PropTypes.func,
    setCurrentMap: PropTypes.func,
    getLayers: PropTypes.func,
    setCollectionInfo: PropTypes.func,
    setCurrentLayer: PropTypes.func,
    setCurrentAttribute: PropTypes.func,
    getAttributes: PropTypes.func,
    // importTemplate: PropTypes.func,
    importWorkspace: PropTypes.func,
    setCurrentTemplateInfo: PropTypes.func,
    setCurrentPlotInfo: PropTypes.func,
    setTemplate: PropTypes.func,
    getMaps: PropTypes.func,
    exportWorkspace: PropTypes.func,
    openWorkspace: PropTypes.func,
    closeWorkspace: PropTypes.func,
    getSymbolTemplates: PropTypes.func,
    getSymbolPlots: PropTypes.func,
    openMap: PropTypes.func,
    closeMap: PropTypes.func,
    saveMap: PropTypes.func,
    getMapSetting: PropTypes.func,
    setSharing: PropTypes.func,
    setCurrentSymbols: PropTypes.func,
    setCurrentSymbol: PropTypes.func,
    clearAttributeHistory: PropTypes.func,
    setMapLegend: PropTypes.func,
    setMapNavigation: PropTypes.func,
    setNavigationChangeAR: PropTypes.func,
    setNavigationPoiView: PropTypes.func,
    setBackAction: PropTypes.func,
    removeBackAction: PropTypes.func,
    setAnalystParams: PropTypes.func,
    setMapSearchHistory: PropTypes.func,
    setNavigationHistory: PropTypes.func,
    setOpenOnlineMap: PropTypes.func,
    downloadFile: PropTypes.func,
    deleteDownloadFile: PropTypes.func,
    setToolbarStatus: PropTypes.func,
    showARSceneNotify: PropTypes.bool,
    showSampleData: PropTypes.bool,
    setSampleDataShow: PropTypes.func,
    isShowCompass: PropTypes.bool,
    aiDetectData: PropTypes.object,
    aiClassifyData: PropTypes.object,
    setAIClassifyModel: PropTypes.func,
    setAIDetectModel: PropTypes.func,
    isRTKAutoCalibration: PropTypes.bool,
  }

  /** 是否导航中 */
  isGuiding = false

  constructor(props) {
    super(props)
    let { params } = this.props.route
    if (!params) {
      const parent = this.props.navigation.dangerouslyGetParent()
      params = parent.state.key === 'CoworkMapStack' && parent.state.params
    }
    /** 模块类型 */
    this.type = (params && params.type) || global.Type || 'LOCAL'
    /** 为true则仅显示地图，不显示其他UI控件 */
    this.isExample = (params && params.isExample) || false
    this.viewEntire = params?.viewEntire !== undefined ? params.viewEntire : this.isExample
    /** 是否显示图例 */
    this.noLegend = (params && params.noLegend) || false
    /**
     * 要打开的数据 object|array 工作空间，数据源，地图或它们的数组
     * Datasource和Map一般不会同时使用
     * 工作空间，一般是大工作空间
     * {
     *  type: 'Workspace'
     *  DSParams: { server<string>, 工作空间路径 },
     * }
     * 数据源，一般为从ConstOnline获取的底图的数据源
     * {
     *  type: 'Datasource'
     *  DSParams: {
     *   server<string>, 数据源路径，
     *   engineType: 225,
     *   alias: 'TrafficMap',
     *  },
     *  layerIndex: 0, 要添加到地图的数据集序号
     * }
     * 地图，要打开的地图
     * {
     *  type: 'Map'
     *  path<string>, 地图xml路径
     *  name<string>, 地图名
     * }
     */
    this.wsData = params && params.wsData
    /** 是否显示定位callout */
    this.showMarker = params && params.showMarker
    /** 页面标题 */
    this.mapTitle = params.mapTitle
    /** 模块地图类型 */
    this.mapType = params.mapType
    /**
     * 地图/ar/scene
     */
    this.onMapLoad = params.onMapLoad
    this.toolbarModuleData = params.toolbarModuleData || []
    this.path = (params && params.path) || ''
    this.showDialogCaption =
      // params && params.path ? !params.path.endsWith('.smwu') : true
      params && params.path ? !(params.path.indexOf('.smwu', params.path.length - '.smwu'.length) !== -1) : true
    /** 自定义返回事件 */
    this.backAction = (params && params.backAction) || null
    this.state = {
      showMap: false, // 控制地图初始化显示
      data: params ? params.data : [],
      mapTitle: this.mapTitle,
      // wsName: wsName,
      measureShow: false,
      measureResult: 0,
      canBeUndo: false,
      canBeRedo: false,
      showAIDetect: this.isARModule(),
      bGoneAIDetect: false,
      showArModeIcon: true,
      showIncrement: false,
      speechContent: '',
      recording: false,
      isRight: true, //室内增量路网模式，true为手绘，false为轨迹 zhangxt
      currentFloorID: '', //导航模块当前楼层id
      showScaleView: false, //是否显示比例尺（地图加载完成后更改值）
      path: '',
      pathLength: '',
      onlineCowork: CoworkInfo.coworkId !== '',
      selectPointType: params && params.selectPointType || undefined,
      mapLoaded: false, // 判断地图是否加载完成
      showArMappingButton: false,
      showSave: false,
      showSwitch: false,
      showADDPoint: false,
      isfirst: true,
      isDrawing: false,
      isMeasure: false,
      currentHeight: '0m',
      showADD: true,//默认先显示
      showLog: false,
      dioLog: '',
      is_showLog: false,
      showCurrentHeightView: false,
      measureType: '',
      // isAR:true,
      isCollect: false,
      isnew: true,
      showGenera: false,
      isTrack: false,
      samplescale: new Animated.Value(0.1),
      showPoiSearch: false,
      showNavigation: false,
      isFull: true,
    }
    // this.props.setDatumPoint(global.Type === ChunkType.MAP_AR ? true : false)
    this.props.setDatumPoint(false)
    this.props.showAR(this.isARModule())
    // this.currentFloorID = ''//有坑，id有可能就是‘’
    this.currentFloorID = undefined
    //导航  地图选点界面的搜索按钮被点击,当前设置按钮title
    this.searchClickedInfo = {
      isClicked: false,
      title: '',
    }

    // this.mapLoaded = false // 判断地图是否加载完成
    this.fullMap = false
    this.analystRecommendVisible = false // 底部分析推荐列表 是否显示
    global.showAIDetect = this.state.showAIDetect
    this.lastClickTime = 0
    //  导航选中的数据
    this.selectedData = {
      selectedDatasources: [], //选中的数据源
      selectedDatasets: [], //选中的数据集
      currentDatasource: [], //当前使用的数据源
      currentDataset: {}, //当前使用的数据集
    }
    // this.floorHiddenListener = null
    CoworkInfo.closeMapHandle = this.back

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })

    // 初始化位置
    this._previousTop = screen.getHeaderHeight(this.props.device.orientation) + scaleSize(8)
    this._previousLeft = 0
    const position = this._getAvailablePosition(this._previousLeft, this._previousTop)
    this._previousTop = position.y
    this._previousLeft = position.x
    this._moveViewStyles = {
      style: {
        top: this._previousTop,
        left: this._previousLeft,
      },
    }

    this.clickAble = true//防止编辑状态下快速重复点击

    //AR测量进入地图默认没有定位
    global.haslocation = false

    // 分享按钮是否可点击标识，true为可点击
    this.isShareCanClick = true
    /** 提示语回调 提示显示的控制定时器 */
    this.timer = null
  }

  isARModule = () => {
    return this.mapType === Module.MapType.AR
  }

  _handleStartShouldSetPanResponder = () => {
    return true
  }

  _handleMoveShouldSetPanResponder = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) < 1 && Math.abs(gestureState.dx) < 1) {
      return false
    }
    return true
  }

  _handlePanResponderMove = (evt, gestureState) => {
    const y = this._previousTop + gestureState.dy
    const x = this._previousLeft + gestureState.dx

    const position = this._getAvailablePosition(x, y)

    this._moveViewStyles.style.top = position.y
    this._moveViewStyles.style.left = position.x

    this._updateNativeStyles()
  }

  _updateNativeStyles = () => {
    this.moveView && this.moveView.setNativeProps(this._moveViewStyles)
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    this._previousTop = this._moveViewStyles.style.top
    this._previousLeft = this._moveViewStyles.style.left
  }

  /**
 * 获取图例可用位置, 不能超出屏幕
 */
  _getAvailablePosition = (x, y) => {
    if (y < TOP_DEFAULT && this.props.device.orientation.indexOf('PORTRAIT') >= 0) {
      y = TOP_DEFAULT
    } else if (y < 0 && this.props.device.orientation.indexOf('LANDSCAPE') >= 0) {
      y = 0
    } else {
      const maxY = this.props.device.safeHeight - scaleSize(250)
      if (y > maxY) {
        y = maxY
      }
    }
    if (x < 0) {
      x = 0
    } else {
      const maxX = this.props.device.safeWidth - scaleSize(250)
      if (x > maxX) {
        x = maxX
      }
    }
    return { x, y }
  }

  // handleStateChange = async appState => {
  //   if (Platform.OS === 'android') {
  //     if (!this.props.isClassifyView) {
  //       if (appState === 'background') {
  //         SAIDetectView.onPause()
  //       }

  //       if (appState === 'active') {
  //         SAIDetectView.onResume()
  //       }
  //     }
  //   }
  // }

  /** 添加楼层显隐监听 */
  addFloorHiddenListener = () => {
    SMap.setFloorHiddenListener(async (result:{currentFloorID:number}) => {
      //在选点过程中/路径分析界面 不允许拖放改变FloorList、MapController的状态
      // 使用this.currentFloorID 使ID发生变化时只渲染一次
      if (
        result.currentFloorID !== this.currentFloorID /*&&*/
        // !(
        //   // (global.MAPSELECTPOINTBUTTON &&
        //   //   global.MAPSELECTPOINTBUTTON.state.show) ||
        //   (global.NAVIGATIONSTARTHEAD &&
        //     global.NAVIGATIONSTARTHEAD.state.show) ||
        //   global.PoiTopSearchBar.state.visible
        // )
      ) {
        this.currentFloorID = result.currentFloorID
        if (!await SNavigation.isGuiding()) {
          this.setState({
            currentFloorID: result.currentFloorID,
          })
        } else {
          this.currentFloorID = this.state.currentFloorID
        }
      }
    })
  }

  async componentDidMount() {
    AppEvent.addListener('on_exit_ar_map_module', this.back)
    if (!global.isLicenseValid) {
      const licenseStatus = await SData.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
    }

    if (global.Type === ChunkType.MAP_AR) {
      Dimensions.addEventListener('change', this.onChange)
    }

    if (global.Type === ChunkType.MAP_AR) {
      this.showFullMap(true)
    }
    BackHandler.addEventListener('hardwareBackPress', this.backHandler)

    if (global.isLicenseValid) {
      if (global.Type === ChunkType.MAP_NAVIGATION) {
        this.addFloorHiddenListener()
        SNavigation.setNaviListener({
          onStartNavi: () => {},
          onStopNavi: this._changeRouteCancel,
          onArrivedDestination: () => {
            if (
              global.NAV_PARAMS &&
                global.NAV_PARAMS.filter(item => !item.hasNaved).length > 0
            ) {
              global.changeRouteDialog &&
                  global.changeRouteDialog.setDialogVisible(true)
            } else {
              this._changeRouteCancel()
            }
          },
        })
        SIndoorNavigation.setNaviListener({
          onStartNavi: () => {},
          onStopNavi: this._changeRouteCancel,
          onArrivedDestination: () => {
            if (
              global.NAV_PARAMS &&
                global.NAV_PARAMS.filter(item => !item.hasNaved).length > 0
            ) {
              global.changeRouteDialog &&
                  global.changeRouteDialog.setDialogVisible(true)
            } else {
              this._changeRouteCancel()
            }
          },
        })
        SIndoorNavigation.setFloorChangeListener(this.changeFloorID)
      }
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.LOADING,
          //'地图加载中'
        )
      // 动画导致有时不会进入InteractionManager
      // InteractionManager.runAfterInteractions(() => {
      global.SaveMapView &&
        global.SaveMapView.setTitle(
          getLanguage(this.props.language).Prompt.SAVE_TITLE,
          getLanguage(this.props.language).Prompt.SAVE_YES,
          getLanguage(this.props.language).Prompt.SAVE_NO,
          getLanguage(this.props.language).Prompt.CANCEL,
        )

      this.setState({
        showMap: true,
      })

      this.props.setBackAction({
        key: 'MapView',
        action: this.back,
      })

      SMediaCollector.setDownloadListener({
        downloadingHandler: data => {
          DownloadUtil.downloadMedia(data)
          DeviceEventEmitter.emit(EventConst.DOWNLOAD_MEDIA, data)
        },
        downloadedHandler: data => {
          DownloadUtil.downloadMedia(data)
          DeviceEventEmitter.emit(EventConst.DOWNLOAD_MEDIA, data)
        },
      })
      SMediaCollector.setCalloutTapListener(async info => {
        let layerInfo
        for (const layer of this.props.layers.layers) {
          if (layer.name === info.layerName) {
            layerInfo = layer
            break
          }
        }
        NavigationService.navigate('MediaEdit', {
          layerInfo,
          info,
        })
      })

      this.clearData()
      if (this.toolBox) {
        global.toolBox = this.toolBox
      }

      this.unsubscribeDidFocus = () => {
        if (this.showFullonBlur) {
          this.showFullMap(false)
          this.showFullonBlur = false
        }
        this.backgroundOverlay && this.backgroundOverlay.setVisible(false)
      }

      // this.unsubscribeBlur = () => {
      //   if (!this.fullMap) {
      //     this.showFullMap(true)
      //     this.showFullonBlur = true
      //   }
      //   this.backgroundOverlay && this.backgroundOverlay.setVisible(true)
      // }

      //跳转回mapview速度太快时会来不及触发willFocus，在didFocus时重复处理相关逻辑
      this.props.navigation.addListener('focus', this.unsubscribeDidFocus)
      // this.props.navigation.addListener('blur', this.unsubscribeBlur)

      SMap.addMessageCalloutListener(this.onMessageCalloutTap)
      this.addSpeechRecognizeListener()
      if (global.language === 'CN') {
        SSpeechRecognizer.setParameter('language', 'zh_cn')
      } else {
        SSpeechRecognizer.setParameter('language', 'en_us ')
      }
    } else {
      global.SimpleDialog.set({
        text: getLanguage(global.language).Prompt.APPLY_LICENSE_FIRST,
        confirmAction: () => NavigationService.goBack(),
        cancelAction: () => NavigationService.goBack(),
      })
      global.SimpleDialog.setVisible(true)
    }
    if (this.isARModule()) {
      (async function () {
        SARMap.addOnHeightChangeListener({
          onHeightChange: height => {
            height = height.toFixed(2)
            this.setState({
              currentHeight: height + 'm',
            })
          },
        })
        // }

        //没有动画回调的话提示语默认5秒后开启
        if (!this.state.is_showLog) {
          setTimeout(() => {
            this.setState({ is_showLog: true })
          }, 5000)
        }

      }.bind(this)())
    }
  }

  /**添加按钮 */
  onAdd = result => {
    if (result.add) {
      if (this.state.isfirst) {
        this.setState({ showADD: true, showADDPoint: true, is_showLog: true })
      } else {
        this.setState({ showADD: true })
      }
    } else {
      this.setState({ showADD: false, showADDPoint: false })
    }
  }

  /**提示语回调 */
  onshowLog = result => {
    if(!this.timer) {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
      }, 2000)

      if (result.close) {
        this.setState({
          dioLog: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_CLOSE, showLog: true
        })
      }

      if(result.far) {
        this.setState({
          dioLog: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_FAR, showLog: true
        })
      }

      if (result.dark) {
        this.setState({
          dioLog: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_DARK, showLog: true
        })
      }

      if (result.fast) {
        this.setState({
          dioLog: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_FAST, showLog: true
        })
      }

      if (result.nofeature) {
        if (this.state.dioLog != getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_LAYOUT_DARK)
          this.setState({
            dioLog: getLanguage(global.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_LAYOUT_NOFEATURE, showLog: true
          })
      }

    }

    if (result.none) {
      this.setState({ dioLog: '', showLog: false })
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.mapNavigation) !==
      JSON.stringify(this.props.mapNavigation)
    ) {
      this.showFullMap(this.props.mapNavigation.isShow)
    } else if (this.props.showDatumPoint !== prevProps.showDatumPoint && this.measureType !== 'arCollect') {
      if (this.props.poiSearch) {
        if (!this.props.showDatumPoint) {
          this.props.arPoiSearch(false)
        }
      } else {
        if (global.Type === ChunkType.MAP_AR) {
          this.showFullMap(this.props.showDatumPoint)
        }
      }
    }

    if (
      JSON.stringify(prevProps.showSampleData) !==
      JSON.stringify(this.props.showSampleData)
    ) {
      if (this.props.showSampleData) {
        const animatedList = []

        animatedList.push(
          Animated.timing(this.state.samplescale, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: false,
          })
        )
        animatedList.push(
          Animated.timing(this.state.samplescale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          })
        )
        Animated.sequence(animatedList).start()
      }
    }

    // if (
    //   JSON.stringify(prevProps.editLayer) !==
    //     JSON.stringify(this.props.editLayer) &&
    //   this.props.nav.routes[this.props.nav.index] === 'MapView'
    // ) {
    //   let name = this.props.editLayer ? this.props.editLayer.name : ''
    //   name && Toast.show('当前可编辑的图层为\n' + name)
    // }
    if (
      JSON.stringify(prevProps.currentLayer) !==
      JSON.stringify(this.props.currentLayer)
    ) {
      global.currentLayer = this.props.currentLayer
    }

    // 防止Toolbar被销毁后，再次添加Toolbar，修改其state失败
    if (this.toolBox) {
      global.toolBox = this.toolBox
    }

    // TODO 调整返回地图界面，改变Header以及返回事件，点击返回后，恢复原来地图界面的Header，去掉MapView中特例功能的方法
    // 网络分析模式下
    if (this.props.analyst.params) {
      // 网络分析模式下，设置返回按钮事件
      if (
        JSON.stringify(prevProps.analyst.params) !==
        JSON.stringify(this.props.analyst.params)
      ) {
        this.toolBox &&
          this.toolBox.setVisible(false, '', {
            cb: () => {
              if (
                this.props.analyst.params.type ===
                ConstToolType.SM_MAP_ANALYSIS_OPTIMAL_PATH ||
                this.props.analyst.params.type ===
                ConstToolType.SM_MAP_ANALYSIS_CONNECTIVITY_ANALYSIS ||
                this.props.analyst.params.type ===
                ConstToolType.SM_MAP_ANALYSIS_FIND_TSP_PATH
              ) {
                this.container && this.container.setHeaderVisible(false)
              } else {
                this.mapController && this.mapController.setVisible(false)
              }
              this.container && this.container.setBottomVisible(false)
              this.NavIcon && this.NavIcon.setVisible(false)
              if (
                this.props.analyst.params.title &&
                this.props.analyst.params.title !== this.state.mapTitle
              ) {
                this.setState({ mapTitle: this.props.analyst.params.title })
              }
              global.TouchType = TouchType.NULL //进入分析页面，触摸事件默认为空
            },
          })
        this.backAction =
          (this.props.analyst.params && this.props.analyst.params.backAction) ||
          null
      }

      // 网络分析模式下，地图控制器 横竖屏切换位置变化
      if (this.props.device.orientation !== prevProps.device.orientation) {
        if (this.analystRecommendVisible) {
          if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
            this.mapController.reset()
          } else {
            this.mapController.move({ bottom: 200 })
          }
        }
      }
    } else if (prevProps.analyst.params && !this.props.analyst.params) {
      this.backAction = null
      // this.container && this.container.setHeaderVisible(true)
      // this.container && this.container.setBottomVisible(true)
      if (this.state.mapTitle !== this.mapTitle) {
        this.setState({ mapTitle: this.mapTitle })
      }
    }

    if (
      this.props.device.orientation !== prevProps.device.orientation &&
      this.props.analyst.params
    ) {
      if (this.analystRecommendVisible) {
        if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
          this.mapController.reset()
        } else {
          this.mapController.move({ bottom: 200 })
        }
      }
    }

    if (
      this.props.downloads.length > 0 &&
      JSON.stringify(this.props.downloads) !==
      JSON.stringify(prevProps.downloads)
    ) {
      let data
      for (let i = 0; i < this.props.downloads.length; i++) {
        // if (this.props.downloads[i].id === global.Type) {
        if (
          this.props.downloads[i].id &&
          this.props.downloads[i].params.module === global.Type
        ) {
          data = this.props.downloads[i]
        }
        if (this.props.downloads[i].id === 'mobilenet_quant_224') {
          data = this.props.downloads[i]
        }
        if (this.props.downloads[i].id === 'gltf') {
          data = this.props.downloads[i]
        }
      }
      if (data && this.mProgress) {
        this.mProgress.progress = data.progress / 100
      }
    }

    if (global.Type === ChunkType.MAP_NAVIGATION) {
      (async function () {
        const currentFloorID = await SIndoorNavigation.getCurrentFloorID()
        this.changeFloorID(currentFloorID, () => {
          const { params } = this.props.route
          const preParams = prevProps.route.params
          if (params?.hideMapController && !preParams?.hideMapController) {
            this.mapController && this.mapController.setVisible(false)
          }
        })
      }.bind(this)())
    }

    // 地图选点组件MapSelectPoint
    // 当导航到MapView时，传递过来的props中的selectPointType和state中的不一致时，更新state中的selectPointType
    // MapSelectPoint根据selectPointType显示
    if (
      this.props.nav.routes &&
      this.props.nav.routes[this.props.nav.index].name === 'MapStack' &&
      prevProps.route.key !== this.props.route.key &&
      (
        prevProps.route.params?.selectPointType !== this.props.route.params?.selectPointType ||
        this.state.selectPointType !== this.props.route.params.selectPointType
      )
    ) {
      this.setState({
        selectPointType: this.props.route.params.selectPointType,
      })
    }

    if (this.state.onlineCowork !== (CoworkInfo.coworkId !== '')) {
      this.setState({
        onlineCowork: CoworkInfo.coworkId !== '',
      })
    }
  }

  componentWillUnmount() {
    AppEvent.removeListener('on_exit_ar_map_module', this.back)
    if (global.Type === ChunkType.MAP_AR) {
      Dimensions.removeEventListener('change', this.onChange)
    }
    if (
      this.isARModule()
    ) {
      screen.unlockAllOrientations()
    }
    // if (global.Type === ChunkType.MAP_AR_ANALYSIS) {
    //   (async function () {
    //     SAIDetectView.dispose()
    //   })()
    // }

    //unmount时置空 zhangxt
    global.Type = null
    SMap.setFloorHiddenListener(null)
    // if (this.floorHiddenListener) {
    //   this.floorHiddenListener.remove()
    // }
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.route.name,
      })
    }
    // this.props.setMapLegend(false)

    // 防止意外退出地图界面，而没有关闭地图，导致再次进入时打开地图挂掉
    if (this.props.map.currentMap.name) {
      this.closeMap()
    }

    // 移除多媒体采集监听
    SMediaCollector.removeListener()
    SMediaCollector.removeDownloadListener()
    // 移除协作消息点击监听
    SMap.removeMessageCalloutListener()

    // 移除多媒体采集Callout
    global.mapView && SMediaCollector.removeMedias()

    this.showMarker && SMap.deleteMarker(global.markerTag)

    if (global.MapTabNavigator) {
      global.MapTabNavigator = null
    }

    this.props.navigation.removeListener('focus', this.unsubscribeDidFocus)
    // this.props.navigation.removeListener('blur', this.unsubscribeBlur)
    //移除手势监听
    global.mapView && SMap.setGestureDetector(null)

    BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
  }

  /** 添加语音识别监听 */
  addSpeechRecognizeListener = () => {
    SSpeechRecognizer.addListenser({
      onBeginOfSpeech: () => {
        this.setState({ speechContent: '', recording: true })
      },
      onEndOfSpeech: () => {
        this.setState({ recording: false })
      },
      onError: e => {
        let error = getLanguage(global.language).Prompt.SPEECH_ERROR
        if (e.indexOf('没有说话') !== -1) {
          error = getLanguage(global.language).Prompt.SPEECH_NONE
        }
        this.setState({ speechContent: error })
      },
      onResult: ({ info }) => {
        this.setState({ speechContent: info }, () => {
          setTimeout(() => {
            try {
              info = info.toLowerCase()
              if (info.indexOf('关闭') !== -1 || info.indexOf('close') !== -1) {
                this.back()
              } else if (
                info.indexOf('定位') !== -1 ||
                info.indexOf('locate') !== -1 ||
                info.indexOf('location') !== -1
              ) {
                (async function () {
                  if (global.Type === ChunkType.MAP_3D) {
                    await SScene.setHeading()
                    // 定位到当前位置
                    await SScene.flyToCurrent()
                    // await SScene.resetCamera()
                    this.mapController.setCompass(0)
                  } else {
                    SMap.moveToCurrent().then(result => {
                      !result &&
                        Toast.show(
                          getLanguage(global.language).Prompt.OUT_OF_MAP_BOUNDS,
                        )
                    })
                  }
                }.bind(this)())
              } else if (
                info.indexOf('放大') !== -1 ||
                info.indexOf('zoom in') !== -1
              ) {
                SMap.zoom(2)
              } else if (
                info.indexOf('缩小') !== -1 ||
                info.indexOf('zoom out') !== -1
              ) {
                SMap.zoom(0.5)
              }
            } catch (e) {
              return
            }
          }, 1000)
        })
      },
    })
  }

  /** 继续室内外一体化导航，切换到剩下的室内或室外导航 */
  _changeNavRoute = async () => {
    global.changeRouteDialog.setDialogVisible(false)
    this.setLoading(true, getLanguage(global.language).Prompt.ROUTE_ANALYSING)
    const curNavInfos = global.NAV_PARAMS.filter(item => !item.hasNaved)
    const guideLines = global.NAV_PARAMS.filter(item => item.hasNaved)
    await SMap.clearTrackingLayer()
    await SNavigation.clearPath()
    await SIndoorNavigation.clearPath()
    const params = JSON.parse(JSON.stringify(curNavInfos[0]))
    params.hasNaved = true
    const {
      startX,
      startY,
      endX,
      endY,
      startFloor,
      endFloor,
      datasourceName,
    } = params
    try {
      if (params.isIndoor) {
        await SIndoorNavigation.setRouteAnalyzePoints({
          startPoint: {x: startX, y: startY, floorID: startFloor},
          destinationPoint: {x: endX, y: endY, floorID: endFloor}
        })
        await SIndoorNavigation.setRouteAnalyzeData({datasourceAlias: datasourceName})
        const rel = await SIndoorNavigation.routeAnalyst()
        if (!rel) {
          Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
          this.changeNavPathInfo({ path: '', pathLength: '' })
          this.setLoading(false)
          this._changeRouteCancel()
          return
        }

        const style = new GeoStyle()
        style.setLineWidth(1)
        style.setLineColor(0,  145, 239)
        style.setLineStyle(9)
        const mapPrj = await SMap.getPrjCoordSys()

        for (const item of guideLines) {

          const points = await SData.CoordSysTranslatorGPSToPrj(mapPrj, [
            { x: item.startX, y: item.startY },
            { x: item.endX, y: item.endY },
          ])

          await SMap.addGeometryToTrackingLayer(
            {type: GeometryType.GEOLINE, points:[points]},
            '',
            style,
          )
        }
        await SIndoorNavigation.startGuide(1)
        this.FloorListView?.setVisible(true)
        global.CURRENT_NAV_MODE = 'INDOOR'
      } else {
        const homePath = await FileTools.getHomeDirectory()
        const userName = AppUser.getCurrentUser().userName
        const modelPath = `${homePath}/iTablet/User/${userName}/Data/Datasource/${params.modelFileName}.snm`
        await SNavigation.setRouteAnalyzeData({
          networkDataset: {
            datasourceAlias: params.datasourceName,
            datasetName:  params.datasetName
          },
          modelPath: modelPath
        })
        await SNavigation.setRouteAnalyzePoints({
          startPoint: {x: startX, y: startY},
          destinationPoint: {x: endX, y: endY}
        })
        const result = await SNavigation.routeAnalyst()
        if(result) {
          //添加分析起终点到参数起终点之间的虚线
          const mapPrj = await SMap.getPrjCoordSys()
          const start = result.route[0]
          const end = result.route[result.route.length - 1]
          await addOutdoorStartEndGuideLine(
            {x: global.STARTX, y: global.STARTY},
            {...start},
            {x: global.ENDX, y: global.ENDY},
            {...end},
            mapPrj
          )
        }
        if (result) {
          const style = new GeoStyle()
          style.setLineWidth(1)
          style.setLineColor(0,  145, 239)
          style.setLineStyle(9)
          const mapPrj = await SMap.getPrjCoordSys()

          for (const item of guideLines) {
            const points = await SData.CoordSysTranslatorGPSToPrj(mapPrj, [
              { x: item.startX, y: item.startY },
              { x: item.endX, y: item.endY },
            ])
            await SMap.addGeometryToTrackingLayer(
              {type: GeometryType.GEOLINE, points:[points]},
              '',
              style,
            )
          }
          await SNavigation.startGuide(1)
          this.FloorListView?.setVisible(false)
          SIndoorNavigation.setCurrentFloorID('')
          global.CURRENT_NAV_MODE = 'OUTDOOR'
        } else {
          Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
          this.changeNavPathInfo({ path: '', pathLength: '' })
          this.setLoading(false)
          this._changeRouteCancel()
          return
        }
      }
    } catch (e) {
      AppLog.error(e)
      Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
      this.changeNavPathInfo({ path: '', pathLength: '' })
      this.setLoading(false)
      this._changeRouteCancel()
      return
    }
    curNavInfos[0] = params
    global.NAV_PARAMS = guideLines.concat(curNavInfos)
    this.changeNavPathInfo({ path: '', pathLength: '' })
    this.setLoading(false)
  }
  /** 取消切换，结束室内外一体化导航 清除所有导航信息 */
  _changeRouteCancel = async () => {
    this.isGuiding = false
    await SNavigation.clearPath()
    await SIndoorNavigation.clearPath()
    await SMap.clearTrackingLayer()
    await SMap.removeCallout('startPoint')
    await SMap.removeCallout('endPoint')
    this.showFullMap(false)
    this.props.setMapNavigation({ isShow: false, name: '' })
    global.STARTX = undefined
    global.STARTY = undefined
    global.ENDX = undefined
    global.ENDY = undefined
    global.TouchType = TouchType.NORMAL
    global.CURRENT_NAV_MODE = ''
    global.NAV_PARAMS = []
    global.STARTNAME = getLanguage(
      global.language,
    ).Map_Main_Menu.SELECT_START_POINT
    global.ENDNAME = getLanguage(
      global.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    if (global.mapController) {
      global.mapController.reset()
      global.mapController.setGuiding(false)
    }
    if (global.FloorListView) {
      global.FloorListView.changeBottom(false)
      global.FloorListView.setGuiding(false)
      global.FloorListView.setVisible(true)
    }
  }

  /** 检测MapView在router中是否唯一 **/
  checkMapViewIsUnique = () => {
    let mapViewNums = 0
    if (this.props.nav.routes) {
      for (let i = 0; i < this.props.nav.routes.length; i++) {
        if (
          this.props.nav.routes[i].name === 'MapView' ||
          this.props.nav.routes[i].name === 'MapTabs'
        ) {
          mapViewNums++
        }
      }
    } else {
      mapViewNums++
    }

    const current = this.props.nav.routes[this.props.nav.routes.length - 1]

    return (
      mapViewNums === 1 &&
      (current.name === 'MapView' || current.name === 'MapTabs')
    )
  }

  resetMapView = () => {
    this.setState(
      {
        showMap: false,
      },
      () => {
        this.setState({
          showMap: true,
        })
      },
    )
  }

  clearData = () => {
    this.props.setEditLayer(null)
    // this.props.setSelection(null)
    this.props.setCollectionInfo() // 置空Redux中Collection中的数据
    this.props.setCurrentTemplateInfo() // 清空当前模板
    this.props.setCurrentPlotInfo() //清空当前模板
    this.props.setTemplate() // 清空模板
  }

  /** 原生mapview加载完成回调 */
  _onGetInstance = async mapView => {
    this.mapView = mapView
    this._addMap()
    this.onMapLoad?.('map')
  }

  _onLoad = async () => {
    // if (Platform.OS === 'ios') {
    //   SARMap.setMeasureMode('arCollect')
    // }else{
    SARMap.showMeasureView(false)
    SARMap.showTrackView(false)
    SARMap.showPointCloud(false)
    SARMap.showARLabel(this.props.showARLabel)
    // }
    this.initBaseMapPosistion(Dimensions.get('screen'))
    this.onMapLoad?.('ar')
    SARMap.setRTKAutoCalibration(this.props?.isRTKAutoCalibration || false)
  }

  onChange = event => {
    this.initBaseMapPosistion(event.screen)
  }

  initBaseMapPosistion = screenSize => {
    let width = scaleSize(250)
    let size = scaleSize(20)
    //android宽度固定，详见原生初始化
    if (Platform.OS === 'android') {
      width = Math.min(Math.min(screenSize.height, screenSize.width) * 0.4, 200)
      size = scaleSize(80)
    }
    SARNavigation.setNaviBaseMapPosition({
      x: screenSize.width - width / 2 - scaleSize(30),
      y: screen.getScreenSafeHeight() - width - size,
      width: width,
      autoAdapt: true,
    })
  }

  /**
   * 对象选中回调
   * @param {object} event
   * {
   *  layerInfo<object>: {
   *    name<string>,
   *    caption<string>,
   *    editable<boolean>
   *    visible<boolean>
   *    selectable<boolean>
   *    type<number>,
   *    path<string>,
   *  },
   *  id<number>,
   *  geometryType<number>,
   *  fieldInfo<array<object>, [{
   *    name<string>,
   *    value<any>,
   *    filedInfo<object>: {caption<string> ...}
   *  }]
   * }
   */
  geometrySelected = async event => {
    this.props.setSelection &&
      this.props.setSelection([
        {
          layerInfo: event.layerInfo,
          geometryType: event.geometryType,
          fieldInfo: event.fieldInfo,
          ids: [event.id],
        },
      ])
    const currentToolbarType = ToolbarModule.getData().type
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.geometrySelected
    ) {
      if (this.clickAble) {
        this.clickAble = false
        ToolbarModule.getData().actions.geometrySelected(event)
        setTimeout(() => {
          this.clickAble = true
        }, 1500)
      }
      return
    }
    switch (currentToolbarType) {
      default:
        // 除了编辑状态，其余点选对象所在图层全设置为选择状态
        if (event.layerInfo.editable) {
          SMap.setLayerEditable(event.layerInfo.path, false).then(() => {
            StyleUtils.setSelectionStyle(event.layerInfo.path)
          })
        } else {
          StyleUtils.setSelectionStyle(event.layerInfo.path)
        }
        break
    }
  }

  /**
   * 对象多选回调
   * @param {object} event
   * {
   *  geometries<array<object>>: [{
   *    ids<array<number>>: [1,2],
   *    geometryType<number>,
   *    layerInfo<object>, {
   *      name<string>,
   *      caption<string>,
   *      editable<boolean>
   *      visible<boolean>
   *      selectable<boolean>
   *      type<number>,
   *      path<string>,
   *    }
   *  }]
   * }
   */
  geometryMultiSelected = event => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.geometryMultiSelected
    ) {
      ToolbarModule.getData().actions.geometryMultiSelected(event)
      return
    }
    const data = []
    for (let i = 0; i < event.geometries.length; i++) {
      if (event.geometries[i].layerInfo.editable) {
        SMap.setLayerEditable(event.geometries[i].layerInfo.path, false)
      }
      StyleUtils.setSelectionStyle(event.geometries[i].layerInfo.path)
      data.push({
        layerInfo: event.geometries[i].layerInfo,
        ids: event.geometries[i].ids,
      })
    }
    this.props.setSelection && this.props.setSelection(data)

    const currentToolbarType = ToolbarModule.getData().type
    switch (currentToolbarType) {
      case ConstToolType.SM_MAP_TOOL_SELECT_BY_RECTANGLE:
        SMap.setAction(Action.PAN)
        break
    }
  }

  /** 触摸事件监听 **/
  _addGeometrySelectedListener = async () => {
    await SMap.setGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  /** 移除触摸事件监听 */
  _removeGeometrySelectedListener = async () => {
    await SMap.setGeometrySelectedListener(null)
  }

  /** 移除导航相关监听（楼层控件） */
  _removeNavigationListeners = async () => {
    const listeners = []
    if (this.TrafficView && this.TrafficView.listener) {
      listeners.push(this.TrafficView.listener)
    }
    if (this.FloorListView && this.FloorListView.listener) {
      listeners.push(this.FloorListView.listener)
    }
    await SMap.setFloorHiddenListener(null)
  }

  /** 地图保存 */
  saveMap = async () => {
    try {
      // if(global.Type === ChunkType.MAP_AR){
      //   await this.props.closeARMap()
      //   await this.props.setCurrentARLayer()
      // }
      let mapName = ''
      if (this.props.map.currentMap.name) {
        // 获取当前打开的地图xml的名称
        mapName = this.props.map.currentMap.name
        mapName =
          mapName.substr(0, mapName.lastIndexOf('.')) ||
          this.props.map.currentMap.name
      } else {
        const mapInfo = await SMap.getMapInfo()
        if (mapInfo && mapInfo.name) {
          // 获取MapControl中的地图名称
          mapName = mapInfo.name
        } else if (this.props.layers.length > 0) {
          // 获取数据源名称作为地图名称
          mapName = this.props.collection.datasourceName
        }
      }
      const addition = {}
      if (this.props.map.currentMap.Template) {
        addition.Template = this.props.map.currentMap.Template
      }

      this.setLoading(true, getLanguage(this.props.language).Prompt.SAVING)
      // 导出(保存)工作空间中地图到模块
      const result = await this.props.saveMap({ mapTitle: mapName, nModule: '', addition })
      if (result || result === '') {
        this.setLoading(false)
        Toast.show(
          result
            ? getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
            : getLanguage(this.props.language).Prompt.SAVE_FAILED,
        )
        if (global.Type === ChunkType.MAP_NAVIGATION) {
          //这里先处理下异常 add xiezhy
          try {
            await SNavigation.stopGuide()
            await SIndoorNavigation.stopGuide()
            await SNavigation.clearPath()
            await SIndoorNavigation.clearPath()
            await SMap.clearTrackingLayer()
            await SMap.removeCallout('startPoint')
            await SMap.removeCallout('endPoint')
          } catch (e) {
            this.setLoading(false)
          }
        }
        return true
      } else {
        this.setLoading(false)
        // this.setSaveMapViewLoading(false)
        return false
      }
    } catch (e) {
      this.setLoading(false)
      return false
    }
  }

  /** 关闭地图，并返回首页 **/
  closeMapHandler = async baskFrom => {
    try {
      this.setLoading(true, getLanguage(this.props.language).Prompt.CLOSING)
      await this.closeMap()
      if (global.Type === ChunkType.MAP_AR) {
        await this.props.closeARMap()
        await this.props.setCurrentARLayer()
      }
      if (
        this.isARModule()
      ) {
        if (Platform.OS === 'android') {
          await SARMap.showMeasureView(false)
          await SARMap.showTrackView(false)
          await SARMap.showPointCloud(false)
        }
        // this.props.showAR(false)
      }
      if (global.Type === ChunkType.MAP_PLOTTING) {
        const params = ToolbarModule.getParams()
        const libIds = params.template.plotLibIds
        await SPlot.removePlotSymbolLibraryArr(libIds)
      }
      LayerUtils.setMapLayerAttribute(undefined, undefined, true)
      this.setLoading(false)
      NavigationService.goBack(baskFrom)

      this.closeSample()
    } catch (e) {
      this.setLoading(false)
    }
  }

  closeMap = async () => {
    try {
      await this._removeGeometrySelectedListener()
      await this.props.setCurrentAttribute({})
      // this.setState({ showScaleView: false })
      //此处置空unmount内的判断会失效 zhangxt
      // global.Type = null
      global.clearMapData()

      // 移除协作时，个人/新操作的callout
      await SMap.removeUserCallout()
      await SMap.clearUserTrack()

      if (global.coworkMode) {
        CoworkInfo.setId('') // 退出任务清空任务ID
        global.coworkMode = false
        global.getFriend().setCurMod(undefined)
        // NavigationService.goBack('CoworkTabs')
      }
      await this.props.closeMap()
    } catch (e) {
      //
    }
  }

  // 删除图层中指定对象
  removeObject = () => {
    (async function () {
      try {
        if (!this.props.selection || !this.props.selection.length === 0) return

        let result = true
        //使用for循环等待，在forEach里await没有用
        for (const item of this.props.selection) {
          if (item.ids.length > 0) {
            if (global.coworkMode && item.ids.length > 0) {
              const currentTaskInfo = this.props.coworkInfo?.[this.props.user.currentUser.userName]?.[this.props.currentTask.groupID]?.[this.props.currentTask.id]
              const isRealTime = currentTaskInfo?.isRealTime === undefined ? false : currentTaskInfo.isRealTime

              const layerType = LayerUtils.getLayerType(item.layerInfo)
              isRealTime && layerType !== 'TAGGINGLAYER' && global.getFriend().onGeometryDelete(item.layerInfo, item.fieldInfo, item.ids[0], item.geometryType)
            }
            result =
              result &&
              (await SCollector.removeByIds(item.ids, item.layerInfo.path))
            result = result && (await SMediaCollector.removeByIds(item.ids, item.layerInfo.name))
            if (result && global.coworkMode) {
              // 在线协作-成功删除数据,修改图层状态
              await SMap._setLayerModified(this.props.currentLayer.path, true)
            }
            // 若果删除的是旅行轨迹的多媒体对象,则更新旅行轨迹
            if (await SMediaCollector.isTourLayer(item.layerInfo.name)) {
              result = await SMediaCollector.updateTour(item.layerInfo.name)
            }
          }
        }

        if (result) {
          Toast.show(getLanguage(this.props.language).Prompt.DELETED_SUCCESS)
          this.props.setSelection && this.props.setSelection()
          SMap.setAction(Action.SELECT)
          const preType = ToolbarModule.getParams().type
          let type
          if (preType.indexOf('SM_MAP_MARKS_') > -1) {
            type = ConstToolType.SM_MAP_MARKS_TAGGING_SELECT
          } else if (preType.indexOf('MAP_TOPO_') > -1) {
            type = ConstToolType.SM_MAP_TOPO_EDIT
          } else {
            type = ConstToolType.SM_MAP_EDIT
          }
          // 删除对象后，编辑设为为选择状态
          this.toolBox.setVisible(true, type, {
            isFullScreen: false,
            height: 0,
          })
        } else {
          Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
        }
        global.removeObjectDialog &&
          global.removeObjectDialog.setDialogVisible(false)
      } catch (e) {
        Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
      }
    }.bind(this)())
  }

  /** 处理android系统返回键 */
  backHandler = () => {
    return BackHandlerUtil.backHandler(this.props.nav, this.props.backActions)
  }

  /**
   * 返回事件
   * @param {*} params {baskFrom?: string // 从该页面返回}
   */
  back = async params => {
    try {
      if (!this.state.mapLoaded) return
      // 最顶层的语音搜索，最先处理
      if (Audio.isShow()) {
        Audio.hideAudio()
        return
      }

      // 位置校准展示时,禁止Android物理返回
      if (Platform.OS === 'android' && this.props.showDatumPoint) {
        return false
      }

      // AR测图-测量/测图界面返回
      if (global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton) {
        this.ARMappingHeaderBack()
        return
      }

      // 优先处理其他界面跳转到MapView传来的返回事件
      if (this.backAction && typeof this.backAction === 'function') {
        this.backAction({
          showFullMap: this.showFullMap,
        })
        this.backAction = null
        this.mapController && this.mapController.reset()
        return
      }

      // Android物理返回事件
      if (Platform.OS === 'android') {
        // Toolbar显示时，返回事件Toolbar的close
        if (this.toolBox && this.toolBox.isShow) {
          //在此处理 toolbar 显示时的返回事件
          // this.toolBox.buttonView.close()
          return true
        }

        //处理导航时返回键
        if (global.NAVIGATIONSTARTHEAD?.state.show) {
          global.NAVIGATIONSTARTHEAD?.close()
          return true
        }

        //处理导航中返回键
        if (this.isGuiding) {
          return true
        }

        // 删除对象Dialog显示时，返回事件关闭Dialog
        if (
          global.removeObjectDialog &&
          global.removeObjectDialog.getState().visible
        ) {
          global.removeObjectDialog.setDialogVisible(false)
          return true
        }
      }

      // 若服务正在更新,则无法关闭地图
      if (
        global.coworkMode && this.props.currentTask?.groupID &&
        this.props.currentTaskServices?.[this.props.user.currentUser.userName]?.[this.props.currentTask?.groupID]?.[this.props.currentTask?.id]?.length > 0
      ) {
        const currentServices = this.props.currentTaskServices[this.props.user.currentUser.userName][this.props.currentTask.groupID][this.props.currentTask.id]
        let serviceDone = true
        for (const services of currentServices) {
          if (services.status !== 'done') {
            serviceDone = false
            break
          }
        }
        if (!serviceDone) {
          Toast.show(getLanguage(this.props.language).Cowork.CLOSE_MAP_BEFORE_UPDATE_SERVICE)
          return true
        }
      }

      const result = await SMap.isModified() // 是否保存普通地图
      const needSaveARMap = global.Type === ChunkType.MAP_AR && this.props.armap.currentMap?.mapName // 是否保存AR地图
      if ((result || needSaveARMap) && !this.isExample) {
        this.setSaveViewVisible(true, null, async () => {
          if(Platform.OS === 'ios'){
            SARMap.setARTouch(true)
          }
          this.props.showAR(false)
          await this.props.setCurrentAttribute({})
          // this.setState({ showScaleView: false })
          await this._removeGeometrySelectedListener()
          if (global.Type === ChunkType.MAP_NAVIGATION) {
            await this._removeNavigationListeners()
          }
          await this.closeMapHandler(params?.baskFrom)
        })
      } else {
        try {
          this.props.showAR(false)
          this.setLoading(true, getLanguage(this.props.language).Prompt.CLOSING)
          if (global.Type === ChunkType.MAP_NAVIGATION) {
            await this._removeNavigationListeners()
            await SNavigation.clearPath()
            await SIndoorNavigation.clearPath()
            await SMap.clearTrackingLayer()
            await SMap.removeCallout('startPoint')
            await SMap.removeCallout('endPoint')
            await SNavigation.stopGuide()
            await SIndoorNavigation.stopGuide()
          }
          await this.closeMapHandler(params?.baskFrom)
        } catch (e) {
          this.setLoading(false)
        }
      }
      return true
    } catch (e) {
      return true
    }
  }

  /** 设置Container的loading */
  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  /** 加载地图，mapview加载完成后调用 */
  _addMap = () => {
    (async function () {
      try {
        let mapInfo // 判断是否打开了地图，若打开了地图，加载完成后先保存在MapControl中
        if (this.wsData) {
          if (this.wsData instanceof Array) {
            for (let i = 0; i < this.wsData.length; i++) {
              const item = this.wsData[i]
              if (item === null) continue
              if (item.type === 'Workspace') {
                await this._openWorkspace(
                  this.wsData[i],
                  this.wsData[i].layerIndex,
                )
              } else if (item.type === 'Datasource') {
                await this._openDatasource(
                  this.wsData[i],
                  this.wsData[i].layerIndex,
                  false,
                )
              } else if (item.type === 'Map') {
                mapInfo = await this._openMap(this.wsData[i])
              }
              // else if (item.type === 'LastMap') {
              //   // 打开最近地图
              //   // this.toolBox && this.toolBox.changeMap(this.wsData.DSParams)
              //   await this._openLatestMap(this.wsData[i].DSParams)
              // }
            }
          } else {
            if (this.wsData.type === 'Workspace') {
              await this._openWorkspace(this.wsData, this.wsData.layerIndex)
            } else if (this.wsData.type === 'Datasource') {
              await this._openDatasource(this.wsData, this.wsData.layerIndex)
            } else if (this.wsData.type === 'Map') {
              mapInfo = await this._openMap(this.wsData)
            }
            // else if (this.wsData.type === 'LastMap') {
            //   // 打开最近地图
            //   // this.toolBox && this.toolBox.changeMap(this.wsData.DSParams)
            //   await this._openLatestMap(this.wsData.DSParams)
            // }
          }
        } else {
          // 若无参数，打开默认工作空间。分析模块使用
          const homePath = await FileTools.appendingHomeDirectory()
          let userPath = ConstPath.CustomerPath
          if (
            this.props.user.currentUser &&
            this.props.user.currentUser.userName
          ) {
            userPath =
              ConstPath.UserPath + this.props.user.currentUser.userName + '/'
          }
          const wsPath =
            homePath +
            userPath +
            ConstPath.RelativeFilePath.Workspace[
              global.language === 'CN' ? 'CN' : 'EN'
            ]
          await this._openWorkspace({
            DSParams: { server: wsPath },
          })
        }
        //没有打开地图，默认加载以“DefaultMapLib"为名的符号库
        if (!mapInfo) {
          const userPath = `${ConstPath.UserPath +
            (this.props.user.currentUser.userName || 'Customer')}/`
          const fillLibPath = await FileTools.appendingHomeDirectory(
            `${userPath +
            ConstPath.RelativeFilePath.DefaultWorkspaceDir}Workspace.bru`,
          )
          const lineLibPath = await FileTools.appendingHomeDirectory(
            `${userPath +
            ConstPath.RelativeFilePath.DefaultWorkspaceDir}Workspace.lsl`,
          )
          const markerLibPath = await FileTools.appendingHomeDirectory(
            `${userPath +
            ConstPath.RelativeFilePath.DefaultWorkspaceDir}Workspace.sym`,
          )
          await SData.importSymbolLibrary('DefaultMapLib', fillLibPath) // 导入面符号库
          await SData.importSymbolLibrary('DefaultMapLib', lineLibPath) // 导入线符号库
          await SData.importSymbolLibrary('DefaultMapLib', markerLibPath) // 导入点符号库
        }
        if (global.Type === ChunkType.MAP_PLOTTING) {
          this.setLoading(
            true,
            //ConstInfo.TEMPLATE_READING
            getLanguage(this.props.language).Prompt.READING_TEMPLATE,
          )
          const plotIconPath = await FileTools.appendingHomeDirectory(
            ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativePath.Plotting +
            'PlotLibData',
          )
          await this.props.getSymbolPlots({
            path: plotIconPath,
            isFirst: true,
          })
        }

        // global.Type === ChunkType.MAP_COLLECTION && this.initCollectorDatasource()

        this._addGeometrySelectedListener()

        setGestureDetectorListener({
          getNavigationDatas: this.getNavigationDatas,
          ...this.props,
        })
        global.TouchType = TouchType.NORMAL

        await SMap.setMapControlStyle({
          nodeColor: { r: 57, g: 153, b: 255, a: 1 },
          nodeSize: 1,
          strokeColor: { r: 57, g: 153, b: 255, a: 1 },
          strokeWidth: 1,
        })
        // await SMap._setLabelColor()
        // 示例地图不加载标注图层
        if (!this.isExample && !global.coworkMode) {
          await SMap._openTaggingDataset(this.props.user.currentUser.userName)
          let hasDefaultTagging = false
          const datasets = await SData.getDatasetsByDatasource({alias:"Label_"+this.props.user.currentUser.userName+"#"})
          datasets.forEach(item => {
            if (item.datasetName.indexOf("Default_Tagging_"+this.props.user.currentUser.userName) != -1) {
              hasDefaultTagging = true
            }
          })
          if (!hasDefaultTagging) {
            await SMap._newTaggingDataset(
              `Default_Tagging_${this.props.user.currentUser.userName}`,
              this.props.user.currentUser.userName,
            )
          }

          const datasourceName = "Label_"+this.props.user.currentUser.userName+"#"
          const layersInfo = await SMap.getLayersInfo(DatasetType.CAD)
          let layer
          for(let i=0;i<layersInfo.length;i++){
            const layerInfo = layersInfo[i]
            if(layerInfo?.caption&&layerInfo.caption.indexOf(datasourceName)!=-1){
              layer = layerInfo
              break
            }
          }
          // let layer = await SMap.getCurrentTaggingLayer(
          //   this.props.user.currentUser.userName,
          // )
          if (layer) {
            layer.isEdit = await SMap.setLayerEditable(layer.name, true)
            layer.isVisible = await SMap.setLayerVisible(layer.name, true)
            this.props.setCurrentLayer(layer)

            if (mapInfo) await SMap.saveMap('')
            // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
            const dataList = await SMap._getTaggingLayers(
              this.props.user.currentUser.userName,
            )
            dataList.forEach(item => {
              if (item.isVisible) {
                SMediaCollector.showMedia(item.name, false)
              }
            })
          }
        }

        // 在线协作-若整个地图数据已发布服务-则初始化数据源-数据集为服务数据
        const service = this.props.route?.params?.service
        if (global.coworkMode && this.props.route?.params?.service && global.Type !== ChunkType.MAP_PLOTTING) {
          await this.props.clearCoworkService({groupId: this.props.currentTask.groupID, taskId: this.props.currentTask.id})
          await SCoordinationUtils.initMapDataWithService(service.address)
          await ServiceAction.downloadService(service.address, this.NewMessageIcon)
        }

        // 标注图层等其他图层添加完后再获取图层列表
        this.props.getLayers(
          { type: -1, currentLayerIndex: 0 },
          async layers => {
            if (!this.wsData) return
            layers.map(layer => {
              if (layer.isVisible) {
                const dsDescription = LayerUtils.getDatasetDescriptionByLayer(layer)
                // const layerDescription = JSON.parse(layer.description)
                dsDescription?.isShowMedia && SMediaCollector.showMedia(layer.name, false)
              }
            })
            // 若数据源已经打开，图层未加载，则去默认加载一个图层
            if (layers.length === 0) {
              let result = false
              if (this.wsData instanceof Array) {
                for (let i = 0; i < this.wsData.length; i++) {
                  const item = this.wsData[i]
                  if (item === null) continue
                  if (item.type === 'Datasource') {
                    result = await SMap.addLayer({datasource: item.DSParams.alias, dataset: 0})
                  }
                }
              } else if (this.wsData.type === 'Datasource') {
                result = await SMap.addLayer({datasource: this.wsData.DSParams.alias, dataset: 0})
              }
              result && this.props.getLayers()
            }
            if (layers.length === 0 && this.wsData.DSParams) {
              SMap.addLayer({datasource: this.wsData.DSParams.alias, dataset: 0}).then(result => {
                result && this.props.getLayers()
              })
            }
          },
        )

        
        this.showMarker &&
          SMap.showMarker(
            this.showMarker.longitude,
            this.showMarker.latitude,
            global.markerTag,
          )

        SMap.setIsMagnifierEnabled(true)
        if (global.Type === ChunkType.MAP_NAVIGATION) {
          this.props.setMapNavigation({ isShow: false, name: '' })
          SIndoorNavigation.getCurrentFloorID().then(currentFloorID => {
            this.changeFloorID(currentFloorID)
          })
          global.STARTNAME = getLanguage(
            global.language,
          ).Map_Main_Menu.SELECT_START_POINT
          global.ENDNAME = getLanguage(
            global.language,
          ).Map_Main_Menu.SELECT_DESTINATION
        }


        //切换地图完成后重置导航选择的数据
        this.selectedData = {
          selectedDatasources: [], //选中的数据源
          selectedDatasets: [], //选中的数据集
          currentDatasource: [], //当前使用的数据源
          currentDataset: {}, //当前使用的数据集
        }

        //防止退出时没有清空
        await SMap.removeUserCallout()
        await SMap.clearUserTrack()
        // 开始协作
        await this.startCowork()

        if (this.props.isAR) {
          await SARMap.resetARMapWorkspace()
        }

        global.legend && global.legend.getLegendData()

        //地图打开后显示比例尺，获取图例数据
        this.setState({ showScaleView: true, mapLoaded: true }, async () => {
          await this.setLoading(false)

          // 当加载状态为不加载，是否显示选点的提示标识为true，且当前模块儿为导航采集时，就给一个“长按选点”的提示
          if (global.Type === ChunkType.MAP_NAVIGATION) {
            // 导航采集选点提示
            Toast.show(getLanguage(this.props.language).Prompt.LONG_PRESS_SELECT_POINT, { duration: 2500 })
          }
          // 在这儿让定位面板显示出来
          this.props.setDatumPoint(global.Type === ChunkType.MAP_AR ? true : false)
        })
      } catch (e) {
        this.setLoading(false)
        this.setState({ mapLoaded: true })
      }

      if (this.viewEntire) {
        SMap.viewEntire()
      }else{
        SMap.moveToCurrent()
      }
    }.bind(this)())
  }

  /** 开始在线协作 */
  startCowork = async () => {
    if (global.coworkMode && CoworkInfo.coworkId === '') {
      // //创建
      // if (CoworkInfo.talkId !== '') {
      //   //从发现创建
      //   try {
      //     let friend = global.getFriend()
      //     let talkId = CoworkInfo.talkId
      //     let mapName = this.props.map.currentMap.name
      //     friend.sendCoworkInvitation(talkId, global.Type, mapName)
      //     this.setState({ onlineCowork: true })
      //   } catch (error) {
      //     Toast.show(getLanguage(global.language).Friends.SEND_FAIL)
      //   }
      // } else if (this.props.map.currentMap.name) {
      //   //从好友创建
      //   global.SimpleDialog.set({
      //     text: getLanguage(global.language).Friends.SEND_COWORK_INVITE,
      //     confirmAction: () => {
      //       try {
      //         let friend = global.getFriend()
      //         let talkId = friend.curChat.targetId
      //         let mapName = this.props.map.currentMap.name
      //         friend.sendCoworkInvitation(talkId, global.Type, mapName)
      //         this.setState({ onlineCowork: true })
      //       } catch (error) {
      //         Toast.show(getLanguage(global.language).Friends.SEND_FAIL)
      //       }
      //     },
      //   })
      //   global.SimpleDialog.setVisible(true)
      // }
    } else if (global.coworkMode && CoworkInfo.coworkId !== '') {
      //加入
      try {
        const friend = global.getFriend()
        friend.startSendLocation(true)

        const messages = this.props.coworkInfo?.[this.props.user.currentUser.userName]?.
          [this.props.currentTask.groupID]?.[this.props.currentTask.id]?.messages || []

        // 把没有更新/追加/忽略的操作的标志添加到地图上
        for (let i = 0; i < messages.length; i++) {
          const _message = messages[i]
          if (_message.status) continue
          let result = false
          if (messages[i].message.geoUserID !== undefined) {
            result = await SMap.isUserGeometryExist(
              messages[i].message.layerPath,
              messages[i].message.id,
              messages[i].message.geoUserID,
            )
          }
          if (result) {
            await SMap.addMessageCallout(
              messages[i].message.layerPath,
              messages[i].message.id,
              messages[i].message.geoUserID,
              messages[i].user.name,
              messages[i].messageID,
            )
          }
        }
      } catch (error) {
        //
      }
    }
  }

  /**
   * 打开工作空间
   * @param {object} wsData 见this.wsData工作空间部分
   * @param {*} index deprecated
   */
  _openWorkspace = async (wsData, index = -1) => {
    if (!wsData.DSParams || !wsData.DSParams.server) {
      this.setLoading(false)
      Toast.show('没有找到地图')
      return
    }
    try {
      const result = await this.props.openWorkspace(wsData.DSParams)
      result && this.props.openMap(index)
    } catch (e) {
      this.setLoading(false)
    }
  }

  /**
   * 打开数据源
   * @param {object} wsData 见this.wsData数据源部分
   * @param {number} index 添加到地图的数据集序号
   * @param {boolean} toHead 是否添加到图层顶部
   */
  _openDatasource = async (wsData, index = -1, toHead = true) => {
    if (!wsData.DSParams || !wsData.DSParams.server) {
      this.setLoading(false)
      Toast.show('没有找到地图')
      return
    }
    try {
      await SMap.openMapWithDatasource(wsData.DSParams, index)
    } catch (e) {
      this.setLoading(false)
    }
  }

  /**
   * 打开地图
   * @param {object} data  见this.wsData地图部分
   */
  _openMap = async data => {
    try {
      const mapInfo = await this.props.openMap({
        path: data.path,
        name: data.name,
      })
      if (mapInfo) {
        // 如果是模板地图，则加载模板
        if (mapInfo.Template && global.Type === ChunkType.MAP_COLLECTION) {
          this.setLoading(
            true,
            //ConstInfo.TEMPLATE_READING
            getLanguage(this.props.language).Prompt.READING_TEMPLATE,
          )
          const templatePath = await FileTools.appendingHomeDirectory(
            ConstPath.UserPath + mapInfo.Template,
          )
          await this.props.getSymbolTemplates({
            path: templatePath,
            name: data.name,
          })
        } else {
          await this.props.setTemplate()
        }
      }
      return mapInfo
    } catch (e) {
      this.setLoading(false)
      return null
    }
  }

  /**
   * 初始化采集数据集
   * @returns {Promise.<void>}
   */
  initCollectorDatasource = async () => {
    let collectorDSPath = ''
    let collectorDSName = 'Collection-' + new Date().getTime()
    let initResult = false
    if (this.props.user.currentUser.userName) {
      collectorDSPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/' +
        ConstPath.RelativePath.Datasource,
      )
    } else {
      collectorDSPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      )
    }
    while (!initResult) {
      initResult = await SData.createDatasource({
        alias: collectorDSName,
        engineType: EngineType.UDB,
        server: collectorDSPath + collectorDSName + '.udb',
      })
      if (!initResult) collectorDSName = 'Collection-' + new Date().getTime()
    }
    this.props.setCollectionInfo({
      datasourceName: collectorDSName,
      datasourceParentPath: collectorDSPath,
      datasourceServer: collectorDSPath + collectorDSName + '.udb',
      datasourceType: EngineType.UDB,
    })
  }

  /**
   * 下方的保存地图提示组建
   * @param visible
   */
  setSaveViewVisible = (visible, setLoading, cb = () => { }) => {
    // this.SaveMapView && this.SaveMapView.setVisible(visible)
    let loadingAction = this.setLoading
    if (setLoading && typeof setLoading === 'function') {
      loadingAction = setLoading
    }
    if(visible){
      if(Platform.OS === 'ios'){
        SARMap.setARTouch(false)
      }
    }
    global.SaveMapView &&
      global.SaveMapView.setVisible(
        visible,
        {
          setLoading: loadingAction,
          cb,
        }
        // this.backPositon,
      )
  }

  /**
   * 中间弹出的保存地图组建
   * @param visible
   */
  // setSaveMapDialogVisible = visible => {
  //   this.SaveDialog && this.SaveDialog.setDialogVisible(visible)
  // }

  /**
   * 中间弹出的命名框
   * @param visible
   */
  // setInputDialogVisible = (visible, params = {}) => {
  //   this.InputDialog && this.InputDialog.setDialogVisible(visible, params)
  // }

  /**
   * 在线协作消息callout点击回调
   * @param {object} info {
   *  messageID<number>, callout对应的消息ID
   *  x<number>, 点击位置的屏幕x坐标
   *  y<number>, 点击位置的屏幕y坐标
   * }
   */
  onMessageCalloutTap = info => {
    try {
      this.coworkMessageID = info.messageID
      this.messageMenu.setVisible(true, {
        x: info.x,
        y: info.y,
      })
    } catch (error) {
      //
    }
  }

  /**
   * 点击协作消息callout出现的菜单
   */
  renderMessageMenu = () => {
    const data = [
      {
        title: getLanguage(global.language).Friends.COWORK_UPDATE,
        action: () => {
          CoworkInfo.update(this.coworkMessageID, true)
        },
      },
      {
        title: getLanguage(global.language).Friends.COWORK_ADD,
        action: () => {
          CoworkInfo.add(this.coworkMessageID, true)
        },
      },
      {
        title: getLanguage(global.language).Friends.COWORK_IGNORE,
        action: () => {
          CoworkInfo.ignore(this.coworkMessageID)
        },
      },
    ]
    return (
      <PopMenu
        ref={ref => (this.messageMenu = ref)}
        fixOnPhone={false}
        getData={() => data}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  /**
   * 底部工具栏
   * @returns {XML}
   */
  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        initIndex={0}
        type={this.type}
        ARView={global.Type === ChunkType.MAP_AR_MAPPING || global.Type === ChunkType.MAP_AR ? this.props.isAR : this.state.showAIDetect}
      />
    )
  }

  renderMapNavIcon = () => {
    return (
      <MapNavIcon
        ref={ref => (this.NavIcon = ref)}
        getNavMenuRef={() => this.NavMenu}
        device={this.props.device}
        mapColumnNavBar={this.props.mapColumnNavBar}
        navBarDisplay={this.props.navBarDisplay}
        setNavBarDisplay={this.props.setNavBarDisplay}
      />
    )
  }

  /**
   * 横屏时的导航栏
   */
  renderMapNavMenu = () => {
    return (
      <MapNavMenu
        ref={ref => (this.NavMenu = ref)}
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        user={this.props.user}
        initIndex={0}
        type={this.type}
        device={this.props.device}
        mapColumnNavBar={this.props.mapColumnNavBar}
        navBarDisplay={this.props.navBarDisplay}
      />
    )
  }

  /** 地图分析模式左侧按钮 **/
  renderAnalystMapButtons = () => {
    if (
      this.props.analyst.params.type !==
      ConstToolType.SM_MAP_ANALYSIS_OPTIMAL_PATH &&
      this.props.analyst.params.type !==
      ConstToolType.SM_MAP_ANALYSIS_CONNECTIVITY_ANALYSIS &&
      this.props.analyst.params.type !==
      ConstToolType.SM_MAP_ANALYSIS_FIND_TSP_PATH
    )
      return null
    return (
      <AnalystMapButtons
        language={this.props.language}
        type={this.props.analyst.params.type}
      />
    )
  }

  /** 地图分析模式底部推荐地点滑动列表 **/
  // renderAnalystMapRecommend = () => {
  //   return (
  //     <AnalystMapRecommend
  //       ref={ref => this.analystRecommend = ref}
  //       orientation={this.props.device.orientation}
  //       data={[
  //         {
  //           title: '1111',
  //           subTitle: '11111111',
  //         },
  //         {
  //           title: '2222',
  //           subTitle: '2222222',
  //         },
  //         {
  //           title: '3333',
  //           subTitle: '33333333',
  //         },
  //       ]}
  //       language={this.props.language}
  //     />
  //   )
  // }

  /** 地图分析模式底部工具栏 **/
  renderAnalystMapToolbar = () => {
    return (
      <AnalystMapToolbar
        type={this.props.analyst.params.type}
        actionType={this.props.analyst.params.actionType}
        back={() => {
          const action =
            (this.props.analyst.params &&
              this.props.analyst.params.backAction) ||
            null
          action && action()
          if (this.state.mapTitle !== this.mapTitle) {
            this.setState({ mapTitle: this.mapTitle })
          }
          // TODO 不同类型高度修改
          this.toolBox.setVisible(true, ConstToolType.SM_MAP_ANALYSIS, {
            isFullScreen: true,
            // height:
            //   this.props.device.orientation.indexOf('LANDSCAPE') === 0
            //     ? ConstToolType.TOOLBAR_HEIGHT[2]
            //     : ConstToolType.TOOLBAR_HEIGHT[3],
            // column: this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 5 : 4,
          })
        }}
        setAnalystParams={this.props.setAnalystParams}
        language={this.props.language}
      />
    )
  }

  /** 地图功能工具栏（右侧） **/
  renderFunctionToolbar = () => {
    return (
      <FunctionToolbar
        language={this.props.language}
        ref={ref => (this.functionToolbar = ref)}
        type={this.type}
        getToolRef={() => this.toolBox}
        showFullMap={this.showFullMap}
        user={this.props.user}
        map={this.props.map}
        symbol={this.props.symbol}
        getLayers={this.props.getLayers}
        currentLayer={this.props.currentLayer}
        currentTask={this.props.currentTask}
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        device={this.props.device}
        online={this.props.online}
        openOnlineMap={this.props.openOnlineMap}
        mapModules={this.props.mapModules}
        currentTaskServices={this.props.currentTaskServices}
        ARView={this.isARModule() ? this.props.isAR : this.state.showAIDetect}
      />
    )
  }

  // TODO 是否移除待定
  /** 专题图预览时的header */
  renderPreviewHeader = () => {
    return (
      <PreviewHeader
        ref={ref => (global.PreviewHeader = ref)}
        navigation={this.props.navigation}
        language={this.props.language}
        currentLayer={this.props.currentLayer}
      />
    )
  }
  //遮盖层
  renderOverLayer = () => {
    return (
      <OverlayView
        ref={ref => (global.OverlayView = ref)}
        onPress={() => {
          this.toolBox && this.toolBox.overlayOnPress()
        }}
      />
    )
  }

  /** 页面进入后台时的遮盖层 */
  renderBackgroundOverlay = () => {
    return (
      <BackgroundOverlay
        ref={ref => (this.backgroundOverlay = ref)}
        device={this.props.device}
      />
    )
  }

  /**
   * 用户自定义输入弹窗
   * @returns {*}
   */
  renderCustomInputDialog = () => {
    return <CustomInputDialog ref={ref => (global.InputDialog = ref)} />
  }
  /**
   * 用户自定义信息弹窗
   * @returns {*}
   */
  renderCustomAlertDialog = () => {
    return <CustomAlertDialog ref={ref => (global.AlertDialog = ref)} />
  }
  /** 地图控制器，放大缩小等功能 **/
  renderMapController = () => {
    return (
      <MapController
        ref={ref => (global.mapController = this.mapController = ref)}
        type={global.Type}
        device={this.props.device}
        currentFloorID={this.state.currentFloorID}
      />
    )
  }

  /**
   * 显示全屏
   * @param {boolean} isFull
   */
  showFullMap = isFull => {
    this.showFullonBlur = !isFull
    if (isFull === this.fullMap) return
    const full = isFull === undefined ? !this.fullMap : !isFull
    this.container && this.container.setHeaderVisible(full)
    this.container && this.container.setBottomVisible(full)
    this.functionToolbar && this.functionToolbar.setVisible(full)
    this.mapController && this.mapController.setVisible(full)
    this.TrafficView && this.TrafficView.setVisible(full)
    this.NavIcon && this.NavIcon.setVisible(full)
    this.NewMessageIcon && this.NewMessageIcon.setVisible(full)
    if (
      !(
        !full &&
        global.Type === ChunkType.MAP_NAVIGATION &&
        this.FloorListView.state.currentFloorID
      )
    ) {
      global.scaleView && global.scaleView.showFullMap(full)
    }

    //只有AR模块走这段代码 add xiezhy
    if (
      this.isARModule()
    ) {
      this.setState({ showArModeIcon: full, isFull: full, })
    } else {
      this.setState({
        isFull: full,
      })
    }

    this.fullMap = !full
  }

  /**
   * 显示量算结果
   * @param {boolean} isShow 是否显示量算结果
   * @param {string|number} result 测量出来的距离 '100m'
   */
  showMeasureResult = (isShow, result = '') => {
    if (
      isShow !== this.state.measureShow ||
      isShow !== this.state.measureResult
    ) {
      this.setState({
        measureShow: isShow,
        measureResult: isShow ? result : '',
      })
    } else {
      this.setState({
        measureResult: '',
      })
    }
  }

  /** 展示撤销Modal **/
  showUndoView = () => {
    (async function () {
      this.popModal && this.popModal.setVisible(true)
      const historyCount = await SMap.getMapHistoryCount()
      const currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
      this.setState({
        canBeUndo: currentHistoryCount >= 0,
        canBeRedo: currentHistoryCount < historyCount - 1,
      })
    }.bind(this)())
  }

  /**
   * AR分类点击保存截图
   * @param {object} params {
   *  ID<number>, trackID
   *  mediaName<string>, 识别的名称
   *  Info<string>, 识别的信息
   * }
   */
  // captureImage = params => {
  //   //保存数据->跳转
  //   (async function () {
  //     let currentLayer = this.props.currentLayer
  //     // let reg = /^Label_(.*)#$/
  //     let isTaggingLayer = false
  //     if (currentLayer) {
  //       let layerType = LayerUtils.getLayerType(currentLayer)
  //       isTaggingLayer = layerType === 'TAGGINGLAYER'
  //       // isTaggingLayer = currentLayer.type === DatasetType.CAD
  //       // && currentLayer.datasourceAlias.match(reg)
  //     }
  //     if (isTaggingLayer) {
  //       const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
  //       const datasetName = currentLayer.datasetName // 标注图层名称
  //       let targetPath = await FileTools.appendingHomeDirectory(
  //         ConstPath.UserPath +
  //         this.props.user.currentUser.userName +
  //         '/' +
  //         ConstPath.RelativeFilePath.Media,
  //       )
  //       SMediaCollector.initMediaCollector(targetPath)

  //       let result = await SMediaCollector.addArMedia({
  //         datasourceName: datasourceAlias,
  //         datasetName: datasetName,
  //         mediaName: params.mediaName,
  //       })
  //       if (result) {
  //         this.switchAr()
  //         Toast.show(
  //           params.mediaName +
  //           ':' +
  //           getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY,
  //         )
  //       }
  //     } else {
  //       Toast.show(
  //         getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
  //       )
  //       this.props.navigation.navigate('LayerManager')
  //       await SAIDetectView.clearClickAIRecognition()
  //     }
  //   }.bind(this)())
  // }

  /**
   * AR分类点击回调
   * @param {object} data {
   *  id<number>, trackID
   *  name<string>, 识别的名称
   *  info<string>, 识别的信息
   * }
   */
  _onArObjectClick = data => {
    if (global.Type === ChunkType.MAP_AR_ANALYSIS) {
      // let params = {
      //   ID: data.id,
      //   mediaName: data.name,
      //   Info: data.info,
      // }
      // Toast.show(data.name + ', ' + data.info + ', ' + data.id)
      // this.showFullMap(false)
      // global.toolBox.setVisible(false)
      // global.AIDETECTCHANGE.setVisible(false)
      // this.captureImage(params)
      ToolbarModule.getData()?.actions?.goToPreview?.()
    }
  }

  /** 顶部量算结果显示 **/
  renderMeasureLabel = () => {
    return (
      <View style={styles.measureResultContainer}>
        <View style={styles.measureResultView}>
          <Text style={styles.measureResultText}>
            {this.state.measureResult}
          </Text>
        </View>
      </View>
    )
  }

  /**
   * 设置已选中的和当前正在使用的导航数据
   * @param {object} params {
   *  selectedDatasets<array>, //当前选中数据集,详见NavigationDataChangePage
   *  selectedDatasources<array>, [] //当前选中数据源，详见NavigationDataChangePage
   *  currentDataset<object>, //当前使用中的数据集，selectedDatasets的元素
   *  currentDatasource<array>, //当前使用中的数据源，selectedDatasources中选中的元素的数组
   * }
   */
  setNavigationDatas = params => {
    this.selectedData = params
  }

  /**
   * 获取导航需要的数据
   * @returns {object} 详见setNavigationDatas
   */
  getNavigationDatas = () => {
    return this.selectedData
  }

  setMapTitle = title => {
    this.setState({
      mapTitle: title,
    })
  }

  //楼层控件
  _getFloorListView = () => {
    return this.FloorListView || null
  }

  renderTool = () => {
    return (
      <ToolBar
        ref={ref => (global.ToolBar = this.toolBox = ref)}
        getFloorListView={this._getFloorListView}
        language={this.props.language}
        changeNavPathInfo={this.changeNavPathInfo}
        changeFloorID={this.changeFloorID}
        setNavigationDatas={this.setNavigationDatas}
        getNavigationDatas={this.getNavigationDatas}
        existFullMap={() => this.showFullMap(false)}
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        showFullMap={this.showFullMap}
        setSaveViewVisible={this.setSaveViewVisible}
        setContainerLoading={this.setLoading}
        showMeasureResult={this.showMeasureResult}
        switchAr={this.switchAr}
        removeAIDetect={this.removeAIDetect}
        setMapTitle={this.setMapTitle}
        getOverlay={() => global.OverlayView}
        selectPointType={this.state.selectPointType}
        {...this.props}
        measure={params => { this.measure(params) }}
        showArNavi={show => { this.setState({ showPoiSearch: show }) }}
        showNavigation={show => { this.setState({ showNavigation: show }) }}
        baseMaps={this.props.baseMaps}
      />
    )
  }

  measure = params => {
    this.listeners = SARMap.addMeasureStatusListeners({
      infoListener: result => {
        if (result.none) {
          this.onshowLog(result)
        }
        if (this.props.showARSceneNotify) {
          this.onshowLog(result)
        }
      },
      addListener: async result => {
        if (result) {
          if (this.state.isfirst) {
            this.setState({ showADD: true, showADDPoint: true, is_showLog: true })
          } else {
            this.setState({ showADD: true })
          }
        } else {
          this.setState({ showADD: false, showADDPoint: false })
        }
      },
    })

    this.isMeasure = false
    this.isDrawing = false
    this.isCollect = false
    this.showSave = false
    this.isnew = true
    this.canContinuousDraw = false
    this.measureType = params.measureType
    if (this.measureType) {
      if (this.measureType === 'measureArea') {
        SARMap.setMeasureMode('MEASURE_AREA')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_POLYGON_TITLE
      } else if (this.measureType === 'measureLength') {
        SARMap.setMeasureMode('MEASURE_LINE')
        this.setState({
          showCurrentHeightView: true,
        })
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_LENGTH
      } else if (this.measureType === 'drawLine') {
        SARMap.setMeasureMode('DRAW_LINE')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE
        if (!global.haslocation) {
          this.props.setDatumPoint(true)
        }
      } else if (this.measureType === 'arDrawArea') {
        SARMap.setMeasureMode('DRAW_AREA')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA
        if (!global.haslocation) {
          this.props.setDatumPoint(true)
        }
      } else if (this.measureType === 'arDrawPoint') {
        SARMap.setMeasureMode('DRAW_POINT')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT
        if (!global.haslocation) {
          this.props.setDatumPoint(true)
        }
      } else if (this.measureType === 'arMeasureHeight') {
        SARMap.setMeasureMode('MEASURE_HEIGHT')
        this.setState({
          showCurrentHeightView: true,
        })
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT
      } else if (this.measureType === 'arMeasureCircle') {
        SARMap.setMeasureMode('MEASURE_AREA_CIRCLE')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_CIRCULAR_TITLE
      } else if (this.measureType === 'arMeasureRectangle') {
        SARMap.setMeasureMode('MEASURE_AREA_RECTANGLE')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_RECTANGLE_TITLE
      } else if (this.measureType === 'measureAngle') {
        SARMap.setMeasureMode('MEASURE_AREA_ANGLE')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_ANGLE
      } else if (this.measureType === 'arMeasureCuboid') {
        SARMap.setMeasureMode('MEASURE_VOLUME_CUBOID')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_CUBOID_TITLE
      } else if (this.measureType === 'arMeasureCylinder') {
        SARMap.setMeasureMode('MEASURE_VOLUME_CYLINDER')
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_CYLINDER_TITLE
      } else if (this.measureType === 'arCollect') {
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT
        if (!global.haslocation) {
          this.props.setDatumPoint(true)
        }
      } else if (this.measureType === 'arDrawRectangle') {
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA
      } else if (this.measureType === 'arDrawCircular') {
        this.title = getLanguage(
          global.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA
      }

      if (this.measureType === 'arMeasureHeight' ||
        this.measureType === 'measureLength' ||
        this.measureType === 'measureArea' ||
        this.measureType === 'measureAngle' ||
        this.measureType === 'arMeasureCuboid' ||
        this.measureType === 'arMeasureCylinder' ||
        this.measureType === 'arMeasureCircle' ||
        this.measureType === 'arMeasureRectangle') {
        this.isMeasure = true
      }

      if (
        this.measureType === 'drawLine' ||
        this.measureType === 'arDrawArea' ||
        this.measureType === 'arDrawPoint' ||
        this.measureType === 'arDrawRectangle' ||
        this.measureType === 'arDrawCircular'
      ) {
        this.isDrawing = true

        this.datasourceAlias = params.datasourceAlias || ''
        this.datasetName = params.datasetName || ''
        this.point = params.point
      }

      if (this.measureType === 'arCollect') {
        this.point = params.point
        this.isCollect = true
        this.isnew = false
        if (Platform.OS === 'android') {
          SARMap.setMeasureMode('NULL')
          SARMap.showMeasureView(true)
          SARMap.showTrackView(true)
        } else {
          SARMap.setMeasureMode('arCollect')
        }
      } else {
        if (Platform.OS === 'android') {
          SARMap.showTrackView(true)
          SARMap.showMeasureView(true)
        }
      }

      SARMap.showPointCloud(true)

      if (
        this.measureType === 'drawLine' ||
        this.measureType === 'arDrawArea' ||
        this.measureType === 'arDrawRectangle' ||
        this.measureType === 'arDrawCircular' ||
        this.measureType === 'arDrawPoint'
      ) {
        this.showSave = true
      }

      if (
        this.measureType === 'measureLength' ||
        this.measureType === 'measureArea' ||
        this.measureType === 'measureAngle'
      ) {
        this.canContinuousDraw = true
      }


      if (!this.props.currentLayer.datasourceAlias || !this.props.currentLayer.datasetName) return
      let datasourceAlias = this.props.currentLayer.datasourceAlias
      let datasetName = this.props.currentLayer.datasetName
      if (this.props.currentLayer.themeType !== 0 || (
        this.props.currentLayer.type !== DatasetType.CAD && (
          // 后面的判断应该是一个整体 不然永真 add zcj
          (this.measureType === 'drawLine' && this.props.currentLayer.type !== DatasetType.LINE) ||
          (this.measureType === 'arDrawArea' && this.props.currentLayer.type !== DatasetType.REGION) ||
          (this.measureType === 'arDrawPoint' && this.props.currentLayer.type !== DatasetType.POINT) ||
          (this.measureType === 'arDrawRectangle' && this.props.currentLayer.type !== DatasetType.REGION) ||
          (this.measureType === 'arDrawCircular' && this.props.currentLayer.type !== DatasetType.REGION)
        )
      )) {
        datasourceAlias = 'Label_' + this.props.user.currentUser.userName + '#'
        datasetName = 'Default_Tagging'
      }
      SARMap.setMeasurePath(datasourceAlias, datasetName)

      this.setState({ showArMappingButton: true, showSave: this.showSave, isfirst: true, showGenera: true, isDrawing: this.isDrawing, isCollect: this.isCollect, isnew: this.isnew, canContinuousDraw: this.canContinuousDraw, measureType: this.measureType, isMeasure: this.isMeasure })
    }
  }

  /**
   * 开启动态投影弹框的取消事件
   */
  cancel = () => {
    global.prjDialog.setDialogVisible(false)
  }

  /**
   * 开启动态投影弹框的确定事件
   */
  confirm = () => {
    (async function () {
      const result = await SMap.setDynamicProjection()
      if (result) {
        global.prjDialog.setDialogVisible(false)
      }
    }.bind(this)())
  }

  /**
   * 是否开启动态投影的弹框
   */
  renderPrjDialog = () => {
    return (
      <Dialog
        ref={ref => (global.prjDialog = ref)}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        //title={'提示'}
        style={styles.dialogStyle}
        opacityStyle={styles.dialogStyle}
        info={getLanguage(this.props.language).Prompt.ENABLE_DYNAMIC_PROJECTION}
        //{'是否开启动态投影？'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.TURN_ON}
        //{'是'}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.NO}
      //{'否'}
      />
    )
  }

  /**
   * 底部撤销恢复的工具栏
   */
  renderEditControllerView = () => {
    const paddingBottom = screen.isIphoneX() && this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? screen.X_BOTTOM_L : 0
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(100) + paddingBottom,
          ...screen.getIphonePaddingHorizontal(
            this.props.device.orientation,
          ),
        }}
      >
        <View style={[
          styles.editControllerView,
          {
            height: scaleSize(100) + paddingBottom,
            paddingBottom,
          },
        ]}>
          <MTBtn
            key={'undo'}
            title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_UNDO}
            //{'撤销'}
            style={styles.button}
            textColor={!this.state.canBeUndo && color.contentColorGray}
            image={
              this.state.canBeUndo
                ? getThemeAssets().edit.icon_undo
                : getThemeAssets().edit.icon_undo_ash
            }
            imageStyle={styles.headerBtnImg}
            onPress={() => {
              if (!this.state.canBeUndo) return
              ;(async function () {
                await SMap.undo()
                const historyCount = await SMap.getMapHistoryCount()
                const currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
                this.setState({
                  canBeUndo: currentHistoryCount >= 0,
                  canBeRedo: currentHistoryCount < historyCount - 1,
                })
              }.bind(this)())
            }}
          />
          <MTBtn
            key={'redo'}
            title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REDO}
            //{'恢复'}
            style={styles.button}
            textColor={!this.state.canBeRedo && color.contentColorGray}
            image={
              this.state.canBeRedo
                ? getThemeAssets().edit.icon_redo
                : getThemeAssets().edit.icon_redo_ash
            }
            imageStyle={styles.headerBtnImg}
            onPress={() => {
              if (!this.state.canBeRedo) return
              ; (async function () {
                await SMap.redo()
                const historyCount = await SMap.getMapHistoryCount()
                const currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
                this.setState({
                  canBeUndo: currentHistoryCount >= 0,
                  canBeRedo: currentHistoryCount < historyCount - 1,
                })
              }.bind(this)())
            }}
          />
          {/*<MTBtn*/}
          {/*key={'revert'}*/}
          {/*title={'还原'}*/}
          {/*style={styles.button}*/}
          {/*image={getThemeAssets().publicAssets.icon_revert}*/}
          {/*imageStyle={styles.headerBtnImg}*/}
          {/*onPress={() => SMap.addMapHistory()}*/}
          {/*/>*/}
          <View style={styles.button} />
          <View style={styles.button} />
        </View>
      </View>
    )
  }

  // //网络数据集和模型文件选择
  // showModelList = async () => {
  //   // let hasNetworkDataset = await SNavigation.hasNetworkDataset()
  //   // if (!hasNetworkDataset) {
  //   //   Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK_DATASETS)
  //   //   return
  //   // }
  //   // let popView = this.selectList
  //   // let simpleList = global.SimpleSelectList
  //   // if (simpleList.renderType !== 'navigation') {
  //   //   if (simpleList.state.navigationData.length === 0) {
  //   //     let path =
  //   //       (await FileTools.appendingHomeDirectory(
  //   //         this.props.user && this.props.user.currentUser.userName
  //   //           ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
  //   //           : ConstPath.CustomerPath,
  //   //       )) + ConstPath.RelativePath.Datasource
  //   //     let datasources = await SMap.getNetworkDatasource()
  //   //     let models = await FileTools.getNetModel(path)
  //   //     models = models.map(item => {
  //   //       item.checked = false
  //   //       return item
  //   //     })
  //   //     let navigationData = [
  //   //       {
  //   //         title: getLanguage(this.props.language).Map_Settings.DATASOURCES,
  //   //         visible: true,
  //   //         image: require('../../../../assets/mapToolbar/list_type_udb_black.png'),
  //   //         data: datasources || [],
  //   //       },
  //   //       {
  //   //         title: getLanguage(this.props.language).Map_Main_Menu
  //   //           .NETWORK_MODEL_FILE,
  //   //         visible: true,
  //   //         image: getThemeAssets().functionBar.icon_tool_network,
  //   //         data: models || [],
  //   //       },
  //   //     ]
  //   //     simpleList.setState({
  //   //       navigationData,
  //   //       renderType: 'navigation',
  //   //     })
  //   //   } else {
  //   //     simpleList.setState({
  //   //       renderType: 'navigation',
  //   //     })
  //   //   }
  //   // }
  //   //
  //   // this.showFullMap(true)
  //   // popView.setVisible(true)
  // }

  //导航地图 模型、路网弹窗 数据在点击模型按钮时获取一次 切换地图时清空
  // renderNetworkSelectList = () => {
  //   return (
  //     <SimpleSelectList
  //       ref={ref => (global.SimpleSelectList = this.SimpleSelectList = ref)}
  //       showFullMap={this.showFullMap}
  //       language={this.props.language}
  //       confirmAction={() => {
  //         this.selectList.setVisible(false)
  //         this.showFullMap(false)
  //         let selectList = global.SimpleSelectList
  //         let { networkModel, networkDataset } = selectList.state
  //         if (networkModel && networkDataset) {
  //           SNavigation.startNavigation(networkDataset.datasetName, networkModel.path)
  //           NavigationService.navigate('NavigationView', {
  //             changeNavPathInfo: this.changeNavPathInfo,
  //             showLocationView: true,
  //           })
  //         }
  //       }}
  //     />
  //   )
  // }

  renderSearchBar = () => {
    return null
    // if (!this.props.analyst.params) return null
    // return (
    //   <SearchBar
    //     ref={ref => (this.searchBar = ref)}
    //     onSubmitEditing={searchKey => {
    //       this.setLoading(true, getLanguage(global.language).Prompt.SEARCHING)
    //       this.search(searchKey)
    //     }}
    //     placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
    //     //{'请输入搜索关键字'}
    //   />
    // )
  }

  renderHeaderRight = () => {
    if (this.props.analyst.params || (global.Type === ChunkType.MAP_AR_MAPPING ? this.props.isAR : this.state.showAIDetect))
      return null
    const size =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50

    const currentMapModule = this.props.mapModules.modules[this.props.user.currentUser.userName].find(item => {
      return item.key === this.type
    })
    const buttonInfos = global.coworkMode && Object.keys(ChunkType).indexOf(global.Type) >= 0 && [
      MapHeaderButton.CoworkChat,
    ] || (currentMapModule && currentMapModule.headerButtons) || [
      // MapHeaderButton.BaseMap,
      MapHeaderButton.Share,
      MapHeaderButton.Search,
      MapHeaderButton.Undo,
      MapHeaderButton.Audio,
    ]
    const buttons = []
    if (this.isExample) {
      if (this.wsData.nodeleteBT) {
        return null
      }
      return (
        <MTBtn
          key={'more'}
          style={[styles.headerBtn, this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
            height: screen.HEADER_HEIGHT_LANDSCAPE - 2,
          }]}
          imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
          image={getPublicAssets().common.icon_nav_imove}
          onPress={async () => {
            // const _params = ToolbarModule.getParams()
            await ToolbarModule.setToolBarData(ConstToolType.SM_MAP_BASE_CHANGE)
            ToolbarModule.addData({
              data: this.wsData,
            })
            const { data, buttons } = await ToolbarModule.getToolBarData(ConstToolType.SM_MAP_BASE_CHANGE)
            this.showFullMap(true)
            this.toolBox?.setVisible(true, ConstToolType.SM_MAP_BASE_CHANGE, {
              containerType: ToolbarType.list, // 数据展示类型为普通列表
              isFullScreen: true,
              data,
              buttons,
            })
          }}
        />
      )
    } else {
      for (let i = 0; i < buttonInfos.length; i++) {
        let info
        if (typeof buttonInfos[i] === 'string') {
          switch (buttonInfos[i]) {
            // case MapHeaderButton.BaseMap:
            //   info = {
            //     key: MapHeaderButton.BaseMap,
            //     image: getThemeAssets().start.icon_tool_map,
            //     action: () => {
            //       let data
            //       let layerManagerDataArr = [...layerManagerData()]
            //       for (let i = 0, n = this.curUserBaseMaps.length; i < n; i++) {
            //         let baseMap = this.curUserBaseMaps[i]
            //         //只保留用户添加的 zhangxt
            //         if (
            //           baseMap.DSParams.engineType === 227 ||
            //           baseMap.DSParams.engineType === 223 ||
            //           !baseMap.userAdd
            //         ) {
            //           continue
            //         }
            //         let layerManagerData = {
            //           title: baseMap.mapName,
            //           action: () => {
            //             return OpenData(baseMap, baseMap.layerIndex)
            //           },
            //           data: [],
            //           image: getThemeAssets().layerType.layer_image,
            //           type: DatasetType.IMAGE,
            //           themeType: -1,
            //         }
            //         layerManagerDataArr.push(layerManagerData)
            //       }
            //       data = [
            //         {
            //           title: '',
            //           data: layerManagerDataArr,
            //         },
            //       ]
            //       //'切换底图') {
            //       ToolbarModule.setData({type:ConstToolType.SM_MAP_LAYER_BASE_CHANGE}) //切换底图前先清空一下module数据避免点击方法调用错误 add jiakai
            //       this.showFullMap(true)
            //       this.toolBox?.setVisible(true, ConstToolType.SM_MAP_LAYER_BASE_CHANGE, {
            //         height: ConstToolType.TOOLBAR_HEIGHT[5],
            //         containerType:'list',
            //         data:data,
            //         isFullScreen: true,
            //       })
            //     },
            //   }
            //   break
            case MapHeaderButton.Share:
              info = {
                key: MapHeaderButton.Share,
                image: getThemeAssets().nav.icon_nav_share,
                action: shareModule().action,
              }
              break
            case MapHeaderButton.Audio:
              info = {
                key: MapHeaderButton.Audio,
                image: getThemeAssets().nav.icon_nav_voice,
                action: () => {
                  Audio.showAudio('top', { device: this.props.device })
                },
              }
              break
            case MapHeaderButton.Undo:
              info = {
                key: MapHeaderButton.Undo,
                image: getThemeAssets().nav.icon_nav_undo,
                action: this.showUndoView,
              }
              break
            case MapHeaderButton.Search:
              info = {
                key: MapHeaderButton.Search,
                image: getThemeAssets().nav.icon_nav_search,
                action: async () => {
                  if (global.Type === ChunkType.MAP_NAVIGATION) {
                    const layers =
                      this.props.getLayers && (await this.props.getLayers())
                    const baseMap = layers.filter(layer =>
                      LayerUtils.isBaseLayer(layer),
                    )[0]
                    if (
                      baseMap &&
                      baseMap.name !== 'baseMap' &&
                      baseMap.isVisible
                    ) {
                      NavigationService.navigate('PointAnalyst', {
                        type: 'pointSearch',
                      })
                      this.changeFloorID('')
                    } else {
                      Toast.show(
                        getLanguage(this.props.language).Prompt
                          .PLEASE_SET_BASEMAP_VISIBLE,
                      )
                    }
                  } else {
                    NavigationService.navigate('PointAnalyst', {
                      type: 'pointSearch',
                    })
                  }
                },
              }
              break
            case MapHeaderButton.CoworkChat:
              // 有协作任务在有群聊
              if (CoworkInfo.coworkId === '') {
                continue
              }
              info = {
                key: MapHeaderButton.CoworkChat,
                image: getThemeAssets().cowork.icon_nav_chat,
                action: async () => {
                  const param = {}
                  if (CoworkInfo.coworkId !== '') {
                    param.targetId = CoworkInfo.coworkId
                    param.title = getLanguage(global.language).Friends.GROUPS
                  }
                  NavigationService.navigate('Chat', param)
                },
                newInfo: this.props.coworkMessages?.[this.props.user.currentUser.userName]
                  ?.coworkGroupMessages?.[this.props.currentTask.groupID]?.[this.props.currentTask.id]?.unread || 0,
              }
              break
          }
        } else {
          info = buttonInfos[i]
        }
        if (buttonInfos[i] === MapHeaderButton.Share || info.newInfo) {
          info &&
            buttons.push(
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <MTBtn
                  key={info.key}
                  style={[styles.headerBtn, this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
                    height: screen.HEADER_HEIGHT_LANDSCAPE - 2,
                  }]}
                  imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
                  image={info.image}
                  // onPress={info.action}
                  onPress={() => {
                    // 正在分享中时，点击分享按钮就给一个提示
                    if (buttonInfos[i] === MapHeaderButton.Share && this.props.online.share[0] &&
                      global.Type === this.props.online.share[0].module &&
                      this.props.online.share[0].progress !== undefined &&
                      this.isShareCanClick) {
                      Toast.show(getLanguage(global.language).Prompt.SHARE_NOT_COMPLRTE, { duration: 1500, position: 145 })
                      // 当提示还存在时，分享按钮点击不给反应
                      this.isShareCanClick = false
                      const timer = setTimeout(() => {
                        this.isShareCanClick = true
                        clearTimeout(timer)
                      }, 1500)
                    }
                    info.action()
                  }}

                />
                {
                  info.newInfo &&
                  <RedDot style={{ position: 'absolute', top: 0, right: 0 }} />
                }
                {buttonInfos[i] === MapHeaderButton.Share && this.props.online.share[0] &&
                  global.Type === this.props.online.share[0].module &&
                  this.props.online.share[0].progress !== undefined && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: scaleSize(4),
                      justifyContent: 'space-between',
                    }}
                  >
                    <Bar
                      style={{
                        width: scaleSize(size), height: 2, borderWidth: 0,
                        backgroundColor: 'black', top: scaleSize(4),
                      }}
                      progress={
                        this.props.online.share[this.props.online.share.length - 1]
                          .progress
                      }
                      width={scaleSize(60)}
                    />
                  </View>
                )}
              </View>
            )
        } else if (typeof info === 'function') {
          buttons.push(info(this.props))
        } else {
          info &&
            buttons.push(
              <MTBtn
                key={info.key}
                style={[styles.headerBtn, this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
                  height: screen.HEADER_HEIGHT_LANDSCAPE - 2,
                }]}
                imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
                image={info.image}
                onPress={info.action}
              />,
            )
        }
      }
    }
    if (global.coworkMode && this.state.onlineCowork && Object.keys(ChunkType).indexOf(global.Type) >= 0) {
      buttons.push(
        <MTBtn
          key={'CoworkMember'}
          style={[styles.headerBtn, this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
            height: screen.HEADER_HEIGHT_LANDSCAPE - 2,
          }]}
          imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
          image={getPublicAssets().common.icon_nav_imove}
          onPress={async () => {
            NavigationService.navigate('CoworkMember')
          }}
        />,
      )
    }
    return (
      <View
        style={{
          // width: scaleSize(itemWidth * buttons.length),
          flexDirection: 'row',
          justifyContent: buttons.length === 1 ? 'flex-end' : 'space-between',
          alignItems: 'center',
        }}
      >
        {buttons}
      </View>
    )
  }

  /**
   * 顶部下载进度条
   */
  renderProgress = () => {
    let data
    if (this.props.downloads.length > 0) {
      for (let i = 0; i < this.props.downloads.length; i++) {
        // if (this.props.downloads[i].id === global.Type) {
        if (
          this.props.downloads[i].id &&
          this.props.downloads[i].params.module === global.Type
        ) {
          data = this.props.downloads[i]
          break
        }
        if (this.props.downloads[i].id === 'mobilenet_quant_224') {
          data = this.props.downloads[i]
          break
        }
        if (this.props.downloads[i].id === 'gltf') {
          data = this.props.downloads[i]
        }
      }
    }
    if (!data) return <View />
    return (
      <Progress
        ref={ref => (this.mProgress = ref)}
        style={styles.progressView}
        //下载示范数据进度条高度，统一修改为8 yangsl
        height={8}
        progressAniDuration={0}
        progressColor={color.item_selected_bg}
      />
    )
  }

  /**
   * 切换ar和地图浏览
   * @param {boolean} showAIDetect 是否隐藏AR相机页面
   */
  switchAr = showAIDetect => {
    if (
      this.isARModule()
    ) {
      let _isAR = this.props.isAR
      if (showAIDetect !== undefined && typeof showAIDetect === 'boolean') {
        if (showAIDetect !== _isAR) {
          _isAR = showAIDetect
        } else {
          return
        }
      } else {
        _isAR = !_isAR
      }
      // this.setState({isAR:_isAR})
      this.props.showAR(_isAR)
      global.showAIDetect = _isAR
      _isAR
        ? screen.lockToPortrait()
        : screen.unlockAllOrientations()

      if (this.props.isAR) {
        SARMap.onPause()
      } else {
        SARMap.onResume()
      }

      return _isAR
    }
    return false
  }

  /**
   * 移除AR相机页面
   * @param {boolean} bGone 是否移除AR相机页面
   */
  removeAIDetect = bGone => {
    this.setState({
      bGoneAIDetect: bGone,
    })
  }

  /** AR和二维地图切换图标 */
  _renderArModeIcon = () => {
    const show =
      this.isARModule() ? this.props.isAR : this.state.showAIDetect
    let right
    if (
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 &&
      !show
    ) {
      right = {
        right: scaleSize(120),
        bottom: scaleSize(26),
      }
    } else {
      right = {
        right: scaleSize(20),
        bottom: scaleSize(135),
      }
    }
    return (
      <View
        style={[styles.iconAr, right]}
        ref={ref => (global.ArModeIcon = ref)}
      >
        <MTBtn
          style={{ padding: scaleSize(5) }}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().ar.switch_ar_light}
          onPress={() => {
            this.currentTime = new Date().getTime()
            this.lastClickTime = this.currentTime
            if (!show) {
              this.setState({
                bGoneAIDetect: false,
              })
            }
            const _showAIDetect = this.switchAr()
            // 防止地图界面全屏后快速点击切换到AR界面，工具栏消失
            setTimeout(() => {
              _showAIDetect && this.showFullMap(false)
            }, Const.ANIMATED_DURATION)
          }}
          activeOpacity={0.5}
        // separator={scaleSize(2)}
        />
      </View>
    )
    // return (
    //   <ImageButton
    //     containerStyle={[styles.iconAr, right]}
    //     // iconBtnStyle={[styles.iconAr, right]}
    //     iconStyle={styles.switchARImg}
    //     icon={getThemeAssets().publicAssets.icon_tool_switch}
    //     onPress={() => {
    //       this.currentTime = new Date().getTime()
    //       this.lastClickTime = this.currentTime
    //       if (!show) {
    //         this.setState({
    //           bGoneAIDetect: false,
    //         })
    //       }
    //       let _showAIDetect = this.switchAr()
    //       // 防止地图界面全屏后快速点击切换到AR界面，工具栏消失
    //       setTimeout(() => {
    //         _showAIDetect && this.showFullMap(false)
    //       }, Const.ANIMATED_DURATION)
    //     }}
    //   />
    // )
  }

  //隐藏示范数据按钮
  closeSample = () => {
    this.props.setSampleDataShow(false)
  }

  /** 示范数据 */
  _renderSampleData = () => {
    let right
    if (
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
    ) {
      right = {
        right: scaleSize(120),
        bottom: scaleSize(26),
      }
    } else {
      right = {
        right: scaleSize(20),
        bottom: scaleSize(135),
      }
    }
    return (
      <View
        style={[styles.iconSap, right]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // this.closeSample()
            NavigationService.navigate('SampleMap')
          }}
        >
          <Animated.Image
            style={{ width: scaleSize(120), height: scaleSize(120), transform: [{ scale: this.state.samplescale }] }}
            resizeMode={'contain'}
            source={getThemeAssets().publicAssets.icon_tool_download}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            width: scaleSize(40),
            height: scaleSize(35),
            right: 0,
            top: 0,
          }}
          onPress={() => {
            this.closeSample()
          }}
        ></TouchableOpacity>
      </View>
    )
  }

  _renderLocationIcon = () => {
    return (
      <LocationView
        getNavigationDatas={this.getNavigationDatas}
        ref={ref => (global.LocationView = ref)}
      />
    )
  }

  /**
   * 室内增量路网绘制icon
   */
  _renderNavigationIcon = () => {
    const title = getLanguage(this.props.language).Map_Main_Menu.DRAW
    return (
      <View style={styles.navigation}>
        <MTBtn
          style={styles.iconNav}
          size={MTBtn.Size.NORMAL}
          title={title}
          textColor={'black'}
          textStyle={{ fontSize: setSpText(12) }}
          image={require('../../../../assets/Navigation/navi_icon.png')}
          onPress={async () => {
            this._incrementRoad()
          }}
          activeOpacity={0.5}
        />
      </View>
    )
  }


  isIndoorPoint = async (x: number, y: number) => {
    const datasources = await SData.getDatasources()
    const datasets: Awaited<ReturnType<typeof SData.getDatasetsByDatasource>>[] = []
    for(let i = 0; i < datasources.length; i++){
      datasets.push(await SData.getDatasetsByDatasource({alias: datasources[i].alias}))
    }
    const indoorDatasource = datasets.filter(dataset => {
      const hasFloorTable = dataset.filter(data => data.datasetName === 'FloorRelationTable').length > 0
      return hasFloorTable
    })

    let isIndoor = false
    if(indoorDatasource.length > 0 && indoorDatasource[0].length > 0) {
      for(let i = 0; i < indoorDatasource[0].length; i++) {
        const dataset = indoorDatasource[0][i]
        const bounds = await SData.getDatasetBounds({dataset: dataset.datasetName, datasource: dataset.datasourceName})
        const prjcoord = await SData.getDatasetPrjCoordSys({datasetName: dataset.datasetName, datasourceName: dataset.datasourceName})
        const point = (await SData.CoordSysTranslatorGPSToPrj(prjcoord, [{x, y}]))[0]

        if(point.x >= bounds.left && point.x <= bounds.right && point.y >= bounds.bottom && point.y <= bounds.top) {
          isIndoor = true
          break
        }
      }
    }

    return isIndoor
  }


  /**
   * 开始绘制室内增量路网
   */
  _incrementRoad = async () => {
    try {
      if (!this.state.isRight) {
        const position = await SMap.getCurrentLocation()
        const isIndoor = await this.isIndoorPoint(position.longitude, position.latitude)
        if (!isIndoor) {
          Toast.show(
            getLanguage(this.props.language).Prompt
              .CANT_USE_TRACK_TO_INCREMENT_ROAD,
          )
          return
        }
      }
      if (this.state.showIncrement) {
        this.setState({ showIncrement: false })
      }
      //清空Toolbar数据
      ToolbarModule.setData({})
      const rel = await IndoorGPSCollector.addNetWorkDataset()
      let type
      if (rel) {
        this.FloorListView.setVisible(false)
        if (!this.state.isRight) {
          type = ConstToolType.SM_MAP_TOOL_GPSINCREMENT
        } else {
          type = ConstToolType.SM_MAP_TOOL_INCREMENT
          await SMap.setMapControlStyle({
            nodeColor: { r: 57, g: 153, b: 255, a: 1 },
            nodeSize: 1,
            strokeColor: { r: 57, g: 153, b: 255, a: 1 },
            strokeWidth: 1,
          })
          // await SMap._setLabelColor()
          await SMap.setAction(Action.DRAWLINE)
          await SMap.setIsMagnifierEnabled(true)
        }
        this.toolBox.setVisible(true, type, {
          containerType: ToolbarType.table,
          isFullScreen: false,
        })
        ToolbarModule.setToolBarData(type)
      } else {
        global.TouchType = TouchType.NORMAL
        this.showFullMap(false)
        Toast.show(getLanguage(this.props.language).Prompt.ILLEGAL_DATA)
      }
    } catch (e) {
      global.TouchType = TouchType.NORMAL
      this.showFullMap(false)
      Toast.show(getLanguage(this.props.language).Prompt.ILLEGAL_DATA)
    }
  }

  // _renderNavigationView = () => {
  //   return (
  //     <View
  //       style={{
  //         position: 'absolute',
  //         top: 0,
  //         width: '100%',
  //       }}
  //     >
  //       <NavigationView />
  //     </View>
  //   )
  // }
  /**
   * 设置楼层id
   * @param {string} currentFloorID 楼层id
   * @param {*} cb 完成回调
   */
  changeFloorID = (currentFloorID:string, cb?: () => void) => {
    if (currentFloorID !== this.state.currentFloorID) {
      this.setState(
        {
          currentFloorID,
        },
        () => {
          cb && cb()
        },
      )
    }
  }

  /** 楼层控件 */
  _renderFloorListView = () => {
    return (
      <RNFloorListView
        changeFloorID={this.changeFloorID}
        currentFloorID={this.state.currentFloorID}
        device={this.props.device}
        mapLoaded={this.state.mapLoaded}
        ref={ref => (global.FloorListView = this.FloorListView = ref)}
      />
    )
  }

  /** 实时路况 */
  _renderTrafficView = () => {
    return (
      <TrafficView
        ref={ref => (global.TrafficView = this.TrafficView = ref)}
        currentFloorID={this.state.currentFloorID}
        getLayers={this.props.getLayers}
        device={this.props.device}
        incrementRoad={() => {
          global.TouchType = TouchType.NULL //进入路网，触摸事件设置为空
          this.showFullMap(true)
          this.setState({ showIncrement: true })
        }}
        mapLoaded={this.state.mapLoaded}
        language={this.props.language}
        setLoading={this.setLoading}
      // showModelList={this.showModelList}
      />
    )
  }

  _renderPositionStateView = () => {
    return (
      <PositionStateView/>
    )
  }

  /**
   * 室内路网采集页面 zhangxt
   */
  _renderIncrementRoad = () => {
    if (this.state.showIncrement) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        >
          <IncrementRoadView
            isRight={this.state.isRight}
            onClick={isRight =>
              this.setState({
                isRight,
              })
            }
            headerProps={{
              title: getLanguage(this.props.language).Map_Main_Menu
                .INCREMENT_ROAD,
              navigation: this.props.navigation,
              type: 'fix',
              backAction: () => {
                this.setState({ showIncrement: false })
                this.showFullMap(false)
                global.TouchType = TouchType.NORMAL //退出路网，触摸事件设置为normal
              },
            }}
          />
        </View>
      )
    } else {
      return <View />
    }
  }

  /**
   * 室内外路网采集入口
   * @param {string} type SM_MAP_INCREMENT_INNER|SM_MAP_INCREMENT_GPS_TRACK
   */
  _pressRoad = async type => {
    //暂时屏蔽室内采集
    if (type === ConstToolType.SM_MAP_INCREMENT_INNER) return
    const params = ToolbarModule.getParams()
    const containerType = ToolbarType.table
    const _data = await IncrementData.getData(type)
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    this.showFullMap(true)
    switch (type) {
      case ConstToolType.SM_MAP_INCREMENT_GPS_TRACK:
        SNavigationInner.createDefaultDataset().then(async returnData => {
          if (returnData && returnData.datasetName) {
            params.setToolbarVisible(true, type, {
              containerType,
              isFullScreen: false,
              resetToolModuleData: true,
              // height:data.height,
              // column:data.column,
              ...data,
            })
            global.INCREMENT_DATA = returnData
          }
        })
        break
      case ConstToolType.SM_MAP_INCREMENT_INNER:
        break
    }
    //设置所有图层不可选 完成拓扑编辑或者退出增量需要设置回去
    const layers = this.props.layers.layers
    LayerUtils.setLayersSelectable(layers, false, true)
    global.TouchType = TouchType.NULL
    global.IncrementRoadDialog.setVisible(false)
  }

  /** 室内外路网采集的弹框 */
  renderIncrementDialog = () => {
    const increment_indoor = getThemeAssets().navigation.increment_indoor
    const increment_outdoor = getThemeAssets().navigation.increment_outdoor
    return (
      <IncrementRoadDialog ref={ref => (global.IncrementRoadDialog = ref)}>
        <View style={styles.incrementContent}>
          <TouchableOpacity
            style={styles.incrementButton}
            onPress={() => {
              this._pressRoad(ConstToolType.SM_MAP_INCREMENT_INNER)
            }}
          >
            <Image
              style={styles.incrementImage}
              source={increment_indoor}
              resizeMode={'contain'}
            />
            <Text style={styles.incrementText}>
              {
                getLanguage(this.props.language).Map_Main_Menu
                  .MAP_INDOOR_NETWORK
              }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.incrementButton}
            onPress={() => {
              this._pressRoad(ConstToolType.SM_MAP_INCREMENT_GPS_TRACK)
            }}
          >
            <Image
              style={styles.incrementImage}
              source={increment_outdoor}
              resizeMode={'contain'}
            />
            <Text style={styles.incrementText}>
              {
                getLanguage(this.props.language).Map_Main_Menu
                  .MAP_OUTDOOR_NETWORK
              }
            </Text>
          </TouchableOpacity>
        </View>
      </IncrementRoadDialog>
    )
  }

  /** 目标识别header */
  _renderAIDetectChange = () => {
    return (
      <MapSelectPoint
        ref={ref => (global.AIDETECTCHANGE = ref)}
        headerProps={{
          navigation: this.props.navigation,
          type: 'fix',
          backAction: async () => {
            // await SAIDetectView.setProjectionModeEnable(false)
            global.AIDETECTCHANGE.setVisible(false)
            this.showFullMap(false)
            global.toolBox.setVisible(false)
            await SAIDetectView.pauseDetect()
            await SAIDetectView.clearDetectObjects()
            // this.switchAr()
          },
          headerRight: this._renderAIDectectHeaderRight(),
        }}
      />
    )
  }

  /** 目标识别header右侧按钮 */
  _renderAIDectectHeaderRight = () => {
    const dectectype = getThemeAssets().setting.icon_detection_type
    return (
      <TouchableOpacity
        onPress={async () => {
          NavigationService.navigate('SecondMapSettings', {
            title: getLanguage(global.language).Map_Settings.DETECT_TYPE,
            language: this.props.language,
            //
            device: this.props.device,
          })
        }}
      >
        <Image
          resizeMode={'contain'}
          source={dectectype}
          style={styles.search}
        />
      </TouchableOpacity>
    )
  }

  /**
   * 导航  地图选点界面的搜索按钮被点击,当前设置按钮title
   * @returns {object} {
   *   isClicked<boolean>,
       title<string>, 当前点击按钮的标题
   *  }
   */
  getSearchClickedInfo = () => {
    return this.searchClickedInfo
  }

  /** 地图选点header右边确定view */
  _renderMapSelectPointHeaderRight = () => {
    if (
      this.state.selectPointType === 'selectPoint' ||
      this.state.selectPointType === 'SELECTPOINTFORARNAVIGATION_INDOOR' ||
      this.state.selectPointType === 'DatumPointCalibration'
    ) {
      return (
        <TouchableOpacity
          key={'search'}
          onPress={async () => {
            if (this.state.selectPointType === 'selectPoint' || this.state.selectPointType === 'DatumPointCalibration') {
              global.MAPSELECTPOINT.setVisible(false)
              // global.MAPSELECTPOINTBUTTON.setVisible(false)
              // 如果是新校准界面 则返回原界面
              if (this.state.selectPointType === 'selectPoint') {
                NavigationService.navigate('EnterDatumPoint', {})
              } else {
                NavigationService.navigate(this.props.route.params.backPage,
                  this.props.route.params.routeData)
              }

              global.mapController.move({
                bottom: scaleSize(-50),
                left: 'default',
              })

              if (global.MapXmlStr) {
                await SMap.mapFromXml(global.MapXmlStr)
                global.MapXmlStr = undefined
              }
              global.SELECTPOINTLATITUDEANDLONGITUDE &&
                global.DATUMPOINTVIEW &&
                global.DATUMPOINTVIEW.updateLatitudeAndLongitude(
                  global.SELECTPOINTLATITUDEANDLONGITUDE,
                )
              this.setState({
                selectPointType: undefined,
              })
              global.AIDETECTCHANGE.setVisible(false)
              this.showFullMap(false)
              SMap.deleteMarker(global.markerTag)
              global.toolBox.setVisible(false)

              Toast.show(
                getLanguage(global.language).Profile
                  .MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED,
              )
              return
            } else if (
              this.state.selectPointType === 'SELECTPOINTFORARNAVIGATION_INDOOR'
            ) {
              global.MAPSELECTPOINT.setVisible(false)
              global.TouchType = TouchType.NORMAL
              SMap.deleteMarker(global.markerTag)
              NavigationService.navigate('EnterDatumPoint', {
                type: 'ARNAVIGATION_INDOOR',
              })
              global.SELECTPOINTLATITUDEANDLONGITUDE &&
                global.DATUMPOINTVIEW &&
                global.DATUMPOINTVIEW.updateLatitudeAndLongitude(
                  global.SELECTPOINTLATITUDEANDLONGITUDE,
                )
              this.setState({
                selectPointType: undefined,
              })
              Toast.show(
                getLanguage(global.language).Profile
                  .MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED,
              )
            }
          }}
        >
          <Text style={styles.textConfirm}>
            {getLanguage(this.props.language).Map_Settings.CONFIRM}
          </Text>
        </TouchableOpacity>
      )
    } else if (!this.state.currentFloorID) {
      return (
        <TouchableOpacity
          key={'search'}
          onPress={async () => {
            const layers = this.props.getLayers && (await this.props.getLayers())
            const baseMap = layers.filter(layer =>
              LayerUtils.isBaseLayer(layer),
            )[0]
            if (baseMap && baseMap.name !== 'baseMap' && baseMap.isVisible) {
              this.searchClickedInfo = {
                isClicked: true,
                title: global.MAPSELECTPOINTBUTTON.state.button,
              }
              NavigationService.navigate('PointAnalyst', {
                type: 'pointSearch',
                searchClickedInfo: this.searchClickedInfo,
                changeNavPathInfo: this.changeNavPathInfo,
              })
            } else {
              Toast.show(
                getLanguage(this.props.language).Prompt
                  .PLEASE_SET_BASEMAP_VISIBLE,
              )
            }
          }}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().nav.icon_search}
            style={styles.search}
          />
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }

  /** 地图选点header */
  _renderMapSelectPoint = () => {
    return (
      <MapSelectPoint
        ref={ref => (global.MAPSELECTPOINT = ref)}
        openSelectPointMap={this._openSelectPointMap}
        selectPointType={this.state.selectPointType}
        headerProps={{
          title: getLanguage(this.props.language).Map_Main_Menu.SELECT_POINTS,
          navigation: this.props.navigation,
          type: 'fix',
          headerRight: this._renderMapSelectPointHeaderRight(),
          backAction: async () => {
            if (this.state.selectPointType === 'selectPoint' || this.state.selectPointType === 'DatumPointCalibration') {
              let backPage = 'EnterDatumPoint'
              if (this.state.selectPointType === 'DatumPointCalibration') {
                backPage = this.props.route.params.backPage
              }
              global.mapController.move({
                bottom: scaleSize(-50),
                left: 'default',
              })

              // 如果是新校准界面 则返回原界面
              NavigationService.navigate(backPage, this.props.route.params.routeData)

              this.setState({
                showScaleView: true,
                selectPointType: undefined,
              }, async () => {
                global.MAPSELECTPOINT.setVisible(false)

                if (global.MapXmlStr) {
                  await SMap.mapFromXml(global.MapXmlStr)
                  global.MapXmlStr = undefined
                }

                SMap.deleteMarker(global.markerTag)
                global.SELECTPOINTLATITUDEANDLONGITUDETEMP &&
                  global.DATUMPOINTVIEW &&
                  global.DATUMPOINTVIEW.updateLatitudeAndLongitude(
                    global.SELECTPOINTLATITUDEANDLONGITUDETEMP,
                  )

                global.AIDETECTCHANGE.setVisible(false)
                this.showFullMap(false)
                global.toolBox.setVisible(false)
              })

              return
            } else if (
              this.state.selectPointType === 'SELECTPOINTFORARNAVIGATION_INDOOR'
            ) {

              global.MAPSELECTPOINT.setVisible(false)
              global.TouchType = TouchType.NORMAL
              this.setState({
                // showScaleView: true,
                selectPointType: undefined,
              }, () => {
                NavigationService.navigate('EnterDatumPoint', {
                  type: 'ARNAVIGATION_INDOOR',
                })
              })
              SMap.deleteMarker(global.markerTag)
              return
            }
            global.MAPSELECTPOINT.setVisible(false)
            // global.MAPSELECTPOINTBUTTON.setVisible(false)
            if (global.Type === ChunkType.MAP_NAVIGATION && global.TouchType !== TouchType.NAVIGATION_TOUCH_END) {
              this.props.setMapNavigation({ isShow: false, name: '' })
              global.STARTNAME = getLanguage(
                global.language,
              ).Map_Main_Menu.SELECT_START_POINT
              global.ENDNAME = getLanguage(
                global.language,
              ).Map_Main_Menu.SELECT_DESTINATION
              global.STARTX = undefined
              global.ENDX = undefined
              global.MAPSELECTPOINT.setVisible(false)
              global.MAPSELECTPOINTBUTTON.setVisible(false)
              await SNavigation.clearPath()
              await SIndoorNavigation.clearPath()
              await SMap.clearTrackingLayer()
              await SMap.removeCallout('startPoint')
              await SMap.removeCallout('endPoint')
              global.ToolBar?.existFullMap()
            } else {
              NavigationService.navigate('NavigationView', {
                changeNavPathInfo: this.changeNavPathInfo,
                getNavigationDatas: this.getNavigationDatas,
              })
            }
          },
        }}
      />
    )
  }

  /** 在线路径分析 */
  _onlineRouteAnylystConfirm = async () => {
    global.NavDialog.setDialogVisible(false)
    this.setLoading(true, getLanguage(global.language).Prompt.ROUTE_ANALYSING)
    let result, path, pathLength
    result = await FetchUtils.routeAnalyst(
      global.STARTX,
      global.STARTY,
      global.ENDX,
      global.ENDY,
    )
    if (result && result[0] && result[0].pathInfos) {
      const style = new GeoStyle()
      style.setLineWidth(1)
      style.setLineColor(0,  191, 255)
      style.setLineStyle(15)
      const mapPrj = await SMap.getPrjCoordSys()
      const points = await SData.CoordSysTranslatorGPSToPrj(mapPrj, result[0].pathPoints)

      await SMap.addGeometryToTrackingLayer({type: GeometryType.GEOLINE, points:[points]},'线路',style,)
    } else {
      this.setLoading(false)
      Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
      return
    }
    pathLength = { length: result[0].pathLength }
    path = result[0].pathInfos

    this.setLoading(false)
    global.NAVIGATIONSTARTBUTTON.setVisible(true, true)
    global.NAVIGATIONSTARTHEAD.setVisible(true)
    global.MAPSELECTPOINTBUTTON.setVisible(false)
    global.MAPSELECTPOINT.setVisible(false)
    global.STARTPOINTFLOOR = await SIndoorNavigation.getCurrentFloorID()

    if (path && pathLength) {
      global.TouchType = TouchType.NORMAL
      this.changeNavPathInfo({ path, pathLength })

      const history = this.props.navigationhistory
      history.push({
        sx: global.STARTX,
        sy: global.STARTY,
        ex: global.ENDX,
        ey: global.ENDY,
        sFloor: global.STARTPOINTFLOOR,
        eFloor: global.ENDPOINTFLOOR,
        address: global.STARTNAME + '---' + global.ENDNAME,
        start: global.STARTNAME,
        end: global.ENDNAME,
      })
      this.props.setNavigationHistory(history)
    }
  }

  /**
   * 设置导航路径的信息
   * @param {object} param0
   * @param {array} param0.path [{
   *  roadLength<number>, 路径长度
   *  turnType<number>, 转弯类型
   * }]
   * @param {object} param0.pathLength {
   *  length<number>, 路径长度
   * }
   */
  changeNavPathInfo = ({ path, pathLength }) => {
    this.setState({
      path,
      pathLength,
    })
  }

  /** 导航底部组件 */
  _renderNavigationStartButton = () => {
    return (
      <NavigationStartButton
        device={this.props.device}
        getNavigationDatas={this.getNavigationDatas}
        path={this.state.path}
        pathLength={this.state.pathLength}
        ref={ref => (global.NAVIGATIONSTARTBUTTON = ref)}
        onNavigationStart={() => {
          this.isGuiding = true
        }}
      />
    )
  }

  /** 导航顶部组件 */
  _renderNavigationStartHead = () => {
    return (
      <NavigationStartHead
        device={this.props.device}
        ref={ref => (global.NAVIGATIONSTARTHEAD = ref)}
        setMapNavigation={this.props.setMapNavigation}
      />
    )
  }

  /** 地图选点底部组件 */
  _renderMapSelectPointButton = () => {
    return (
      <MapSelectPointButton
        setLoading={this.setLoading}
        getNavigationDatas={this.getNavigationDatas}
        setNavigationDatas={this.setNavigationDatas}
        navigationhistory={this.props.navigationhistory}
        setNavigationHistory={this.props.setNavigationHistory}
        changeNavPathInfo={this.changeNavPathInfo}
        ref={ref => (global.MAPSELECTPOINTBUTTON = ref)}
      />
    )
  }

  /**
   * 根据data打开地图并显示指定点位置
   * @param {object} data  见this.wsData
   * @param {object} point 坐标点 {x<number>, y<number>}
   */
  _openSelectPointMap = async (data, point) => {
    await SMap.removeAllLayer() // 移除所有图层
    await this._openDatasource(data, data.layerIndex)
    point && SMap.showMarker(point.x, point.y, global.markerTag)
    global.MAPSELECTPOINT.updateLatitudeAndLongitude(point)
    this.setState({ showScaleView: false })
  }

  _renderNavigationPoiView = () => {
    return (
      <NavigationPoiView
        setNavigationChangeAR={this.props.setNavigationChangeAR}
      />
    )
  }

  /**
   * 退出地图保存提示框
   */
  _renderExitSaveView = () => {
    if (global.Type === ChunkType.MAP_AR) {
      return (
        <SaveListView
          ref={ref => global.SaveMapView = ref}
          getMaps={async () => {
            const maps = []
            if (this.props.armap.currentMap?.mapName) {
              maps.push({
                name: this.props.armap.currentMap.mapName,
                // path: this.props.armap.currentMap.path,
                mapType: 'ar',
              })
            }
            let mapName = ''
            if (this.props.map.currentMap.name) {
              // 获取当前打开的地图xml的名称
              mapName = this.props.map.currentMap.name
              mapName =
                mapName.substr(0, mapName.lastIndexOf('.')) ||
                this.props.map.currentMap.name
            } else {
              const mapInfo = await SMap.getMapInfo()
              if (mapInfo && mapInfo.name) {
                // 获取MapControl中的地图名称
                mapName = mapInfo.name
              } else if (this.props.layers.layers.length > 0) {
                // 若无参数，打开默认工作空间。分析模块使用
                let userPath = ConstPath.CustomerPath
                if (
                  this.props.user.currentUser &&
                  this.props.user.currentUser.userName
                ) {
                  userPath =
                    ConstPath.UserPath + this.props.user.currentUser.userName + '/'
                }
                mapName = await DataHandler.getAvailableFileNameNoExt(await FileTools.appendingHomeDirectory(userPath + ConstPath.RelativePath.Map), 'DefaultMap', 'xml')
              }
            }
            if (mapName) {
              maps.push({
                name: mapName,
                // path: this.props.map.currentMap.path,
                mapType: 'map',
              })
            }
            return maps
          }}
          cancel={() => {
            //
          }}
          saveMap={this.props.saveMap}
          saveARMap={this.props.saveARMap}
        />
      )
    }
    return (
      <SaveView
        ref={ref => (global.SaveMapView = ref)}
        language={this.props.language}
        save={this.saveMap}
        device={this.props.device}
        cancel={() => {
          // this.backAction = null
        }}
      />
    )
  }


  //AR测图引导界面 add jiakai
  renderMapArMappingGuideView = () => {
    return (
      <GuideViewMapArMappingModel
        language={this.props.language}
      />
    )
  }

  //数据处理引导界面 add jiakai
  renderMapAnalystGuideView = () => {
    return (
      <GuideViewMapAnalystModel
        language={this.props.language}
        device={this.props.device}
      />
    )
  }

  //专题图引导界面 add jiakai
  renderMapThemeGuideView = () => {
    return (
      <GuideViewMapThemeModel
        language={this.props.language}
        device={this.props.device}
      />
    )
  }

  //外业采集引导界面 add jiakai
  renderMapCollectGuideView = () => {
    return (
      <GuideViewMapCollectModel
        language={this.props.language}
        device={this.props.device}
      />
    )
  }

  //地图浏览引导界面 add jiakai
  renderMapEditGuideView = () => {
    return (
      <GuideViewMapEditModel
        language={this.props.language}
        device={this.props.device}
      />
    )
  }

  renderHeader = () => {
    return (
      <Header
        ref={ref => (this.containerHeader = ref)}
        backAction={this.ARMappingHeaderBack}
        title={this.title}
        type={'fix'}
        headerRight={this.renderARHeaderRight()}
      />
    )
  }

  renderARHeaderRight = () => {
    let filters
    if (this.measureType === 'drawLine') {
      filters = [DatasetType.LINE]
    } else if (this.measureType === 'arDrawArea') {
      filters = [DatasetType.REGION]
    } else if (this.measureType === 'arDrawPoint') {
      filters = [DatasetType.POINT]
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        {this.isDrawing && (
          <TouchableOpacity
            onPress={() => NavigationService.navigate('ChooseLayer', {
              filters: filters,
            })}
            style={{
              width: scaleSize(60),
              height: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent'
            }}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.icon_classify_settings}
              source={getThemeAssets().toolbar.icon_toolbar_option}
              style={styles.smallIcon}
            />
          </TouchableOpacity>)}
        {this.isDrawing && (
          <TouchableOpacity
            onPress={() => {
              this.setting()
            }}
            style={{
              width: scaleSize(60),
              height: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.ai_setting}
              source={getThemeAssets().toolbar.icon_toolbar_setting}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        )}
        {this.isCollect && (
          <TouchableOpacity
            onPress={() => {
              this.collectsetting()
            }}
            style={{
              width: scaleSize(60),
              height: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent'
            }}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.ai_setting}
              source={getThemeAssets().toolbar.icon_toolbar_setting}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        )}
        {this.isMeasure && (
          <TouchableOpacity
            onPress={() => {
              this.Measuresetting()
            }}
            style={{
              width: scaleSize(60),
              height: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent'
            }}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.ai_setting}
              source={getThemeAssets().toolbar.icon_toolbar_setting}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  /** 设置 */
  setting = async () => {
    const isSnap = await SARMap.getIsSnapRange()
    const tole = await SARMap.getSnapTolerance()
    const showGenera = this.state.showGenera
    NavigationService.navigate('CollectSceneFormSet', {
      point: this.point,
      fixedPositions: point => {
        NavigationService.goBack()
      },
      showType: 'newDatumPoint', // 新的位置校准界面
      reshowDatumPoint: () => {
        NavigationService.goBack()
        this.props.setDatumPoint(true)
      },
      isSnap: isSnap,
      tole: tole,
      showGenera: showGenera,
      autoCatch: value => {
        SARMap.setIsSnapRange(value)
      },
      setTolerance: value => {
        if (value > 100) {
          value = 100
        }
        if (value < 0) {
          value = 0
        }
        SARMap.setSnapTolerance(value)
      },
      showGeneracb: value => {
        this.setState({ showGenera: value })
      },
    })
  }

  collectsetting = () => {
    NavigationService.navigate('CollectSceneFormSet', {
      showType: 'newDatumPoint', // 新的位置校准界面
      point: this.datumPoint,
      fixedPositions: point => {
        NavigationService.goBack()
        // SCollectSceneFormView.fixedPosition(false, point.x, point.y, 0)
      },
      reshowDatumPoint: () => {
        NavigationService.goBack()
        this.props.setDatumPoint(true)
      },
      collectScene: true,
    })
  }

  /** 量算的设置（界面传入数据有区别）add jiakai */
  Measuresetting = async () => {
    const isSnap = await SARMap.getIsSnapRange()
    const tole = await SARMap.getSnapTolerance()
    NavigationService.navigate('CollectSceneFormSet', {
      isMeasure: true,
      isSnap: isSnap,
      tole: tole,
      autoCatch: value => {
        SARMap.setIsSnapRange(value)
      },
      setTolerance: value => {
        NavigationService.goBack()
        if (value > 100) {
          value = 100
        }
        if (value < 0) {
          value = 0
        }
        SARMap.setSnapTolerance(value)
      },
    })
  }

  _onDatumPointClose = () => {
    this.props.setDatumPoint(false)
    if (global.Type === ChunkType.MAP_AR_MAPPING) {
      SARMap.measuerPause(false)
    }
    global.haslocation = true
  }

  _onDatumPointConfirm = point => {
    SARMap.setPosition(Number(point.x), Number(point.y), Number(point.h))
    this.props.setDatumPoint(false)
    if (global.Type === ChunkType.MAP_AR_MAPPING) {
      SARMap.measuerPause(false)
    }
    global.haslocation = true
  }

  ARMappingHeaderBack = () => {
    SARMap.stopLocation()
    SARMap.cancelCurrent()
    SARMap.clearMeasure()
    this.listeners && this.listeners.infoListener?.remove()
    this.listeners && this.listeners.addListener?.remove()
    SARMap.showMeasureView(false)
    SARMap.showTrackView(false)
    SARMap.showPointCloud(false)
    if (Platform.OS === 'android') {
      SARMap.stopTracking()
    }
    // }
    this.setState({ showArMappingButton: false, isTrack: false, showCurrentHeightView: false })
    this.showFullMap(false)
  }

  renderBottomBtns = () => {
    return (
      <ArMappingButton
        isCollect={this.state.isCollect}
        showSave={this.state.showSave}
        isDrawing={this.state.isDrawing}
        isMeasure={this.state.isMeasure}
        measureType={this.state.measureType}
        canContinuousDraw={this.state.canContinuousDraw}
        showSwitch={show => { this.setState({ showSwitch: show }) }}
        setCurrentHeight={height => { this.setState({ currentHeight: height }) }}
        isnew={() => { this.setState({ isnew: true }) }}
        isTrack={is => { this.setState({ isTrack: is }) }}
        showCurrentHeightView={show => { this.setState({ showCurrentHeightView: show }) }}
      />
    )
  }

  renderCurrentHeightChangeView() {
    return (
      <View style={[styles.currentHeightChangeView, { top: scaleSize(100) + screen.getIphonePaddingTop() }]}>
        <Text style={styles.titleCurrentHeight}>
          {this.state.currentHeight}
        </Text>
      </View>
    )
  }

  renderADDPoint = () => {
    let text
    global.language === 'CN' ? text = '添加点' : text = 'Add Point'
    const image = getThemeAssets().ar.icon_ar_measure_add_toast
    // global.language === 'CN' ? image = getThemeAssets().ar.icon_ar_measure_add_toast : image = getThemeAssets().ar.icon_ar_measure_add_toast_en
    return (
      <View style={styles.addcaptureView}>
        <ImageButton
          containerStyle={styles.addcapture}
          iconStyle={styles.addiconView}
          activeOpacity={0.3}
          icon={image}
        />
        <Text style={styles.addText}>
          {text}
        </Text>
      </View>
    )
  }

  renderCenterBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.iconView}
        activeOpacity={0.5}
        icon={getThemeAssets().ar.icon_ar_measure_add}
        onPress={() => {
          this.addNewRecord()
        }}
      />
    )
  }

  /** 添加 **/
  addNewRecord = async () => {
    if (this.state.isCollect) {
      if (Platform.OS === 'ios') {
        await SARMap.draw()
      } else {
        SARMap.addTrackPoint()
      }
      this.setState({ showADDPoint: false, isfirst: false })
    } else {
      SARMap.draw()
      this.setState({ showADDPoint: false, isfirst: false })
    }
  }

  renderDioLog = () => {
    let img
    switch (this.state.dioLog) {
      case getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_NOFEATURE:
        img = getThemeAssets().ar.icon_tips_aim
        break
      case getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_FAST:
        img = getThemeAssets().ar.icon_tips_slow_down
        break
      case getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_DARK:
        img = getThemeAssets().ar.icon_tips_lighting
        break
      case getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_CLOSE:
        img = getThemeAssets().ar.icon_tips_approach
        break
      case getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_FAR:
        // 换为近一点图标 to do
        img = getThemeAssets().ar.icon_tips_move_away
        break
      default:
        img = getThemeAssets().ar.icon_tips_move_away
        break
    }
    return (
      <View style={[{
        position: 'absolute',
        top: scaleSize(300),
        borderRadius: 15,
        // opacity: 0.5,
        backgroundColor: '#464646',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        paddingLeft: scaleSize(10),
        paddingRight: scaleSize(10),
        zIndex: zIndexLevel.SYSTEM,
      }]}>
        <Image
          source={img}
          style={styles.dioimg}
        />
        <Text style={styles.dioLog}>
          {this.state.dioLog}
        </Text>
      </View>)
  }

  renderGeneralView() {
    return (
      <View
        ref={ref => this.moveView = ref}
        style={{
          position: 'absolute',
          top: scaleSize(400),
          width: scaleSize(250),
          height: scaleSize(250),
          borderRadius: scaleSize(4),
          backgroundColor: 'white',
          ...this._moveViewStyles.style,
        }}>
        <View
          style={{
            width: '100%',
            height: scaleSize(30),
            backgroundColor: 'transparent',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
          {...this._panResponder.panHandlers}
        >
          <View
            style={{
              height: scaleSize(8),
              width: scaleSize(60),
              borderRadius: scaleSize(4),
              backgroundColor: color.separateColorGray4,
            }}
          />
        </View>
        <SMMeasureARGeneraView />
      </View>
    )
  }

  //ar测图界面
  _renderMeasureAreaView = () => {
    if (
      // global.Type !== ChunkType.MAP_AR_MAPPING &&
      // global.Type !== ChunkType.MAP_AR_ANALYSIS &&
      // global.Type !== ChunkType.MAP_AR
      !this.isARModule() ||
      this.isExample
    ) return null
    return (
      <>
        <SMARMapView
          moduleId={this.getModueId()}
          customStyle={this.props.isAR ? undefined : styles.hidden}
          onLoad={this._onLoad}
          onSingleClick={async () => {
            if(AppToolBar.getCurrentOption() === undefined
              &&  (ToolbarModule.getParams().type === '' || ToolbarModule.getParams().type === undefined)
            ) {
              this.showFullMap(!this.fullMap)
            }
          }}
          onARElementTouch={async (element, childIndex) => {
            if (AppToolBar.getCurrentOption()?.key === 'AR_MAP_BROWSE_ELEMENT' && Platform.OS === 'android') {
              const element01 = AppToolBar.getData().selectARElement
              if(element01) {
                // 只有当点击对象与选择对象相同时，才显隐属性表
                if(element01.layerName === element.layerName && element01.id === element.id) {
                  const attributes = await SARMap.getShowAttribute(element01.layerName, element01.id)
                  AppToolBar.getProps().setPipeLineAttribute([])
                  if (attributes) {
                    const isShowAttribute = await SARMap.isShowAttribute(element01.layerName, element01.id)
                    if (isShowAttribute) {
                      SARMap.hideAttribute(element.layerName, element.id)
                    } else {
                      SARMap.showAttribute(element01.layerName, element01.id, attributes)
                    }
                  } else {
                    SARMap.showAttribute(element01.layerName, element01.id, null)
                  }
                }
              }

            } else if(AppToolBar.getCurrentOption() === undefined
              && (ToolbarModule.getParams().type === '' || ToolbarModule.getParams().type === undefined)
              && Platform.OS === 'android'
            )  {
              if( element.type === ARElementType.AR_IMAGE
                || element.type === ARElementType.AR_VIDEO
                // || element.type === ARElementType.AR_WEBVIEW
                || element.type === ARElementType.AR_TEXT
                || element.type === ARElementType.AR_BUBBLE_TEXT
                || element.type === ARElementType.AR_MODEL
                || element.type === ARElementType.AR_LINE
                || element.type === ARElementType.AR_MARKER_LINE
                // || element.type === ARElementType.AR_SAND_TABLE
              ) {
                // 获取已选择的属性
                const attributes = await SARMap.getShowAttribute(element.layerName, element.id)
                AppToolBar.getProps().changeShowAttributeElement(element)
                if (attributes) {
                // 当已选择的属性存在时
                  const isShowAttribute = await SARMap.isShowAttribute(element.layerName, element.id)
                  if (isShowAttribute) {
                  // 当已选择的属性存在且面板已显示时，关闭
                    SARMap.hideAttribute(element.layerName, element.id)
                  } else {
                  // 当已选择的属性存在且面板未显示时，显示
                    SARMap.showAttribute(element.layerName, element.id, attributes)
                  }
                } else {
                // 当没有已选择的属性时
                  SARMap.showAttribute(element.layerName, element.id, null)
                }
              }


            }
          }}
          onARElementSelect={async (element, childIndex) => {
            if (AppToolBar.getCurrentOption()?.key === 'AR_MAP_ATTRIBUTE_SELECTED') {
              if( element.type === ARElementType.AR_IMAGE
                || element.type === ARElementType.AR_VIDEO
                // || element.type === ARElementType.AR_WEBVIEW
                || element.type === ARElementType.AR_TEXT
                || element.type === ARElementType.AR_BUBBLE_TEXT
                || element.type === ARElementType.AR_MODEL
                || element.type === ARElementType.AR_LINE
                || element.type === ARElementType.AR_MARKER_LINE
                // || element.type === ARElementType.AR_SAND_TABLE
              ){
                // 在属性选择页面。选中对象后，跳转到属性编辑页面
                AppToolBar.addData({ selectARElement: element })
                AppToolBar.show('ARATTRIBUTE', 'AR_MAP_BROWSE_ELEMENT')
                const attributes = await SARMap.getShowAttribute(element.layerName, element.id)
                AppToolBar.getProps().setPipeLineAttribute([])
                if (attributes) {
                  const isShowAttribute = await SARMap.isShowAttribute(element.layerName, element.id)
                  if (isShowAttribute) {
                  // SARMap.hideAttribute(element.layerName, element.id)
                  } else {
                    SARMap.showAttribute(element.layerName, element.id, attributes)
                  }
                } else {
                  SARMap.showAttribute(element.layerName, element.id, null)
                }
              } else if(element.type === ARElementType.AR_SAND_TABLE) {
                AppToolBar.addData({ selectARElement: element })
                AppToolBar.show('ARATTRIBUTE', 'AR_MAP_BROWSE_ELEMENT')
              } else {
                // 不支持属性的对象
                Toast.show(getLanguage().CUR_ELE_NOT_SUPPORT_ATTRIBUTE)
                SARMap.clearSelection()
              }

            } else if (AppToolBar.getCurrentOption()?.key === 'AR_MAP_ANIMATION_HOME') {
              onAddARAnimation(element)
            } else if (element.type === ARElementType.AR_SAND_TABLE
              && (AppToolBar.getCurrentOption()?.key === 'AR_SAND_TABLE_CREATE'
                || AppToolBar.getCurrentOption()?.key === 'AR_SAND_TABLE_MODIFY'
              )) {
              AppToolBar.addData({ selectARElement: element, selectedChildIndex: childIndex })
              AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_EDIT')
            } else if(AppToolBar.getCurrentOption()?.key === 'AR_MAP_SELECT_ELEMENT') {
              if (element.type === ARElementType.AR_IMAGE
                || element.type === ARElementType.AR_VIDEO
                || element.type === ARElementType.AR_WEBVIEW
                || element.type === ARElementType.AR_TEXT
                || element.type === ARElementType.AR_BUBBLE_TEXT
                || element.type === ARElementType.AR_MODEL
                || element.type === ARElementType.AR_ALBUM
                || element.type === ARElementType.AR_BROCHOR
                || element.type === ARElementType.AR_VIDEO_ALBUM
                || element.type === ARElementType.AR_ATTRIBUTE_ALBUM
                || element.type === ARElementType.AR_SAND_TABLE
                || element.type === ARElementType.AR_ELEMENT_GROUP
                || element.type === ARElementType.AR_SAND_TABLE_ALBUM
                || element.type === ARElementType.AR_BAR_CHART
                || element.type === ARElementType.AR_PIE_CHART
              ) {
                const modelAnimations = await SARMap.getModelAnimation(element.layerName, element.id)
                let ownModelAnimation = false
                if(modelAnimations.length > 0) {
                  ownModelAnimation = true
                }
                AppToolBar.addData({selectARElement: element, ownModelAnimation})
                AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_ELEMENT')
              }
            }
          }}
          onARElementAdd={element => {
            AppToolBar.addData({addARElement: element})
            AppEvent.emitEvent('ar_map_on_add_element', element)
            if(element.type === ARElementType.AR_ATTRIBUTE_ALBUM || element.type === ARElementType.AR_BROCHOR || element.type === ARElementType.AR_ALBUM|| element.type === ARElementType.AR_VIDEO_ALBUM || element.type === ARElementType.AR_SAND_TABLE_ALBUM || element.type === ARElementType.AR_BAR_CHART || element.type === ARElementType.AR_PIE_CHART){
              if(AppToolBar.getData().isAlbumFirstAdd){
                AppToolBar.addData({selectARElement: element,isAlbumFirstAdd:false})
                AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_ELEMENT')
              }
            }
          }}
          onCalloutTouch={tag => {
            this.poiSearch.onPoiSelect(tag)
          }}
          onNaviLocationChange={(location, remian) => {
            this.arNavi.onLocationChange(remian)
          }}
          onAIRecognitionTouch={info => {
            ToolbarModule.getData()?.actions?.goToPreview?.([info])
          }}
          onImageTrackingResult={async (tag) => {
            // ar增强定位执行的回调函数
            await this.setState({ imageTrackingresultTag: tag })
            // 调用AREnhancePosition的startScan方法
            this.datumPointCalibration?.arEnhancePosition?.startScan()
            AppEvent.emitEvent('ar_tracking_image_result', {success: tag === 'ImageTracking success'})
          }
          }
          onARElementGeometryTouch={element => {
            // 点击矢量线和符号线的回调函数
            // if (AppToolBar.getCurrentOption()?.key === 'AR_MAP_SELECT_ELEMENT') {
            if (AppToolBar.getCurrentOption()?.key === 'AR_MAP_ANIMATION_HOME') {
              onAddARAnimation(element)
            } else if(AppToolBar.getCurrentOption()?.key === 'AR_MAP_SELECT_ELEMENT') {
              if (element.type === ARElementType.AR_LINE
                || element.type === ARElementType.AR_MARKER_LINE) {
                {
                  AppToolBar.addData({selectARElement: element})
                  AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_GEOMETRY')
                }
              }
            }
            // }
          }}
          onToast={(type) => {
            if(type === 0){
              Toast.show(getLanguage().THE_FIRST)
            }else{
              Toast.show(getLanguage().THE_LAST)
            }
          }}
        />
        {global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton && !this.props.showDatumPoint && this.renderHeader()}
        {global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton && !this.props.showDatumPoint && this.renderBottomBtns()}
        {global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton && this.state.showCurrentHeightView && !this.props.showDatumPoint && this.renderCurrentHeightChangeView()}
        {global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton && !this.state.showSwitch && this.state.showADDPoint && this.state.isnew && !this.state.isTrack && !this.props.showDatumPoint && this.renderADDPoint()}
        {global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton && this.state.showADD && this.state.isnew && !this.state.isTrack && !this.props.showDatumPoint && this.renderCenterBtn()}
        {global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton && !this.state.showSwitch && this.state.is_showLog && this.state.showLog && this.props.showARSceneNotify && !this.props.showDatumPoint && this.renderDioLog()}
        {global.Type === ChunkType.MAP_AR_MAPPING && this.state.showArMappingButton && this.state.showGenera && (this.isDrawing || this.isCollect) && !this.props.showDatumPoint && this.renderGeneralView()}
      </>
    )
  }

  renderCompass = () => {
    if (!this.props.isShowCompass) return null
    return (
      <CompassView
        style={{
          position: 'absolute',
          top: scaleSize(this.type === 'MAP_NAVIGATION' ? 300 : 180),
          left: scaleSize(10),
        }}
        orientation={this.props.device.orientation}
      />
    )
  }

  _renderPoiSearchView = () => {
    return (
      <ARPoiSearchView
        ref={ref => (this.poiSearch = ref)}
        toolbarVisible={this.state.showPoiSearch}
        visible={this.state.showPoiSearch}
        device={this.props.device}
      />
    )
  }

  _renderArNavigationView = () => {
    return (
      <ARNavigationView
        ref={ref => (this.arNavi = ref)}
        toolbarVisible={this.state.showNavigation}
        visible={this.state.showNavigation}
      />
    )
  }

  px=  (size:number) =>{
    return PixelRatio.getPixelSizeForLayoutSize(size)
  }

  getModueId = () => {
    switch(global.Type) {
      case ChunkType.MAP_EDIT:
        return 0x01
      case ChunkType.MAP_THEME:
        return 0x04
      case ChunkType.MAP_COLLECTION:
        return 0x08
      case ChunkType.MAP_AR:
      case ChunkType.MAP_AR_ANALYSIS:
      case ChunkType.MAP_AR_MAPPING:
        return 0x10
      case ChunkType.MAP_NAVIGATION:
        return 0x20
      case ChunkType.MAP_ANALYST:
        return 0x40
      case ChunkType.MAP_PLOTTING:
        return 0x80
      default:
        return undefined
    }
  }

  getInfoText = () => {
    try {

      if(this.props.isAR){
        return null
      }
      let isTianditu = false
      let isGaode  = false
      const length = this.props.layers.layers.length
      if(length == 0){
        return null
      }
      const layer = this.props.layers.layers[length - 1]
      const isBaseMap = LayerUtils.isBaseLayer(layer)
      if(!isBaseMap) {
        return null
      }

      const server = layer.datasourceServer || ""
      if(server.toLowerCase().indexOf("tianditu") !== -1) {
        isTianditu = true
      }else if(server.toLowerCase().indexOf("amap") !== -1){
        isGaode = true
      }

      let positionStyle = {}
      if(this.props.device.orientation.indexOf('PORTRAIT') >= 0) {
        if(this.state.isFull) {
          positionStyle = {
            bottom: scaleSize(100),
            right: scaleSize(22),
          }
        } else {
          positionStyle = {
            bottom: scaleSize(10),
            right: scaleSize(22),
          }
        }
      } else {
        if(this.state.isFull) {
          positionStyle = {
            bottom: scaleSize(10),
            right: scaleSize(110),
          }
        } else {
          positionStyle = {
            bottom: scaleSize(10),
            right: scaleSize(22),
          }
        }
      }

      let text = ""
      if(isTianditu) {
        text = "国家基础地理信息中心-GS(2022)3124号"
      }else if(isGaode){
        text = "高德软件-GS京(2022)1061号"
      }else{
        return null
      }

      return (
        <View
          style={[
            styles.bottomInfoTextContainer,
            positionStyle,
          ]}
        >
          <Text
            style={[styles.bottomInfoText]}
          >{text}</Text>
        </View>
      )
    } catch (error) {
      return null
    }
  }

  renderContainer = () => {
    const width = this.px(screen.getScreenWidth())
    return (
      <Container
        ref={ref => (this.container = ref)}
        showPointToast={true}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: this.state.mapTitle,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            // justifyContent: 'flex-start',
            // marginLeft: scaleSize(90),
            textAlign: 'left',
          },
          headerStyle: {
            right:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? scaleSize(96)
                : 0,
          },
          backAction: event => {
            // this.backPositon = {
            //   x: event?.nativeEvent.pageX,
            //   y: event?.nativeEvent.pageY,
            // }
            return this.back()
          },
          type: 'fix',
          headerCenter: this.renderSearchBar(),
          headerRight: this.renderHeaderRight(),
          isResponseHeader: true,
        }}
        bottomBar={
          // this.props.device.orientation.indexOf('LANDSCAPE') < 0 &&
          !this.isExample &&
          // !this.props.analyst.params &&
          this.renderToolBar()
        }
        bottomProps={{ type: 'fix' }}
        headStyle={this.isExample && { width: '100%' }}
      >
        {this.state.showMap && (
          <View style={[
            StyleSheet.absoluteFill,
            Platform.OS === 'android' &&
            (
              this.isARModule()
            ) &&
            this.props.isAR && { left: 9999,width:width ,height:width*0.666-this.px(50) },
          ]}>
            <SMMapView
              ref={ref => (global.mapView = ref)}
              moduleId={this.getModueId()}
              onGetInstance={this._onGetInstance}
            />
          </View>
        )}
        {this.renderCompass()}

        {this._renderMeasureAreaView()}
        {this._renderPoiSearchView()}
        {this._renderArNavigationView()}

        {(global.Type === ChunkType.MAP_AR_MAPPING ? !this.props.isAR : true) &&
          global.Type &&
          this.props.mapLegend[global.Type] &&
          this.props.mapLegend[global.Type].isShow &&
          !this.noLegend && (
          <RNLegendView
            setMapLegend={this.props.setMapLegend}
            legendSettings={this.props.mapLegend}
            device={this.props.device}
            language={this.props.language}
            ref={ref => (global.legend = ref)}
          />
        )}
        {global.Type === ChunkType.MAP_NAVIGATION &&
          this._renderFloorListView()}
        {global.Type === ChunkType.MAP_NAVIGATION && this._renderTrafficView()}


        {/* 是否使用了差分服务的定位状态提示 */}
        {/* {this.props?.peripheralDevice?.type === "bluetooth"
        && this.props?.essentialInfo?.userName !== ""
        && this.props.pointStateText !== ""
        && this._renderPositionStateView()
        } */}
        {this._renderPositionStateView()}

        {this._renderAIDetectChange()}
        <SurfaceView
          ref={ref => (global.MapSurfaceView = ref)}
          orientation={this.props.device.orientation}
        />
        {!(global.Type === ChunkType.MAP_AR_MAPPING || global.Type === ChunkType.MAP_AR || global.Type === ChunkType.MAP_AR_ANALYSIS ? this.props.isAR : this.state.showAIDetect) && this.renderMapController()}
        {global.Type === ChunkType.MAP_NAVIGATION &&
          this._renderIncrementRoad()}
        {this._renderMapSelectPoint()}
        {global.Type === ChunkType.MAP_NAVIGATION &&
          this._renderNavigationStartButton()}
        {global.Type === ChunkType.MAP_NAVIGATION &&
          this._renderNavigationStartHead()}
        {global.Type === ChunkType.MAP_NAVIGATION &&
          this._renderMapSelectPointButton()}
        {!this.isExample &&
          global.Type === ChunkType.MAP_NAVIGATION &&
          this._renderNavigationPoiView()}
        {!this.isExample &&
          global.Type === ChunkType.MAP_NAVIGATION &&
          !this.props.mapNavigation.isShow &&
          this.state.showIncrement &&
          this._renderNavigationIcon()}
        {/*{global.Type === ChunkType.MAP_NAVIGATION && this._renderLocationIcon()}*/}
        {!this.isExample &&
          this.props.analyst.params &&
          this.renderAnalystMapButtons()}
        {/*{!this.isExample && this.props.analyst.params && this.renderAnalystMapRecommend()}*/}
        {!this.isExample &&
          !this.props.analyst.params &&
          this.renderFunctionToolbar()}
        {
          // !this.isExample &&
          !this.props.analyst.params &&
          this.renderOverLayer()}
        {this.renderTool()}
        {!this.isExample &&
          this.props.analyst.params &&
          this.renderAnalystMapToolbar()}
        {this.state.measureShow &&
          !this.props.analyst.params &&
          this.renderMeasureLabel()}
        {!this.isExample &&
          this.isARModule() &&
          this.state.showArModeIcon &&
          this._renderArModeIcon()}
        {!this.isExample && this.props.showSampleData && this._renderSampleData()}
        {/*{!this.isExample && this.renderMapNavIcon()}*/}
        {/*{!this.isExample && this.renderMapNavMenu()}*/}
        {!(global.Type === ChunkType.MAP_AR_MAPPING ? this.props.isAR : this.state.showAIDetect) && this.state.showScaleView && (
          <ScaleView
            mapNavigation={this.props.mapNavigation}
            device={this.props.device}
            language={this.props.language}
            isShow={this.props.mapScaleView}
            ref={ref => (global.scaleView = ref)}
          />
        )}
        <BubblePane ref={ref => (global.bubblePane = ref)} maxSize={1} />
        <PopModal ref={ref => (this.popModal = ref)}>
          {this.renderEditControllerView()}
        </PopModal>
        {this.renderPrjDialog()}
        <Dialog
          ref={ref => (global.removeObjectDialog = ref)}
          type={Dialog.Type.MODAL}
          info={getLanguage(this.props.language).Prompt.DELETE_OBJECT}
          confirmAction={this.removeObject}
          opacityStyle={styles.dialogStyle}
          confirmBtnTitle={getLanguage(this.props.language).Prompt.DELETE}
          cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        />
        <PoiTopSearchBar
          device={this.props.device}
          ref={ref => (global.PoiTopSearchBar = ref)}
          setMapNavigation={this.props.setMapNavigation}
          navigation={this.props.navigation}
        />
        <PoiInfoContainer
          setLoading={this.setLoading}
          getSearchClickedInfo={this.getSearchClickedInfo}
          getNavigationDatas={this.getNavigationDatas}
          changeNavPathInfo={this.changeNavPathInfo}
          ref={ref => (global.PoiInfoContainer = ref)}
          mapSearchHistory={this.props.mapSearchHistory}
          setMapSearchHistory={this.props.setMapSearchHistory}
          device={this.props.device}
          setMapNavigation={this.props.setMapNavigation}
          setNavigationPoiView={this.props.setNavigationPoiView}
          setNavigationChangeAR={this.props.setNavigationChangeAR}
        />
        {global.Type === ChunkType.MAP_THEME && this.renderPreviewHeader()}
        {global.coworkMode && this.state.onlineCowork && (
          <NewMessageIcon ref={ref => (this.NewMessageIcon = ref)} />
        )}
        {global.Type === ChunkType.MAP_NAVIGATION && (
          <Dialog
            ref={ref => (global.NavDialog = ref)}
            confirmAction={this._onlineRouteAnylystConfirm}
            opacity={1}
            opacityStyle={styles.dialogBackground}
            style={styles.dialogBackground}
            confirmBtnTitle={getLanguage(global.language).Prompt.YES}
            cancelBtnTitle={getLanguage(global.language).Prompt.NO}
          >
            <View style={styles.dialogHeaderView}>
              <Image
                source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
                style={styles.dialogHeaderImg}
              />
              <Text style={styles.promptTitleSmallText}>
                {getLanguage(global.language).Prompt.USE_ONLINE_ROUTE_ANALYST}
              </Text>
            </View>
          </Dialog>
        )}
        {global.Type === ChunkType.MAP_NAVIGATION && (
          <Dialog
            ref={ref => (global.changeRouteDialog = ref)}
            confirmAction={this._changeNavRoute}
            cancelAction={this._changeRouteCancel}
            opacity={1}
            opacityStyle={styles.dialogOneLine}
            style={styles.dialogOneLine}
            confirmBtnTitle={getLanguage(global.language).Prompt.YES}
            cancelBtnTitle={getLanguage(global.language).Prompt.NO}
          >
            <View style={styles.dialogHeaderView}>
              <Image
                source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
                style={styles.dialogHeaderImg}
              />
              <Text style={styles.promptTitle}>
                {global.CURRENT_NAV_MODE === 'INDOOR'
                  ? getLanguage(global.language).Prompt.CHANGE_TO_OUTDOOR
                  : getLanguage(global.language).Prompt.CHANGE_TO_INDOOR}
              </Text>
            </View>
          </Dialog>
        )}
        {this.renderMessageMenu()}
        {this.renderBackgroundOverlay()}
        {this.renderCustomInputDialog()}
        {this.renderCustomAlertDialog()}
        {this.getInfoText()}

        <Toolbar
          navigation={this.props.navigation}
          visibleChange={visible => {
            this.showFullMap(visible)
          }}
          extraModule={this.toolbarModuleData}
        />
      </Container>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderContainer()}
        {this.renderProgress()}
        {global.Type === ChunkType.MAP_NAVIGATION &&
          this.renderIncrementDialog()}
        {/* {!this.props.currentGroup.id&&(global.Type === ChunkType.MAP_AR)&&this.props.mapArGuide&&this.renderMapArGuideView()} */}
        {/* {!this.props.currentGroup.id&&(global.Type === ChunkType.MAP_AR_MAPPING)&&this.props.mapArMappingGuide && this.renderMapArMappingGuideView()} */}
        {/* {!this.props.currentGroup.id&&(global.Type === ChunkType.MAP_ANALYST)&&this.props.mapAnalystGuide && this.renderMapAnalystGuideView()} */}
        {!this.props.currentGroup.id && (global.Type === ChunkType.MAP_THEME) && this.props.themeGuide && this.renderMapThemeGuideView()}
        {!this.props.currentGroup.id && (global.Type === ChunkType.MAP_COLLECTION) && this.props.collectGuide && this.renderMapCollectGuideView()}
        {!this.props.currentGroup.id && (global.Type === ChunkType.MAP_EDIT) && this.props.mapEditGuide && this.renderMapEditGuideView()}
        {this.props.showDatumPoint && <DatumPointCalibration
          onClose={this._onDatumPointClose}
          onConfirm={this._onDatumPointConfirm}
        />}
        {this._renderExitSaveView()}
      </View>
    )
  }
}