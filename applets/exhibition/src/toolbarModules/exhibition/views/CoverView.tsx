import { AppEvent, AppToolBar, Toast ,DataHandler} from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, TouchableOpacity, View, EmitterSubscription, StyleSheet, Text } from 'react-native'
import Scan from '../components/Scan'
import { TARLayerType, SARMap ,ARElementLayer,ARLayerType, SExhibition,RNFS,FileTools} from 'imobile_for_reactnative'
import { Slider } from 'imobile_for_reactnative/components'
import { getGlobalPose, isCoverGuided, setCoverGuided } from '../Actions'
import ARGuide from '../components/ARGuide'
import SideBar, { Item } from '../components/SideBar'
import ARViewLoadHandler from '../components/ARViewLoadHandler'
import TimeoutTrigger from '../components/TimeoutTrigger'
import ScanWrap from '../components/ScanWrap'
import BottomMenu, { itemConmonType } from '../components/BottomMenu'
import AnimationWrap from '../components/AnimationWrap'
import SlideBar from 'imobile_for_reactnative/components/SlideBar'
import { FlowParam } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SExhibition'
import { getLanguage } from '@/language'
import { ConstPath } from '@/constants'

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showSlider:boolean
  backClick:boolean
  showGuide:boolean
  showSide: boolean
  secondMenuData: itemConmonType[]
  /** 是否允许扫描界面进行扫描 true表示允许 fasle表示不允许 */
  isScan: boolean
  isSecondaryShow: boolean
  name:string
  width:string
  length:string
  attributeShow:boolean
}

let pose: SARMap.Pose | undefined
let data:{name:string,x:string,y:string,route1:{names:[],flow:{start:[],end:[]},alert:[]},route2:{names:[],flow:{start:[],end:[]},alert:[]}}
class CoverView extends React.Component<Props, State> {
  currentRadiusx = 10
  currentRadiusy = 10
  currentDepth = 1
  scanRef: Scan | null = null
  show = true
  listeners: {
    addListener:EmitterSubscription | undefined,
    infoListener:EmitterSubscription | undefined
  } | null = null

  /** 第一次显示扫描界面是否完成 */
  scanFirstShow = false
  sideBar: SideBar | null = null
  sideBarIndex: string | undefined = ""
  holeBarIndex: string | undefined = undefined
  rollingbarIndex: string | undefined = undefined
  flowBarIndex: string | undefined = undefined

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      isScan: false,
      showSlider: false,
      backClick: true,
      showGuide: false,
      showSide: true,
      secondMenuData: [],
      isSecondaryShow: false,
      name:'',
      width:'',
      length:'',
      attributeShow:false,
    }
  }

  valveListener: EmitterSubscription | null = null
  route1ValveStatus: [boolean, boolean, boolean] = [true, true, true]
  route2ValueStatus: [boolean, boolean, boolean] = [true, true, true]

  componentDidMount(): void {
    this.valveListener = SExhibition.addVavlePressListener(result =>{
      console.log(result)
      let route: 1 | 2 = 1
      if(result.name === 'valve_1_0') {
        this.route1ValveStatus[0] = result.isOpen
      }
      if(result.name === 'valve_1_1') {
        this.route1ValveStatus[1] = result.isOpen
      }
      if(result.name === 'valve_1_2') {
        this.route1ValveStatus[2] = result.isOpen
      }
      if(result.name === 'valve_2_0') {
        this.route2ValueStatus[0] = result.isOpen
        route = 2
      }
      if(result.name === 'valve_2_1') {
        this.route2ValueStatus[1] = result.isOpen
        route = 2
      }
      if(result.name === 'valve_2_2') {
        this.route2ValueStatus[2] = result.isOpen
        route = 2
      }
      this.onValveOpen(route)
    })
  }

  componentWillUnmount(): void {
    if(this.valveListener != null) {
      this.valveListener.remove()
      this.valveListener = null
    }
  }

  getMainMenuItem = (): Item[] => {
    return [
      {
        image: getImage().ar_pipe_full,
        title: getLanguage().PANORAMA,
        action: this.onFullScapePress,
        autoCancelSelected: false,
      },
      {
        image: getImage().icon_tool_rolling,
        title: getLanguage().ROLLER,
        action: this.onRollingPress,
        autoCancelSelected: false,
      },
      {
        image: getImage().icon_window,
        title: getLanguage().HOLE,
        action: this.onHolePress,
        autoCancelSelected: false,
      },
      {
        image: getImage().ar_pipe_flow,
        title: getLanguage().FLOW,
        action: this.onFlowPress,
      },
      {
        image: getImage().ar_pipe_alert,
        title: getLanguage().BURST,
        action: this.onAlertPress,
      },
      {
        image: getImage().tool_attribute,
        title: getLanguage().ATTRIBUTE,
        action: this.onAttributePres,
        autoCancelSelected: true,
      },
    ]
  }

  getCutMenu = (): itemConmonType[] => {
    return [
      {
        image: getImage().ar_pipe_bounds,
        name: getLanguage().SCOPE,
        action: this.onHoleBoundsPress,
      },
      {
        image: getImage().icon_tool_fix,
        name: getLanguage().FIXED,
        action: this.onFixPress,
      }
    ]
  }

  getRollingModeMenu = (): itemConmonType[] => {
    return [
      {
        name: getLanguage().TRANVERSE,
        image: getImage().icon_tool_horizontal,
        action: () => {
          this.onRollingSelect(0)
        }
      },
      {
        name: getLanguage().LONGITUDINAL,
        image: getImage().icon_tool_vertical,
        action: () => {
          this.onRollingSelect(1)
        }
      }
    ]
  }

  getFlowMenu = (): itemConmonType[] => {
    return [
      {
        name: '流向A',
        image: getImage().ar_pipe_flow_1,
        action: () => {
          this.onFlowSelect(1)
        }
      },
      {
        name: '流向B',
        image: getImage().ar_pipe_flow_2,
        action: () => {
          this.onFlowSelect(2)
        }
      }
    ]
  }

  getAlertMenu = (): itemConmonType[] => {
    return [
      {
        name: '爆管A',
        image: getImage().ar_pipe_flow_alert_1,
        action: () => {
          this.onAlertSelect(1)
        }
      },
      {
        name: '爆管B',
        image: getImage().ar_pipe_flow_alert_2,
        action: () => {
          this.onAlertSelect(2)
        }
      }
    ]
  }

  stopDrawLine = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.stopDrawLine(layer.name)
    }
  }

  onFullScapePress = (index: string) => {
    if(this.sideBarIndex === index) {
      this.sideBarIndex = ""
      this.sideBar?.clear()
      return
    }
    this.sideBarIndex = index

    this.timeoutTrigger?.active()
    this._hideSlide()
    this._disableAttribte()
    this._disableFlow()
    this.stopCover()
    this.stopRolling()
    this._disableAlert()
    this.stopDrawLine()
    this.setState({
      secondMenuData: [],
    })
  }

  onHolePress = (index: string) => {
    if(this.sideBarIndex === index) {
      this.stopCover()
      this.setState({
        isSecondaryShow: false,
      })
      this.sideBarIndex = ""
      this.sideBar?.clear()
      return
    }
    this.sideBarIndex = index
    this.holeBarIndex = index

    this.timeoutTrigger?.onShowSecondMenu()
    this._hideSlide()
    this._disableAttribte()
    this._disableFlow()
    this.stopRolling()
    this._disableAlert()
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startARCover(layer.name)
    }
    this.setState({
      secondMenuData: this.getCutMenu(),
      isSecondaryShow: true,
    })
  }

  onRollingPress = (index: string) => {
    if(this.sideBarIndex === index) {
      this.stopRolling()
      this.setState({
        isSecondaryShow: false,
      })
      this.sideBarIndex = ""
      this.sideBar?.clear()
      return
    }
    this.sideBarIndex = index
    this.rollingbarIndex = index

    this.timeoutTrigger?.onShowSecondMenu()
    this._hideSlide()
    this._disableAttribte()
    this._disableFlow()
    this._disableAlert()
    this.setState({
      secondMenuData: this.getRollingModeMenu(),
      isSecondaryShow: true,
    })
  }

  flowEnabled = false
  onFlowPress = async (index: string) => {
    if(this.sideBarIndex === index) {
      this._disableFlow()
      this.setState({
        isSecondaryShow: false,
      })
      this.sideBarIndex = ""
      this.sideBar?.clear()
      return
    }
    this.sideBarIndex = index
    this.flowBarIndex = index

    this.timeoutTrigger?.onFirstMenuClick()
    this.stopCover()
    this.stopRolling()
    this._hideSlide()
    this._disableAttribte()
    this._disableAlert()
    this.stopDrawLine()
    this.flowEnabled = !this.flowEnabled

    this.setState({
      secondMenuData: this.getFlowMenu(),
      isSecondaryShow: true
    })
  }

  onAlertPress = (index: string) => {
    if(this.sideBarIndex === index) {
      this._disableAlert()
      this.setState({
        isSecondaryShow: false,
      })
      this.sideBarIndex = ""
      this.sideBar?.clear()
      return
    }
    this.sideBarIndex = index

    this.timeoutTrigger?.onShowSecondMenu()
    this.stopCover()
    this.stopRolling()
    this._hideSlide()
    this._disableAttribte()
    this._disableFlow()
    this.stopDrawLine()

    this.setState({
      secondMenuData: this.getAlertMenu(),
      isSecondaryShow: true
    })
  }

  attribteEanbled = false
  onAttributePres = (index: string) => {
    if(this.sideBarIndex === index) {
      this._disableAttribte()
      this.sideBarIndex = ""
      this.sideBar?.clear()
      return
    }
    this.sideBarIndex = index

    this.timeoutTrigger?.onFirstMenuClick()
    this.stopCover()
    this.stopRolling()
    this._hideSlide()
    this._disableFlow()
    this._disableAlert()
    this.stopDrawLine()
    this.attribteEanbled = !this.attribteEanbled
    SExhibition.enablePipeAttribute(this.attribteEanbled)
    this.setState({
      secondMenuData: [],
    })
  }


  //二级菜单

  onHoleBoundsPress = () => {
    if(this.state.showSlider){
      this.timeoutTrigger?.onBackFromSecondMenu()
      this.setState({ showSlider: false })
    }else{
      this.timeoutTrigger?.onShowSecondMenu()
      this.setState({ showSlider: true, secondMenuData: [] })
    }
  }

  onFixPress = () => {
    this.timeoutTrigger?.onFirstMenuClick()
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startARFix(layer.name)
    }
  }


  onRollingSelect = (mode: 0 | 1) => {
    this.timeoutTrigger?.onBackFromSecondMenu()
    this.rolling(mode)
    // this.setState({secondMenuData: []})
  }

  onFlowSelect = (index: 1 | 2) => {
    this.flow(index)
  }

  onAlertSelect = (index: 1 | 2) => {
    this.alert(index)
  }

  _hideSlide = () => {
    if(this.state.showSlider) {
      this.setState({
        showSlider: false
      })
    }
  }

  _disableAttribte = () => {
    if(this.attribteEanbled) {
      this.attribteEanbled = false
      SExhibition.enablePipeAttribute(false)
    }
  }

  _disableFlow =async () => {
    if(this.flowEnabled) {
      this.flowEnabled = false
      SExhibition.hidePipeFlow()
      const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
      if(layer){
        SExhibition.restorePipeMaterial(
          layer.name,
          data.route1.names
        )
        SExhibition.restorePipeMaterial(
          layer.name,
          data.route2.names
        )
      }
    }
  }


  _disableAlert = async () => {
    this.route1ValveStatus = [true, true, true]
    this.route2ValueStatus = [true, true, true]
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer) {
      await SExhibition.hideBreakPoint(layer.name, [...data.route1.alert, ...data.route2.alert])
      await SExhibition.restorePipeMaterial(layer.name, [...data.route1.names, ...data.route2.names])
      await SExhibition.hidePipeFlow()
      await SExhibition.hideValve(layer.name, getValve1())
      await SExhibition.hideValve(layer.name, getValve2())
    }
  }


  arViewDidMount = (): void => {
    const scanShowTimer = setTimeout(() => {
      if(!this.scanFirstShow) {
        if(this.state.showScan && !this.state.isScan) {
          // 启用增强定位
          SARMap.setAREnhancePosition()
        }
        this.scanFirstShow = true
        this.setState({
          isScan: true,
        })
      }
      clearTimeout(scanShowTimer)
    }, 3000)

    this.listeners = SARMap.addMeasureStatusListeners({
      addListener: async result => {
        if (result) {
          if(this.state.showScan && !this.state.isScan) {
            // 启用增强定位
            SARMap.setAREnhancePosition()
          }
          this.scanFirstShow = true
          this.setState({
            isScan: true,
          })
        } else {
          if(this.state.showScan && this.state.isScan) {
            // 停止增强定位
            SARMap.stopAREnhancePosition()
          }

          this.setState({
            isScan: false,
          })
        }
      },
    })

    AppEvent.addListener('ar_3dmap_attribute',result => {
      this.setState({name:result.name,length:result.length,width:result.width,attributeShow:result.show})
    })

    AppEvent.addListener('ar_single_click', this.onSingleClick)

    AppEvent.addListener('ar_image_tracking_result', result => {
      pose = result
      if(result) {
        this.timeoutTrigger?.onBackFromScan()
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false ,backClick:false})

        if(!isCoverGuided()) {
          setCoverGuided()
          this.showGuide(true)
        } else {
          this.openARModel()
        }
        Toast.show(getLanguage().LOCATIONSUCCESS,{
          backgroundColor: 'rgba(0,0,0,.5)',
          textColor: '#fff',
        })
      }
    })
  }

  onSingleClick = () => {

    if(this.sideBar?.state.currentIndex !== '') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
    } else {
      if(!this.state.showSide) {
        this.timeoutTrigger?.onBarShow()
      } else {
        this.timeoutTrigger?.onBarHide()
      }
      this.setState({showSide: !this.state.showSide})
    }
  }

  showGuide = (show: boolean) => {
    this.setState({showGuide: show})
  }

  openARModel = async () => {
    await this.checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    // console.warn(layer)
    // if(layer){
    // console.warn(layer)
    const homePath = await FileTools.getHomeDirectory()
    const path = homePath + ConstPath.Common + `Exhibition/AR室内管线/route.json`
    const info = await RNFS.readFile(path)
    const infoJson = JSON.parse(info)
    const datas = infoJson.datas
    for(let i =0 ; i<datas.length ;i++){
      if(pose && pose.imgx === datas[i].x && pose.imgy === datas[i].y){
        data = datas[i]
        await SARMap.addARCover(layer.name,datas[i].name, pose && {
          pose: pose,
          translation: {
            x: 0,
            y: 0,
            z: 0,
          }
        })
      }
    }


    // }
    const _time = async function() {
      return new Promise(function(resolve) {
        const timer = setTimeout(function() {
          resolve('waitting send close message')
          timer && clearTimeout(timer)
        }, 3000)
      })
    }
    await _time()
    this.setState({backClick:true})
  }

  checkARElementLayer = async (type: TARLayerType) => {
    let newDatasource = AppToolBar.getData().addNewDSourceWhenCreate === true
    let newDataset = AppToolBar.getData().addNewDsetWhenCreate === true
    AppToolBar.addData({
      addNewDSourceWhenCreate: false,
      addNewDsetWhenCreate: false,
    })
    const props = AppToolBar.getProps()
    const mapInfo = props.arMapInfo
    let satisfy = false
    if (props.arMap.currentMap) {
      if (mapInfo) {
        const layer = mapInfo.currentLayer
        if (!newDataset && layer && layer.type === type) {
          satisfy = true
        } else {
          newDataset = true
        }
      } else {
        newDataset = true
      }
    } else {
      await AppToolBar.getProps().createARMap()
      newDatasource = true
    }

    if (!satisfy) {
      let datasourceName = DataHandler.getARRawDatasource()
      let datasetName: string
      switch (type) {
        case ARLayerType.AR_MEDIA_LAYER:
          datasetName = 'defaultArPoiLayer'
          break
        case ARLayerType.AR_TEXT_LAYER:
          datasetName = 'defaultArTextLayer'
          break
        case ARLayerType.AR_MODEL_LAYER:
          datasetName = 'defaultArModelLayer'
          break
        // 矢量线类型的图层
        case ARLayerType.AR_LINE_LAYER:
          datasetName = 'defaultArLineLayer'
          break
        // 矢量符号线的图层
        case ARLayerType.AR_MARKER_LINE_LAYER:
          datasetName = 'defaultArMarkerLineLayer'
          break
        default:
          datasetName = 'defaultArLayer'
      }
      const result = await DataHandler.createARElementDatasource(props.currentUser, datasourceName, datasetName, newDatasource, newDataset, type)
      if (result.success) {
        datasourceName = result.datasourceName
        datasetName = result.datasetName || ''
        if (newDatasource) {
          DataHandler.setARRawDatasource(datasourceName)
        }

        let markerLineContent = AppToolBar.getData()?.markerLineContent
        if (markerLineContent && markerLineContent.indexOf('file://') === 0) {
          markerLineContent = markerLineContent.substring(7)
        } else {
          markerLineContent = ""
        }

        const layerName = await SARMap.addElementLayer(datasourceName, datasetName, type, false)
        if (type === ARLayerType.AR_MARKER_LINE_LAYER) {
          await SARMap.setLayerStyle(layerName, { markerSymbolPath: markerLineContent })
        }
        const layers = await props.getARLayers()
        const defaultLayer = layers.find(item => {
          if (item.type === type) {
            const layer = item as ARElementLayer
            return layer.datasourceAlias === datasourceName && layer.datasetName === datasetName
          }
          return false
        })
        if (defaultLayer) {
          props.setCurrentARLayer(defaultLayer)
        }
      } else {
        // AppLog.error(result.error)
      }
    }
  }


  stopCover = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.stopARCover(layer.name)
    }
  }

  rolling = (type: 0 | 1) => {
    this.stopCover()
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startRolling(layer.name, type)
    }
  }

  stopRolling = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.stopRolling(layer.name)
    }
  }

  flow = async (index: 1 | 2) => {
    await SExhibition.hidePipeFlow()
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      await SExhibition.restorePipeMaterial(
        layer.name,
        index === 1 ? data.route2.names : data.route1.names
      )
      SExhibition.showPipeFlow(
        layer.name,
        index === 1 ? getFlowRoute1(false,data.route1.flow) : getFlowRoute2(false,data.route2.flow)
      )

      SExhibition.makePipeMaterialTransparent(
        layer.name,
        index === 1 ? data.route1.names : data.route2.names
      )
    }
  }

  alert = async (index: 1 | 2) => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    await this._disableAlert()
    if(layer) {
      SExhibition.showBreakPoint(layer.name, index === 1 ? data.route1.alert : data.route2.alert)
      SExhibition.makePipeMaterialTransparent(layer.name,
        index === 1 ? data.route1.names : data.route2.names
      )
      SExhibition.showPipeFlow(layer.name,
        index === 1 ? getFlowRoute1(true,data.route1.flow) : getFlowRoute2(true,data.route2.flow)
      )
      SExhibition.showValve(layer.name, index === 1 ? getValve1() : getValve2())
    }
  }

  onValveOpen = async (route: 1 | 2) => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer) {
      await SExhibition.hidePipeFlow()
      if(route === 1) {
        //三个阀门都打开才会流向爆管处
        if(this.route1ValveStatus[0] && this.route1ValveStatus[1] && this.route1ValveStatus[2]) {
          SExhibition.showBreakPoint(layer.name, getAlertPipe1())
        } else {
          SExhibition.hideBreakPoint(layer.name, getAlertPipe1())
        }
        SExhibition.showPipeFlow(layer.name, getBreakFlowRoute1(this.route1ValveStatus))
      } else {
        //第一个和第三个阀门打开才会流向爆管处
        if(this.route2ValueStatus[0] && this.route2ValueStatus[2]) {
          SExhibition.showBreakPoint(layer.name, getAlertPipe2())
        } else {
          SExhibition.hideBreakPoint(layer.name, getAlertPipe2())
        }
        SExhibition.showPipeFlow(layer.name, getBreakFlowRoute2(this.route2ValueStatus))
      }

    }
  }

  attribute = () => {
    return (
      <View
        style={{
          position: 'absolute',
          width: dp(240),
          height: dp(140),
          bottom: dp(20),
          left: dp(20),
          backgroundColor: '#rgba(25, 25, 25, 0.65)',
          borderRadius: dp(8),
        }}
      >
        <View>
          <Image
            resizeMode={'stretch'}
            style={{ width: '100%', height: dp(32) ,opacity:0.8}}
            source={getImage().icon_coverview_title}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontSize: dp(18), color: 'white' }}>{getLanguage().ATTRIBUTE}</Text>
          </View>
        </View>


        <View
          style={{
            flex: 1,
            paddingHorizontal: dp(10),
          }}
        >

          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={{ width: '100%', height: dp(40)}}
              source={getImage().icon_coverview_back1}
              resizeMode={'contain'}
            />
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                top: 0,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ textAlign: 'left', fontSize: dp(10), color: 'white', width: dp(35), marginLeft: dp(20) }}>{getLanguage().MAP_AR_PIPELINE+":"}</Text>
              <Text style={{ textAlign: 'left', fontSize: dp(13), color: 'white', flex: 1 }}>{this.state.name}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                style={{ width: dp(65), height: dp(55) }}
                source={getImage().icon_coverview_back2}
              />

              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(10), color: 'white', top: dp(15), }}>{getLanguage().LINK_TYPE}</Text>

                <View
                  style={{ width: dp(30), height: dp(1), backgroundColor: '#rgba(242, 79, 2, 1)' }}
                ></View>

                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(13), color: 'white', bottom: dp(10) }}>{getLanguage().ROUTINE}</Text>
              </View>

            </View>


            <View
              style={{
                flex: 1,
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                style={{ width: dp(65), height: dp(55) }}
                source={getImage().icon_coverview_back2}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(10), color: 'white', top: dp(15), }}>{getLanguage().LENGTH}</Text>

                <View
                  style={{ width: dp(30), height: dp(1), backgroundColor: '#rgba(242, 79, 2, 1)' }}
                ></View>

                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(13), color: 'white', bottom: dp(10) }}>{this.state.length}</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                style={{ width: dp(65), height: dp(55) }}
                source={getImage().icon_coverview_back2}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(10), color: 'white', top: dp(15), }}>{getLanguage().SECTION_DIAMETER}</Text>

                <View
                  style={{ width: dp(30), height: dp(1), backgroundColor: '#rgba(242, 79, 2, 1)' }}
                ></View>

                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(13), color: 'white', bottom: dp(10) }}>{this.state.width}</Text>
              </View>
            </View>

          </View>

        </View>
      </View>
    )
  }


  onScanPress = async () => {
    if (this.state.showScan) {
      this.timeoutTrigger?.onBackFromScan()
      this.setState({ showScan: false })
    } else {
      this.timeoutTrigger?.onShowScan()
      this._hideSlide()
      this.startScan()
      this.stopCover()
      this.stopRolling()
      const props = AppToolBar.getProps()
      await props.closeARMap()
      await props.setCurrentARLayer()
      this.setState({ showScan: true })
    }
  }

  onBackPress = async () => {
    if (this.state.backClick) {
      if (this.state.showScan) {
        this.timeoutTrigger?.onBackFromScan()
        if(this.state.isScan) {
          SARMap.stopAREnhancePosition()
        }
        this.setState({ showScan: false })
        return
      }
      this._hideSlide()
      this.stopCover()
      this.stopRolling()

      AppEvent.removeListener('ar_image_tracking_result')
      this.listeners && this.listeners.addListener?.remove()
      AppEvent.removeListener('ar_single_click')
      if (this.state.showScan) {
        SARMap.stopAREnhancePosition()
      }
      // SARMap.close()
      const props = AppToolBar.getProps()
      await props.closeARMap()
      await props.setCurrentARLayer()
      AppToolBar.goBack()
    }
  }

  startScan = () => {
    this.scanRef?.scan()
    SARMap.setAREnhancePosition()
  }

  renderBack = () => {
    return (
      <TouchableOpacity
        style={{
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        }}
        onPress={this.onBackPress}
      >
        <Image
          style={{ width: dp(30), height: dp(30) }}
          source={getImage().icon_return}
        />
      </TouchableOpacity>
    )
  }

  renderScan = () => {
    return <ScanWrap windowSize={this.props.windowSize} hint={getLanguage().SCAN_BOTTOM}/>
  }

  slider01 = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: dp(20),
          left: dp(40),
          width: dp(300),
          height: dp(100),
          borderRadius: dp(10),
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,.5)',
          paddingHorizontal:dp(10),
          opacity:0.7,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              width: dp(30),
              height: dp(30),
            }}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={getImage().icon_tool_length}
            />
          </View>
          <View
            style={{
              width: '90%',
              height: '100%',
              justifyContent: 'center',
              paddingLeft: dp(10),
            }}
          >
            <Slider
              type={'single'}
              left={{ type: 'text', text: getLanguage().LENGTH }}
              defaultValue={this.currentRadiusx}
              right={{ type: 'indicator', unit: '' }}
              range = {[0,30]}
              onMove={(value: number) => {
                this.currentRadiusx = value
              }}
              onEnd={() => {
                const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
                if(layer){
                  SARMap.setARCoverRadiusX(layer.name,this.currentRadiusx/10)
                }
              }}
            />

          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              width: dp(30),
              height: dp(30),
            }}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={getImage().icon_tool_distance}
            />
          </View>
          <View
            style={{
              width: '90%',
              height: '100%',
              justifyContent: 'center',
              paddingLeft: dp(10),
            }}
          >
            <Slider
              type={'single'}
              left={{ type: 'text', text: getLanguage().LEGEND_WIDTH }}
              defaultValue={this.currentRadiusy}
              right={{ type: 'indicator', unit: '' }}
              range = {[0,30]}
              onMove={(value: number) => {
                this.currentRadiusy = value
              }}
              onEnd={() => {
                const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
                if(layer){
                  SARMap.setARCoverRadiusY(layer.name,this.currentRadiusy/10)
                }
              }}
            />

          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              width: dp(30),
              height: dp(30),
            }}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={getImage().icon_tool_depth}
            />
          </View>
          <View
            style={{
              width: '90%',
              height: '100%',
              justifyContent: 'center',
              paddingLeft: dp(10),
            }}
          >
            <Slider
              type={'single'}
              left={{ type: 'text', text: getLanguage().DEEP }}
              defaultValue={this.currentDepth}
              right={{ type: 'indicator', unit: '' }}
              range = {[0,5]}
              onMove={(value: number) => {
                this.currentDepth = value
              }}
              onEnd={() => {
                const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
                if(layer){
                  SARMap.setARCoverDepth(layer.name,this.currentDepth)
                }
              }}
            />

          </View>
        </View>

      </View>
    )

  }

  slider = () => {
    return (
      <View style={[styles.toolView]}>
        <View style={styles.toolRow}>
          <Text style={{width: '100%', textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{getLanguage().HOLE_ADJUST}</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={this._hideSlide}
          >
            <Image
              style={styles.closeImg}
              source={getImage().icon_cancel02}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{getLanguage().LENGTH}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 30]}
            defaultMaxValue={this.currentRadiusx}
            barColor={'#FF6E51'}
            onMove={async (value: number) => {
              // to do
              this.currentRadiusx = value
              const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
              if(layer){
                SARMap.setARCoverRadiusX(layer.name,this.currentRadiusx/10)
              }
            }}
          />
        </View>

        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{getLanguage().LEGEND_WIDTH}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 30]}
            defaultMaxValue={this.currentRadiusy}
            barColor={'#FF6E51'}
            onMove={async (value: number) => {
              this.currentRadiusy = value
              const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
              if(layer){
                SARMap.setARCoverRadiusY(layer.name,this.currentRadiusy/10)
              }
            }}
          />
        </View>

        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{getLanguage().DEEP}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 5]}
            defaultMaxValue={this.currentDepth}
            barColor={'#FF6E51'}
            onMove={async (value: number) => {
              // to do
              this.currentDepth = value
              const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
              if(layer){
                SARMap.setARCoverDepth(layer.name,this.currentDepth)
              }
            }}
          />
        </View>
      </View>
    )
  }

  /** 扫描按钮 */
  renderScanBtn = () => {
    return (
      <TouchableOpacity
        style={{
          marginTop: dp(15),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        }}
        onPress={this.onScanPress}
      >
        <Image
          style={{width: dp(30), height: dp(30) }}
          source={getImage().icon_other_scan}
        />
      </TouchableOpacity>
    )
  }

  renderRollingMode = () => {
    return (
      <BottomMenu
        // visible={this.state.secondMenuData.length > 0}
        visible={this.state.isSecondaryShow}
        hide={true}
        onHide={() => {
          this.timeoutTrigger?.onBackFromSecondMenu()
          // this.setState({
          //   // secondMenuData: [],
          //   isSecondaryShow: false,
          // })
        }}
        data={this.state.secondMenuData}
        isRepeatClickCancelSelected
        imageStyle={{width: dp(100), height: dp(100), marginTop: dp(0)}}
      />
    )
  }

  renderLeftSide = () => {
    return (
      <AnimationWrap
        animated='left'
        visible={this.state.showSide}
        range={[-dp(100), dp(20)]}
        style={{
          position: 'absolute',
          top: dp(20)
        }}
      >
        {!this.state.showGuide && this.renderBack()}
        {(!this.state.showScan && !this.state.showGuide) && this.renderScanBtn()}
      </AnimationWrap>
    )
  }

  renderRightSide = () => {
    return (
      <AnimationWrap
        animated='right'
        visible={this.state.showSide}
        range={[-dp(100), dp(20)]}
        style={{
          position: 'absolute',
          top: dp(20)
        }}
      >
        <SideBar
          ref={ref => this.sideBar = ref}
          sections={[this.getMainMenuItem()]}
          autoCancel={true}
        />
      </AnimationWrap>
    )
  }

  timeoutTrigger: TimeoutTrigger | null = null

  render() {
    return(
      <>
        <ARViewLoadHandler arViewDidMount={this.arViewDidMount}/>
        <TimeoutTrigger
          ref={ref => this.timeoutTrigger = ref}
          timeout={1500000}
          trigger={() => {
            this.setState({
              showSide: false
            })
          }}
        />

        {this.renderRollingMode()}

        {!this.state.showScan && this.renderRightSide()}
        {this.state.showScan && this.state.isScan && this.renderScan()}
        {this.renderLeftSide()}

        {this.state.showSlider && this.slider()}

        {this.state.attributeShow && this.attribute()}

        <ARGuide
          show={this.state.showGuide}
          animationName={'AR室内管线'}
          onSkip={() => {
            this.showGuide(false)
          }}
          onGuideEnd={() => {
            const globlaPose = getGlobalPose()
            if (globlaPose != null) {
              this.openARModel()
            }
          }}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  toolView: {
    position: 'absolute',
    left: dp(22),
    bottom: dp(22),
    marginLeft: dp(22),
    width: dp(360),
    backgroundColor: '#rgba(0,0,0,0.5)',
    borderRadius: dp(10),
    overflow: 'hidden',
  },
  toolRow: {
    flexDirection: 'row',
    width: dp(360),
    minHeight: dp(40),
    alignItems: 'center',
    paddingHorizontal: dp(20),
  },
  slideBar: {
    flex: 1,
    height: dp(30),
    marginLeft: dp(20),
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: dp(10),
    width: dp(40),
    height: dp(40),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  closeImg: {
    position: 'absolute',
    width: dp(12),
    height: dp(12),
  },

})

export default CoverView

//流向 1
function getFlowRoute1(): FlowParam[] {
  return _getFlowRoute1Origin([true, true, true])
}

function getFlowRoute1(isBreak = false,info?:any): FlowParam[] {
  const speed = 0.49
  const heightOffset = 0
  const pose = 0
  const scale = 2
  const arrow = 3
  const arrow_break = 4

  const arr:FlowParam[] = []

  for(let i =0 ; i<info.start.length ;i++){
    arr.push({
      start: {x: info.start[i].x, y:  info.start[i].y + heightOffset, z: info.start[i].z},
      end:  {x: info.end[i].x, y:  info.end[i].y + heightOffset, z: info.end[i].z},
      speed: speed,
      segment: info.start[i].segment,
      runRange: 1,
      pose,
      arrow: isBreak ? arrow_break : arrow,
    })
  }
  return arr

  // return [
  //   {
  //     start: {x: info.start[0].x, y:  info.start[0].y + heightOffset, z: info.start[0].z},
  //     end:  {x: info.end[0].x, y:  info.end[0].y + heightOffset, z: info.end[0].z},
  //     speed: speed,
  //     segment: info.start[0].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: info.start[1].x, y:  info.start[1].y + heightOffset, z: info.start[1].z},
  //     end:  {x: info.end[1].x, y:  info.end[1].y + heightOffset, z: info.end[1].z},
  //     speed: speed,
  //     segment: info.start[1].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: info.start[2].x, y:  info.start[2].y + heightOffset, z: info.start[2].z},
  //     end:  {x: info.end[2].x, y:  info.end[2].y + heightOffset, z: info.end[2].z},
  //     speed: speed,
  //     segment: info.start[2].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },

  //   {
  //     start: {x: info.start[3].x, y:  info.start[3].y + heightOffset, z: info.start[3].z},
  //     end:  {x: info.end[3].x, y:  info.end[3].y + heightOffset, z: info.end[3].z},
  //     speed: speed,
  //     segment: info.start[3].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: info.start[4].x, y:  info.start[4].y + heightOffset, z: info.start[4].z},
  //     end:  {x: info.end[4].x, y:  info.end[4].y + heightOffset, z: info.end[4].z},
  //     speed: speed,
  //     segment: info.start[4].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: info.start[5].x, y:  info.start[5].y + heightOffset, z: info.start[5].z},
  //     end:  {x: info.end[5].x, y:  info.end[5].y + heightOffset, z: info.end[5].z},
  //     speed: speed,
  //     segment: info.start[5].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },


  // ]
}

//流向 2
function getFlowRoute2(): FlowParam[] {
  return _getFlowRoute2Origin([true, true, true])
}

function getFlowRoute2(isBreak = false,info?:any): FlowParam[] {
  const speed = 0.49
  const offset = 0
  const pose = 1
  const arrow = 3
  const arrow_break = 4

  const arr:FlowParam[] = []

  for(let i =0 ; i<info.start.length ;i++){
    arr.push({
      start: {x: info.start[i].x, y:  info.start[i].y , z: info.start[i].z},
      end:  {x: info.end[i].x, y:  info.end[i].y , z: info.end[i].z},
      speed: speed,
      segment: info.start[i].segment,
      runRange: 1,
      pose,
      arrow: isBreak ? arrow_break : arrow,
    })
  }
  return arr

  // return [
  //   {
  //     start: {x: info.start[0].x, y:  info.start[0].y , z: info.start[0].z},
  //     end:  {x: info.end[0].x, y:  info.end[0].y , z: info.end[0].z},
  //     speed: speed,
  //     segment: info.start[0].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: info.start[1].x, y:  info.start[1].y , z: info.start[1].z},
  //     end:  {x: info.end[1].x, y:  info.end[1].y , z: info.end[1].z},
  //     speed: speed,
  //     segment: info.start[1].segment,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: -0.967, y:  -0.814 , z: -12.032},
  //     end:  {x: -1.582, y:  -0.814 , z: -12.032},
  //     speed: speed,
  //     segment: 2,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },

  //   {
  //     start: {x: -1.646, y:  -0.733 , z: -13.169},
  //     end:  {x: -1.646, y:  1.362 , z: -13.169},
  //     speed: speed,
  //     segment: 5,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: -0.883, y:  1.362 , z: -13.169},
  //     end:  {x: -0.883, y:  -0.733 , z: -13.169},
  //     speed: speed,
  //     segment: 5,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  //   {
  //     start: {x: -0.967, y:  -0.814 , z: -13.169},
  //     end:  {x: -1.582, y:  -0.814 , z: -13.169},
  //     speed: speed,
  //     segment: 2,
  //     runRange: 1,
  //     pose,
  //     arrow: isBreak ? arrow_break : arrow,
  //   },
  // ]
}



//流向 1 管线名称 用来设置管线透明
function getRoute1Names(): string[] {
  return [
    'DYRBF_18',
    'DYRBF_19',
    'DYRBF_FDJB_03',
    'DYRBF_FDJB_04',
    'DYRBF_KGA_29',
    'DYRBF_KGA_30',

    // '地下冷水管_23',
    // '地下冷水管_弯头14',
    // '地下冷水管_24',
    // '地下冷水管_弯头13',
    // '地下冷水管_25',
    // '地下冷水管_四通05',
    // '地下冷水管_弯头12',
    // '地下冷水管_26',
    // '地下冷水管_27',
    // '地下冷水管_弯头11',
    // '地下冷水管_28',
    // '地下冷水管_弯头10',
    // '地下冷水管_29',
    // '地下冷水管_弯头09',
    // '地下冷水管_30'
  ]
}

//流向 2 管线名称 用来设置管线透明
function getRoute2Names(): string[] {
  return [
    'DYRBF_20',
    'DYRBF_21',
    'DYRBF_FDJB_01',
    'DYRBF_FDJB_02',
    'DYRBF_KGA_31',
    'DYRBF_KGA_32',
    // '墙面冷水管_122',
    // '墙面冷水管_弯头67',
    // '墙面冷水管_121',
    // '墙面冷水管_弯头68',
    // '墙面冷水管_120',
    // '墙面冷水管_三通19',
    // '墙面冷水管_119',
    // '墙面冷水管_弯头69',
    // '墙面冷水管_118',
    // '墙面冷水管_三通14',
    // '墙面冷水管_139',
    // '墙面冷水管_弯头70',
    // '墙面冷水管_138',
    // '墙面冷水管_弯头71',
    // '墙面冷水管_137',
    // '墙面冷水管_三通13',
    // '墙面冷水管_110',
    // '墙面冷水管_四通06',
    // '墙面冷水管_111',
    // '墙面冷水管_弯头30',
    // '墙面冷水管_112',
    // '墙面冷水管_弯头29',
    // '墙面冷水管_113',
    // '墙面冷水管_弯头28',
    // '墙面冷水管_114',
    // '墙面冷水管_弯头27',
    // '墙面冷水管_115',
    // '墙面冷水管_四通05',
    // '墙面冷水管_116',
    // '墙面冷水管_三通06',
    // '墙面冷水管_27',
    // '墙面冷水管_弯头26',
    // '墙面冷水管_28',
    // '墙面冷水管_弯头25',
    // '墙面冷水管_29',
    // '墙面冷水管_三通04',
    // '墙面冷水管_31',
    // '墙面冷水管_三通05',
    // '墙面冷水管_32',
    // '墙面冷水管_弯头24',
    // '墙面冷水管_33',
    // '墙面冷水管_弯头23',
    // '墙面冷水管_34',
    // '墙面冷水管_弯头22',
    // '墙面冷水管_35',
    // '墙面冷水管_弯头21',
    // '墙面冷水管_36',
    // '墙面冷水管_弯头20',
    // '墙面冷水管_37',
    // '墙面冷水管_弯头19',
    // '墙面冷水管_38',
    // '墙面冷水管_弯头18',
    // '墙面冷水管_39',
    // '墙面冷水管_弯头17',
    // '墙面冷水管_40',
    // '墙面冷水管_弯头16',
    // '墙面冷水管_41',
    // '墙面冷水管_弯头15',
    // '墙面冷水管_42',
    // '墙面冷水管_弯头14',
    // '墙面冷水管_43',
    // '墙面冷水管_弯头13',
    // '墙面冷水管_44',
  ]
}


//流向 1 爆管点
function getAlertPipe1(): {name: string, offsetX?: number, offsetY?: number, offsetZ?: number, scale?: number}[] {
  return [
    {
      name: 'DYRBF_KGA_29',
      offsetY: -0.02, // -0.25,
      scale: 0.5,
    },
    {
      name: 'DYRBF_KGA_30',
      offsetY: -0.02, // -0.25,
      scale: 0.5,
    },
  ]
}

//流向 2 爆管点
function getAlertPipe2(): {name: string, offsetX?: number, offsetY?: number, offsetZ?: number, scale?: number}[] {
  return [
    {
      name: 'DYRBF_KGA_31',
      offsetY: -0.02, // -0.25,
      scale: 0.5,
    },
    {
      name: 'DYRBF_KGA_32',
      offsetY: -0.02, // -0.25,
      scale: 0.5,
    },
  ]
}

//流向 1 阀门点
function getValve1(): {name: string,position: Vector3,scale: number,isOpen: boolean}[] {
  const scale = 0.3
  const offsetY = -0.05

  return [
    {
      name: 'valve_1_0',
      position: {
        x: -1.048,
        y: -0.126 + offsetY,
        z: -0.106,
      },
      scale,
      isOpen: true,
    },
    {
      name: 'valve_1_1',
      position: {
        x: -0.335,
        y: -0.126 + offsetY,
        z: 0.933,
      },
      scale,
      isOpen: true,
    },
    {
      name: 'valve_1_2',
      position: {
        x: -0.340,
        y: -0.126 + offsetY,
        z: 1.728,
      },
      scale,
      isOpen: true,
    }
  ]
}

//流向 2 阀门点
function getValve2(): {name: string,position: Vector3,scale: number,isOpen: boolean}[] {
  const scale = 0.5
  const offsetY = -0.05

  return [
    {
      name: 'valve_2_0',
      position: {
        x: -6.467,
        y: 4.067 + offsetY,
        z: 4.918,
      },
      scale,
      isOpen: true,
    },
    {
      name: 'valve_2_1',
      position: {
        x: -5.885,
        y: 4.060 + offsetY,
        z: -0.694,
      },
      scale,
      isOpen: true,
    },
    {
      name: 'valve_2_2',
      position: {
        x: -6.061,
        y: 4.043 + offsetY,
        z: -3.295,
      },
      scale,
      isOpen: true,
    }
  ]
}