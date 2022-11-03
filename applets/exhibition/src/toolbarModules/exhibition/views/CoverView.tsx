import { AppEvent, AppStyle, AppToolBar, Toast ,DataHandler} from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Scan from '../components/Scan'
import { TARLayerType, SARMap ,ARElementLayer,ARLayerType} from 'imobile_for_reactnative'
import { Slider } from 'imobile_for_reactnative/components'
import { getGlobalPose, isCoverGuided, setCoverGuided, setGolbalPose } from '../Actions'
import ARGuide from '../components/ARGuide'

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showCover: boolean
  showSlider:boolean
  backClick:boolean
  showGuide:boolean
}

class CoverView extends React.Component<Props, State> {
  currentRadiusx = 1
  currentRadiusy = 1
  currentDepth = 1
  scanRef: Scan | null = null
  coverClick = false
  fixClick = false

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      showCover: false,
      showSlider: false,
      backClick: true,
      showGuide: false,
    }
  }

  componentDidMount(): void {
    if(this.state.showScan) {
      SARMap.setAREnhancePosition()
    }

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
      return new Promise(function(resolve, reject) {
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

  cover = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startARCover(layer.name)
    }
  }

  fix = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if(layer){
      SARMap.startARFix(layer.name)
    }
  }

  back = async () => {
    if (this.state.backClick) {
      if (this.state.showScan) {
        this.setState({ showScan: false })
        return
      }
      const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
      if (layer) {
        SARMap.stopARCover(layer.name)
      }

      AppEvent.removeListener('ar_image_tracking_result')
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
          top: dp(20),
          left: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(25),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onPress={this.back}
      >
        <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_return}
        />
      </TouchableOpacity>
    )
  }

  renderLocation = () => {
    let image
    if(this.state.showScan){
      image = getImage().icon_cover_select
    }else{
      image = getImage().icon_cover
    }
    return (
      <TouchableOpacity
        style={{
          // position: 'absolute',
          // top: dp(80),
          // right: dp(10),
          width: dp(50),
          height: dp(60),
          borderTopLeftRadius: dp(10),
          borderBottomLeftRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
        onPress={async()=>{
          if(this.state.showScan){
            this.setState({showScan: false})
          }else{
            this.startScan()
            const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
            if (layer) {
              SARMap.stopARCover(layer.name)
            }
            const props = AppToolBar.getProps()
            await props.closeARMap()
            await props.setCurrentARLayer()
            this.setState({showScan: true})
          }
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
            source={image}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'定位'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderWindow = () => {
    let image
    if(this.state.showCover){
      image = getImage().icon_window_select
    }else {
      image = getImage().icon_window
    }
    return (
      <TouchableOpacity
        style={[{
          // position: 'absolute',
          // top: dp(140),
          // right: dp(10),
          width: dp(50),
          height: dp(60),
          // borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          // backgroundColor: 'white',
        },this.state.showCover&&{ borderRightWidth: dp(2), borderRightColor: '#F24F02'}]}
        onPress={()=>{
          if(this.state.showCover){
            this.setState({showCover:false})
          }else{
            const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
            if(layer){
              this.setState({showCover:true})
            }
          }
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
            source={image}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'视口模式'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderSliderContorl = () => {
    let image
    if(this.state.showSlider){
      image = getImage().icon_tool_slider_select
    }else{
      image = getImage().icon_tool_slider
    }
    return (
      <TouchableOpacity
        style={[{
          // position: 'absolute',
          // top: dp(200),
          // right: dp(10),
          width: dp(50),
          height: dp(60),
          // borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          // backgroundColor: 'white',
        },this.state.showSlider&&{borderRightWidth: dp(2),borderRightColor: '#F24F02'}]}
        onPress={()=>{
          if(this.state.showSlider){
            this.setState({ showSlider: false })
          }else{
            this.setState({ showSlider: true })
          }

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
            source={image}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'坑洞调整'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderCancel = () => {
    return (
      <TouchableOpacity
        style={{
          // position: 'absolute',
          // top: dp(260),
          // right: dp(10),
          width: dp(50),
          height: dp(60),
          // borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          // backgroundColor: 'white',
        }}
        onPress={() => {
          this.coverClick = false
          this.fixClick = false
          this.setState({ showSlider: false })
          const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
          if (layer) {
            SARMap.stopARCover(layer.name)
          }
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
            source={getImage().icon_cancel}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'退出裁剪'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderCover = () => {
    let image
    if (this.coverClick) {
      image = getImage().icon_tool_rectangle_select
    }else{
      image = getImage().icon_tool_rectangle
    }
    return (
      <TouchableOpacity
        style={{
          width: dp(50),
          height: dp(60),
          borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
        onPress={()=>{
          this.coverClick = true
          this.fixClick = false
          this.setState({showCover:false})
          this.cover()
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
            source={image}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'立方体'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderFix = () => {
    let image
    if(this.fixClick){
      image = getImage().icon_tool_fix_select
    }else{
      image = getImage().icon_tool_fix
    }
    return (
      <TouchableOpacity
        style={{
          width: dp(50),
          height: dp(60),
          borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
        onPress={()=>{
          this.fixClick = true
          this.setState({showCover:false})
          this.fix()
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
            source={image}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'固定'}
        </Text>
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
              {'请扫描地面上的二维码加载展示内容'}
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
          top: dp(80),
          left: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(5),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
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
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_other_scan}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <>
        <View
          style={{
            position: 'absolute',
            right: 0,
            width: dp(180),
            height: '100%',
            // justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >

          <View
            style={{
              top: dp(50),
              right: dp(0),
              flexDirection: 'row',
            }}
          >

            {this.state.showCover && <View
              style={{
                // position: 'absolute',
                top: dp(15),
                right: dp(10),
                width: dp(50),
                height: dp(110),
                borderRadius: dp(10),
                justifyContent: 'center',
                alignItems: 'center',
                // overflow: 'hidden',
                backgroundColor: 'white',
              }}
            >
              {this.renderCover()}
              {this.renderFix()}
            </View>}


            <View>
              {/* {this.renderLocation()} */}
              <View
                style={{
                  top: dp(10),
                  borderTopLeftRadius: dp(10),
                  borderBottomLeftRadius: dp(10),
                  backgroundColor: 'white',
                }}
              >
                {this.renderWindow()}
                {this.renderSliderContorl()}
                {this.renderCancel()}
              </View>
            </View>

          </View>

        </View>



        {this.state.showSlider && this.slider()}

        {this.state.showScan && this.renderScan()}
        {!this.state.showGuide && this.renderBack()}
        {(!this.state.showScan && !this.state.showGuide) && this.renderScanBtn()}


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