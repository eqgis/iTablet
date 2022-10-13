/*
 Copyright © SuperMap. All rights reserved.
 Author: jiakai
 */
import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import {
  scaleSize,
  setSpText,
  Toast,
  LayerUtils,
} from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import styles from './styles'
import { getThemeAssets } from '../../../../assets'
import {
  SMap,
  DatasetType,
  SARMap,
} from 'imobile_for_reactnative'
import { color } from '../../../../styles'
import NavigationService from '../../../../containers/NavigationService'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'
import ARMeasureAction from '../ToolBar/modules/arMeasure/ARMeasureAction'


//ar测量底部按钮
export default class ArMappingButton extends React.Component {
  props: {
    language: any,
    device: any,
    showSave: any,
    showSwitch: () => {},//控制二级菜单弹起时是否显示添加按钮等
    isDrawing: any,
    isMeasure: any,
    isCollect: any,
    canContinuousDraw: any,
    user: Object,
    nav: Object,
    currentLayer: SMap.LayerInfo,
    measureType: any,
    setCurrentHeight: () => {},
    isnew: () => {},//判断是否新建采集
    isTrack: () => {},//判断是轨迹采集还是打点采集
    showCurrentHeightView: () => {},
  }


  constructor(props) {
    super(props)

    this.isDrawing = this.props.isDrawing
    this.isMeasure = this.props.isMeasure
    this.canContinuousDraw = this.props.canContinuousDraw
    // this.measureType = this.props.measureType
    this.isCollect = this.props.isCollect

    this.collectdata = [
      {
        //新建开始
        key: 'replease',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_NEWDATA,
        action: () => { this.switchStatus() },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_new,
      },
      {
        //清除
        key: 'critical',
        title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
        action: () => { this.clearTrack() },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_delete,
      },
      {
        //线
        key: 'line',
        title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_LINE,
        action: () => {
          this.getLayerType()
          if (!this.disbaleLine) {
            this.saveline()
          } else {
            Toast.show(getLanguage(global.language).Prompt.PLEASE_CHOOSE_LINE_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_save_line,
      },
      {
        //保存点
        key: 'POINT',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_SAVE_POINT,
        action: () => {
          this.getLayerType()
          if (!this.disablePoint) {
            this.savepoint()
          } else {
            Toast.show(getLanguage(global.language).Prompt.PLEASE_CHOOSE_POINT_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_save_spot,
      },
      {
        //保存面
        key: 'REGION',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_SAVE_REGION,
        action: () => {
          this.getLayerType()
          if (!this.disableArea) {
            this.saveRegion()
          } else {
            Toast.show(getLanguage(global.language).Prompt.PLEASE_CHOOSE_REGION_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_save_region,
      },
    ]


    this.switchdata = [
      {
        //占位
        key: 'replease',
        title: '',
        action: ()=>{},
        size: 'large',
      },
      {
        //轨迹
        key: 'critical',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_SCENE_TRACK_COLLECT,
        action: ()=>{ this.trackCollect()},
        size: 'large',
        image: getThemeAssets().collection.icon_track_start,
      },
      {
        //点
        key: 'point',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_SCENE_POINT_COLLECT,
        action: ()=>{ this.pointCollect()},
        size: 'large',
        image: getThemeAssets().collection.icon_point_black,
      },
      {
        //占位
        key: 'replease',
        title: '',
        action: ()=>{},
        size: 'large',
      },
    ]

    this.data = [
      {
        //轨迹
        key: 'critical',
        title: getLanguage(global.language).Map_Main_Menu
          .TRACK,
        action: () => {
          this.arCollect()
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_analysis_critical_element,
      },
      {
        //点
        key: 'point',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SAVE_POINT,
        action: async () => {
          let is = await SARMap.isMeasuring()
          if (is) {
            SARMap.cancelCurrent()
          }
          this.getLayerType()
          if (!this.disablePoint) {
            this.drawPoint()
          } else {
            Toast.show(getLanguage(global.language).Prompt.PLEASE_CHOOSE_POINT_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_toolbar_savespot,
      },
      {
        //线
        key: 'line',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SAVE_LINE,
        action: async () => {
          let is = await SARMap.isMeasuring()
          if (is) {
            SARMap.cancelCurrent()
          }
          this.getLayerType()
          if (!this.disbaleLine) {
            this.drawLine()
          } else {
            Toast.show(getLanguage(global.language).Prompt.PLEASE_CHOOSE_LINE_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_toolbar_saveline,
      },
      {
        //面
        key: 'region',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SAVE_AEREA,
        action: async () => {
          let is = await SARMap.isMeasuring()
          if (is) {
            SARMap.cancelCurrent()
          }
          this.getLayerType()
          if (!this.disableArea) {
            this.setState({ data: this.areadata, measureType: 'arDrawArea' })
          } else {
            Toast.show(getLanguage(global.language).Prompt.PLEASE_CHOOSE_REGION_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().toolbar.icon_toolbar_region,
      },
      // {
      //   //体
      //   key: 'substance',
      //   title: getLanguage(global.language).Map_Main_Menu
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
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_POLYGON,
        action: () => {
          this.drawPolygon()
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_polygon,
      },
      {
        // 矩形
        key: 'rectangle',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_RECTANGLE,
        action: () => {
          this.drawRectangle()
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_rectangle,
      },
      {
        // 圆
        key: 'circular',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CIRCULAR,
        action: () => {
          this.drawCircular()
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_circular,
      },
    ]

    this.measureAreadata = [
      {
        //AR面积 多边形
        key: 'polygon',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_POLYGON,
        action: () => {
          this.canContinuousDraw = true
          this.continuousDraw()
          ARMeasureAction.arMeasurePolygon()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
          this.props.showCurrentHeightView(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_polygon,
      },
      {
        //AR面积 矩形
        key: 'rectangle',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_RECTANGLE,
        action: () => {
          this.canContinuousDraw = false
          this.continuousDraw()
          ARMeasureAction.arMeasureRectanglet()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
          this.props.showCurrentHeightView(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_rectangle,
      },
      {
        //AR面积 圆
        key: 'circular',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CIRCULAR,
        action: () => {
          this.canContinuousDraw = false
          this.continuousDraw()
          ARMeasureAction.arMeasureCircular()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
          this.props.showCurrentHeightView(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_circular,
      },
    ]

    this.measureAreadata1 = [
      {
        //AR体积 长方体
        key: 'cuboid',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CUBOID,
        action: () => {
          this.canContinuousDraw = false
          this.continuousDraw()
          ARMeasureAction.arMeasureCuboid()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
          this.props.showCurrentHeightView(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_cuboid,
      },
      {
        //AR体积 圆柱体
        key: 'cylinder',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CYLINDER,
        action: () => {
          this.canContinuousDraw = false
          this.continuousDraw()
          ARMeasureAction.arMeasureCylinder()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
          this.props.showCurrentHeightView(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_cylinder,
      },
      {
        //占位
        key: 'replease',
        title: '',
        action: ()=>{},
        size: 'large',
      },
      {
        //占位
        key: 'replease',
        title: '',
        action: ()=>{},
        size: 'large',
      },
    ]

    this.measuredata = [
      {
        //AR测距
        key: 'arMeasureArea',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_LENGTH,
        action: () => {
          this.canContinuousDraw = true
          this.continuousDraw()
          ARMeasureAction.arMeasureLength()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
          this.props.showCurrentHeightView(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.ar_analyst_length,
      },
      {
        //AR测高
        key: 'arMeasureHeitht',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT,
        action: () => {
          this.canContinuousDraw = false
          this.continuousDraw()
          ARMeasureAction.arMeasureHeight()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_altimetry_select,
      },
      {
        //AR面积
        key: 'arMeasureArea',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_AREA,
        action: () => {
          this.setState({
            data:this.measureAreadata,
          })
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.ar_analyst_area,
      },
      {
        //AR测量角度
        key: 'arMeasureAngle',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_ANGLE,
        action: () => {
          this.canContinuousDraw = true
          this.continuousDraw()
          ARMeasureAction.arMeasureAngle()
          this.setState({
            showSwitch: false, toolbar: { height: scaleSize(96) },
          })
          this.props.showSwitch(false)
          this.props.showCurrentHeightView(false)
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.ar_analyst_angle,
      },
      {
        //体积测量
        key: 'arMeasureAngle',
        title: getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_MEASURE_VOLUME,
        action: () => {
          this.setState({
            data:this.measureAreadata1,
          })
        },
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
      },
    ]

    this.disablePoint = true
    this.disableArea = true
    this.disbaleLine = true

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
      showSwitch: this.props.isCollect?true:false,
      toolbar: this.props.isCollect?{height: scaleSize(250)}:{},
      title: this.title,
      data: this.isCollect?this.collectdata:this.data,
      showGenera: false,
      showDatumPoint: this.props.measureType ? this.isDrawing : true,
      showSave: this.props.showSave,
      isCollect:this.props.isCollect,
      measureType: this.props.measureType
    }
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   return (
  //     JSON.stringify(nextProps) !== JSON.stringify(this.props)
  //     || JSON.stringify(nextState) !== JSON.stringify(this.state)
  //     // || this.measureType !== this.props.measureType
  //   )
  // }

  getLayerType = () =>{
    const layerType = LayerUtils.getLayerType(global.currentLayer)
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
    this.disablePoint = disablePoint
    this.disableArea = disableArea
    this.disbaleLine = disbaleLine
  }

  saveLog = () => {
    Toast.show(getLanguage(global.language).Prompt.SAVE_SUCCESSFULLY)
  }

  switchStatus = () => {
    if (Platform.OS === 'android') {
      SARMap.startTracking()
    }else{
      SARMap.draw()
    }
    this.props.isnew()
    Toast.show(
      getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START,
    )
  }

  clearTrack = () => {
    if (Platform.OS === 'ios') {
      this.clearAll()
    }else{
      SARMap.clearTracking()
    }
  }

  saveline = async () => {
    try {
      if (Platform.OS === 'ios') {
        // this.save()
        SARMap.setMeasurePath(this.props.currentLayer.datasourceAlias, this.props.currentLayer.datasetName)
        let result = await SARMap.saveTrackingLine()
        if (!result) {
          Toast.show(getLanguage(global.language).Prompt.SAVE_LINE_FAIL)
        }
      }else{
        await SARMap.setTrackingLayer(this.props.currentLayer.datasourceAlias,
          this.props.currentLayer.datasetName)
        let result = await SARMap.saveTrackingLine()
        Toast.show(result ? getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS : getLanguage(global.language).Prompt.SAVE_FAILED)
      }
    } catch (e) {
      global.Loading.setLoading(false)
      Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
    }
  }

  savepoint = async () => {
    try {
      if (Platform.OS === 'ios') {
        // this.save()
        SARMap.setMeasurePath(this.props.currentLayer.datasourceAlias, this.props.currentLayer.datasetName)
        let result = await SARMap.saveTrackingPoint()
        if (!result) {
          Toast.show(getLanguage(global.language).Prompt.SAVE_FAIL_POINT)
        }
      }else{
        await SARMap.setTrackingLayer(this.props.currentLayer.datasourceAlias,
          this.props.currentLayer.datasetName)
        let result = await SARMap.saveTrackingPoint()
        Toast.show(result ? getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS : getLanguage(global.language).Prompt.SAVE_FAILED)
      }
    } catch (e) {
      global.Loading.setLoading(false)
      Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
    }
  }

  saveRegion = async () => {
    try {
      if (Platform.OS === 'ios') {
        // this.save()
        SARMap.setMeasurePath(this.props.currentLayer.datasourceAlias, this.props.currentLayer.datasetName)
        let result = await SARMap.saveTrackingRegion()
        if (!result) {
          Toast.show(getLanguage(global.language).Prompt.SAVE_REGION_FAIL)
        }
      } else {
        await SARMap.setTrackingLayer(this.props.currentLayer.datasourceAlias,
          this.props.currentLayer.datasetName)
        let result = await SARMap.saveTrackingRegion()
        Toast.show(result ? getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS : getLanguage(global.language).Prompt.SAVE_FAILED)
      }
    } catch (e) {
      global.Loading.setLoading(false)
      Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
    }
  }

  /** 轨迹式 **/
  trackCollect = () => {
    try {
      if (Platform.OS === 'android') {
        SARMap.changeTrackingMode(0)
      } else {
        SARMap.setMeasureMode('arCollect_auto')
      }
      this.props.isTrack(true)
      this.setState({ data: this.collectdata })
    } catch (e) {
      () => { }
    }
  }

  /** 打点式 **/
  pointCollect = () => {
    try {
      if (Platform.OS === 'android') {
        SARMap.changeTrackingMode(1)
      }else{
        SARMap.setMeasureMode('arCollect')
      }
      this.props.isTrack(false)
      this.setState({data:this.collectdata})
    } catch (e) {
      () => { }
    }
  }

  arCollect = () => {
    // SARMap.clearMeasure()
    if (Platform.OS === 'android') {
      SARMap.setMeasureMode('NULL')
      SARMap.showMeasureView(true)
      SARMap.showTrackView(true)
      SARMap.changeTrackingMode(1)
    }
    this.props.isTrack(false)
    this.props.showSwitch(false)
    this.setState({ isCollect: true, data: this.collectdata, showSwitch: true })
    this.isDrawing = false
    global.toolBox && global.toolBox.measure({ isExistFullMap: false, measureType: 'arCollect' ,haslocation:true})
  }

  drawPoint = async () => {
    if(this.state.measureType==='arCollect'){
      SARMap.clearAllTracking()
    }
    SARMap.stopLocation()
    if (Platform.OS === 'android') {
      SARMap.showMeasureView(true)
      SARMap.showTrackView(true)
    }
    this.props.isTrack(false)
    this.isDrawing = true
    SARMap.setMeasureMode('DRAW_POINT')
    this.setState({
      isCollect:false, showSave: true, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT,
      measureType: 'arDrawPoint',
    })
    this.props.showSwitch(false)

    const _params = ToolbarModule.getParams()
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["POINTLAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是点线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }

    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }
    
    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point
    global.MeasureCollectData.measureType = 'arDrawPoint'
    global.toolBox && global.toolBox.measure({isExistFullMap:false,measureType:'arDrawPoint',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName,haslocation:true})
  }

  drawLine = async () => {
    if(this.state.measureType==='arCollect'){
      SARMap.clearAllTracking()
    }
    SARMap.stopLocation()
    if (Platform.OS === 'android') {
      SARMap.showMeasureView(true)
      SARMap.showTrackView(true)
    }
    this.props.isTrack(false)
    this.isDrawing = true
    SARMap.setMeasureMode('DRAW_LINE')
    this.setState({
      isCollect:false, showSave: true, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE,
      measureType: 'drawLine',
    })
    this.props.showSwitch(false)

    const _params = ToolbarModule.getParams()
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["LINELAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }
    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      // 否则画到当前图层
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point
    global.MeasureCollectData.measureType = 'drawLine'
    global.toolBox && global.toolBox.measure({isExistFullMap:false,measureType:'drawLine',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName,haslocation:true})
  }

  drawPolygon = async () => {
    if(this.state.measureType==='arCollect'){
      SARMap.clearAllTracking()
    }
    SARMap.stopLocation()
    if (Platform.OS === 'android') {
      SARMap.showMeasureView(true)
      SARMap.showTrackView(true)
    }
    this.props.isTrack(false)
    this.isDrawing = true
    SARMap.setMeasureMode('DRAW_AREA')
    this.setState({
      isCollect:false, showSave: true, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA, data: this.data,
    })
    this.props.showSwitch(false)


    const _params = ToolbarModule.getParams()
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["REGIONLAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是面线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }

    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point
    global.MeasureCollectData.measureType = 'arDrawArea'
    global.toolBox && global.toolBox.measure({isExistFullMap:false,measureType:'arDrawArea',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName,haslocation:true})
  }

  drawRectangle = async () => {
    if(this.state.measureType==='arCollect'){
      SARMap.clearAllTracking()
    }
    SARMap.stopLocation()
    if (Platform.OS === 'android') {
      SARMap.showMeasureView(true)
      SARMap.showTrackView(true)
    }
    this.props.isTrack(false)
    this.isDrawing = true
    SARMap.setMeasureMode('DRAW_RECTANGLE')
    this.setState({
      isCollect:false, showSave: true, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA, data: this.data,
    })
    this.props.showSwitch(false)

    const _params = ToolbarModule.getParams()
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["REGIONLAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是面线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }

    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point
    global.MeasureCollectData.measureType = 'arDrawRectangle'
    global.toolBox && global.toolBox.measure({isExistFullMap:false,measureType:'arDrawRectangle',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName})
  }

  drawCircular = async () => {
    if(this.state.measureType==='arCollect'){
      SARMap.clearAllTracking()
    }
    SARMap.stopLocation()
    if (Platform.OS === 'android') {
      SARMap.showMeasureView(true)
      SARMap.showTrackView(true)
    }
    this.props.isTrack(false)
    this.isDrawing = true
    SARMap.setMeasureMode('DRAW_CIRCLE')
    this.setState({
      isCollect:false, showSave: true, showSwitch: false, toolbar: { height: scaleSize(96) }, title: getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA, data: this.data,
    })
    this.props.showSwitch(false)

    const _params = ToolbarModule.getParams()
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["REGIONLAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是面线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }

    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point
    global.MeasureCollectData.measureType = 'arDrawCircular'
    global.toolBox && global.toolBox.measure({isExistFullMap:false,measureType:'arDrawCircular',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName})
  }

  renderItems = () => {
    let items = []
    for (let i = 0; i < this.state.data.length; i++) {
      items.push(this.renderItem(this.state.data[i]))
    }
    return items
  }

  renderItem = (item) => {
    let backgroundColor = '#E5E5E6'
    if(item.image === undefined){
      backgroundColor = 'transparent'
    }
    return (
      <View
        style={{
          width: scaleSize(100),
          // height: scaleSize(100),
          alignItems: 'center',
          // justifyContent: 'center',
        }}>
        {
          item.image &&
          <TouchableOpacity
            onPress={item.action}
            style={{
              width: scaleSize(80),
              height: scaleSize(80),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: scaleSize(40),
              backgroundColor: backgroundColor,
            }}
          >
            <Image
              resizeMode={'contain'}
              source={item.image}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        }
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

  /** ar画面切换 */
  switch = async () => {
    if(this.state.isCollect){
      if (!this.state.showSwitch) {
        this.setState({ showSwitch: true, toolbar: { height: scaleSize(250) }, data: this.data })
        this.props.showSwitch(true)
      } else {
        this.setState({ data: this.data })
      }
    } else {
      if (!this.state.showSwitch) {
        this.props.showSwitch(true)
        if (this.isMeasure) {
          this.setState({ showSwitch: true, toolbar: { height: scaleSize(250) }, data: this.measuredata })
        } else {
          this.setState({ showSwitch: true, toolbar: { height: scaleSize(250) } })
        }
      } else {
        this.setState({ showSwitch: false, toolbar: { height: scaleSize(96) }, data: this.data })
        this.props.showSwitch(false)
      }
    }
  }

  /** 撤销 **/
  undo = async () => {
    await SARMap.undoDraw()
    if (this.state.measureType === 'arMeasureHeight') {
      let height = await SARMap.getCurrentHeight()
      // this.setState({
      //   currentHeight: height + 'm',
      // })
      this.props.setCurrentHeight(height + 'm')
    }
  }

  /** 连续测量 **/
  continuousDraw = async () => {
    await SARMap.endCurrentDraw()
  }

  /** 清除 **/
  clearAll = async () => {
    await SARMap.clearMeasure()
    if (this.state.measureType === 'arMeasureHeight'||this.state.measureType === 'measureLength') {
      this.props.setCurrentHeight('0m')
      // this.setState({
      //   currentHeight: '0m',
      // })
    }
  }

  /** 保存 **/
  save = async () => {
    if (!this.props.currentLayer.datasourceAlias || !this.props.currentLayer.datasetName) return
    let datasourceAlias = this.props.currentLayer.datasourceAlias
    let datasetName = this.props.currentLayer.datasetName
    if (this.props.currentLayer.themeType !== 0 || (
      this.props.currentLayer.type !== DatasetType.CAD &&
      (
        (this.state.measureType === 'drawLine' && this.props.currentLayer.type !== DatasetType.LINE) ||
        (this.state.measureType === 'arDrawArea' && this.props.currentLayer.type !== DatasetType.REGION) ||
        (this.state.measureType === 'arDrawPoint' && this.props.currentLayer.type !== DatasetType.POINT)
      )
    )) {
      datasourceAlias = 'Label_' + this.props.user.currentUser.userName + '#'
      datasetName = `Default_Tagging_${this.props.user.currentUser.userName}`
    }
    SARMap.setMeasurePath(datasourceAlias, datasetName)
    SARMap.saveMeasureData(datasourceAlias, datasetName).then(result => {
      Toast.show(result ? getLanguage().Prompt.SAVE_SUCCESSFULLY : getLanguage().Prompt.SAVE_FAILED)
    })
  }

  renderBottomBtn() {
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate('ChooseLayer')
          }}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().toolbar.icon_toolbar_option}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if(this.state.data === this.collectdata){
              this.setState({data:this.switchdata})
            }else{
              this.setState({data:this.collectdata})
            }
          }}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().toolbar.icon_toolbar_switch}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if(this.state.showSwitch){
              this.setState({showSwitch:false ,toolbar: { height: scaleSize(96) }})
              this.props.showSwitch(false)
            }else{
              this.setState({showSwitch:true ,toolbar: { height: scaleSize(250) }})
              this.props.showSwitch(true)
            }
          }}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            // source={getThemeAssets().ar.toolbar.icon_flex}
            source={getThemeAssets().toolbar.icon_toolbar_style}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
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
      </View>
    )
  }



  render() {
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

        {this.state.isCollect && this.renderBottomBtn()}

        {!this.state.isCollect &&
        <View style={styles.buttonView}>
          {this.state.showSwitch && <View style={{ position: 'absolute', top: 0, width: '100%', height: scaleSize(2), backgroundColor: '#E5E5E6' }} />}
          <TouchableOpacity
            onPress={() => this.clearAll()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.icon_ar_toolbar_delete}
              source={getThemeAssets().toolbar.icon_toolbar_cancel}
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
          {(this.isMeasure||this.isDrawing) && (
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
        </View>}
      </View>
    )
  }
}
