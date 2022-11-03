import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle ,Animated} from 'react-native'
import { AppEvent, AppStyle, AppToolBar, AppUser, DataHandler, Toast } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import Scan from '../components/Scan'
import { FileTools, SARMap, SExhibition, SMap } from 'imobile_for_reactnative'
import ARArrow from '../components/ARArrow'
import { Vector3 } from 'imobile_for_reactnative/types/data'
import { ConstPath } from '@/constants'
import { getGlobalPose, isAr3dMapGuided, setAr3dMapGuided, shouldRefresh3dMapData } from '../Actions'
import { Pose } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import ARGuide from '../components/ARGuide'


interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showShape:boolean
  showGuide:boolean
  btRight:Animated.Value
  btLeft:Animated.Value
}
class AR3DMapView extends React.Component<Props, State> {
  scanRef: Scan | null = null
  open = false
  result = {
    x: 0,
    y: 0,
    z: 0,
    qx: 0,
    qy: 0,
    qz: 0,
    qw: 0
  }
  show = true

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      showShape:false,
      showGuide: false,
      btRight:new Animated.Value(
        0,
      ),
      btLeft:new Animated.Value(
        dp(20),
      ),
    }
  }

  componentDidMount(): void {
    this.importData().then(() => {
      if(this.state.showScan) {
        SARMap.setAREnhancePosition()
      }
    })


    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        SExhibition.addTempPoint()
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})

        if(!isAr3dMapGuided()) {
          setAr3dMapGuided()
          this.showGuide(true)
        } else {
          this.start(result)
        }
      }
    })
  }

  showGuide = (show: boolean) => {
    this.setState({showGuide: show})
  }

  start = (pose: Pose) => {
    SMap.openMapName('MapClip').then(async () => {
      await SMap.openMap('MapClip')
      const relativePositin: Vector3 = {
        x: 0,
        y: 0,
        z: -0.5,
      }
      SExhibition.removeTempPoint()
      this.result = pose
      SExhibition.addMapviewElement(0,{
        pose: pose,
        translation: relativePositin
      })

      const _time = async function() {
        return new Promise(function(resolve, reject) {
          const timer = setTimeout(function() {
            resolve('waitting send close message')
            timer && clearTimeout(timer)
          }, 1500)
        })
      }
      await _time()

      const loca = await SExhibition.getMapviewLocation()

      const center: Vector3 = {
        x: loca.centerx,
        y: loca.centery,
        z: loca.centerz,
      }

      const vertice0: Vector3 = {
        x: loca.vertices[0].x,
        y: loca.vertices[0].y,
        z: loca.vertices[0].z,
      }

      const vertice1: Vector3 = {
        x: loca.vertices[1].x,
        y: loca.vertices[1].y,
        z: loca.vertices[1].z,
      }

      const vertice2: Vector3 = {
        x: loca.vertices[2].x,
        y: loca.vertices[2].y,
        z: loca.vertices[2].z,
      }

      const vertice3: Vector3 = {
        x: loca.vertices[3].x,
        y: loca.vertices[3].y,
        z: loca.vertices[3].z,
      }

      SExhibition.setTrackingTarget({
        center: center,
        vertices: [vertice0,vertice1,vertice2,vertice3]
      })
      SExhibition.startTrackingTarget()

      this.open = true
    })
  }

  importData = async () => {
    const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'MAP')
    const hasFlatMap = data.find(item => {
      return item.name === 'MapClip.xml'
    })
    let needToImport = await shouldRefresh3dMapData()

    if(needToImport && hasFlatMap) {
      //remove
      // console.warn('remove')
      const homePath = await FileTools.getHomeDirectory()
      const mapPath = homePath + hasFlatMap.path
      const mapExpPath = mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'
      await FileTools.deleteFile(mapPath)
      await FileTools.deleteFile(mapExpPath)
    } else if(!hasFlatMap) {
      needToImport = true
    }

    if(needToImport) {
      const homePath = await FileTools.getHomeDirectory()
      const path = homePath + ConstPath.Common + 'Exhibition/AR立体地图/ChengduNew'
      const data = await DataHandler.getExternalData(path)
      if(data.length > 0 && data[0].fileType === 'workspace') {
        await DataHandler.importExternalData(AppUser.getCurrentUser(), data[0])
        // console.warn('imported')
      } else {
        // console.warn('failed to load data')
      }
    } else {
      // console.warn('data already loaded')
    }
  }

  back = () => {
    if(this.state.showScan) {
      SARMap.stopAREnhancePosition()
      this.setState({showScan: false})
      return
    }
    AppEvent.removeListener('ar_image_tracking_result')
    SExhibition.stopTrackingTarget()
    SExhibition.removeMapviewElement()
    SMap.exitMap()
    AppToolBar.goBack()
  }

  startScan = () => {
    SExhibition.stopTrackingTarget()
    SExhibition.removeMapviewElement()
    SMap.exitMap()
    this.setState({showScan: true})
    this.scanRef?.scan()
    SARMap.setAREnhancePosition()
  }

  showScan = () => {
    this.setState({showScan:true})
  }

  /** 扫描按钮 */
  renderScanBtn = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(60),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(5),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onPress={this.startScan}
      >
        <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_other_scan}
        />
      </TouchableOpacity>
    )
  }

  renderBack = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
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
              {'请扫描演示台上的二维码加载展示内容'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  renderReset = () =>{
    return (
      <TouchableOpacity
        style={{
          width: dp(50),
          height: dp(60),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onPress={()=>{
          SExhibition.map3Dreset()
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
            source={getImage().icon_tool_reset}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'复位'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderMapControl = () => {
    let image
    if(this.state.showShape){
      image = getImage().icon_tool_shape_select
    }else {
      image = getImage().icon_tool_shape
    }
    return (
      <TouchableOpacity
        style={[{
          width: dp(50),
          height: dp(60),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },this.state.showShape&&{ borderRightWidth: dp(2), borderRightColor: '#F24F02'}]}
        onPress={()=>{
          if(this.state.showShape){
            this.setState({showShape:false})
          }else{
            if(this.open){
              this.setState({showShape:true})
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
          {'地图形状'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderjx = () => {
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
        onPress={async ()=>{
          this.setState({showShape:false})
          SExhibition.removeMapviewElement()
          const relativePositin: Vector3 = {
            x: 0,
            y: 0,
            z: -0.5,
          }
          SExhibition.removeTempPoint()
          SExhibition.addMapviewElement(0,{
            pose: this.result,
            translation: relativePositin
          })
          const _time = async function() {
            return new Promise(function(resolve, reject) {
              const timer = setTimeout(function() {
                resolve('waitting send close message')
                timer && clearTimeout(timer)
              }, 1500)
            })
          }
          await _time()
          await SExhibition.getMapviewLocation()
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
            source={getImage().icon_tool_juxing}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'矩形'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderyjx = () => {
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
        onPress={async ()=>{
          this.setState({showShape:false})
          SExhibition.removeMapviewElement()
          const relativePositin: Vector3 = {
            x: 0,
            y: 0,
            z: -0.5,
          }
          SExhibition.removeTempPoint()
          SExhibition.addMapviewElement(1,{
            pose: this.result,
            translation: relativePositin
          })

          const _time = async function() {
            return new Promise(function(resolve, reject) {
              const timer = setTimeout(function() {
                resolve('waitting send close message')
                timer && clearTimeout(timer)
              }, 1500)
            })
          }
          await _time()

          await SExhibition.getMapviewLocation()
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
            source={getImage().icon_tool_yuanjiaojx}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'圆角矩形'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderyx = () => {
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
        onPress={async ()=>{
          this.setState({showShape:false})
          SExhibition.removeMapviewElement()
          const relativePositin: Vector3 = {
            x: 0,
            y: 0,
            z: -0.5,
          }
          SExhibition.removeTempPoint()
          SExhibition.addMapviewElement(4,{
            pose: this.result,
            translation: relativePositin
          })

          const _time = async function() {
            return new Promise(function(resolve, reject) {
              const timer = setTimeout(function() {
                resolve('waitting send close message')
                timer && clearTimeout(timer)
              }, 1500)
            })
          }
          await _time()

          await SExhibition.getMapviewLocation()
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
            source={getImage().icon_tool_yuan}
          />
        </View>

        <Text
          style={{
            color: 'black',
            fontSize:10,
          }}
        >
          {'圆形'}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            width: '100%',
            height: '100%',
            // justifyContent: 'center',
            alignItems: 'flex-end',
          }}
          onPress={()=>{
            let right
            let left
            if (this.show) {
              right = -200
              left = -200
            }else {
              right = 0
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
          }}
        >

          <Animated.View
            style={{
              top: dp(50),
              right: this.state.btRight,
              flexDirection: 'row',
            }}
          >

            {this.state.showShape && <View
              style={{
                // position: 'absolute',
                top: dp(80),
                right: dp(10),
                width: dp(50),
                height: dp(120),
                borderRadius: dp(10),
                justifyContent: 'center',
                alignItems: 'center',
                // overflow: 'hidden',
                backgroundColor: 'white',
              }}
            >
              {this.renderjx()}
              {/* {this.renderyjx()} */}
              {this.renderyx()}
            </View>}


            <View>
              <View
                style={{
                  top: dp(10),
                  borderTopLeftRadius: dp(10),
                  borderBottomLeftRadius: dp(10),
                  backgroundColor: 'white',
                }}
              >
                {this.renderReset()}
              </View>


              <View
                style={{
                  top: dp(20),
                  borderTopLeftRadius: dp(10),
                  borderBottomLeftRadius: dp(10),
                  backgroundColor: 'white',
                }}
              >
                {this.renderMapControl()}
              </View>
            </View>

          </Animated.View>

        </TouchableOpacity>


        {this.state.showScan && this.renderScan()}

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


        <ARArrow
          arrowShowed={() => Toast.show('请按照箭头引导转动屏幕查看立体地图')}
        />

        <ARGuide
          show={this.state.showGuide}
          animationName={'Ar立体地图'}
          onSkip={() => {
            this.showGuide(false)
          }}
          onGuideEnd={() => {
            const globlaPose = getGlobalPose()
            if (globlaPose != null) {
              this.start(globlaPose)
            }
          }}
        />

      </>
    )
  }
}

export default AR3DMapView