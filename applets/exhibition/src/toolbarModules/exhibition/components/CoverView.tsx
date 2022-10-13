import { AppEvent, AppStyle, AppToolBar, Toast ,DataHandler} from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Scan from './Scan'
import { TARLayerType, SARMap ,ARElementLayer,ARLayerType} from 'imobile_for_reactnative'
import { ConstPath } from '@/constants'

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showCover: boolean
}

class CoverView extends React.Component<Props, State> {

  scanRef: Scan | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: false,
      showCover: false,
    }
  }

  componentDidMount(): void {
    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})
        this.openARModel()
        Toast.show('定位成功')
      }
    })
  }

  openARModel = async () => {
    await this.checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    // console.warn(layer)
    // if(layer){
    // console.warn(layer)
    await SARMap.addARCover(layer.name, undefined)
    // }
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

  back = async () => {
    AppEvent.removeListener('ar_image_tracking_result')
    if(this.state.showScan) {
      SARMap.stopAREnhancePosition()
    }
    // SARMap.close()
    const props = AppToolBar.getProps()
    await props.closeARMap()
    await props.setCurrentARLayer()
    AppToolBar.goBack()
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
    return (
      <View
        style={{
          position: 'absolute',
          top: dp(100),
          right: dp(10),
          width: dp(50),
          height: dp(50),
          borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            width: dp(30),
            height: dp(30),
          }}
          onPress={()=>{
            if(this.state.showScan){
              this.setState({showScan: false})
            }else{
              this.setState({showScan: true})
            }
          }}
        >
          <Image
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            source={getImage().icon_cover}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize:10,
          }}
        >
          {'定位'}
        </Text>
      </View>
    )
  }

  renderWindow = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: dp(160),
          right: dp(10),
          width: dp(50),
          height: dp(50),
          borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            width: dp(30),
            height: dp(30),
          }}
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
          <Image
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            source={getImage().icon_window}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize:10,
          }}
        >
          {'视口模式'}
        </Text>
      </View>
    )
  }

  renderCover = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: dp(160),
          right: dp(70),
          width: dp(50),
          height: dp(50),
          borderRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            width: dp(30),
            height: dp(30),
          }}
          onPress={()=>{
            this.setState({showCover:false})
            this.cover()
          }}
        >
          <Image
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            source={getImage().icon_tool_rectangle}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize:10,
          }}
        >
          {'立方体'}
        </Text>
      </View>
    )
  }


  renderScan = () => {
    const isPortrait = this.props.windowSize.width < this.props.windowSize.height
    const width = Math.min(this.props.windowSize.width, this.props.windowSize.height)
    const height = Math.max(this.props.windowSize.width, this.props.windowSize.height)

    const space = width * 0.3 / 2

    const position = width * 0.7 / 2 + height / 2 + dp(40)

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
        maxWidth: (height / 2- width * 0.7 / 2 ) * 0.9,
        alignItems: 'center',
        top: width / 2,
        right: 0,
      }
    }

    return (
      <>
        <Scan
          ref={ref => this.scanRef = ref}
          windowSize={this.props.windowSize}
          auto={false}
          color='red' />

        <View
          style={style}
        >
          <TouchableOpacity
            style={{
              width: dp(100),
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.startScan}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={getImage().background_red}
              resizeMode="stretch" />
            <Text style={[AppStyle.h3, { color: 'white' }]}>
              {'扫一扫'}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              marginTop: dp(10),
              textAlign: 'center',
            }}
          >
            {'请扫描演示台上的二维码加载展示内容'}
          </Text>
        </View>

      </>
    )
  }

  render() {
    return(
      <>
        {this.state.showScan && this.renderScan()}
        {this.renderBack()}
        {this.renderLocation()}
        {this.renderWindow()}
        {this.state.showCover && this.renderCover()}
      </>
    )
  }
}

export default CoverView