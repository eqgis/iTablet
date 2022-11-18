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


  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      isScan: true,
      showSlider: false,
      backClick: true,
      showGuide: false,
      showSide: true,
      secondMenuData: [],
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
      // {
      //   image: getImage().icon_tool_rolling,
      //   title: '流向',
      //   action: this.onFlowPress,
      // },
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

  onFullScapePress = () => {
    this.timeoutTrigger?.active()
    this._hideSlide()
    this._disableAttribte()
    this.stopCover()
    this.stopRolling()
  }

  onHolePress = () => {
    this.timeoutTrigger?.onShowSecondMenu()
    this._hideSlide()
    this._disableAttribte()
    this.stopRolling()
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startARCover(layer.name)
    }
    this.setState({
      secondMenuData: this.getCutMenu()
    })
  }

  onRollingPress = () => {
    this.timeoutTrigger?.onShowSecondMenu()
    this._hideSlide()
    this._disableAttribte()
    this.setState({
      secondMenuData: this.getRollingModeMenu()
    })
  }

  attribteEanbled = false
  onAttributePres = () => {
    this.timeoutTrigger?.onFirstMenuClick()
    this.stopCover()
    this.stopRolling()
    this._hideSlide()
    this.attribteEanbled = !this.attribteEanbled
    SExhibition.enablePipeAttribute(this.attribteEanbled)
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
    if(!this.state.showSide) {
      this.timeoutTrigger?.onBarShow()
    } else {
      this.timeoutTrigger?.onBarHide()
    }
    this.setState({showSide: !this.state.showSide})
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
    //
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
        visible={this.state.secondMenuData.length > 0}
        onHide={() => {
          this.timeoutTrigger?.onBackFromSecondMenu()
          this.setState({secondMenuData: []})
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

        {!this.state.showScan && this.renderRightSide()}
        {this.state.showScan && this.state.isScan && this.renderScan()}
        {this.renderLeftSide()}

        {this.renderRollingMode()}
        {this.state.showSlider && this.slider()}



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