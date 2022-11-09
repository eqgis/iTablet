import { AppEvent, AppStyle, AppToolBar, Toast ,DataHandler} from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle,  Animated, } from 'react-native'
import Scan from '../components/Scan'
import { TARLayerType, SARMap ,ARElementLayer,ARLayerType} from 'imobile_for_reactnative'
import { Slider } from 'imobile_for_reactnative/components'
import { getGlobalPose, isCoverGuided, setCoverGuided } from '../Actions'
import ARGuide from '../components/ARGuide'
import SideBar, { Item } from '../components/SideBar'
import FillAnimationWrap from '../components/FillAnimationWrap'

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showCover: boolean
  showSlider:boolean
  backClick:boolean
  showGuide:boolean
  btRight:Animated.Value
  btLeft:Animated.Value
  showRolling:boolean
  mainMenu: Item[]
  showRollingMode: boolean
}

class CoverView extends React.Component<Props, State> {
  currentRadiusx = 1
  currentRadiusy = 1
  currentDepth = 1
  scanRef: Scan | null = null
  coverClick = false
  fixClick = false
  show = true
  verticalClick = false
  horizontalClick = false

  isCutMode = false

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      showCover: false,
      showSlider: false,
      backClick: true,
      showGuide: false,
      btRight:new Animated.Value(
        dp(20),
      ),
      btLeft:new Animated.Value(
        dp(20),
      ),
      showRolling:false,
      mainMenu: this.getMainMenuItem(),
      showRollingMode: false,
    }
  }

  getMainMenuItem = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_rectangle,
        title: '全景',
        action: this.fullScape,
      },
      {
        image: getImage().icon_tool_rectangle,
        title: '视口模式',
        action: this.cover,
      },
      {
        image: getImage().icon_tool_rolling,
        title: '卷帘模式',
        action: this.rollingMenu,
      },
      // {
      //   image: getImage().icon_tool_rolling,
      //   title: '流向',
      //   action: this.rollingMenu,
      // },
      // {
      //   image: getImage().icon_tool_rolling,
      //   title: '属性',
      //   action: this.rollingMenu,
      // },
    ]
  }

  getCutMenu = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_rolling,
        title: '范围',
        action: this.adjustCoverBounds,
      },
      {
        image: getImage().icon_tool_fix,
        title: '固定',
        action: this.fix,
      }
    ]

  }

  componentDidMount(): void {
    if(this.state.showScan) {
      SARMap.setAREnhancePosition()
    }

    AppEvent.addListener('ar_single_click', () =>{
      let right
      let left
      if (this.show) {
        right = -200
        left = -200
      }else {
        right = dp(20)
        left = dp(20)
      }
      this.show = !this.show
      Animated.parallel([
        Animated.timing(this.state.btRight, {
          toValue: right,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.btLeft, {
          toValue: left,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start()
    })

    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false ,backClick:false})

        if(!isCoverGuided()) {
          setCoverGuided()
          this.showGuide(true)
        } else {
          this.openARModel()
        }
        Toast.show('定位成功')
      }
    })
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

  fullScape = () => {
    this._exitCutMode()
    this.stopCover()
    this.stopRolling()
  }

  cover = () => {
    this._enterCutMode()
    this.stopRolling()
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startARCover(layer.name)
    }
  }

  stopCover = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.stopARCover(layer.name)
    }
  }

  adjustCoverBounds = () => {
    if(this.state.showSlider){
      this.setState({ showSlider: false })
    }else{
      this.setState({ showSlider: true })
    }
  }

  fix = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startARFix(layer.name)
    }
  }

  rollingMenu = () => {
    this._exitCutMode()
    this.setState({
      showRollingMode: true
    })
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
    this._exitCutMode()
  }

  attribute = () => {
    this._exitCutMode()
  }

  _enterCutMode = () =>{
    if(!this.isCutMode) {
      this.isCutMode = true
      this.setState({
        mainMenu: [...this.getMainMenuItem(), ...this.getCutMenu()]
      })
    }
  }

  _exitCutMode = () => {
    if(this.isCutMode) {
      this.isCutMode = false
      this.setState({mainMenu: this.getMainMenuItem()})
    }
  }

  back = async () => {
    if (this.state.backClick) {
      if (this.state.showScan) {
        this.setState({ showScan: false })
        return
      }
      this.stopCover()
      this.stopRolling()

      AppEvent.removeListener('ar_image_tracking_result')
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
          position: 'absolute',
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        }}
        onPress={this.back}
      >
        <Image
          style={{ position: 'absolute', width: dp(30), height: dp(30) }}
          source={getImage().icon_return}
        />
      </TouchableOpacity>
    )
  }

  renderScan = () => {
    const isPortrait = this.props.windowSize.width < this.props.windowSize.height
    const width = Math.min(this.props.windowSize.width, this.props.windowSize.height)
    const height = Math.max(this.props.windowSize.width, this.props.windowSize.height)
    const isLargeScreen = width > 400 //平板

    const scanSize = dp(300)

    let space: number
    let position: number
    let maxWidth: number

    const positionLargeLand = width / 2 + scanSize / 2 + dp(40)
    const positionLargePortrait = height / 2 + scanSize / 2 + dp(40)
    const postionSmallLand = width * 0.7 / 2 + width / 2 + dp(40)
    const postionSmallPortrait = width * 0.7 / 2 + height / 2 + dp(40)

    const spaceLarge = width - scanSize / 2
    const spaceSmall = width * 0.3 / 2

    const maxWidthLarge = (height / 2- scanSize / 2 ) * 0.9
    const maxWidthSmall = (height / 2- width * 0.7 / 2 )

    if(isLargeScreen) {
      space = spaceLarge
      position = isPortrait ? positionLargePortrait : positionLargeLand
      maxWidth = maxWidthLarge
    } else {
      space = spaceSmall
      position = isPortrait ? postionSmallPortrait : postionSmallLand
      maxWidth = maxWidthSmall
    }

    let style : ViewStyle = {
      position: 'absolute',
      flex: 1,
      width: '100%',
      height: dp(70),
      alignItems: 'center',
      top: position,
      overflow: 'hidden',
    }
    if(!isPortrait && space < dp(70)) {
      style = {
        position: 'absolute',
        flex: 1,
        maxWidth: maxWidth,
        alignItems: 'center',
        // top: width / 2,
        bottom: dp(10),
      }
    }

    return (
      <>
        <Scan
          ref={ref => this.scanRef = ref}
          windowSize={this.props.windowSize}
          scanSize={scanSize}
          color='red'
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: dp(10),
          }}
        >
          <View
            style={style}
          >
            {/* <TouchableOpacity
            style={{
              width: dp(100),
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            // onPress={this.startScan}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={getImage().background_red}
              resizeMode="stretch" />
            <Text style={[AppStyle.h3, { color: 'white' }]}>
              {'扫一扫'}
            </Text>
          </TouchableOpacity> */}
            <Text
              style={{
                color: 'white',
                marginTop: dp(10),
                textAlign: 'center',
              }}
            >
              {'请对准地面上的二维码进行扫描'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  slider = () => {
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
          backgroundColor: 'white',
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
                this.fixClick = false
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
                this.fixClick = false
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
                this.fixClick = false
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

  /** 扫描按钮 */
  renderScanBtn = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(55),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        }}
        onPress={async () => {
          if (this.state.showScan) {
            this.setState({ showScan: false })
          } else {
            this.startScan()
            const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
            if (layer) {
              SARMap.stopARCover(layer.name)
            }
            const props = AppToolBar.getProps()
            await props.closeARMap()
            await props.setCurrentARLayer()
            this.setState({ showScan: true })
          }
        }}
      >
        <Image
          style={{ position: 'absolute', width: dp(30), height: dp(30) }}
          source={getImage().icon_other_scan}
        />
      </TouchableOpacity>
    )
  }

  renderRollingBtn = (item: Item) => {
    return (
      <TouchableOpacity
        onPress={item.action}
        style={{
          width: dp(80),
          height: dp(80),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(30,30,30,0.65)',
        }}
      >
        <Image
          source={item.image}
          style={{
            width: dp(40),
            height: dp(40)
          }}
        />
        <Text style={[{...AppStyle.h3, color: 'white'}]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderRollingMode = () => {
    return (
      <FillAnimationWrap
        visible={this.state.showRollingMode}
        animated={'bottom'}
        style={{
          position: 'absolute',
          alignSelf: 'center'
        }}
        range={[-dp(100), dp(20)]}
        onHide={() => {
          this.setState({showRollingMode: false})
        }}
      >
        <View style={{
          borderRadius: dp(10),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
          {this.renderRollingBtn({
            image: getImage().icon_tool_horizontal,
            title: '横向',
            action: () => {
              this.rolling(0)
              this.setState({showRollingMode: false})
            }
          })}
          {this.renderRollingBtn({
            image: getImage().icon_tool_vertical,
            title: '纵向',
            action: () => {
              this.rolling(1)
              this.setState({showRollingMode: false})
            }
          })}
        </View>
      </FillAnimationWrap>
    )
  }

  render() {
    return(
      <>
        <View
          style={{
            position: 'absolute',
            right: 0,
            width: '100%',
            height: '100%',
            // justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >

          <Animated.View
            style={{
              top: dp(20),
              right: this.state.btRight,
              flexDirection: 'row',
            }}
          >
            <SideBar
              sections={[this.state.mainMenu]}
              showIndicator
            />
          </Animated.View>

        </View>


        {this.state.showScan && this.renderScan()}
        {this.state.showSlider && this.slider()}
        <Animated.View
          style={{
            position: 'absolute',
            top: dp(20),
            left: this.state.btLeft,
            width: dp(60),
            height: dp(200),
            overflow: 'hidden',
          }}
        >

          {!this.state.showGuide && this.renderBack()}
          {(!this.state.showScan && !this.state.showGuide) && this.renderScanBtn()}
        </Animated.View>

        {this.renderRollingMode()}



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

export default CoverView