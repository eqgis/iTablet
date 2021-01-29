/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

/*global GLOBAL*/
import * as React from 'react'
import {
  SMMapView,
  Action,
  SMap,
  SScene,
  SCollector,
  EngineType,
  SMediaCollector,
  SMAIDetectView,
  SAIDetectView,
  SSpeechRecognizer,
} from 'imobile_for_reactnative'
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
} from '../../components'
import ToolbarModule from '../../components/ToolBar/modules/ToolbarModule'
import { shareModule } from '../../components/ToolBar/modules'
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
} from '../../../../utils'
import { color } from '../../../../styles'
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
  AppState,
} from 'react-native'
import { getLanguage } from '../../../../language/index'
import styles from './styles'
// import { Analyst_Types } from '../../../analystView/AnalystType'
import Orientation from 'react-native-orientation'
import IncrementData from '../../components/ToolBar/modules/incrementModule/IncrementData'
import NewMessageIcon from '../../../../containers/tabs/Friend/Cowork/NewMessageIcon'
import CoworkInfo from '../../../../containers/tabs/Friend/Cowork/CoworkInfo'
import { BackHandlerUtil } from '../../util'
import { Bar } from 'react-native-progress'
import GuideViewMapArModel from '../../components/GuideViewMapArModel'
import GuideViewMapArMappingModel from '../../components/GuideViewMapArMappingModel'
import GuideViewMapAnalystModel from '../../components/GuideViewMapAnalystModel'

GLOBAL.markerTag = 118082

export default class MapView extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    nav: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    analystLayer: PropTypes.object,
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

    isClassifyView: PropTypes.bool,
    mapArGuide: PropTypes.bool,
    mapArMappingGuide: PropTypes.bool,
    mapAnalystGuide: PropTypes.bool,

    coworkInfo: PropTypes.object,
    currentTask: PropTypes.object,
    coworkMessages: PropTypes.object,

    setNavBarDisplay: PropTypes.func,
    setEditLayer: PropTypes.func,
    setSelection: PropTypes.func,
    setLatestMap: PropTypes.func,
    setCurrentMap: PropTypes.func,
    setBufferSetting: PropTypes.func,
    setOverlaySetting: PropTypes.func,
    setAnalystLayer: PropTypes.func,
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
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    if (!params) {
      let parent = this.props.navigation.dangerouslyGetParent()
      params = parent.state.key === 'CoworkMapStack' && parent.state.params
    }
    /** 模块类型 */
    this.type = (params && params.type) || GLOBAL.Type || 'LOCAL'
    /** 为true则仅显示地图，不显示其他UI控件 */
    this.isExample = (params && params.isExample) || false
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

    this.path = (params && params.path) || ''
    this.showDialogCaption =
      params && params.path ? !params.path.endsWith('.smwu') : true
    /** 自定义返回事件 */
    this.backAction = (params && params.backAction) || null
    this.state = {
      showMap: false, // 控制地图初始化显示
      data: params ? params.data : [],
      popShow: false, //  一级popView显示控制
      popType: '',
      mapTitle: this.mapTitle,
      // wsName: wsName,
      measureShow: false,
      measureResult: 0,
      editLayer: {},
      showMapMenu: false,
      // changeLayerBtnBottom: scaleSize(200),
      canBeUndo: false,
      canBeRedo: false,
      showAIDetect:
        GLOBAL.Type === ChunkType.MAP_AR ||
        GLOBAL.Type === ChunkType.MAP_AR_ANALYSIS ||
        GLOBAL.Type === ChunkType.MAP_AR_MAPPING,
      bGoneAIDetect: false,
      showRoadView: true,
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
    }
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
    GLOBAL.showAIDetect = this.state.showAIDetect
    this.lastClickTime = 0
    //  导航选中的数据
    this.selectedData = {
      selectedDatasources: [], //选中的数据源
      selectedDatasets: [], //选中的数据集
      currentDatasource: [], //当前使用的数据源
      currentDataset: {}, //当前使用的数据集
    }
    this.floorHiddenListener = null
    GLOBAL.clickWait = false // 防止重复点击，该页面用于关闭地图方法
    AppState.addEventListener('change', this.handleStateChange)
  }

  handleStateChange = async appState => {
    if (Platform.OS === 'android') {
      if (!this.props.isClassifyView) {
        if (appState === 'background') {
          SAIDetectView.onPause()
        }

        if (appState === 'active') {
          SAIDetectView.onResume()
        }
      }
    }
  }

  /** 添加楼层显隐监听 */
  addFloorHiddenListener = () => {
    this.floorHiddenListener = SMap.addFloorHiddenListener(async result => {
      //在选点过程中/路径分析界面 不允许拖放改变FloorList、MapController的状态
      // 使用this.currentFloorID 使ID发生变化时只渲染一次
      if (
        result.currentFloorID !== this.currentFloorID /*&&*/
        // !(
        //   // (GLOBAL.MAPSELECTPOINTBUTTON &&
        //   //   GLOBAL.MAPSELECTPOINTBUTTON.state.show) ||
        //   (GLOBAL.NAVIGATIONSTARTHEAD &&
        //     GLOBAL.NAVIGATIONSTARTHEAD.state.show) ||
        //   GLOBAL.PoiTopSearchBar.state.visible
        // )
      ) {
        this.currentFloorID = result.currentFloorID
        let guideInfo = await SMap.isGuiding()
        if (!guideInfo.isOutdoorGuiding) {
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
    if (!GLOBAL.isLicenseValid) {
      let licenseStatus = await SMap.getEnvironmentStatus()
      GLOBAL.isLicenseValid = licenseStatus.isLicenseValid
    }

    BackHandler.addEventListener('hardwareBackPress', this.backHandler)

    if (GLOBAL.isLicenseValid) {
      if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
        this.addFloorHiddenListener()
        SMap.setIndustryNavigationListener({
          callback: async () => {
            if (
              GLOBAL.NAV_PARAMS &&
              GLOBAL.NAV_PARAMS.filter(item => !item.hasNaved).length > 0
            ) {
              GLOBAL.changeRouteDialog &&
                GLOBAL.changeRouteDialog.setDialogVisible(true)
            } else {
              this._changeRouteCancel()
            }
          },
        })
        SMap.setStopNavigationListener({
          callback: this._changeRouteCancel,
        })
      }
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.LOADING,
          //'地图加载中'
        )
      // 动画导致有时不会进入InteractionManager
      // InteractionManager.runAfterInteractions(() => {
      GLOBAL.SaveMapView &&
        GLOBAL.SaveMapView.setTitle(
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

      SMediaCollector.setCalloutTapListener(info => {
        NavigationService.navigate('MediaEdit', {
          info,
        })
      })

      this.clearData()
      if (this.toolBox) {
        GLOBAL.toolBox = this.toolBox
      }
      // })

      this.unsubscribeFocus = this.props.navigation.addListener(
        'willFocus',
        () => {
          if (this.showFullonBlur) {
            this.showFullMap(false)
            this.showFullonBlur = false
          }
          this.backgroundOverlay && this.backgroundOverlay.setVisible(false)
        },
      )

      //跳转回mapview速度太快时会来不及触发willFocus，在didFocus时重复处理相关逻辑
      this.unsubscribeDidFocus = this.props.navigation.addListener(
        'didFocus',
        () => {
          if (this.showFullonBlur) {
            this.showFullMap(false)
            this.showFullonBlur = false
          }
          this.backgroundOverlay && this.backgroundOverlay.setVisible(false)
        },
      )

      this.unsubscribeBlur = this.props.navigation.addListener(
        'willBlur',
        () => {
          if (!this.fullMap) {
            this.showFullMap(true)
            this.showFullonBlur = true
          }
          this.backgroundOverlay && this.backgroundOverlay.setVisible(true)
        },
      )
      SMap.addMessageCalloutListener(this.onMessageCalloutTap)
      this.addSpeechRecognizeListener()
      if (GLOBAL.language === 'CN') {
        SSpeechRecognizer.setParameter('language', 'zh_cn')
      } else {
        SSpeechRecognizer.setParameter('language', 'en_us ')
      }
    } else {
      GLOBAL.SimpleDialog.set({
        text: getLanguage(GLOBAL.language).Prompt.APPLY_LICENSE_FIRST,
        confirmAction: () => NavigationService.goBack(),
        cancelAction: () => NavigationService.goBack(),
      })
      GLOBAL.SimpleDialog.setVisible(true)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.mapNavigation) !==
      JSON.stringify(this.props.mapNavigation)
    ) {
      this.showFullMap(this.props.mapNavigation.isShow)
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
      GLOBAL.currentLayer = this.props.currentLayer
    }

    // 防止Toolbar被销毁后，再次添加Toolbar，修改其state失败
    if (this.toolBox) {
      GLOBAL.toolBox = this.toolBox
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
              GLOBAL.TouchType = TouchType.NULL //进入分析页面，触摸事件默认为空
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
      this.container && this.container.setHeaderVisible(true)
      this.container && this.container.setBottomVisible(true)
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
        // if (this.props.downloads[i].id === GLOBAL.Type) {
        if (
          this.props.downloads[i].id &&
          this.props.downloads[i].params.module === GLOBAL.Type
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

    if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
      (async function () {
        let currentFloorID = await SMap.getCurrentFloorID()
        this.changeFloorID(currentFloorID, () => {
          let { params } = this.props.navigation.state
          let preParams = prevProps.navigation.state.params
          if (params.hideMapController && !preParams.hideMapController) {
            this.mapController && this.mapController.setVisible(false)
          }
        })
      }.bind(this)())
    }

    // 地图选点组件MapSelectPoint
    // 当导航到MapView时，传递过来的props中的selectPointType和state中的不一致时，更新state中的selectPointType
    // MapSelectPoint根据selectPointType显示
    if (
      this.props.nav.routes[this.props.nav.index].routeName === 'MapStack' &&
      prevProps.nav.routes && this.props.nav.routes && prevProps.nav.routes[prevProps.nav.index].key !== this.props.nav.routes[this.props.nav.index].key &&
      (
        prevProps.navigation.state.params.selectPointType !== this.props.navigation.state.params.selectPointType ||
        this.state.selectPointType !== this.props.navigation.state.params.selectPointType
      )
    ) {
      this.setState({
        selectPointType: this.props.navigation.state.params.selectPointType,
      })
    }
  }

  componentWillUnmount() {
    GLOBAL.clickWait = false // MapView Unmount后将GLOBAL.clickWait设置为false，防止多次返回或返回到首页后闪现保存提示框
    SMap.setCurrentModule(0)
    if (
      GLOBAL.Type === ChunkType.MAP_AR ||
      GLOBAL.Type === ChunkType.MAP_AR_ANALYSIS ||
      GLOBAL.Type === ChunkType.MAP_AR_MAPPING
    ) {
      Orientation.unlockAllOrientations()
    }
    if (GLOBAL.Type === ChunkType.MAP_AR_ANALYSIS) {
      (async function () {
        SAIDetectView.dispose()
      })()
    }
    if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
      (async function () {
        SMap.destroySpeakPlugin()
      })()
    }
    //unmount时置空 zhangxt
    GLOBAL.Type = null
    if (this.floorHiddenListener) {
      this.floorHiddenListener.remove()
    }
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.navigation.state.routeName,
      })
    }
    // this.props.setMapLegend(false)

    // 移除多媒体采集监听
    SMediaCollector.removeListener()
    // 移除协作消息点击监听
    SMap.removeMessageCalloutListener()

    // 移除多媒体采集Callout
    GLOBAL.mapView && SMediaCollector.removeMedias()

    this.showMarker && SMap.deleteMarker(GLOBAL.markerTag)

    if (GLOBAL.MapTabNavigator) {
      GLOBAL.MapTabNavigator = null
    }
    this.unsubscribeFocus && this.unsubscribeFocus.remove()
    this.unsubscribeFocus && this.unsubscribeBlur.remove()
    this.unsubscribeDidFocus && this.unsubscribeDidFocus.remove()
    //移除手势监听
    GLOBAL.mapView && SMap.deleteGestureDetector()

    BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
    AppState.removeEventListener('change', this.handleStateChange)
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
        let error = getLanguage(GLOBAL.language).Prompt.SPEECH_ERROR
        if (e.indexOf('没有说话') !== -1) {
          error = getLanguage(GLOBAL.language).Prompt.SPEECH_NONE
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
                  if (GLOBAL.Type === ChunkType.MAP_3D) {
                    await SScene.setHeading()
                    // 定位到当前位置
                    await SScene.location()
                    // await SScene.resetCamera()
                    this.mapController.setCompass(0)
                  } else {
                    SMap.moveToCurrent().then(result => {
                      !result &&
                        Toast.show(
                          getLanguage(GLOBAL.language).Prompt.OUT_OF_MAP_BOUNDS,
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
    GLOBAL.changeRouteDialog.setDialogVisible(false)
    this.setLoading(true, getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING)
    let curNavInfos = GLOBAL.NAV_PARAMS.filter(item => !item.hasNaved)
    let guideLines = GLOBAL.NAV_PARAMS.filter(item => item.hasNaved)
    await SMap.clearPath()
    let params = JSON.parse(JSON.stringify(curNavInfos[0]))
    params.hasNaved = true
    let {
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
        await SMap.getStartPoint(startX, startY, true, startFloor)
        await SMap.getEndPoint(endX, endY, true, endFloor)
        await SMap.startIndoorNavigation(datasourceName)
        let rel = await SMap.beginIndoorNavigation()
        if (!rel) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
          this.changeNavPathInfo({ path: '', pathLength: '' })
          this.setLoading(false)
          this._changeRouteCancel()
          return
        }
        for (let item of guideLines) {
          await SMap.addLineOnTrackingLayer(
            { x: item.startX, y: item.startY },
            { x: item.endX, y: item.endY },
          )
        }
        await SMap.indoorNavigation(1)
        this.FloorListView?.setVisible(true)
        GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
      } else {
        await SMap.startNavigation(params)
        let result = await SMap.beginNavigation(startX, startY, endX, endY)
        if (result) {
          for (let item of guideLines) {
            await SMap.addLineOnTrackingLayer(
              { x: item.startX, y: item.startY },
              { x: item.endX, y: item.endY },
            )
          }
          await SMap.outdoorNavigation(1)
          this.FloorListView?.setVisible(false)
          SMap.setCurrentFloorID('')
          GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
        } else {
          Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
          this.changeNavPathInfo({ path: '', pathLength: '' })
          this.setLoading(false)
          this._changeRouteCancel()
          return
        }
      }
    } catch (e) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
      this.changeNavPathInfo({ path: '', pathLength: '' })
      this.setLoading(false)
      this._changeRouteCancel()
      return
    }
    curNavInfos[0] = params
    GLOBAL.NAV_PARAMS = guideLines.concat(curNavInfos)
    this.changeNavPathInfo({ path: '', pathLength: '' })
    this.setLoading(false)
  }
  /** 取消切换，结束室内外一体化导航 清除所有导航信息 */
  _changeRouteCancel = () => {
    SMap.clearPoint()
    this.showFullMap(false)
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.STARTX = undefined
    GLOBAL.STARTY = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ENDY = undefined
    GLOBAL.TouchType = TouchType.NORMAL
    GLOBAL.CURRENT_NAV_MODE = ''
    GLOBAL.NAV_PARAMS = []
    GLOBAL.STARTNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_START_POINT
    GLOBAL.ENDNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    if (GLOBAL.mapController) {
      GLOBAL.mapController.reset()
      GLOBAL.mapController.setGuiding(false)
    }
    if (GLOBAL.FloorListView) {
      GLOBAL.FloorListView.changeBottom(false)
      GLOBAL.FloorListView.setGuiding(false)
      GLOBAL.FloorListView.setVisible(true)
    }
  }

  /** 检测MapView在router中是否唯一 **/
  checkMapViewIsUnique = () => {
    let mapViewNums = 0
    if (this.props.nav.routes) {
      for (let i = 0; i < this.props.nav.routes.length; i++) {
        if (
          this.props.nav.routes[i].routeName === 'MapView' ||
          this.props.nav.routes[i].routeName === 'MapTabs'
        ) {
          mapViewNums++
        }
      }
    } else {
      mapViewNums++
    }

    let current = this.props.nav.routes[this.props.nav.routes.length - 1]

    return (
      mapViewNums === 1 &&
      (current.routeName === 'MapView' || current.routeName === 'MapTabs')
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
    this.props.setBufferSetting(null)
    this.props.setOverlaySetting(null)
    this.props.setAnalystLayer(null)
    this.props.setCollectionInfo() // 置空Redux中Collection中的数据
    this.props.setCurrentTemplateInfo() // 清空当前模板
    this.props.setCurrentPlotInfo() //清空当前模板
    this.props.setTemplate() // 清空模板
  }

  closeWorkspace = (cb = () => { }) => {
    if (!this.map || !this.mapControl || !this.workspace) return
    this.saveLatest(
      async function () {
        this.setLoading(true, '正在关闭', { bgColor: 'white' })
        this.clearData()
        this._removeGeometrySelectedListener()
        this.setLoading(false)
        cb && cb()
      }.bind(this),
    )
  }

  saveLatest = (cb = () => { }) => {
    if (this.isExample) {
      cb()
      return
    }
    try {
      this.mapControl &&
        this.mapControl
          .outputMap({ mapView: this.mapView })
          .then(({ result, uri }) => {
            if (result) {
              this.props.setLatestMap(
                {
                  path: (this.DSParams && this.DSParams.server) || this.path,
                  type: this.type,
                  name: this.mapTitle,
                  image: uri,
                  DSParams: this.DSParams,
                  labelDSParams: this.labelDSParams,
                  layerIndex: this.layerIndex,
                  mapTitle: this.mapTitle,
                },
                cb,
              )
            }
          })
    } catch (e) {
      Toast.show('保存失败')
    }
  }

  /** 原生mapview加载完成回调 */
  _onGetInstance = async mapView => {
    this.mapView = mapView
    this._addMap()
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
          ids: [event.id],
        },
      ])
    let currentToolbarType = ToolbarModule.getData().type
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.geometrySelected
    ) {
      ToolbarModule.getData().actions.geometrySelected(event)
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
    let data = []
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

    let currentToolbarType = ToolbarModule.getData().type
    switch (currentToolbarType) {
      case ConstToolType.SM_MAP_TOOL_SELECT_BY_RECTANGLE:
        SMap.setAction(Action.PAN)
        break
    }
  }

  /** 触摸事件监听 **/
  _addGeometrySelectedListener = async () => {
    await SMap.addGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  /** 移除触摸事件监听 */
  _removeGeometrySelectedListener = async () => {
    await SMap.removeGeometrySelectedListener()
  }

  /** 移除导航相关监听（楼层控件） */
  _removeNavigationListeners = async () => {
    let listeners = []
    if (this.TrafficView && this.TrafficView.listener) {
      listeners.push(this.TrafficView.listener)
    }
    if (this.FloorListView && this.FloorListView.listener) {
      listeners.push(this.FloorListView.listener)
    }
    await SMap.removeFloorHiddenListener(listeners)
  }

  /** 地图保存 */
  saveMap = async () => {
    try {
      if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
        //这里先处理下异常 add xiezhy
        try {
          await SMap.stopGuide()
          await SMap.clearPoint()
        } catch (e) {
          this.setLoading(false)
        }
      }
      let mapName = ''
      if (this.props.map.currentMap.name) {
        // 获取当前打开的地图xml的名称
        mapName = this.props.map.currentMap.name
        mapName =
          mapName.substr(0, mapName.lastIndexOf('.')) ||
          this.props.map.currentMap.name
      } else {
        let mapInfo = await SMap.getMapInfo()
        if (mapInfo && mapInfo.name) {
          // 获取MapControl中的地图名称
          mapName = mapInfo.name
        } else if (this.props.layers.length > 0) {
          // 获取数据源名称作为地图名称
          mapName = this.props.collection.datasourceName
        }
      }
      let addition = {}
      if (this.props.map.currentMap.Template) {
        addition.Template = this.props.map.currentMap.Template
      }

      this.setLoading(true, getLanguage(this.props.language).Prompt.SAVING)
      // 导出(保存)工作空间中地图到模块
      let result = await this.props.saveMap({ mapTitle: mapName, nModule: '', addition })
      if (result || result === '') {
        this.setLoading(false)
        Toast.show(
          result
            ? getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
            : getLanguage(this.props.language).Prompt.SAVE_FAILED,
        )
        return true
      } else {
        this.setSaveMapViewLoading(false)
        return false
      }
    } catch (e) {
      GLOBAL.clickWait = false
      this.setLoading(false)
    }
  }

  /** 关闭地图，并返回首页 **/
  closeMapHandler = async () => {
    try {
      this.setLoading(true, getLanguage(this.props.language).Prompt.CLOSING)
      await this.props.closeMap()
      await this._removeGeometrySelectedListener()
      await this.props.setCurrentAttribute({})
      // this.setState({ showScaleView: false })
      //此处置空unmount内的判断会失效 zhangxt
      // GLOBAL.Type = null
      GLOBAL.clearMapData()

      // 移除协作时，个人/新操作的callout
      await SMap.removeUserCallout()
      await SMap.clearUserTrack()

      this.setLoading(false)
      if (GLOBAL.coworkMode) {
        GLOBAL.coworkMode = false
        GLOBAL.getFriend().setCurMod(undefined)
        // NavigationService.goBack('CoworkTabs')
      }
      NavigationService.goBack()
      // GLOBAL.clickWait = false
    } catch (e) {
      GLOBAL.clickWait = false
      this.setLoading(false)
    }
  }

  // 删除图层中指定对象
  removeObject = () => {
    (async function () {
      try {
        if (!this.props.selection || !this.props.selection.length === 0) return

        let result = true
        //使用for循环等待，在forEach里await没有用
        for(let i = 0; i < this.props.selection.length; i++) {
          let item = this.props.selection[i]
          if (item.ids.length > 0) {
            result =
              result &&
              (await SCollector.removeByIds(item.ids, item.layerInfo.path))
            result = result && (await SMediaCollector.removeByIds(item.ids, item.layerInfo.name))
          }
        }

        if (result) {
          Toast.show(getLanguage(this.props.language).Prompt.DELETED_SUCCESS)
          this.props.setSelection && this.props.setSelection()
          SMap.setAction(Action.SELECT)
          let preType = ToolbarModule.getParams().type
          let type =
            preType.indexOf('MAP_TOPO_') > -1
              ? ConstToolType.SM_MAP_TOPO_EDIT
              : ConstToolType.SM_MAP_EDIT
          // 删除对象后，编辑设为为选择状态
          this.toolBox.setVisible(true, type, {
            isFullScreen: false,
            height: 0,
          })
        } else {
          Toast.show(getLanguage(GLOBAL.language).Prompt.FAILED_TO_DELETE)
        }
        GLOBAL.removeObjectDialog &&
          GLOBAL.removeObjectDialog.setDialogVisible(false)
      } catch (e) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.FAILED_TO_DELETE)
      }
    }.bind(this)())
  }

  /** 处理android系统返回键 */
  backHandler = () => {
    return BackHandlerUtil.backHandler(this.props.nav, this.props.backActions)
  }

  /** 返回事件 */
  back = async () => {
    try {
      if (!this.state.mapLoaded) return
      // 最顶层的语音搜索，最先处理
      if (Audio.isShow()) {
        Audio.hideAudio()
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
        if (this.toolBox && this.toolBox.getState().isShow) {
          this.toolBox.buttonView.close()
          return true
        }
        // 删除对象Dialog显示时，返回事件关闭Dialog
        else if (
          GLOBAL.removeObjectDialog &&
          GLOBAL.removeObjectDialog.getState().visible
        ) {
          GLOBAL.removeObjectDialog.setDialogVisible(false)
          return true
        }
      }

      if (GLOBAL.clickWait) return true
      GLOBAL.clickWait = true
      let result = await SMap.mapIsModified()
      if (result && !this.isExample) {
        this.setSaveViewVisible(true, null, async () => {
          this.props.setCurrentAttribute({})
          // this.setState({ showScaleView: false })
          this._removeGeometrySelectedListener()
          if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
            this._removeNavigationListeners()
          }
          await this.closeMapHandler()
          GLOBAL.clickWait = false
        })
      } else {
        try {
          this.setLoading(true, getLanguage(this.props.language).Prompt.CLOSING)
          if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
            this._removeNavigationListeners().then(() => {
              SMap.clearPoint()
              SMap.stopGuide()
            })
          }
          await this.closeMapHandler()
        } catch (e) {
          GLOBAL.clickWait = false
          this.setLoading(false)
        }
      }
      return true
    } catch (e) {
      GLOBAL.clickWait = false
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
        let hasMap = false // 判断是否打开了地图，若打开了地图，加载完成后先保存在MapControl中
        if (this.wsData) {
          if (this.wsData instanceof Array) {
            for (let i = 0; i < this.wsData.length; i++) {
              let item = this.wsData[i]
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
                await this._openMap(this.wsData[i])
                hasMap = true
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
              await this._openMap(this.wsData)
              hasMap = true
            }
            // else if (this.wsData.type === 'LastMap') {
            //   // 打开最近地图
            //   // this.toolBox && this.toolBox.changeMap(this.wsData.DSParams)
            //   await this._openLatestMap(this.wsData.DSParams)
            // }
          }
        } else {
          // 若无参数，打开默认工作空间。分析模块使用
          let homePath = await FileTools.appendingHomeDirectory()
          let userPath = ConstPath.CustomerPath
          if (
            this.props.user.currentUser &&
            this.props.user.currentUser.userName
          ) {
            userPath =
              ConstPath.UserPath + this.props.user.currentUser.userName + '/'
          }
          let wsPath =
            homePath +
            userPath +
            ConstPath.RelativeFilePath.Workspace[
              GLOBAL.language === 'CN' ? 'CN' : 'EN'
            ]
          await this._openWorkspace({
            DSParams: { server: wsPath },
          })
        }
        //没有打开地图，默认加载以“DefaultMapLib"为名的符号库
        if (!hasMap) {
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
          await SMap.importSymbolLibrary('DefaultMapLib', fillLibPath) // 导入面符号库
          await SMap.importSymbolLibrary('DefaultMapLib', lineLibPath) // 导入线符号库
          await SMap.importSymbolLibrary('DefaultMapLib', markerLibPath) // 导入点符号库
        }
        if (GLOBAL.Type === ChunkType.MAP_PLOTTING) {
          this.setLoading(
            true,
            //ConstInfo.TEMPLATE_READING
            getLanguage(this.props.language).Prompt.READING_TEMPLATE,
          )
          let plotIconPath = await FileTools.appendingHomeDirectory(
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

        // GLOBAL.Type === ChunkType.MAP_COLLECTION && this.initCollectorDatasource()
        // 获取图层列表
        this.props.getLayers(
          { type: -1, currentLayerIndex: 0 },
          async layers => {
            if (!this.wsData) return
            // 若数据源已经打开，图层未加载，则去默认加载一个图层
            if (layers.length === 0) {
              let result = false
              if (this.wsData instanceof Array) {
                for (let i = 0; i < this.wsData.length; i++) {
                  let item = this.wsData[i]
                  if (item === null) continue
                  if (item.type === 'Datasource') {
                    result = await SMap.addLayer(item.DSParams.alias, 0)
                  }
                }
              } else if (this.wsData.type === 'Datasource') {
                result = await SMap.addLayer(this.wsData.DSParams.alias, 0)
              }
              result && this.props.getLayers()
            }
            if (layers.length === 0 && this.wsData.DSParams) {
              SMap.addLayer(this.wsData.DSParams.alias, 0).then(result => {
                result && this.props.getLayers()
              })
            }
          },
        )

        this._addGeometrySelectedListener()

        setGestureDetectorListener({
          getNavigationDatas: this.getNavigationDatas,
          ...this.props,
        })
        GLOBAL.TouchType = TouchType.NORMAL

        await SMap.setLabelColor()
        // 示例地图不加载标注图层
        if (!this.isExample) {
          await SMap.openTaggingDataset(this.props.user.currentUser.userName)
          let hasDefaultTagging = await SMap.hasDefaultTagging(
            this.props.user.currentUser.userName,
          )
          if (!hasDefaultTagging) {
            await SMap.newTaggingDataset(
              'Default_Tagging',
              this.props.user.currentUser.userName,
            )
          }
          let layer = await SMap.getCurrentTaggingLayer(
            this.props.user.currentUser.userName,
          )
          if (layer) {
            layer.isEdit = await SMap.setLayerEditable(layer.name, true)
            layer.isVisible = await SMap.setLayerVisible(layer.name, true)
            this.props.setCurrentLayer(layer)

            if (hasMap) await SMap.saveMap('', false, false)
            // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
            let dataList = await SMap.getTaggingLayers(
              this.props.user.currentUser.userName,
            )
            dataList.forEach(item => {
              if (item.isVisible) {
                SMediaCollector.showMedia(item.name, false)
              }
            })
          }
        }

        SMap.setDynamicviewsetVisible(true)
        this.showMarker &&
          SMap.showMarker(
            this.showMarker.longitude,
            this.showMarker.latitude,
            GLOBAL.markerTag,
          )

        SMap.setIsMagnifierEnabled(true)
        if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
          this.props.setMapNavigation({ isShow: false, name: '' })
          SMap.getCurrentFloorID().then(currentFloorID => {
            this.changeFloorID(currentFloorID)
          })
          SMap.initSpeakPlugin()
          GLOBAL.STARTNAME = getLanguage(
            GLOBAL.language,
          ).Map_Main_Menu.SELECT_START_POINT
          GLOBAL.ENDNAME = getLanguage(
            GLOBAL.language,
          ).Map_Main_Menu.SELECT_DESTINATION
        }


        this.setLoading(false)
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


        //地图打开后显示比例尺，获取图例数据
        this.setState({ showScaleView: true, mapLoaded: true })
        GLOBAL.legend && GLOBAL.legend.getLegendData()
        // this.mapLoaded = true
      } catch (e) {
        this.setLoading(false)
        this.setState({ mapLoaded: true })
      }
    }.bind(this)())
  }

  /** 开始在线协作 */
  startCowork = async () => {
    if (GLOBAL.coworkMode && CoworkInfo.coworkId === '') {
      // //创建
      // if (CoworkInfo.talkId !== '') {
      //   //从发现创建
      //   try {
      //     let friend = GLOBAL.getFriend()
      //     let talkId = CoworkInfo.talkId
      //     let mapName = this.props.map.currentMap.name
      //     friend.sendCoworkInvitation(talkId, GLOBAL.Type, mapName)
      //     this.setState({ onlineCowork: true })
      //   } catch (error) {
      //     Toast.show(getLanguage(GLOBAL.language).Friends.SEND_FAIL)
      //   }
      // } else if (this.props.map.currentMap.name) {
      //   //从好友创建
      //   GLOBAL.SimpleDialog.set({
      //     text: getLanguage(GLOBAL.language).Friends.SEND_COWORK_INVITE,
      //     confirmAction: () => {
      //       try {
      //         let friend = GLOBAL.getFriend()
      //         let talkId = friend.curChat.targetId
      //         let mapName = this.props.map.currentMap.name
      //         friend.sendCoworkInvitation(talkId, GLOBAL.Type, mapName)
      //         this.setState({ onlineCowork: true })
      //       } catch (error) {
      //         Toast.show(getLanguage(GLOBAL.language).Friends.SEND_FAIL)
      //       }
      //     },
      //   })
      //   GLOBAL.SimpleDialog.setVisible(true)
      // }
    } else if (GLOBAL.coworkMode && CoworkInfo.coworkId !== '') {
      //加入
      try {
        let friend = GLOBAL.getFriend()
        friend.startSendLocation(true)

        let messages = this.props.coworkInfo?.[this.props.user.currentUser.userName]?.
          [this.props.currentTask.groupID]?.[this.props.currentTask.id]?.messages || []

        // 把没有更新/追加/忽略的操作的标志添加到地图上
        for (let i = 0; i < messages.length; i++) {
          let _message = messages[i]
          if (_message.consume) continue
          let result = await SMap.isUserGeometryExist(
            messages[i].message.layerPath,
            messages[i].message.id,
            messages[i].message.geoUserID,
          )
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
      // let result = await SMap.openWorkspace(wsData.DSParams)
      let result = await this.props.openWorkspace(wsData.DSParams)
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
      await SMap.openDatasource(wsData.DSParams, index, toHead)
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
      let mapInfo = await this.props.openMap({
        path: data.path,
        name: data.name,
      })
      if (mapInfo) {
        // 如果是模板地图，则加载模板
        if (mapInfo.Template && GLOBAL.Type === ChunkType.MAP_COLLECTION) {
          this.setLoading(
            true,
            //ConstInfo.TEMPLATE_READING
            getLanguage(this.props.language).Prompt.READING_TEMPLATE,
          )
          let templatePath = await FileTools.appendingHomeDirectory(
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
    } catch (e) {
      this.setLoading(false)
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
      initResult = await SMap.createDatasource({
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
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(
        visible,
        loadingAction,
        cb,
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
    let data = [
      {
        title: getLanguage(GLOBAL.language).Friends.COWORK_UPDATE,
        action: () => {
          CoworkInfo.update(this.coworkMessageID)
        },
      },
      {
        title: getLanguage(GLOBAL.language).Friends.COWORK_ADD,
        action: () => {
          CoworkInfo.add(this.coworkMessageID)
        },
      },
      {
        title: getLanguage(GLOBAL.language).Friends.COWORK_IGNORE,
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
        ARView={this.state.showAIDetect}
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
          let action =
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
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        device={this.props.device}
        online={this.props.online}
        openOnlineMap={this.props.openOnlineMap}
        mapModules={this.props.mapModules}
        ARView={this.state.showAIDetect}
      />
    )
  }

  // TODO 是否移除待定
  /** 专题图预览时的header */
  renderPreviewHeader = () => {
    return (
      <PreviewHeader
        ref={ref => (GLOBAL.PreviewHeader = ref)}
        navigation={this.props.navigation}
        language={this.props.language}
      />
    )
  }
  //遮盖层
  renderOverLayer = () => {
    return (
      <OverlayView
        ref={ref => (GLOBAL.OverlayView = ref)}
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
    return <CustomInputDialog ref={ref => (GLOBAL.InputDialog = ref)} />
  }
  /**
   * 用户自定义信息弹窗
   * @returns {*}
   */
  renderCustomAlertDialog = () => {
    return <CustomAlertDialog ref={ref => (GLOBAL.AlertDialog = ref)} />
  }
  /** 地图控制器，放大缩小等功能 **/
  renderMapController = () => {
    return (
      <MapController
        ref={ref => (GLOBAL.mapController = this.mapController = ref)}
        type={GLOBAL.Type}
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
    let full = isFull === undefined ? !this.fullMap : !isFull
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
        GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
        this.FloorListView.state.currentFloorID
      )
    ) {
      GLOBAL.scaleView && GLOBAL.scaleView.showFullMap(full)
    }

    //只有AR模块走这段代码 add xiezhy
    if (
      GLOBAL.Type === ChunkType.MAP_AR ||
      GLOBAL.Type === ChunkType.MAP_AR_ANALYSIS ||
      GLOBAL.Type === ChunkType.MAP_AR_MAPPING
    ) {
      this.setState({ showArModeIcon: full })
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
      let historyCount = await SMap.getMapHistoryCount()
      let currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
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
  captureImage = params => {
    //保存数据->跳转
    (async function () {
      let currentLayer = this.props.currentLayer
      // let reg = /^Label_(.*)#$/
      let isTaggingLayer = false
      if (currentLayer) {
        let layerType = LayerUtils.getLayerType(currentLayer)
        isTaggingLayer = layerType === 'TAGGINGLAYER'
        // isTaggingLayer = currentLayer.type === DatasetType.CAD
        // && currentLayer.datasourceAlias.match(reg)
      }
      if (isTaggingLayer) {
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Media,
        )
        SMediaCollector.initMediaCollector(targetPath)

        let result = await SMediaCollector.addArMedia({
          datasourceName: datasourceAlias,
          datasetName: datasetName,
          mediaName: params.mediaName,
        })
        if (result) {
          this.switchAr()
          Toast.show(
            params.mediaName +
            ':' +
            getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY,
          )
        }
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
        this.props.navigation.navigate('LayerManager')
        await SAIDetectView.clearClickAIRecognition()
      }
    }.bind(this)())
  }

  /**
   * AR分类点击回调
   * @param {object} data {
   *  id<number>, trackID
   *  name<string>, 识别的名称
   *  info<string>, 识别的信息
   * }
   */
  _onArObjectClick = data => {
    if (GLOBAL.Type === ChunkType.MAP_AR_ANALYSIS) {
      let params = {
        ID: data.id,
        mediaName: data.name,
        Info: data.info,
      }
      // Toast.show(data.name + ', ' + data.info + ', ' + data.id)
      this.showFullMap(false)
      GLOBAL.toolBox.setVisible(false)
      GLOBAL.AIDETECTCHANGE.setVisible(false)
      this.captureImage(params)
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
        ref={ref => (GLOBAL.ToolBar = this.toolBox = ref)}
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
        getOverlay={() => GLOBAL.OverlayView}
        selectPointType={this.state.selectPointType}
        {...this.props}
      />
    )
  }

  /**
   * 开启动态投影弹框的取消事件
   */
  cancel = () => {
    GLOBAL.prjDialog.setDialogVisible(false)
  }

  /**
   * 开启动态投影弹框的确定事件
   */
  confirm = () => {
    (async function () {
      let result = await SMap.setDynamicProjection()
      if (result) {
        GLOBAL.prjDialog.setDialogVisible(false)
      }
    }.bind(this)())
  }

  /**
   * 是否开启动态投影的弹框
   */
  renderPrjDialog = () => {
    return (
      <Dialog
        ref={ref => (GLOBAL.prjDialog = ref)}
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
    return (
      <View style={[styles.editControllerView, { width: '100%' }]}>
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
          imageStyle={styles.headerBtn}
          onPress={() => {
            if (!this.state.canBeUndo) return
            ; (async function () {
              await SMap.undo()
              let historyCount = await SMap.getMapHistoryCount()
              let currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
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
          imageStyle={styles.headerBtn}
          onPress={() => {
            if (!this.state.canBeRedo) return
            ; (async function () {
              await SMap.redo()
              let historyCount = await SMap.getMapHistoryCount()
              let currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
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
        {/*imageStyle={styles.headerBtn}*/}
        {/*onPress={() => SMap.addMapHistory()}*/}
        {/*/>*/}
        <View style={styles.button} />
        <View style={styles.button} />
      </View>
    )
  }

  // //网络数据集和模型文件选择
  // showModelList = async () => {
  //   // let hasNetworkDataset = await SMap.hasNetworkDataset()
  //   // if (!hasNetworkDataset) {
  //   //   Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK_DATASETS)
  //   //   return
  //   // }
  //   // let popView = this.selectList
  //   // let simpleList = GLOBAL.SimpleSelectList
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
  //       ref={ref => (GLOBAL.SimpleSelectList = this.SimpleSelectList = ref)}
  //       showFullMap={this.showFullMap}
  //       language={this.props.language}
  //       confirmAction={() => {
  //         this.selectList.setVisible(false)
  //         this.showFullMap(false)
  //         let selectList = GLOBAL.SimpleSelectList
  //         let { networkModel, networkDataset } = selectList.state
  //         if (networkModel && networkDataset) {
  //           SMap.startNavigation(networkDataset.datasetName, networkModel.path)
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
    //       this.setLoading(true, getLanguage(GLOBAL.language).Prompt.SEARCHING)
    //       this.search(searchKey)
    //     }}
    //     placeholder={getLanguage(GLOBAL.language).Prompt.ENTER_KEY_WORDS}
    //     //{'请输入搜索关键字'}
    //   />
    // )
  }

  renderHeaderRight = () => {
    if (this.props.analyst.params || this.state.showAIDetect)
      return null
    let itemWidth =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 100 : 65
    let size =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50

    const currentMapModule = this.props.mapModules.modules.find(item => {
      return item.key === this.type
    })
    let buttonInfos = GLOBAL.coworkMode && [
      MapHeaderButton.CoworkChat,
    ] || (currentMapModule && currentMapModule.headerButtons) || [
      MapHeaderButton.Share,
      MapHeaderButton.Search,
      MapHeaderButton.Undo,
      MapHeaderButton.Audio,
    ]
    let buttons = []
    if (this.isExample) {
      return (
        <MTBtn
          key={'more'}
          imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
          image={getPublicAssets().common.icon_nav_imove}
          onPress={async () => {
            // const _params = ToolbarModule.getParams()
            await ToolbarModule.setToolBarData(ConstToolType.SM_MAP_BASE_CHANGE)
            ToolbarModule.addData({
              data: this.wsData,
            })
            let { data, buttons } = await ToolbarModule.getToolBarData(ConstToolType.SM_MAP_BASE_CHANGE)
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
                  if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
                    let layers =
                      this.props.getLayers && (await this.props.getLayers())
                    let baseMap = layers.filter(layer =>
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
              info = {
                key: MapHeaderButton.CoworkChat,
                image: getThemeAssets().cowork.icon_nav_chat,
                action: async () => {
                  let param = {}
                  if (CoworkInfo.coworkId !== '') {
                    param.targetId = CoworkInfo.coworkId
                    param.title = getLanguage(GLOBAL.language).Friends.GROUPS
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
                  imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
                  image={info.image}
                  onPress={info.action}
                />
                {
                  info.newInfo &&
                  <RedDot style={{position: 'absolute', top: 0, right: 0}} />
                }
                {buttonInfos[i] === MapHeaderButton.Share && this.props.online.share[0] &&
                  GLOBAL.Type === this.props.online.share[0].module &&
                  this.props.online.share[0].progress !== undefined && (
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
                )}
              </View>
            )
        } else {
          info &&
            buttons.push(
              <MTBtn
                key={info.key}
                imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
                image={info.image}
                onPress={info.action}
              />,
            )
        }
      }
    }
    if (GLOBAL.coworkMode && this.state.onlineCowork) {
      buttons.push(
        <MTBtn
          key={'CoworkMember'}
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
          width: scaleSize(itemWidth * buttons.length),
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
        // if (this.props.downloads[i].id === GLOBAL.Type) {
        if (
          this.props.downloads[i].id &&
          this.props.downloads[i].params.module === GLOBAL.Type
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
    let _showAIDetect = this.state.showAIDetect
    if (showAIDetect !== undefined && typeof showAIDetect === 'boolean') {
      if (showAIDetect !== _showAIDetect) {
        _showAIDetect = showAIDetect
      } else {
        return
      }
    } else {
      _showAIDetect = !_showAIDetect
    }
    this.setState({
      showAIDetect: _showAIDetect,
    })
    GLOBAL.showAIDetect = _showAIDetect
    SMap.setDynamicviewsetVisible(!_showAIDetect)
    _showAIDetect
      ? Orientation.lockToPortrait()
      : Orientation.unlockAllOrientations()
    return _showAIDetect
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
    let right
    if (
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 &&
      !this.state.showAIDetect
    ) {
      right = { right: scaleSize(100) }
    } else {
      right = { right: scaleSize(20) }
    }
    return (
      <View
        style={[styles.iconAr, right]}
        ref={ref => (GLOBAL.ArModeIcon = ref)}
      >
        <MTBtn
          style={{ padding: scaleSize(5) }}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().ar.switch_ar_light}
          onPress={() => {
            this.currentTime = new Date().getTime()
            // if (this.currentTime - this.lastClickTime < 1500) {
            //   return
            // }
            this.lastClickTime = this.currentTime
            // this.container.setLoading(
            //   true,
            //   getLanguage(this.props.language).Prompt.LOADING,
            // )
            // setTimeout(() => {
            //   this.container.setLoading(
            //     false,
            //     getLanguage(this.props.language).Prompt.LOADING,
            //   )
            // }, 3000)
            if (!this.state.showAIDetect) {
              this.setState({
                bGoneAIDetect: false,
              })
            }
            let _showAIDetect = this.switchAr()
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
  }

  _renderLocationIcon = () => {
    return (
      <LocationView
        getNavigationDatas={this.getNavigationDatas}
        ref={ref => (GLOBAL.LocationView = ref)}
      />
    )
  }

  /**
   * 室内增量路网绘制icon
   */
  _renderNavigationIcon = () => {
    let title = getLanguage(this.props.language).Map_Main_Menu.DRAW
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

  /**
   * 开始绘制室内增量路网
   */
  _incrementRoad = async () => {
    try {
      if (!this.state.isRight) {
        let position = await SMap.getCurrentPosition()
        let isIndoor = await SMap.isIndoorPoint(position.x, position.y)
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
      let rel = await SMap.addNetWorkDataset()
      let type
      if (rel) {
        this.FloorListView.setVisible(false)
        if (!this.state.isRight) {
          type = ConstToolType.SM_MAP_TOOL_GPSINCREMENT
        } else {
          type = ConstToolType.SM_MAP_TOOL_INCREMENT
          await SMap.setLabelColor()
          await SMap.setAction(Action.DRAWLINE)
          await SMap.setIsMagnifierEnabled(true)
        }
        this.toolBox.setVisible(true, type, {
          containerType: ToolbarType.table,
          isFullScreen: false,
        })
        ToolbarModule.setToolBarData(type)
      } else {
        GLOBAL.TouchType = TouchType.NORMAL
        this.showFullMap(false)
        Toast.show(getLanguage(this.props.language).Prompt.ILLEGAL_DATA)
      }
    } catch (e) {
      GLOBAL.TouchType = TouchType.NORMAL
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
  changeFloorID = (currentFloorID, cb) => {
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
        ref={ref => (GLOBAL.FloorListView = this.FloorListView = ref)}
      />
    )
  }

  /** 实时路况 */
  _renderTrafficView = () => {
    return (
      <TrafficView
        ref={ref => (GLOBAL.TrafficView = this.TrafficView = ref)}
        currentFloorID={this.state.currentFloorID}
        getLayers={this.props.getLayers}
        device={this.props.device}
        incrementRoad={() => {
          GLOBAL.TouchType = TouchType.NULL //进入路网，触摸事件设置为空
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
                GLOBAL.TouchType = TouchType.NORMAL //退出路网，触摸事件设置为normal
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
        SMap.createDefaultDataset().then(async returnData => {
          if (returnData.datasetName) {
            params.setToolbarVisible(true, type, {
              containerType,
              isFullScreen: false,
              resetToolModuleData: true,
              // height:data.height,
              // column:data.column,
              ...data,
            })
            GLOBAL.INCREMENT_DATA = returnData
          }
        })
        break
      case ConstToolType.SM_MAP_INCREMENT_INNER:
        break
    }
    //设置所有图层不可选 完成拓扑编辑或者退出增量需要设置回去
    let layers = this.props.layers.layers
    LayerUtils.setLayersSelectable(layers, false, true)
    GLOBAL.TouchType = TouchType.NULL
    GLOBAL.IncrementRoadDialog.setVisible(false)
  }

  /** 室内外路网采集的弹框 */
  renderIncrementDialog = () => {
    const increment_indoor = getThemeAssets().navigation.increment_indoor
    const increment_outdoor = getThemeAssets().navigation.increment_outdoor
    return (
      <IncrementRoadDialog ref={ref => (GLOBAL.IncrementRoadDialog = ref)}>
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
        ref={ref => (GLOBAL.AIDETECTCHANGE = ref)}
        headerProps={{
          navigation: this.props.navigation,
          type: 'fix',
          backAction: async () => {
            // await SAIDetectView.setProjectionModeEnable(false)
            GLOBAL.AIDETECTCHANGE.setVisible(false)
            this.showFullMap(false)
            GLOBAL.toolBox.setVisible(false)
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
            title: getLanguage(GLOBAL.language).Map_Settings.DETECT_TYPE,
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
      this.state.selectPointType === 'SELECTPOINTFORARNAVIGATION_INDOOR'
    ) {
      return (
        <TouchableOpacity
          key={'search'}
          onPress={async () => {
            if (this.state.selectPointType === 'selectPoint') {
              GLOBAL.MAPSELECTPOINT.setVisible(false)
              // GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
              NavigationService.navigate('EnterDatumPoint', {})
              if (GLOBAL.MapXmlStr) {
                await SMap.mapFromXml(GLOBAL.MapXmlStr)
                GLOBAL.MapXmlStr = undefined
              }
              GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE &&
                GLOBAL.DATUMPOINTVIEW &&
                GLOBAL.DATUMPOINTVIEW.updateLatitudeAndLongitude(
                  GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE,
                )
              this.setState({
                selectPointType: undefined,
              })
              GLOBAL.AIDETECTCHANGE.setVisible(false)
              this.showFullMap(false)
              SMap.deleteMarker(GLOBAL.markerTag)
              GLOBAL.toolBox.setVisible(false)

              Toast.show(
                getLanguage(GLOBAL.language).Profile
                  .MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED,
              )
              return
            } else if (
              this.state.selectPointType === 'SELECTPOINTFORARNAVIGATION_INDOOR'
            ) {
              GLOBAL.MAPSELECTPOINT.setVisible(false)
              GLOBAL.TouchType = TouchType.NORMAL
              SMap.deleteMarker(GLOBAL.markerTag)
              NavigationService.navigate('EnterDatumPoint', {
                type: 'ARNAVIGATION_INDOOR',
              })
              GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE &&
                GLOBAL.DATUMPOINTVIEW &&
                GLOBAL.DATUMPOINTVIEW.updateLatitudeAndLongitude(
                  GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE,
                )
              this.setState({
                selectPointType: undefined,
              })
              Toast.show(
                getLanguage(GLOBAL.language).Profile
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
            let layers = this.props.getLayers && (await this.props.getLayers())
            let baseMap = layers.filter(layer =>
              LayerUtils.isBaseLayer(layer),
            )[0]
            if (baseMap && baseMap.name !== 'baseMap' && baseMap.isVisible) {
              this.searchClickedInfo = {
                isClicked: true,
                title: GLOBAL.MAPSELECTPOINTBUTTON.state.button,
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
            source={require('../../../../assets/header/icon_search.png')}
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
        ref={ref => (GLOBAL.MAPSELECTPOINT = ref)}
        openSelectPointMap={this._openSelectPointMap}
        selectPointType={this.state.selectPointType}
        headerProps={{
          title: getLanguage(this.props.language).Map_Main_Menu.SELECT_POINTS,
          navigation: this.props.navigation,
          type: 'fix',
          headerRight: this._renderMapSelectPointHeaderRight(),
          backAction: async () => {
            if (this.state.selectPointType === 'selectPoint') {
              GLOBAL.mapController.move({
                bottom: scaleSize(-50),
                left: 'default',
              })

              NavigationService.navigate('EnterDatumPoint', {})
              this.setState({
                showScaleView: true,
                selectPointType: undefined,
              }, async () => {
                GLOBAL.MAPSELECTPOINT.setVisible(false)

                if (GLOBAL.MapXmlStr) {
                  await SMap.mapFromXml(GLOBAL.MapXmlStr)
                  GLOBAL.MapXmlStr = undefined
                }

                SMap.deleteMarker(GLOBAL.markerTag)
                GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP &&
                  GLOBAL.DATUMPOINTVIEW &&
                  GLOBAL.DATUMPOINTVIEW.updateLatitudeAndLongitude(
                    GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP,
                  )

                GLOBAL.AIDETECTCHANGE.setVisible(false)
                this.showFullMap(false)
                GLOBAL.toolBox.setVisible(false)
              })

              return
            } else if (
              this.state.selectPointType === 'SELECTPOINTFORARNAVIGATION_INDOOR'
            ) {

              GLOBAL.MAPSELECTPOINT.setVisible(false)
              GLOBAL.TouchType = TouchType.NORMAL
              this.setState({
                // showScaleView: true,
                selectPointType: undefined,
              }, () => {
                NavigationService.navigate('EnterDatumPoint', {
                  type: 'ARNAVIGATION_INDOOR',
                })
              })
              SMap.deleteMarker(GLOBAL.markerTag)
              return
            }
            GLOBAL.MAPSELECTPOINT.setVisible(false)
            // GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
            NavigationService.navigate('NavigationView', {
              changeNavPathInfo: this.changeNavPathInfo,
              getNavigationDatas: this.getNavigationDatas,
            })
          },
        }}
      />
    )
  }

  /** 在线路径分析 */
  _onlineRouteAnylystConfirm = async () => {
    GLOBAL.NavDialog.setDialogVisible(false)
    this.setLoading(true, getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING)
    let result, path, pathLength
    result = await FetchUtils.routeAnalyst(
      GLOBAL.STARTX,
      GLOBAL.STARTY,
      GLOBAL.ENDX,
      GLOBAL.ENDY,
    )
    if (result && result[0] && result[0].pathInfos) {
      await SMap.drawOnlinePath(result[0].pathPoints)
    } else {
      this.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
      return
    }
    pathLength = { length: result[0].pathLength }
    path = result[0].pathInfos

    this.setLoading(false)
    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, true)
    GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.STARTPOINTFLOOR = await SMap.getCurrentFloorID()

    if (path && pathLength) {
      GLOBAL.TouchType = TouchType.NORMAL
      this.changeNavPathInfo({ path, pathLength })

      let history = this.props.navigationhistory
      history.push({
        sx: GLOBAL.STARTX,
        sy: GLOBAL.STARTY,
        ex: GLOBAL.ENDX,
        ey: GLOBAL.ENDY,
        sFloor: GLOBAL.STARTPOINTFLOOR,
        eFloor: GLOBAL.ENDPOINTFLOOR,
        address: GLOBAL.STARTNAME + '---' + GLOBAL.ENDNAME,
        start: GLOBAL.STARTNAME,
        end: GLOBAL.ENDNAME,
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
        ref={ref => (GLOBAL.NAVIGATIONSTARTBUTTON = ref)}
      />
    )
  }

  /** 导航顶部组件 */
  _renderNavigationStartHead = () => {
    return (
      <NavigationStartHead
        device={this.props.device}
        ref={ref => (GLOBAL.NAVIGATIONSTARTHEAD = ref)}
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
        ref={ref => (GLOBAL.MAPSELECTPOINTBUTTON = ref)}
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
    point && SMap.showMarker(point.x, point.y, GLOBAL.markerTag)
    GLOBAL.MAPSELECTPOINT.updateLatitudeAndLongitude(point)
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
    return (
      <SaveView
        ref={ref => (GLOBAL.SaveMapView = ref)}
        language={this.props.language}
        save={this.saveMap}
        device={this.props.device}
        cancel={() => {
          // this.backAction = null
          GLOBAL.clickWait = false
        }}
      />
    )
  }

  //AR地图引导界面 add jiakai
  renderMapArGuideView = () => {
    return(
      <GuideViewMapArModel
        language={this.props.language}
      />
    )
  }

  //AR测图引导界面 add jiakai
  renderMapArMappingGuideView = () => {
    return(
      <GuideViewMapArMappingModel
        language={this.props.language}
      />
    )
  }

  //数据处理引导界面 add jiakai
  renderMapAnalystGuideView = () => {
    return(
      <GuideViewMapAnalystModel
        language={this.props.language}
        device={this.props.device}
      />
    )
  }


  renderContainer = () => {
    return (
      <Container
        ref={ref => (this.container = ref)}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: this.state.mapTitle,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
          },
          headerStyle: {
            right:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? scaleSize(96)
                : 0,
          },
          backAction: event => {
            this.backPositon = {
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            }
            this.back()
          },
          type: 'fix',
          headerCenter: this.renderSearchBar(),
          headerRight: this.renderHeaderRight(),
        }}
        bottomBar={
          // this.props.device.orientation.indexOf('LANDSCAPE') < 0 &&
          !this.isExample &&
          // !this.props.analyst.params &&
          this.renderToolBar()
        }
        bottomProps={{ type: 'fix' }}
      >
        {this.state.showMap && (
          <SMMapView
            ref={ref => (GLOBAL.mapView = ref)}
            style={styles.map}
            onGetInstance={this._onGetInstance}
          />
        )}
        {GLOBAL.Type &&
          this.props.mapLegend[GLOBAL.Type] &&
          this.props.mapLegend[GLOBAL.Type].isShow &&
          !this.noLegend && (
          <RNLegendView
            setMapLegend={this.props.setMapLegend}
            legendSettings={this.props.mapLegend}
            device={this.props.device}
            language={this.props.language}
            ref={ref => (GLOBAL.legend = ref)}
          />
        )}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          this._renderFloorListView()}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION && this._renderTrafficView()}
        {!this.isExample &&
          GLOBAL.isLicenseValid &&
          GLOBAL.Type &&
          GLOBAL.Type.indexOf(ChunkType.MAP_AR) === 0 &&
          !this.state.bGoneAIDetect && (
          <SMAIDetectView
            style={
              screen.isIphoneX() && {
                paddingBottom: screen.getIphonePaddingBottom(),
              }
            }
            customStyle={this.state.showAIDetect ? null : styles.hidden}
            language={this.props.language}
            // isDetect={GLOBAL.Type === ChunkType.MAP_AR_ANALYSIS}
            onArObjectClick={this._onArObjectClick}
          />
        )}
        {this._renderAIDetectChange()}
        <SurfaceView
          ref={ref => (GLOBAL.MapSurfaceView = ref)}
          orientation={this.props.device.orientation}
        />
        {!this.state.showAIDetect && this.renderMapController()}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          this._renderIncrementRoad()}
        {this._renderMapSelectPoint()}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          this._renderNavigationStartButton()}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          this._renderNavigationStartHead()}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          this._renderMapSelectPointButton()}
        {!this.isExample &&
          GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          this._renderNavigationPoiView()}
        {!this.isExample &&
          GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          !this.props.mapNavigation.isShow &&
          this.state.showIncrement &&
          this._renderNavigationIcon()}
        {/*{GLOBAL.Type === ChunkType.MAP_NAVIGATION && this._renderLocationIcon()}*/}
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
          (GLOBAL.Type === ChunkType.MAP_AR ||
            GLOBAL.Type === ChunkType.MAP_AR_ANALYSIS ||
            GLOBAL.Type === ChunkType.MAP_AR_MAPPING) &&
          this.state.showArModeIcon &&
          this._renderArModeIcon()}
        {/*{!this.isExample && this.renderMapNavIcon()}*/}
        {/*{!this.isExample && this.renderMapNavMenu()}*/}
        {!this.state.showAIDetect && this.state.showScaleView && (
          <ScaleView
            mapNavigation={this.props.mapNavigation}
            device={this.props.device}
            language={this.props.language}
            isShow={this.props.mapScaleView}
            ref={ref => (GLOBAL.scaleView = ref)}
          />
        )}
        <BubblePane ref={ref => (GLOBAL.bubblePane = ref)} maxSize={1} />
        <PopModal ref={ref => (this.popModal = ref)}>
          {this.renderEditControllerView()}
        </PopModal>
        {this.renderPrjDialog()}
        <Dialog
          ref={ref => (GLOBAL.removeObjectDialog = ref)}
          type={Dialog.Type.MODAL}
          info={getLanguage(this.props.language).Prompt.DELETE_OBJECT}
          confirmAction={this.removeObject}
          opacityStyle={styles.dialogStyle}
          confirmBtnTitle={getLanguage(this.props.language).Prompt.DELETE}
          cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        />
        <PoiTopSearchBar
          device={this.props.device}
          ref={ref => (GLOBAL.PoiTopSearchBar = ref)}
          setMapNavigation={this.props.setMapNavigation}
          navigation={this.props.navigation}
        />
        <PoiInfoContainer
          setLoading={this.setLoading}
          getSearchClickedInfo={this.getSearchClickedInfo}
          getNavigationDatas={this.getNavigationDatas}
          changeNavPathInfo={this.changeNavPathInfo}
          ref={ref => (GLOBAL.PoiInfoContainer = ref)}
          mapSearchHistory={this.props.mapSearchHistory}
          setMapSearchHistory={this.props.setMapSearchHistory}
          device={this.props.device}
          setMapNavigation={this.props.setMapNavigation}
          setNavigationPoiView={this.props.setNavigationPoiView}
          setNavigationChangeAR={this.props.setNavigationChangeAR}
        />
        {GLOBAL.Type === ChunkType.MAP_THEME && this.renderPreviewHeader()}
        {GLOBAL.coworkMode && this.state.onlineCowork && (
          <NewMessageIcon ref={ref => (this.NewMessageIcon = ref)} />
        )}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION && (
          <Dialog
            ref={ref => (GLOBAL.NavDialog = ref)}
            confirmAction={this._onlineRouteAnylystConfirm}
            opacity={1}
            opacityStyle={styles.dialogBackground}
            style={styles.dialogBackground}
            confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.YES}
            cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.NO}
          >
            <View style={styles.dialogHeaderView}>
              <Image
                source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
                style={styles.dialogHeaderImg}
              />
              <Text style={styles.promptTitleSmallText}>
                {getLanguage(GLOBAL.language).Prompt.USE_ONLINE_ROUTE_ANALYST}
              </Text>
            </View>
          </Dialog>
        )}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION && (
          <Dialog
            ref={ref => (GLOBAL.changeRouteDialog = ref)}
            confirmAction={this._changeNavRoute}
            cancelAction={this._changeRouteCancel}
            opacity={1}
            opacityStyle={styles.dialogOneLine}
            style={styles.dialogOneLine}
            confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.YES}
            cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.NO}
          >
            <View style={styles.dialogHeaderView}>
              <Image
                source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
                style={styles.dialogHeaderImg}
              />
              <Text style={styles.promptTitle}>
                {GLOBAL.CURRENT_NAV_MODE === 'INDOOR'
                  ? getLanguage(GLOBAL.language).Prompt.CHANGE_TO_OUTDOOR
                  : getLanguage(GLOBAL.language).Prompt.CHANGE_TO_INDOOR}
              </Text>
            </View>
          </Dialog>
        )}
        {this.renderMessageMenu()}
        {this.renderBackgroundOverlay()}
        {this.renderCustomInputDialog()}
        {this.renderCustomAlertDialog()}
        {this._renderExitSaveView()}
      </Container>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderContainer()}
        {this.renderProgress()}
        {GLOBAL.Type === ChunkType.MAP_NAVIGATION &&
          this.renderIncrementDialog()}
        {(GLOBAL.Type === ChunkType.MAP_AR)&&this.props.mapArGuide&&this.renderMapArGuideView()}
        {(GLOBAL.Type === ChunkType.MAP_AR_MAPPING)&&this.props.mapArMappingGuide && this.renderMapArMappingGuideView()}
        {(GLOBAL.Type === ChunkType.MAP_ANALYST)&&this.props.mapAnalystGuide && this.renderMapAnalystGuideView()}
      </View>
    )
  }
}
