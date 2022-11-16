import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View ,Animated, EmitterSubscription} from 'react-native'
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
import ARViewLoadHandler from '../components/ARViewLoadHandler'
import SideBar, { Item } from '../components/SideBar'
import TimeoutTrigger from '../components/TimeoutTrigger'
import ScanWrap from '../components/ScanWrap'
import BottomMenu,{ itemConmonType } from "../components/BottomMenu"


interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showShape:boolean
  showGuide:boolean
  btRight:Animated.Value
  btLeft:Animated.Value
  mainMenu: Item[]
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
  /** 当前车流是否在播放 */
  isCarAnimationPlay = false

  sideBar: SideBar | null = null
  speakData: Array<itemConmonType> = [
    {
      name: '矩形',
      image: getImage().icon_tool_juxing,
      action:async () => {
        SExhibition.removeMapviewElement()
        const relativePositin: Vector3 = {
          x: 0,
          y: 0,
          z: -0.5,
        }
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
        this.setState({showShape: false})
        this.timeoutTrigger?.onBackFromSecondMenu()
      },
    },
    {
      name: '圆形',
      image: getImage().icon_tool_yuan,
      action: async () => {
        SExhibition.removeMapviewElement()
        const relativePositin: Vector3 = {
          x: 0,
          y: 0,
          z: -0.5,
        }
        SExhibition.addMapviewElement(4, {
          pose: this.result,
          translation: relativePositin
        })

        const _time = async function () {
          return new Promise(function (resolve, reject) {
            const timer = setTimeout(function () {
              resolve('waitting send close message')
              timer && clearTimeout(timer)
            }, 1500)
          })
        }
        await _time()

        await SExhibition.getMapviewLocation()
        this.setState({ showShape: false })
        this.timeoutTrigger?.onBackFromSecondMenu()
      },
    },
  ]

  listeners: {
    addListener:EmitterSubscription | undefined,
    infoListener:EmitterSubscription | undefined
  } | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: false,
      showShape:false,
      showGuide: false,
      btRight:new Animated.Value(
        dp(20),
      ),
      btLeft:new Animated.Value(
        dp(20),
      ),
      mainMenu: this.getMainMenuItem(),
    }
  }

  getMainMenuItem = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_reset,
        title: '复位',
        action: async ()=>{
          if(this.isCarAnimationPlay) {
            await SARMap.pauseCarAnimation()
            this.isCarAnimationPlay = false
          }
          SExhibition.map3Dreset()
          this.timeoutTrigger?.onFirstMenuClick()
        },
      },
      {
        image: getImage().icon_tool_shape,
        title: '地图形状',
        action: async () => {
          if(this.isCarAnimationPlay) {
            await SARMap.pauseCarAnimation()
            this.isCarAnimationPlay = false
          }
          if (this.open) {
            this.setState({ showShape: true })
            this.timeoutTrigger?.onShowSecondMenu()
          }
        },
      },
      {
        image: getImage().icon_tool_car,
        title: '车流模拟',
        action: this.ChangeCarAnimation,
      },
    ]
  }

  /** 点击了车流模拟按钮的响应方法 */
  ChangeCarAnimation = async () => {
    try {
      if(this.isCarAnimationPlay) {
        await SARMap.pauseCarAnimation()
        this.isCarAnimationPlay = false
      } else {
        await SARMap.openCarAnimation()
        this.isCarAnimationPlay = true
      }
      this.timeoutTrigger?.onFirstMenuClick()
    } catch (error) {
      return
    }
  }

  /** 详解被选中时显示的界面 */
  renderRollingMode = () => {
    return (
      <BottomMenu
        data={this.speakData}
        onSelect={()=>{
          this.setState({
            showShape: false,
          })
        }}
        visible={this.state.showShape}
        onHide={() => {
          this.setState({
            showShape: false,
          })
        }}
      />
    )
  }

  // renderRollingMode = () => {
  //   return (
  //     <FillAnimationWrap
  //       visible={this.state.showShape}
  //       animated={'bottom'}
  //       style={{
  //         position: 'absolute',
  //         alignSelf: 'center'
  //       }}
  //       range={[-dp(100), dp(20)]}
  //       onHide={() => {
  //         this.timeoutTrigger?.onBackFromSecondMenu()
  //         this.setState({showShape: false})
  //       }}
  //     >
  //       <View style={{
  //         borderRadius: dp(10),
  //         flexDirection: 'row',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         overflow: 'hidden',
  //       }}>
  //         {this.renderRollingBtn({
  //           image: getImage().icon_tool_juxing,
  //           title: '矩形',
  //           action: async () => {
  //             SExhibition.removeMapviewElement()
  //             const relativePositin: Vector3 = {
  //               x: 0,
  //               y: 0,
  //               z: -0.5,
  //             }
  //             SExhibition.addMapviewElement(0,{
  //               pose: this.result,
  //               translation: relativePositin
  //             })
  //             const _time = async function() {
  //               return new Promise(function(resolve, reject) {
  //                 const timer = setTimeout(function() {
  //                   resolve('waitting send close message')
  //                   timer && clearTimeout(timer)
  //                 }, 1500)
  //               })
  //             }
  //             await _time()
  //             await SExhibition.getMapviewLocation()
  //             this.setState({showShape: false})
  //             this.timeoutTrigger?.onBackFromSecondMenu()
  //           }
  //         })}
  //         {this.renderRollingBtn({
  //           image: getImage().icon_tool_yuan,
  //           title: '圆形',
  //           action: async () => {
  //             SExhibition.removeMapviewElement()
  //             const relativePositin: Vector3 = {
  //               x: 0,
  //               y: 0,
  //               z: -0.5,
  //             }
  //             SExhibition.addMapviewElement(4, {
  //               pose: this.result,
  //               translation: relativePositin
  //             })

  //             const _time = async function () {
  //               return new Promise(function (resolve, reject) {
  //                 const timer = setTimeout(function () {
  //                   resolve('waitting send close message')
  //                   timer && clearTimeout(timer)
  //                 }, 1500)
  //               })
  //             }
  //             await _time()

  //             await SExhibition.getMapviewLocation()
  //             this.setState({ showShape: false })
  //             this.timeoutTrigger?.onBackFromSecondMenu()
  //           }
  //         })}
  //       </View>
  //     </FillAnimationWrap>
  //   )
  // }

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

  arViewDidMount = (): void => {
    this.importData().then(() => {
      // if(this.state.showScan) {
      //   SARMap.setAREnhancePosition()
      // }
      this.listeners = SARMap.addMeasureStatusListeners({
        addListener: async result => {
          if (result) {
            this.setState({
              showScan: true,
            })
            // 启用增强定位
            SARMap.setAREnhancePosition()
          }
        },
      })
    })

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
        this.timeoutTrigger?.onBackFromScan()
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})

        if(!isAr3dMapGuided()) {
          setAr3dMapGuided()
          this.showGuide(true)
        } else {
          this.start(result)
        }
        Toast.show('定位成功', {
          backgroundColor: 'rgba(0,0,0,.5)',
          textColor: '#fff',
          duration: 2000,
        })
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
        z: -1,
      }
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

      const timer = setTimeout(()=>{
        SExhibition.setTrackingTarget({
          center: center,
          vertices: [vertice0,vertice1,vertice2,vertice3]
        })
        SExhibition.startTrackingTarget()
        clearTimeout(timer)
      }, 500)

      this.open = true
    })
  }

  showSideBar = () => {
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
    if(this.show) {
      this.timeoutTrigger?.onBarShow()
    } else {
      this.timeoutTrigger?.onBarHide()
    }
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
      this.timeoutTrigger?.onBackFromScan()
      SARMap.stopAREnhancePosition()
      this.setState({showScan: false})
      return
    }
    AppEvent.removeListener('ar_image_tracking_result')
    this.listeners && this.listeners.addListener?.remove()
    AppEvent.removeListener('ar_single_click')
    SExhibition.stopTrackingTarget()
    SExhibition.removeMapviewElement()
    SMap.exitMap()
    AppToolBar.goBack()
  }

  startScan = () => {
    this.timeoutTrigger?.onShowScan()
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
          top: dp(55),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        }}
        onPress={this.startScan}
      >
        <Image
          style={{ position: 'absolute', width: dp(30), height: dp(30) }}
          source={getImage().icon_other_scan}
        />
      </TouchableOpacity>
    )
  }

  /** 返回按钮 */
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

  /** 扫描界面 */
  renderScan = () => {
    return <ScanWrap windowSize={this.props.windowSize} hint={'请对准演示台上二维码进行扫描'}/>
  }

  timeoutTrigger: TimeoutTrigger | null = null

  render() {
    return(
      <>
        <ARViewLoadHandler arViewDidMount={this.arViewDidMount}/>
        <TimeoutTrigger
          ref={ref => this.timeoutTrigger = ref}
          timeout={15000}
          trigger={this.showSideBar}
        />
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
              height: '100%',
              right: this.state.btRight,
              flexDirection: 'row',
            }}
          >
            <SideBar
              ref={ref => this.sideBar = ref}
              sections={[this.state.mainMenu]}
              showIndicator
            />

          </Animated.View>

        </View>


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

        {this.renderRollingMode()}

        <ARArrow
          arrowShowed={() => Toast.show('请按照箭头引导转动屏幕查看立体地图',{
            backgroundColor: 'rgba(0,0,0,.5)',
            textColor: '#fff',
          })}
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