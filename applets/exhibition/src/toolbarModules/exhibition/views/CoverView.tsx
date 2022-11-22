import { AppEvent, AppToolBar, Toast ,DataHandler} from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, TouchableOpacity, View, EmitterSubscription, StyleSheet, Text } from 'react-native'
import Scan from '../components/Scan'
import { TARLayerType, SARMap ,ARElementLayer,ARLayerType, SExhibition} from 'imobile_for_reactnative'
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
import { Vector3 } from 'imobile_for_reactnative/types/data'

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

class CoverView extends React.Component<Props, State> {
  currentRadiusx = 1
  currentRadiusy = 1
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

  getMainMenuItem = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_rectangle,
        title: '全景',
        action: this.onFullScapePress,
        autoCancelSelected: false,
      },
      {
        image: getImage().icon_window,
        title: '挖洞',
        action: this.onHolePress,
        autoCancelSelected: false,
      },
      {
        image: getImage().icon_tool_rolling,
        title: '卷帘',
        action: this.onRollingPress,
        autoCancelSelected: false,
      },
      {
        image: getImage().icon_tool_rolling,
        title: '流向',
        action: this.onFlowPress,
      },
      {
        image: getImage().tool_attribute,
        title: '属性',
        action: this.onAttributePres,
        autoCancelSelected: true,
      },
    ]
  }

  getCutMenu = (): itemConmonType[] => {
    return [
      {
        image: getImage().ar_pipe_bounds,
        name: '范围',
        action: this.onHoleBoundsPress,
      },
      {
        image: getImage().icon_tool_fix,
        name: '固定',
        action: this.onFixPress,
      }
    ]
  }

  getRollingModeMenu = (): itemConmonType[] => {
    return [
      {
        name: '横向',
        image: getImage().icon_tool_horizontal,
        action: () => {
          this.onRollingSelect(0)
        }
      },
      {
        name: '纵向',
        image: getImage().icon_tool_vertical,
        action: () => {
          this.onRollingSelect(1)
        }
      }
    ]
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
    this.setState({
      secondMenuData: [],
    })
  }

  onHolePress = (index: string) => {
    if(this.sideBarIndex === index) {
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
    this.setState({
      secondMenuData: this.getRollingModeMenu(),
      isSecondaryShow: true,
    })
  }

  flowEnabled = false
  onFlowPress = async () => {
    this.timeoutTrigger?.onFirstMenuClick()
    this.stopCover()
    this.stopRolling()
    this._hideSlide()
    this._disableAttribte()
    this.flowEnabled = !this.flowEnabled
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){

      // const paths: [Vector3, Vector3][] = [

      //   // 入口线
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -11},
      //     {x: -1.318, y:  -0.141, z: -10.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -10.5},
      //   //   {x: -1.318, y:  -0.141, z: -10.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -10},
      //     {x: -1.318, y:  -0.141, z: -9.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -9.5},
      //   //   {x: -1.318, y:  -0.141, z: -9.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -9},
      //     {x: -1.318, y:  -0.141, z: -8.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -8.5},
      //   //   {x: -1.318, y:  -0.141, z: -8.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -8},
      //     {x: -1.318, y:  -0.141, z: -7.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -7.5},
      //   //   {x: -1.318, y:  -0.141, z: -7.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -7},
      //     {x: -1.318, y:  -0.141, z: -6.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -6.5},
      //   //   {x: -1.318, y:  -0.141, z: -6.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -6},
      //     {x: -1.318, y:  -0.141, z: -5.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -5.5},
      //   //   {x: -1.318, y:  -0.141, z: -5.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -5},
      //     {x: -1.318, y:  -0.141, z: -4.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -4.5},
      //   //   {x: -1.318, y:  -0.141, z: -4.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -4},
      //     {x: -1.318, y:  -0.141, z: -3.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -3.5},
      //   //   {x: -1.318, y:  -0.141, z: -3.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -3},
      //     {x: -1.318, y:  -0.141, z: -2.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -2.5},
      //   //   {x: -1.318, y:  -0.141, z: -2.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -2},
      //     {x: -1.318, y:  -0.141, z: -1.75},
      //   ],
      //   // [ // todo 中间加点
      //   //   {x: -1.318, y:  -0.141, z: -1.5},
      //   //   {x: -1.318, y:  -0.141, z: -1.25},
      //   // ],
      //   [ // todo 中间加点
      //     {x: -1.318, y:  -0.141, z: -1},
      //     {x: -1.318, y:  -0.141, z: -0.75},
      //   ],

      //   //转弯短线
      //   [ //
      //     {x: -1.176, y: -0.150, z: -0.141},
      //     {x: -0.551, y: -0.130, z: -0.094},
      //   ],

      //   // 短线
      //   [ //
      //     {x: -0.370, y: -0.130, z: 0.132},
      //     {x: -0.370, y: -0.130, z: 1.678},
      //   ],

      //   //长线
      //   [ // todo 中间加点
      //     {x: -0.528, y: -0.130, z: 1.877},
      //     {x: -4.335, y: -0.130, z: 1.877},
      //   ],

      //   //短线
      //   [ //
      //     {x: -4.671, y: -0.112, z: 1.678},
      //     {x: -4.671, y: -0.112, z: 1.030},
      //   ],

      //   //长线
      //   [ //  todo 中间加点
      //     {x: -4.325, y: -0.112, z: 0.966},
      //     {x: 0.031, y: -0.110, z: 0.966},
      //   ],

      //   //出口长线
      //   [ //  todo 中间加点
      //     {x:0.285, y: -0.141, z: 0.656},
      //     {x: 0.285, y: -0.141, z: -10.660},
      //   ],
      // ]

      // SExhibition.showPipeFlow(layer.name, paths, 0.7, 0)

      const speed = 0.7
      const heightOffset = 0.05

      SExhibition.showPipeFlow2(layer.name, [
        {
          start: {x: -1.318, y:  -0.141 + heightOffset, z: -11},
          end:  {x: -1.318, y:  -0.141 + heightOffset, z: -0.75},
          speed: speed,
          segment: 10,
          runRange: 1,
        },
        {
          start: {x: -1.135, y:  -0.141 + heightOffset, z: -0.093},
          end:  {x: -0.462, y:  -0.141 + heightOffset, z: -0.093},
          speed: speed,
          segment: 1,
          runRange: 1,
        },
        {
          start: {x: -0.332, y: -0.141 + heightOffset, z: 0.3},
          end:  {x: -0.332, y:  -0.141 + heightOffset, z: 1.607},
          speed: speed,
          segment: 2,
          runRange: 1,
        },
        {
          start: {x: -0.677, y: -0.141 + heightOffset, z: 1.852},
          end:  {x: -4.338, y:  -0.141 + heightOffset, z: 1.852},
          speed: speed,
          segment: 5,
          runRange: 1,
        },
        {
          start: {x: -4.645, y: -0.141 + heightOffset, z: 1.664},
          end:  {x: -4.645, y:  -0.141 + heightOffset, z: 1.191},
          speed: speed,
          segment: 1,
          runRange: 1,
        },
        {
          start: {x: -4.324, y: -0.141 + heightOffset, z: 0.976},
          end:  {x: -0.265, y: -0.141 + heightOffset, z: 0.976},
          speed: speed,
          segment: 5,
          runRange: 1,
        },
        {
          start: {x: 0.270, y: -0.141 + heightOffset, z: 0.691},
          end:  {x: 0.270, y:  -0.141 + heightOffset, z: -10.982},
          speed: speed,
          segment: 10,
          runRange: 1,
        },
      ])

    }
  }

  attribteEanbled = false
  onAttributePres = (index: string) => {
    if(this.sideBarIndex === index) {
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
    this.setState({secondMenuData: []})
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

  _disableFlow = () => {
    if(this.flowEnabled) {
      this.flowEnabled = false
      SExhibition.hidePipeFlow()
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
        Toast.show('定位成功',{
          backgroundColor: 'rgba(0,0,0,.5)',
          textColor: '#fff',
        })
      }
    })
  }

  onSingleClick = () => {

    if(this.holeBarIndex === this.sideBar?.state.currentIndex || this.rollingbarIndex === this.sideBar?.state.currentIndex) {
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
    await SARMap.addARCover(layer.name, undefined)
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

  flow = () => {
    //
  }

  attribute = () => {
    let name = ''
    if(this.state.name === '地面'){
      name = '地下冷水管'
    }else{
      name = '消防水管'
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: dp(320),
          height: dp(200),
          bottom: dp(20),
          left: dp(20),
          backgroundColor: '#rgba(25, 25, 25, 0.65)',
          borderRadius: dp(8),
        }}
      >
        <View>
          <Image
            resizeMode={'contain'}
            style={{ width: '100%', height: dp(50) }}
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
            <Text style={{ textAlign: 'center', fontSize: dp(22), color: 'white' }}>{"属性"}</Text>
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
              style={{ width: '100%', height: dp(50) }}
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
              <Text style={{ textAlign: 'left', fontSize: dp(13), color: 'white', width: dp(70), marginLeft: dp(30) }}>{"管线:"}</Text>
              <Text style={{ textAlign: 'left', fontSize: dp(18), color: 'white', flex: 1 }}>{name}</Text>
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
                style={{ width: dp(85), height: dp(75) }}
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
                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(13), color: 'white', top: dp(25), }}>{"链接类型"}</Text>

                <View
                  style={{ width: dp(30), height: dp(1), backgroundColor: '#rgba(242, 79, 2, 1)' }}
                ></View>

                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(18), color: 'white', bottom: dp(20) }}>{"常规"}</Text>
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
                style={{ width: dp(85), height: dp(75) }}
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
                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(13), color: 'white', top: dp(25), }}>{"长度"}</Text>

                <View
                  style={{ width: dp(30), height: dp(1), backgroundColor: '#rgba(242, 79, 2, 1)' }}
                ></View>

                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(18), color: 'white', bottom: dp(20) }}>{this.state.length}</Text>
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
                style={{ width: dp(85), height: dp(75) }}
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
                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(13), color: 'white', top: dp(25), }}>{"截面直径"}</Text>

                <View
                  style={{ width: dp(30), height: dp(1), backgroundColor: '#rgba(242, 79, 2, 1)' }}
                ></View>

                <Text style={{ position: 'absolute', textAlign: 'center', fontSize: dp(18), color: 'white', bottom: dp(20) }}>{this.state.width}</Text>
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
    return <ScanWrap windowSize={this.props.windowSize} hint={'请对准地面上的二维码进行扫描'}/>
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
              left={{ type: 'text', text: '长度' }}
              defaultValue={this.currentRadiusx}
              right={{ type: 'indicator', unit: '' }}
              range = {[0,5]}
              onMove={(value: number) => {
                this.currentRadiusx = value
              }}
              onEnd={() => {
                const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
                if(layer){
                  SARMap.setARCoverRadiusX(layer.name,this.currentRadiusx)
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
              left={{ type: 'text', text: '宽度' }}
              defaultValue={this.currentRadiusy}
              right={{ type: 'indicator', unit: '' }}
              range = {[0,5]}
              onMove={(value: number) => {
                this.currentRadiusy = value
              }}
              onEnd={() => {
                const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
                if(layer){
                  SARMap.setARCoverRadiusY(layer.name,this.currentRadiusy)
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
              left={{ type: 'text', text: '深度' }}
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
          <Text style={{width: '100%', textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{"挖洞调整"}</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={this.onHolePress}
          >
            <Image
              style={styles.closeImg}
              source={getImage().icon_cancel02}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{"长度"}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 5]}
            defaultMaxValue={this.currentRadiusx}
            barColor={'#FF6E51'}
            onMove={async (value: number) => {
              // to do
              this.currentRadiusx = value
              const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
              if(layer){
                SARMap.setARCoverRadiusX(layer.name,this.currentRadiusx)
              }
            }}
          />
        </View>

        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{"宽度"}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 5]}
            defaultMaxValue={this.currentRadiusy}
            barColor={'#FF6E51'}
            onMove={async (value: number) => {
              this.currentRadiusy = value
              const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
              if(layer){
                SARMap.setARCoverRadiusY(layer.name,this.currentRadiusy)
              }
            }}
          />
        </View>

        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{"深度"}</Text>
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
        onHide={() => {
          this.timeoutTrigger?.onBackFromSecondMenu()
          this.setState({
            // secondMenuData: [],
            isSecondaryShow: false,
          })
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
          timeout={15000}
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