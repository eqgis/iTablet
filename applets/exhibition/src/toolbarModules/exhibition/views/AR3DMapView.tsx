import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View ,Animated,StyleSheet,EmitterSubscription} from 'react-native'
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
import SlideBar from 'imobile_for_reactnative/components/SlideBar'
import { getLanguage } from '@/language'


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
  showSlide: boolean
  attribute: boolean
  /** 是否允许扫描界面进行扫描 true表示允许 fasle表示不允许 */
  isScan: boolean,
  showVideo:boolean
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
  speakData: Array<itemConmonType> = []

  scaleValue = 12
  rotationValue = 10

  listeners: {
    addListener:EmitterSubscription | undefined,
    infoListener:EmitterSubscription | undefined
  } | null = null

  /** 第一次显示扫描界面是否完成 */
  scanFirstShow = false
  sideBarIndex: string | undefined = ""
  shapBarIndex: string | undefined = undefined
  materialsBarIndex: string | undefined = undefined

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      isScan: false,
      showShape:false,
      showGuide: false,
      btRight:new Animated.Value(
        dp(20),
      ),
      btLeft:new Animated.Value(
        dp(20),
      ),
      mainMenu: this.getMainMenuItem(),
      showSlide: false,
      attribute:false,
      showVideo:false,
    }
  }

  getMainMenuItem = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_reset,
        title: getLanguage().PLOTTING_ANIMATION_RESET,
        action: async (index: string) => {
          if(this.isCarAnimationPlay) {
            await SARMap.pauseCarAnimation()
            this.isCarAnimationPlay = false
            // SExhibition.rotation3dMap(this.rotationValue)
          }
          // SExhibition.map3Dreset()
          this.scaleValue = 12
          this.rotationValue = 10
          SExhibition.scale3dMap(1.2)
          SExhibition.rotation3dMap(10)
          this.setState({showSlide:false})

          if (this.state.attribute) {
            SExhibition.setIsTouchSelect(false)
            this.setState({ attribute: false })
            Toast.show(getLanguage().SEARCHCLOSE, {
              backgroundColor: 'rgba(0,0,0,.5)',
              textColor: '#fff',
              duration: 2000,
            })
          }

          if(this.state.showVideo){
            this.setState({showVideo:false})
            SExhibition.showMapVideo(false)
          }
          this.setState({
            showShape: false,
            showSlide: false,
          })

          // if(this.sideBarIndex === index) {
          //   this.sideBarIndex = ""
          //   this.sideBar?.clear()
          //   return
          // }
          // this.sideBarIndex = index
        },
      },
      {
        image: getImage().tool_location,
        image_selected: getImage().tool_location_selected,
        title: getLanguage().ADJUSTMENT,
        action: async(index: string) => {
          if(!this.state.showSlide){
            this.timeoutTrigger?.onShowSecondMenu()
          }else{
            this.timeoutTrigger?.onBackFromSecondMenu()
          }
          this.setState({showSlide:!this.state.showSlide})

          // if(this.isCarAnimationPlay) {
          //   await SARMap.pauseCarAnimation()
          //   this.isCarAnimationPlay = false
          // }

          // if(this.open){
          //   SExhibition.rotation3dMap(this.rotationValue)
          // }

          // if(this.state.attribute){
          //   SExhibition.setIsTouchSelect(false)
          //   this.setState({attribute:false})
          //   Toast.show('查询关闭', {
          //     backgroundColor: 'rgba(0,0,0,.5)',
          //     textColor: '#fff',
          //     duration: 2000,
          //   })
          // }

          // if(this.state.showVideo){
          //   this.setState({showVideo:false})
          //   SExhibition.showMapVideo(false)
          // }
          this.setState({
            showShape: false,
          })

          if(this.sideBarIndex === index) {
            this.setState({
              showSlide: false,
            })
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index
        }
      },
      {
        image: getImage().icon_tool_shape,
        title: getLanguage().SHAPE,
        action: async (index: string) => {
          // if(this.isCarAnimationPlay) {
          //   await SARMap.pauseCarAnimation()
          //   this.isCarAnimationPlay = false
          // }
          if (this.open) {
            this.getShape()
            this.setState({ showShape: true })
            this.timeoutTrigger?.onShowSecondMenu()
            // if (this.state.attribute) {
            //   SExhibition.setIsTouchSelect(false)
            //   this.setState({ attribute: false })
            //   Toast.show('查询关闭', {
            //     backgroundColor: 'rgba(0,0,0,.5)',
            //     textColor: '#fff',
            //     duration: 2000,
            //   })
            // }

            // if(this.state.showVideo){
            //   this.setState({showVideo:false})
            //   SExhibition.showMapVideo(false)
            // }

            // SExhibition.rotation3dMap(this.rotationValue)
            this.setState({
              showSlide: false,
            })

            if(this.sideBarIndex === index) {
              this.setState({
                showShape: false,
              })
              this.sideBarIndex = ""
              this.sideBar?.clear()
              return
            }
            this.sideBarIndex = index
            this.shapBarIndex = index
          }
        },
      },
      {
        image: getImage().icon_tool_materials,
        title: getLanguage().TEXTTURE,
        action: async (index: string) => {
          if (this.open) {
            this.getMaterials()
            this.setState({ showShape: true })
            this.timeoutTrigger?.onShowSecondMenu()
            // if (this.state.attribute) {
            //   SExhibition.setIsTouchSelect(false)
            //   this.setState({ attribute: false })
            //   Toast.show('查询关闭', {
            //     backgroundColor: 'rgba(0,0,0,.5)',
            //     textColor: '#fff',
            //     duration: 2000,
            //   })
            // }

            // if(this.state.showVideo){
            //   this.setState({showVideo:false})
            //   SExhibition.showMapVideo(false)
            // }
            this.setState({
              showSlide: false,
            })

            if(this.sideBarIndex === index) {
              this.setState({
                showShape: false,
              })
              this.sideBarIndex = ""
              this.sideBar?.clear()
              return
            }
            this.sideBarIndex = index
            this.materialsBarIndex = index
          }
        },
      },
      {
        image: getImage().icon_tool_car,
        title: getLanguage().TRAFFIC,
        action: this.ChangeCarAnimation,
      },
      {
        image: getImage().icon_tool_video,
        title: getLanguage().MAP_AR_VIDEO,
        action: async(index: string)=>{
          if(this.isCarAnimationPlay) {
            await SARMap.pauseCarAnimation()
            this.isCarAnimationPlay = false
          }
          this.timeoutTrigger?.onFirstMenuClick()

          if (this.state.attribute) {
            SExhibition.setIsTouchSelect(false)
            this.setState({ attribute: false })
            Toast.show(getLanguage().SEARCHCLOSE, {
              backgroundColor: 'rgba(0,0,0,.5)',
              textColor: '#fff',
              duration: 2000,
            })
          }
          if(!this.state.showVideo){
            SExhibition.showMapVideo(true)
            // SExhibition.rotation3dMap(30)
          }else{
            SExhibition.showMapVideo(false)
            // SExhibition.rotation3dMap(this.rotationValue)
          }
          this.setState({showVideo:!this.state.showVideo,showSlide:false, showShape: false,})

          if(this.sideBarIndex === index) {
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index
        },
      },
      {
        image: getImage().icon_tool_attribute,
        title: getLanguage().ATTRIBUTE,
        action: async(index: string) => {
          if(!this.state.attribute){
            SExhibition.setIsTouchSelect(true)
            Toast.show(getLanguage().SEARCHSTART, {
              backgroundColor: 'rgba(0,0,0,.5)',
              textColor: '#fff',
              duration: 2000,
            })
          }else{
            SExhibition.setIsTouchSelect(false)
            Toast.show(getLanguage().SEARCHCLOSE, {
              backgroundColor: 'rgba(0,0,0,.5)',
              textColor: '#fff',
              duration: 2000,
            })
          }
          if(this.isCarAnimationPlay) {
            await SARMap.pauseCarAnimation()
            this.isCarAnimationPlay = false
          }

          if(this.state.showVideo){
            this.setState({showVideo:false})
            SExhibition.showMapVideo(false)
          }

          // if(this.open){
          //   SExhibition.rotation3dMap(this.rotationValue)
          // }

          this.setState({ attribute: !this.state.attribute, showSlide: false, showShape: false, })
          this.timeoutTrigger?.onFirstMenuClick()

          if(this.sideBarIndex === index) {
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index
        },
      },
    ]
  }

  getShape = () => {
    this.speakData = [
      {
        name: getLanguage().THEME_RECTANGLE,
        image: getImage().icon_tool_juxing,
        action: async () => {
          if(this.isCarAnimationPlay) {
            await SARMap.pauseCarAnimation()
            this.isCarAnimationPlay = false
          }
          if (this.state.attribute) {
            SExhibition.setIsTouchSelect(false)
            this.setState({ attribute: false })
            // Toast.show('查询关闭', {
            //   backgroundColor: 'rgba(0,0,0,.5)',
            //   textColor: '#fff',
            //   duration: 2000,
            // })
          }
          if(this.state.showVideo){
            this.setState({showVideo:false})
            SExhibition.showMapVideo(false)
          }

          SExhibition.removeMapviewElement()
          const relativePositin: Vector3 = {
            x: 0,
            y: 0,
            z: -1.2,
          }
          SExhibition.addMapviewElement(0,false, {
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
          // this.setState({ showShape: false })
          this.timeoutTrigger?.onBackFromSecondMenu()
        },
      },
      {
        name: getLanguage().CIRCULAR,
        image: getImage().icon_tool_yuan,
        action: async () => {
          if(this.isCarAnimationPlay) {
            await SARMap.pauseCarAnimation()
            this.isCarAnimationPlay = false
          }
          if (this.state.attribute) {
            SExhibition.setIsTouchSelect(false)
            this.setState({ attribute: false })
            // Toast.show('查询关闭', {
            //   backgroundColor: 'rgba(0,0,0,.5)',
            //   textColor: '#fff',
            //   duration: 2000,
            // })
          }
          if(this.state.showVideo){
            this.setState({showVideo:false})
            SExhibition.showMapVideo(false)
          }

          SExhibition.removeMapviewElement()
          const relativePositin: Vector3 = {
            x: 0,
            y: 0,
            z: -1.2,
          }
          SExhibition.addMapviewElement(4, false,{
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
          // this.setState({ showShape: false })
          this.timeoutTrigger?.onBackFromSecondMenu()
        },
      },
    ]
  }

  getMaterials = () => {
    this.speakData = [
      {
        name: getLanguage().PLAINWHITE,
        image: getImage().icon_tool_meterials0,
        action: async () => {
          SExhibition.changeBuildMaterials(0)
          // this.setState({ showShape: false })
          this.timeoutTrigger?.onBackFromSecondMenu()
        },
      },
      {
        name: getLanguage().TEACHBLUE,
        image: getImage().icon_tool_meterials1,
        action: async () => {
          SExhibition.changeBuildMaterials(2)
          // this.setState({ showShape: false })
          this.timeoutTrigger?.onBackFromSecondMenu()
        },
      },
      {
        name: getLanguage().RETROBROWN,
        image: getImage().icon_tool_meterials2,
        action: async () => {
          SExhibition.changeBuildMaterials(1)
          // this.setState({ showShape: false })
          this.timeoutTrigger?.onBackFromSecondMenu()
        },
      },
    ]
  }

  /** 点击了车流模拟按钮的响应方法 */
  ChangeCarAnimation = async (index: string) => {
    try {
      if(this.state.showVideo){
        this.setState({showVideo:false})
        SExhibition.showMapVideo(false)
      }
      if(this.isCarAnimationPlay) {
        await SARMap.pauseCarAnimation()
        this.isCarAnimationPlay = false
        // SExhibition.rotation3dMap(this.rotationValue)
      } else {
        // SExhibition.rotation3dMap(30)
        await SARMap.openCarAnimation()
        this.isCarAnimationPlay = true
      }
      this.setState({showSlide:false, showShape: false,})

      if (this.state.attribute) {
        SExhibition.setIsTouchSelect(false)
        this.setState({ attribute: false })
        Toast.show(getLanguage().SEARCHCLOSE, {
          backgroundColor: 'rgba(0,0,0,.5)',
          textColor: '#fff',
          duration: 2000,
        })
      }
      this.timeoutTrigger?.onFirstMenuClick()

      if(this.sideBarIndex === index) {
        this.sideBarIndex = ""
        this.sideBar?.clear()
        return
      }
      this.sideBarIndex = index
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
            // showShape: false,
          })
        }}
        imageStyle={{width: '100%', height: '100%',marginTop: dp(0)}}
        visible={this.state.showShape}
        onHide={() => {
          this.setState({
            showShape: false,
          })
        }}
      />
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

  arViewDidMount = (): void => {
    this.importData().then(() => {
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
    })
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

    AppEvent.addListener('ar_single_click', () =>{
      if(this.shapBarIndex === this.sideBar?.state.currentIndex || this.materialsBarIndex === this.sideBar?.state.currentIndex) {
        this.setState({
          showShape: !this.state.showShape,
        })
      } else {
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
      }


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
        Toast.show(getLanguage().LOCATIONSUCCESS, {
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
        z: -1.2,
      }
      this.result = pose
      SExhibition.addMapviewElement(0,true,{
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
      this.rotationValue = 10
      this.scaleValue = 12
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
      if(this.state.isScan) {
        SARMap.stopAREnhancePosition()
      }
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
    this.setState({
      showScan: true,
      showSlide: false,
    })
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
    return <ScanWrap windowSize={this.props.windowSize} hint={getLanguage().SCAN_TOP}/>
  }

  renderSlideBar = () => {
    return (
      <View style={[styles.toolView]}>
        <View style={styles.toolRow}>
          <Text style={{width: '100%', textAlign: 'center', fontSize: dp(12),color:'white'}}>{getLanguage().POSITION_ADJUST}</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={()=>{
              this.timeoutTrigger?.onBackFromSecondMenu()
              this.setState({showSlide:false})
            }}
          >
            <Image
              style={styles.closeImg}
              source={getImage().icon_cancel02}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{getLanguage().SCALE}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[5, 20]}
            defaultMaxValue={this.scaleValue}
            barColor={'#FF6E51'}
            onMove={loc => {
              SExhibition.scale3dMap(loc/10)
              this.scaleValue = loc
            }}
          />
        </View>
        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{getLanguage().ROTATION}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 180]}
            defaultMaxValue={this.rotationValue}
            barColor={'#FF6E51'}
            onMove={loc => {
              SExhibition.rotation3dMap(loc)
              this.rotationValue = loc
            }}
          />
        </View>
      </View>
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
          trigger={this.showSideBar}
        />
        {!this.state.showScan && this.renderRollingMode()}
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
            {!this.state.showScan && (
              <SideBar
                ref={ref => this.sideBar = ref}
                sections={[this.state.mainMenu]}
                showIndicator
              />
            )}
          </Animated.View>

        </View>


        {this.state.showScan && this.state.isScan && this.renderScan()}

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

        {this.state.showSlide && !this.state.showScan && this.renderSlideBar()}

        <ARArrow
          arrowShowed={() => Toast.show(getLanguage().FLLOW_THE_ARROW,{
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

const styles = StyleSheet.create({
  toolView: {
    position: 'absolute',
    left: dp(22),
    bottom: dp(22),
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

export default AR3DMapView