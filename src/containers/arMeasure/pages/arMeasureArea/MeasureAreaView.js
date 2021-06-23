import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
  Platform,
  DeviceEventEmitter,
  NativeModules,
  NativeEventEmitter,
  AppState,
  PanResponder,
} from 'react-native'
import NavigationService from '../../../../containers/NavigationService'
import { getThemeAssets } from '../../../../assets'
import {
  SMMeasureAreaView,
  SMeasureAreaView,
  SMap,
  DatasetType,
  SMMeasureARGeneraView,
  SMARMapView,
  SARMap,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import styles from './styles'
import ImageButton from '../../../../components/ImageButton'
import { Container, Dialog ,CustomAlertDialog} from '../../../../components'
import { Toast, scaleSize,setSpText,LayerUtils ,screen} from '../../../../utils'
import { getLanguage } from '../../../../language'
import { color ,zIndexLevel} from '../../../../styles'
import DatumPointCalibration from '../../../arDatumPointCalibration/'

const SMeasureViewiOS = NativeModules.SMeasureAreaView
const iOSEventEmi = new NativeEventEmitter(SMeasureViewiOS)
const TOP_DEFAULT = Platform.select({
  android:screen.getHeaderHeight('PORTRAIT') + scaleSize(8),
  // ios: screen.isIphoneX() ? screen.X_TOP : screen.IOS_TOP,
  // ios: screen.isIphoneX() ? 0 : screen.IOS_TOP,
  ios: screen.getHeaderHeight('PORTRAIT') + scaleSize(8),
})

/*
 * AR高精度采集界面
 */
export default class MeasureAreaView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
    currentLayer: SMap.LayerInfo,
    device: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}

    this.measureType = params && params.measureType

    this.isDrawing = false
    this.isMeasure = false
    this.showSave = false

    const layerType = LayerUtils.getLayerType(GLOBAL.currentLayer)
    let disablePoint = true,
      disableArea = true,
      disbaleLine = true
    // 如果当前没有图层或类型不满足，不能绘制
    // 如果是CAD或者标注图层，则可以绘制点线面 by zcj
    if (["CADLAYER", "TAGGINGLAYER"].indexOf(layerType) != -1) {
      disablePoint = false
      disbaleLine = false
      disableArea = false
    } else if (layerType === "POINTLAYER") {
      disablePoint = false
    } else if (layerType === "REGIONLAYER") {
      disableArea = false
    } else if (layerType === "LINELAYER") {
      disbaleLine = false
    }

    this.data = [
      {
        //轨迹
        key: 'critical',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .TRACK,
        action: ()=>{
          this.toCollectView = true
          this.back()
          this.critical()
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_analysis_critical_element,
      },
      {
        //点
        key: 'point',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SAVE_POINT,
        action: async ()=>{
          let is = await SARMap.isMeasuring()
          if(is){
            SARMap.cancelCurrent()
          }
          if (!disablePoint) {
            SARMap.setMeasureMode('DRAW_POINT'), this.setState({
              showSave: false, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
                GLOBAL.language,
              ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT,
            })
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_CHOOSE_POINT_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_toolbar_savespot,
      },
      {
        //线
        key: 'line',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SAVE_LINE,
        action: async ()=>{
          let is = await SMeasureAreaView.isMeasuring()
          if(is){
            SMeasureAreaView.cancelCurrent()
          }
          if (!disbaleLine) {
            SMeasureAreaView.setMeasureMode('DRAW_LINE')
            this.setState({
              showSave: true, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
                GLOBAL.language,
              ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE,
            })
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_CHOOSE_LINE_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_toolbar_saveline,
      },
      {
        //面
        key: 'region',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SAVE_AEREA,
        action: async ()=>{
          let is = await SMeasureAreaView.isMeasuring()
          if(is){
            SMeasureAreaView.cancelCurrent()
          }
          if (!disableArea) {
            this.setState({ data: this.areadata })
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_CHOOSE_REGION_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_toolbar_region,
      },
      // {
      //   //体
      //   key: 'substance',
      //   title: getLanguage(GLOBAL.language).Map_Main_Menu
      //     .MAP_AR_AI_ASSISTANT_SAVE_SUBSTANCE,
      //   action: ()=>{},
      //   size: 'large',
      //   image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
      // },
    ]

    this.areadata = [
      {
        // 多边形
        key: 'polygon',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_POLYGON,
        action: ()=>{
          SMeasureAreaView.setMeasureMode('DRAW_AREA')
          this.setState({
            showSave: true, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
              GLOBAL.language,
            ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA, data: this.data,
          })
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_polygon,
      },
      {
        // 矩形
        key: 'rectangle',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_RECTANGLE,
        action: ()=>{
          SMeasureAreaView.setMeasureMode('DRAW_RECTANGLE')
          this.setState({
            showSave: false, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
              GLOBAL.language,
            ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA, data: this.data,
          })
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_rectangle,
      },
      {
        // 圆
        key: 'circular',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CIRCULAR,
        action: ()=>{
          SMeasureAreaView.setMeasureMode('DRAW_CIRCLE')
          this.setState({ showSave: false,showSwitch: false, toolbar: { height: scaleSize(96) },title:getLanguage(
            GLOBAL.language,
          ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA, data: this.data,
          })
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_circular,
      },
    ]

    if (this.measureType) {
      if (this.measureType === 'measureArea') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_POLYGON_TITLE
      } else if (this.measureType === 'measureLength') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_LENGTH
      } else if (this.measureType === 'drawLine') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE
      } else if (this.measureType === 'arDrawArea') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA
      } else if (this.measureType === 'arDrawPoint') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT
      } else if (this.measureType === 'arMeasureHeight') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT
      } else if (this.measureType === 'arMeasureCircle') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_CIRCULAR_TITLE
      } else if (this.measureType === 'arMeasureRectangle') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_RECTANGLE_TITLE
      } else if (this.measureType === 'measureAngle') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_ANGLE
      } else if (this.measureType === 'arMeasureCuboid') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_CUBOID_TITLE
      } else if (this.measureType === 'arMeasureCylinder') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA_CYLINDER_TITLE
      }

      if (this.measureType === 'arMeasureHeight' ||
        this.measureType === 'measureLength' ||
        this.measureType === 'measureArea' ||
        this.measureType === 'measureAngle' ||
        this.measureType === 'arMeasureCuboid' ||
        this.measureType === 'arMeasureCylinder') {
        this.isMeasure = true
      }

      if (
        this.measureType === 'drawLine' ||
        this.measureType === 'arDrawArea' ||
        this.measureType === 'arDrawPoint'
      ) {
        this.isDrawing = true

        this.datasourceAlias = params.datasourceAlias || ''
        this.datasetName = params.datasetName
        this.point = params.point
      }

      if (
        this.measureType === 'drawLine' ||
        this.measureType === 'arDrawArea'
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
    }

    this.state = {
      currentLength: 0,
      totalLength: 0,
      tolastLength: 0,
      totalArea: 0,
      showModelViews: false,
      SearchingSurfacesSucceed: false,
      showSwithchButtons: false,

      showCurrentHeightView: false,
      currentHeight: '0m',
      showADDPoint: false,
      showADD: true,//默认先显示
      isfirst: true,
      showLog: false,
      dioLog: '',
      diologStyle: {},
      is_showLog: false,
      showSwitch: false,
      toolbar: {},
      title:this.title,
      data:this.data,
      showGenera:false,
      showDatumPoint: this.measureType ? this.isDrawing : true,
      showSave:this.showSave,
    }

    AppState.addEventListener('change', this.handleStateChange)


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

    this.toCollectView = false // 是否是跳转到轨迹
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      const position = this._getAvailablePosition(this._moveViewStyles.style.left, this._moveViewStyles.style.top)

      this._moveViewStyles.style.top = position.y
      this._moveViewStyles.style.left = position.x
      this._previousTop = position.y
      this._previousLeft = position.x

      this._updateNativeStyles()
    }
  }

  _updateNativeStyles = () => {
    this.moveView && this.moveView.setNativeProps(this._moveViewStyles)
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
    let y = this._previousTop + gestureState.dy
    let x = this._previousLeft + gestureState.dx

    const position = this._getAvailablePosition(x, y)

    this._moveViewStyles.style.top = position.y
    this._moveViewStyles.style.left = position.x

    this._updateNativeStyles()
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

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {

    // InteractionManager.runAfterInteractions(() => {//这里表示下面代码是在动画结束后才执行，但是外面有动画在执行就会导致下面代码一直不执行，开发者需要自己考虑 add xiezhy
    // 初始化数据
    (async function () {
      //提供测量等界面添加按钮及提示语的回调方法 add jiakai
      if (Platform.OS === 'ios') {
        iOSEventEmi.addListener(
          'com.supermap.RN.SMeasureAreaView.ADD',
          this.onAdd,
        )
        iOSEventEmi.addListener(
          'com.supermap.RN.SMeasureAreaView.CLOSE',
          this.onshowLog,
        )
      } else {
        SMeasureAreaView.setAddListener({
          callback: async result => {
            if (result) {
              // Toast.show("add******")
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

        SARMap.addMeasureStatusListeners({
          infoListener: async result => {
            this.onshowLog(result)
          },
        })
      }

      if (this.isDrawing) {
        SMeasureAreaView.initMeasureCollector(
          this.datasourceAlias,
          this.datasetName,
        )
        // let fixedPoint = this.point
        // setTimeout(function () {
        //   //设置基点
        //   SMeasureAreaView.fixedPosition(false, fixedPoint.x, fixedPoint.y, 0)
        // }, 1000)
      }

      //没有动画回调的话提示语默认5秒后开启
      if (!this.state.is_showLog) {
        setTimeout(() => {
          this.setState({ is_showLog: true })
        }, 5000)
      }

      //注册监听
      if (Platform.OS === 'ios') {
        iOSEventEmi.addListener(
          'onCurrentHeightChanged',
          this.onCurrentHeightChanged,
        )
      } else {
        SARMap.addOnHeightChangeListener({
          onHeightChange: height => {
            this.setState({
              currentHeight: height,
            })
          },
        })
        // DeviceEventEmitter.addListener(
        //   'onCurrentHeightChanged',
        //   this.onCurrentHeightChanged,
        // )
      }
    }.bind(this)())
    // })
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      SMeasureAreaView.onPause()
    }
    //移除监听
    DeviceEventEmitter.removeListener(
      'onCurrentHeightChanged',
      this.onCurrentHeightChanged,
    )

    SARMap.removeOnHeightChangeListeners()

    AppState.removeEventListener('change', this.handleStateChange)

    if (Platform.OS === 'ios') {
      iOSEventEmi.removeListener(
        'com.supermap.RN.SMeasureAreaView.ADD',
        this.onAdd,
      )
      iOSEventEmi.removeListener(
        'com.supermap.RN.SMeasureAreaView.CLOSE',
        this.onshowLog,
      )
    }
  }

  handleStateChange = async appState => {
    if (Platform.OS === 'android') {
      if (appState === 'background') {
        SARMap.onPause()
      }

      if (appState === 'active') {
        SARMap.onResume()
      }
    }
  }

  /**高度变化 */
  onCurrentHeightChanged = params => {
    this.setState({
      currentHeight: params.currentHeight,
    })
  }

  /**添加按钮 */
  onAdd = result => {
    if (result.add) {
      if (this.state.isfirst) {
        this.setState({ showADD: true, showADDPoint: true ,is_showLog: true })
      } else {
        this.setState({ showADD: true })
      }
    } else {
      this.setState({ showADD: false, showADDPoint: false })
    }
  }

  /**提示语回调 */
  onshowLog = result => {
    if (result.close) {
      this.setState({
        dioLog: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_LAYOUT_CLOSE, showLog: true
      })
    }

    if (result.dark) {
      this.setState({
        dioLog: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_LAYOUT_DARK, showLog: true
      })
    }

    if (result.fast) {
      this.setState({
        dioLog: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_LAYOUT_FAST, showLog: true
      })
    }

    if (result.nofeature) {
      if (this.state.dioLog != getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_DARK)
        this.setState({
          dioLog: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_NOFEATURE, showLog: true
        })
    }

    if (result.none) {
      this.setState({ dioLog: '', showLog: false })
    }
  }

  /** 添加 **/
  addNewRecord = async () => {
    await SMeasureAreaView.addNewRecord()
    this.setState({ showADDPoint: false, isfirst: false })
  }

  /** 添加 **/
  switchModelViews = async () => {
    if (Platform.OS === 'ios') {
      this.setState({
        showModelViews: !this.state.showModelViews,
      })
    } else {
      this.setState({
        showSwithchButtons: !this.state.showSwithchButtons,
      })
    }
  }

  /** 撤销 **/
  undo = async () => {
    await SMeasureAreaView.undoDraw()
    if (this.measureType === 'arMeasureHeight') {
      let height = await SMeasureAreaView.getCurrentHeight()
      this.setState({
        currentHeight: height + 'm',
      })
    }
  }

  /** 连续测量 **/
  continuousDraw = async () => {
    await SMeasureAreaView.continuousDraw()
  }

  /** 清除 **/
  clearAll = async () => {
    await SMeasureAreaView.clearAll()
    if (this.measureType === 'arMeasureHeight') {
      this.setState({
        currentHeight: '0m',
      })
    }
  }

  /** 保存 **/
  save = async () => {
    if (!this.props.currentLayer.datasourceAlias || !this.props.currentLayer.datasetName) return
    let datasourceAlias = this.props.currentLayer.datasourceAlias
    let datasetName = this.props.currentLayer.datasetName
    if (this.props.currentLayer.themeType !== 0 || (
      this.props.currentLayer.type !== DatasetType.CAD &&
      (this.measureType === 'drawLine' && this.props.currentLayer.type !== DatasetType.LINE) ||
      (this.measureType === 'arDrawArea' && this.props.currentLayer.type !== DatasetType.REGION) ||
      (this.measureType === 'arDrawPoint' && this.props.currentLayer.type !== DatasetType.POINT)
    )) {
      datasourceAlias = 'Label_' + this.props.user.currentUser.userName + '#'
      datasetName = 'Default_Tagging'
    }
    let result = await SMeasureAreaView.saveDataset(
      datasourceAlias,
      datasetName
    )
    if (result) {
      //await SMeasureAreaView.clearAll()
      Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_SUCCESSFULLY)
    }
  }

  /** 重置/切换模式 **/
  remake = () => {
    //安排任务在交互和动画完成之后执行
    InteractionManager.runAfterInteractions(() => {
      // 重置数据
    })
  }

  /** 确认 **/
  confirm = () => { }

  back = () => {
    //返回时立即释放资源，以免ai检测冲突 zhangxt
    SMeasureAreaView.dispose()
    // eslint-disable-next-line
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    // eslint-disable-next-line
    // 如果是跳转到轨迹 不用切换ar相机 否则地图选点时没有mapController zcj
    if(!this.toCollectView){
      GLOBAL.toolBox.switchAr()
    }

    NavigationService.goBack()
    return true
  }

  critical = async () => {
    // if (GLOBAL.showAIDetect) {
    //   GLOBAL.arSwitchToMap = true
    //   ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // }
    // CollectSceneFormView 退出时切换ar相机
    GLOBAL.arSwitchToMap = true
    GLOBAL.EnterDatumPointType = 'arCollectSceneForm'
    // NavigationService.navigate('EnterDatumPoint')
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    NavigationService.navigate('CollectSceneFormView')
  }

  choseMoreModel = () => {
    const datasourceAlias = 'currentLayer.datasourceAlias' // 标注数据源名称
    const datasetName = 'currentLayer.datasetName' // 标注图层名称
    NavigationService.navigate('ModelChoseView', {
      datasourceAlias,
      datasetName,
    })
  }

  setFlagType = async type => {
    await SMeasureAreaView.setFlagType(type)
  }

  setMeasureMode = async mode => {
    await SMeasureAreaView.setMeasureMode(mode)
  }

  /** 量算的设置（界面传入数据有区别）add jiakai */
  Measuresetting = async () => {
    let isSnap = await SMeasureAreaView.getIsSnapRange()
    let tole = await SMeasureAreaView.getSnapTolerance()
    NavigationService.navigate('CollectSceneFormSet', {
      isMeasure: true,
      isSnap: isSnap,
      tole: tole,
      autoCatch: value => {
        SMeasureAreaView.setIsSnapRange(value)
      },
      setTolerance: value => {
        NavigationService.goBack()
        if (value > 100) {
          value = 100
        }
        if (value < 0) {
          value = 0
        }
        SMeasureAreaView.setSnapTolerance(value)
      },
    })
  }

  /** 设置 */
  setting = async () => {
    let isSnap = await SMeasureAreaView.getIsSnapRange()
    let tole = await SMeasureAreaView.getSnapTolerance()
    let showGenera = this.state.showGenera
    NavigationService.navigate('CollectSceneFormSet', {
      point: this.point,
      fixedPositions: point => {
        NavigationService.goBack()
        // SMeasureAreaView.fixedPosition(false, point.x, point.y, 0)
      },
      showType: 'newDatumPoint', // 新的位置校准界面
      reshowDatumPoint: ()=>{
        NavigationService.goBack()
        this.setState({
          showDatumPoint: true,
        })
      },
      isSnap: isSnap,
      tole: tole,
      showGenera:showGenera,
      autoCatch: value => {
        SMeasureAreaView.setIsSnapRange(value)
      },
      setTolerance: value => {
        if (value > 100) {
          value = 100
        }
        if (value < 0) {
          value = 0
        }
        SMeasureAreaView.setSnapTolerance(value)
      },
      showGeneracb: value => {
        this.setState({showGenera:value})
      },
    })
  }

  /** ar画面切换 */
  switch = async () => {
    if(!this.state.showSwitch){
      this.setState({ showSwitch: true, toolbar: { height: scaleSize(250) } })
    }else{
      this.setState({ showSwitch: false, toolbar: { height: scaleSize(96) } , data:this.data })
    }
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.DatumPointDialog = ref)}
        type={'modal'}
        cancelBtnVisible={false}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.CONFIRM}
        confirmAction={async () => {
          let fixedPoint = this.point
          //设置基点
          SMeasureAreaView.fixedPosition(false, fixedPoint.x, fixedPoint.y, 0)
          this.DatumPointDialog.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderLicenseDialogChildren()}
      </Dialog>
    )
  }

  renderLicenseDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTitle}>
          {
            getLanguage(GLOBAL.language).Profile
              .MAP_AR_DATUM_PLEASE_TOWARDS_NORTH
          }
        </Text>
      </View>
    )
  }

  renderHeaderRight = () => {
    let filters
    if (this.measureType === 'drawLine') {
      filters = [DatasetType.LINE]
    } else if (this.measureType === 'arDrawArea') {
      filters = [DatasetType.REGION]
    } else if (this.measureType === 'arDrawPoint') {
      filters = [DatasetType.POINT]
    }
    return (
      <View style={{flexDirection: 'row'}}>
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
              backgroundColor: 'transparent'}}
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
              backgroundColor: 'transparent'}}
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
              backgroundColor: 'transparent'}}
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

  renderItems = () => {
    let items = []
    for (let i = 0; i < this.state.data.length; i++) {
      items.push(this.renderItem(this.state.data[i]))
    }
    return items
  }

  renderItem = (item) => {
    return (
      <View
        style={{
          width: scaleSize(100),
          // height: scaleSize(100),
          alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={item.action}
          style={[{
            width: scaleSize(80),
            height: scaleSize(80),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: scaleSize(40),
            backgroundColor: '#E5E5E6',
          }]}
        >
          <Image
            resizeMode={'contain'}
            source={item.image}
            style={styles.smallIcon}
          />
        </TouchableOpacity>

        <Text
          style={[
            {
              marginTop: scaleSize(10),
              color: color.font_color_white,
              fontSize: setSpText(15),
              backgroundColor: 'transparent',
              textAlign: 'center',
            },
          ]}
        >
          {item.title}
        </Text>
      </View>
    )
  }

  renderBottomBtns = () => {
    return (
      <View style={[styles.toolbar, this.state.toolbar]}>

        {this.state.showSwitch && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: scaleSize(150),
              marginTop: scaleSize(10),
              justifyContent: 'space-between',
              // alignItems: 'center',
            }}
          >
            {this.renderItems()}
          </View>)}


        <View style={styles.buttonView}>
          {this.state.showSwitch &&<View style={{ position: 'absolute', top: 0, width: '100%', height: scaleSize(2), backgroundColor: '#E5E5E6' }} />}
          <TouchableOpacity
            onPress={() => this.clearAll()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.icon_ar_toolbar_delete}
              source={getThemeAssets().toolbar.icon_toolbar_delete}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.undo()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.icon_ar_toolbar_undo}
              source={getThemeAssets().toolbar.icon_toolbar_undo}
              style={styles.smallIcon}
            />
          </TouchableOpacity>

          {this.canContinuousDraw && (
            <TouchableOpacity
              onPress={() => this.continuousDraw()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                // source={getThemeAssets().ar.toolbar.icon_ar_toolbar_submit}
                source={getThemeAssets().toolbar.icon_toolbar_submit}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
          {this.state.showSave && this.isDrawing && (
            <TouchableOpacity
              onPress={() => this.save()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                // source={getThemeAssets().ar.toolbar.icon_ar_toolbar_submit}
                source={getThemeAssets().toolbar.icon_toolbar_submit}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
          {this.isDrawing && (
            <TouchableOpacity
              onPress={() => this.switch()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().toolbar.icon_toolbar_type}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderADDPoint = () => {
    let text
    GLOBAL.language === 'CN' ? text = '添加点' : text = 'Add Point'
    let image = getThemeAssets().ar.icon_ar_measure_add_toast
    // GLOBAL.language === 'CN' ? image = getThemeAssets().ar.icon_ar_measure_add_toast : image = getThemeAssets().ar.icon_ar_measure_add_toast_en
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

  renderDioLog = () => {
    let img
    switch (this.state.dioLog) {
      case getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_NOFEATURE:
        img = getThemeAssets().ar.icon_tips_aim
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_FAST:
        img = getThemeAssets().ar.icon_tips_slow_down
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_DARK:
        img = getThemeAssets().ar.icon_tips_lighting
        break
      case getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_CLOSE:
        img = getThemeAssets().ar.icon_tips_approach
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

  renderModelItemFirst = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => this.setFlagType('PIN_BOWLING')}
        style={styles.ModelItemView}
      >
        <Image
          source={getThemeAssets().ar.navi_model_pin_bowling}
          style={styles.img}
        />
      </TouchableOpacity>
    )
  }
  renderModelItemSecond = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => this.setFlagType('RED_FLAG')}
        style={styles.ModelItemView}
      >
        <Image
          source={getThemeAssets().ar.navi_model_red_flag}
          style={styles.img}
        />
      </TouchableOpacity>
    )
  }
  renderModelItem = () => {
    return (
      <View style={styles.ModelItemView}>
        <Image
          source={getThemeAssets().ar.icon_ar_measure_add}
          style={styles.img}
        />
        <Text style={styles.titleSwitchModelsView}>{'一种模型'}</Text>
      </View>
    )
  }

  renderSwitchModels = () => {
    return (
      <View style={styles.SwitchModelsView}>
        <Text style={styles.titleSwitchModelsView}>
          {
            getLanguage(GLOBAL.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_CHOOSE_MODEL
          }
        </Text>
        <View style={styles.DividingLine} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.renderModelItemFirst()}
          {this.renderModelItemSecond()}
          {/*{this.renderModelItem()}*/}
          {/*{this.renderModelItem()}*/}
          {/*{this.renderModelItem()}*/}
        </ScrollView>
        {/* <Button
          style={styles.btnSwitchModelsView}
          titleStyle={styles.txtBtnSwitchModelsView}
          title={'查看更多'}
          type={'BLUE'}
          activeOpacity={0.5}
          onPress={() => this.choseMoreModel()}
        />*/}
      </View>
    )
  }

  renderTopBtns = () => {
    return (
      <View style={styles.topView}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_back}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.save()} style={styles.iconView}>
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_save}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderBottomSwitchBtns = () => {
    return (
      <View style={styles.SwitchMeasureModeView}>
        <View style={[styles.buttonView, { backgroundColor: color.white }]}>
          <TouchableOpacity
            onPress={() => {
              this.setMeasureMode('MEASURE_LINE')
              this.setState({
                showSwithchButtons: false,
              })
            }}
            style={styles.iconView}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().mapTools.icon_dotted_lines}
                style={styles.smallIcon}
              />

              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_MEASURE_LENGTH
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              try {
                this.setMeasureMode('MEASURE_AREA')
                this.setState({
                  showSwithchButtons: false,
                })
              } catch (e) {
                () => { }
              }
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().mark.icon_frame}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_MEASURE_AREA
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      </View>
    )
  }

  renderTotalLengthChangeView() {
    return (
      <View style={styles.totallengthChangeView}>
        <Text style={styles.titleTotal}>
          {getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH +
            this.state.totalLength +
            'm'}
        </Text>
      </View>
    )
  }

  renderTotalAreaChangeView() {
    return (
      <View style={[styles.totallengthChangeView, { top: scaleSize(200) }]}>
        <Text style={styles.titleTotal}>
          {getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH +
            this.state.totalArea +
            'm²'}
        </Text>
      </View>
    )
  }

  renderCurrentLengthChangeView() {
    return (
      <View style={styles.tolastlengthChangeView}>
        <Text style={styles.titleTotal}>
          {getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_VIEW_DISTANCE +
            this.state.currentLength +
            'm'}
        </Text>
      </View>
    )
  }

  renderToLastLengthChangeView() {
    return (
      <View style={styles.currentLengthChangeView}>
        <Text style={styles.title}>
          {getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOLASTLENGTH +
            this.state.tolastLength +
            'm'}
        </Text>
      </View>
    )
  }

  renderSearchingView() {
    return Platform.OS === 'ios' ? null : (
      <View style={styles.currentLengthChangeView}>
        <Text style={styles.title}>
          {
            getLanguage(GLOBAL.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_SEARCHING
          }
        </Text>
      </View>
    )
  }

  renderCurrentHeightChangeView() {
    return (
      <View style={styles.currentHeightChangeView}>
        <Text style={styles.titleCurrentHeight}>
          {this.state.currentHeight}
        </Text>
      </View>
    )
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


  /** 原生mapview加载完成回调 */
  _onGetInstance = async () => {
    //设置类型需要放到原生空间初始化完成，放到componentDidMount 也不靠谱 add xiezhy
    if (this.measureType) {
      SARMap.showMeasureView(true)
      SARMap.showTrackView(false)
      SARMap.showPointCloud(false)
      if (this.measureType === 'measureArea') {
        SARMap.setMeasureMode('MEASURE_AREA')
        // SMeasureAreaView.setMeasureMode('DRAW_AREA')
      } else if (this.measureType === 'measureLength') {
        SARMap.setMeasureMode('MEASURE_LINE')
      } else if (this.measureType === 'drawLine') {
        SARMap.setMeasureMode('DRAW_LINE')
      } else if (
        this.measureType === 'arDrawArea' ||
        this.measureType === 'arArea'
      ) {
        SARMap.setMeasureMode('DRAW_AREA')
      } else if (this.measureType === 'arDrawPoint') {
        SARMap.setMeasureMode('DRAW_POINT')
      } else if (this.measureType === 'arMeasureHeight') {
        SARMap.setMeasureMode('MEASURE_HEIGHT')
        this.setState({
          showCurrentHeightView: true,
        })
      } else if (this.measureType === 'arMeasureCircle') {
        SARMap.setMeasureMode('MEASURE_AREA_CIRCLE')
      } else if (this.measureType === 'arMeasureRectangle') {
        SARMap.setMeasureMode('MEASURE_AREA_RECTANGLE')
      } else if (this.measureType === 'measureAngle') {
        SARMap.setMeasureMode('MEASURE_AREA_ANGLE')
      } else if (this.measureType === 'arMeasureCuboid') {
        SARMap.setMeasureMode('MEASURE_VOLUME_CUBOID')
      } else if (this.measureType === 'arMeasureCylinder') {
        SARMap.setMeasureMode('MEASURE_VOLUME_CYLINDER')
      }
      if (!this.props.currentLayer.datasourceAlias || !this.props.currentLayer.datasetName) return
      let datasourceAlias = this.props.currentLayer.datasourceAlias
      let datasetName = this.props.currentLayer.datasetName
      if (this.props.currentLayer.themeType !== 0 || (
        this.props.currentLayer.type !== DatasetType.CAD &&
        (this.measureType === 'drawLine' && this.props.currentLayer.type !== DatasetType.LINE) ||
        (this.measureType === 'arDrawArea' && this.props.currentLayer.type !== DatasetType.REGION) ||
        (this.measureType === 'arDrawPoint' && this.props.currentLayer.type !== DatasetType.POINT)
      )) {
        datasourceAlias = 'Label_' + this.props.user.currentUser.userName + '#'
        datasetName = 'Default_Tagging'
      }
      SMeasureAreaView.setSavePath(datasourceAlias,datasetName)
      this.setState({ isfirst: true ,showGenera:true})
    }
  }

  _startScan = () => {
    return SMeasureAreaView.startScan()
  }

  _onDatumPointClose = () => {
    this.setState({
      showDatumPoint: false,
    })
  }

  _onDatumPointConfirm = point => {
    SMeasureAreaView.fixedPosition(false, Number(point.x), Number(point.y), Number(point.h))
    this.setState({
      showDatumPoint: false,
    })
  }

  render() {
    const { showDatumPoint } = this.state
    return (
      <>
        <Container
          ref={ref => (this.Container = ref)}
          headerProps={{
            title: this.state.title,
            navigation: this.props.navigation,
            backAction: this.back,
            type: 'fix',
            headerRight: this.renderHeaderRight(),
          }}
          bottomProps={{ type: 'fix' }}
          withoutHeader={showDatumPoint}
        >
          <SMARMapView
            ref={ref => (this.SMMeasureAreaView = ref)}
            onLoad={this._onGetInstance}
          />
          { !showDatumPoint && <>
            {this.state.showSwithchButtons && this.renderBottomSwitchBtns()}
            {this.renderBottomBtns()}
            {this.state.showModelViews && this.renderSwitchModels()}
            {this.state.SearchingSurfacesSucceed &&
              this.renderTotalLengthChangeView()}
            {this.state.SearchingSurfacesSucceed &&
              this.renderCurrentLengthChangeView()}
            {this.state.SearchingSurfacesSucceed &&
              this.renderToLastLengthChangeView()}
            {this.state.SearchingSurfacesSucceed &&
              this.renderTotalAreaChangeView()}
            {this.state.showCurrentHeightView &&
              this.renderCurrentHeightChangeView()}
            {!this.state.showSwitch&&this.state.showADDPoint && this.renderADDPoint()}
            {!this.state.showSwitch&&this.state.showADD && this.renderCenterBtn()}
            {!this.state.showSwitch&&this.state.is_showLog && this.state.showLog && this.renderDioLog()}
            {this.isDrawing && this.state.showGenera && this.renderGeneralView()}
          </>}
        </Container>
        {showDatumPoint && <DatumPointCalibration routeName = "MeasureAreaView"
          routeData={{
            measureType: this.measureType,
          }}
          onConfirm={this._onDatumPointConfirm}
          startScan={this._startScan} onClose={this._onDatumPointClose}/>}
      </>
    )
  }
}
