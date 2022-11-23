import { AppEvent, AppToolBar, AppUser, DataHandler, Toast } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle, Animated ,StyleSheet,EmitterSubscription} from 'react-native'
import Scan from '../components/Scan'
import { FileTools, SARMap, SExhibition, SMap } from 'imobile_for_reactnative'
import ARArrow from '../components/ARArrow'
import { Vector3 } from 'imobile_for_reactnative/types/data'
import { ConstPath } from '@/constants'
import { flatMapImported, getGlobalPose, isFlatMapGuided, setFlatMapGuided, setGolbalPose, shouldRefreshFlatMapData } from '../Actions'
import { Pose } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import ARGuide from '../components/ARGuide'
import { ILocalData } from '@/utils/DataHandler/DataLocal'
import SideBar, { Item } from '../components/SideBar'
import ImageList, { ImageItem } from '../components/ImageList'
import ARViewLoadHandler from '../components/ARViewLoadHandler'
import TimeoutTrigger from '../components/TimeoutTrigger'
import ScanWrap from '../components/ScanWrap'
import SlideBar from 'imobile_for_reactnative/components/SlideBar'

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showGuide: boolean
  imageList: ImageItem[]
  showSide: boolean
  showSlide: boolean
  /** 是否允许扫描界面进行扫描 true表示允许 fasle表示不允许 */
  isScan: boolean
}

interface FlatMap {
  extFolderName: string
  mapName: string
}

const flatMaps: FlatMap[] = [
  {
    extFolderName: '台风登陆路径',
    mapName: '台风登陆路径'
  },
  {
    extFolderName: '玛多地震',
    mapName: '玛多地震'
  },
  {
    extFolderName: '红色足迹',
    mapName: '红色足迹'
  },
]
class FlatMapVIew extends React.Component<Props, State> {

  scanRef: Scan | null = null

  isMapOpend = false

  imageList: ImageList | null = null
  listeners: {
    addListener:EmitterSubscription | undefined,
    infoListener:EmitterSubscription | undefined
  } | null = null

  /** 第一次显示扫描界面是否完成 */
  scanFirstShow = false
  sideBar: SideBar | null = null
  sideBarIndex: string | undefined = ""
  aiPicBarIndex: string | undefined = undefined
  changemapBarIndex: string | undefined = undefined 

  scaleValue = 10
  rotationValue = 40

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: true,
      isScan: false,
      showGuide: false,
      imageList: [],
      showSide: true,
      showSlide: false,
    }
  }

  getSideBarItems = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_reset,
        image_selected: getImage().icon_tool_reset_selected,
        title: '复位',
        action: (index: string) => {
          if(this.sideBarIndex === index) {
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index

          this.timeoutTrigger?.onFirstMenuClick()
          this.hideListIfAny()
          this.showLoading(500)
          this.scaleValue = 10
          this.rotationValue = 40
          SExhibition.scaleFlatMap(1)
          SExhibition.rotationFlatMap(40)
          this.setState({
            showSlide:false,
            imageList: [],
          })
          // SExhibition.onFlatFunctionPress('reset')
        }
      },
      {
        image: getImage().tool_location,
        image_selected: getImage().tool_location_selected,
        title: '调整',
        action: (index: string) => {
          if(this.sideBarIndex === index) {
            this.setState({
              showSlide:false,
            })
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index

          if(!this.state.showSlide){
            this.timeoutTrigger?.onShowSecondMenu()
          }else{
            this.timeoutTrigger?.onBackFromSecondMenu()
          }
          this.setState({
            showSlide:!this.state.showSlide,
            imageList: [],
          })
        }
      },
      {
        image: getImage().flat_ai_pic,
        image_selected: getImage().flat_ai_pic_selected,
        title: '配图',
        action: (index: string) => {
          if(this.sideBarIndex === index) {
            this.setState({
              imageList: []
            })
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index
          this.aiPicBarIndex =index

          this.timeoutTrigger?.onShowSecondMenu()
          this.setState({
            imageList: this.getAiList(),
            showSlide:false,
          })
        }
      },
      {
        image: getImage().flat_search,
        image_selected: getImage().flat_search_selected,
        title: '查询',
        action: (index: string) => {
          if(this.sideBarIndex === index) {
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index
          this.changemapBarIndex = index

          this.timeoutTrigger?.onFirstMenuClick()
          this.hideListIfAny()
          this.showLoading(500)
          SExhibition.onFlatFunctionPress('search')
          this.setState({
            imageList: [],
            showSlide:false,
          })

        }
      },
      {
        image: getImage().flat_buffer,
        image_selected: getImage().flat_buffer_selected,
        title: '分析',
        action: (index: string) => {
          if(this.sideBarIndex === index) {
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index

          this.timeoutTrigger?.onFirstMenuClick()
          this.hideListIfAny()
          this.showLoading(500)
          SExhibition.onFlatFunctionPress('buffer')
          this.setState({
            imageList: [],
            showSlide:false,
          })
        }
      },
      {
        image: getImage().flat_plot,
        image_selected: getImage().flat_plot_selected,
        title: '标绘',
        action: (index: string) => {
          if(this.sideBarIndex === index) {
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index

          this.timeoutTrigger?.onFirstMenuClick()
          this.hideListIfAny()
          this.showLoading(500)
          SExhibition.onFlatFunctionPress('plot')
          this.setState({
            imageList: [],
            showSlide:false,
          })
        }
      }
    ]
  }

  getSideBarMapItems = (): Item[] => {
    return [
      {
        image: getImage().flat_change_map,
        image_selected: getImage().flat_change_map_selected,
        title: '地图',
        action: (index: string) => {
          if(this.sideBarIndex === index) {
            this.setState({
              imageList: []
            })
            this.sideBarIndex = ""
            this.sideBar?.clear()
            return
          }
          this.sideBarIndex = index
          this.changemapBarIndex = index

          this.timeoutTrigger?.onShowSecondMenu()
          this.setState({
            imageList: this.getMapList(),
            showSlide:false,
          })
        }
      }
    ]
  }

  getMapList = (): ImageItem[] => {
    return [
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail.png'},
        path: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail.png',
        onTouch: () => {
          this.hideListIfAny()
          this.showLoading(500)
          SExhibition.changeFlatMap(flatMaps[0].mapName)
        }
      },
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail2.png'},
        path: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail2.png',
        onTouch: () => {
          this.hideListIfAny()
          this.showLoading(500)
          SExhibition.changeFlatMap(flatMaps[1].mapName)
        }
      },
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail3.png'},
        path: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail3.png',
        onTouch: () => {
          this.hideListIfAny()
          this.showLoading(500)
          SExhibition.changeFlatMap(flatMaps[2].mapName)
        }
      },
    ]
  }

  getAiList = (): ImageItem[] => {
    return [
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/1.jpg'},
        path: '/sdcard/iTablet/Common/Exhibition/AR平面地图/1.jpg',
        onTouch: SExhibition.setAiPicture
      },
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/2.jpg'},
        path: '/sdcard/iTablet/Common/Exhibition/AR平面地图/2.jpg',
        onTouch: SExhibition.setAiPicture
      },
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/3.jpg'},
        path: '/sdcard/iTablet/Common/Exhibition/AR平面地图/3.jpg',
        onTouch: SExhibition.setAiPicture
      },
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/4.jpg'},
        path: '/sdcard/iTablet/Common/Exhibition/AR平面地图/4.jpg',
        onTouch: SExhibition.setAiPicture
      },
    ]
  }

  hideListIfAny = () => {
    if(this.state.imageList.length != 0) {
      this.imageList?.hideList()
    }
  }

  showLoading = (time: number) => {
    global.Loading.setLoading(true)
    setTimeout(() => {
      global.Loading.setLoading(false)
    }, time)
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
    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        this.timeoutTrigger?.onBackFromScan()
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})

        setGolbalPose(result)

        if(!isFlatMapGuided()) {
          setFlatMapGuided()
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
    const globlaPose = getGlobalPose()
    if(globlaPose != null) {
      if(!isFlatMapGuided()) {
        setFlatMapGuided()
        this.showGuide(true)
      } else {
        this.start(globlaPose)
      }
    }
    AppEvent.addListener('ar_single_click', this.onSingleClick)
  }

  onSingleClick = () => {
    if((this.aiPicBarIndex === this.sideBar?.state.currentIndex || this.changemapBarIndex === this.sideBar?.state.currentIndex) && this.state.imageList.length != 0) {
      if(this.imageList?.state.vislble) {
        this.hideListIfAny()
      } else {
        this.imageList?.showList()
      }

    } else {
      if(this.state.showSide) {
        this.timeoutTrigger?.onBarHide()
      } else {
        this.timeoutTrigger?.onBarShow()
      }
      this.setState({showSide: !this.state.showSide})
    }
  }

  showGuide = (show: boolean) => {
    this.setState({showGuide: show})
  }

  start = (pose: Pose) => {
    // SExhibition.addTempPoint()
    this.addMap(pose)
  }

  addMap = async (pose: Pose) => {
    if(!this.isMapOpend) {
      // SExhibition.addTempPoint()
      await SMap.openMapName(flatMaps[0].mapName)
      await SMap.openMap(flatMaps[0].mapName)
      this.isMapOpend = true
    }
    const relativePositin: Vector3 = {
      x: 0,
      y: 0,
      z: -1,
    }
    // SExhibition.removeTempPoint()
    SExhibition.addFlatMap({
      pose: pose,
      translation: relativePositin
    })
    this.rotationValue = 40
    this.scaleValue = 10
    if(relativePositin) {
      const timer = setTimeout(()=>{
        SExhibition.setTrackingTarget({
          pose: pose,
          translation: relativePositin
        })
        SExhibition.startTrackingTarget()
        clearTimeout(timer)
      }, 2300)
    }
  }


  importData = async () => {
    const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'MAP')
    const needToImport = await shouldRefreshFlatMapData()

    const ps = flatMaps.map(async map => {
      return this.importMap(map, data, needToImport)
    })

    await Promise.all(ps)
  }

  importMap = async (map: FlatMap, localMaps: ILocalData[], needToImport: boolean) => {
    const hasFlatMap = localMaps.find(item => {
      return item.name === `${map.mapName}.xml`
    })

    if(needToImport && hasFlatMap) {
      //remove
      // console.warn('remove')
      const homePath = await FileTools.getHomeDirectory()
      const mapPath = homePath + hasFlatMap.path
      const mapExpPath = mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'
      await FileTools.deleteFile(mapPath)
      await FileTools.deleteFile(mapExpPath)
      const animationPath = homePath + ConstPath.UserPath + `Customer/Data/Animation/${map.mapName}`
      await FileTools.deleteFile(animationPath)
    } else if(!hasFlatMap) {
      needToImport = true
    }

    if(needToImport) {
      const homePath = await FileTools.getHomeDirectory()
      const path = homePath + ConstPath.Common + `Exhibition/AR平面地图/${map.extFolderName}`
      const data = await DataHandler.getExternalData(path)
      if(data.length > 0 && data[0].fileType === 'workspace') {
        await DataHandler.importExternalData(AppUser.getCurrentUser(), data[0])
        flatMapImported()
        // console.warn('imported')
      } else {
        // console.warn('failed to load data')
      }
    } else {
      // console.warn('no need to import')
    }
  }

  back = () => {
    if(this.state.showScan) {
      this.timeoutTrigger?.onBackFromScan()
      if(this.state.isScan) {
        SARMap.stopAREnhancePosition()
      }
      SExhibition.resumeTrackingTarget()
      this.setState({showScan: false})
      return
    }
    AppEvent.removeListener('ar_image_tracking_result')
    this.listeners && this.listeners.addListener?.remove()
    AppEvent.removeListener('ar_single_click', this.onSingleClick)
    SExhibition.stopTrackingTarget()
    SExhibition.removeFlatMap()
    AppToolBar.goBack()
  }

  startScan = () => {
    if(this.state.showScan) return
    this.timeoutTrigger?.onShowScan()
    SExhibition.pauseTrackingTarget()
    this.setState({
      showScan: true,
      showSlide: false,
    })
    SARMap.setAREnhancePosition()
  }

  renderBack = () => {
    return (
      <AnimationWrap
        range={[-dp(100), dp(20)]}
        animated={'left'}
        visible={this.state.showSide}
        style={{
          position: 'absolute',
          top: dp(20),
        }}
      >
        <TouchableOpacity
          style={{
            width: dp(45),
            height: dp(45),
            borderRadius: dp(8),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#1E1E1EA6'
          }}
          onPress={this.back}
        >
          <Image
            style={{ position: 'absolute', width: dp(30), height: dp(30) }}
            source={getImage().icon_return}
          />
        </TouchableOpacity>
      </AnimationWrap>
    )
  }

  renderScanIcon = () => {
    return (
      <AnimationWrap
        range={[-dp(100), dp(20)]}
        animated={'left'}
        visible={this.state.showSide}
        style={{
          position: 'absolute',
          top: dp(75),
        }}
      >
        <TouchableOpacity
          style={{
            width: dp(45),
            height: dp(45),
            borderRadius: dp(8),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#1E1E1EA6'
          }}
          onPress={this.startScan}
        >
          <Image
            style={{ position: 'absolute',  width: dp(30), height: dp(30) }}
            source={getImage().icon_other_scan}
          />
        </TouchableOpacity>
      </AnimationWrap>
    )
  }

  renderScan = () => {
    return <ScanWrap windowSize={this.props.windowSize} hint={'请对准演示台上二维码进行扫描'}/>
  }

  renderSideBar = () => {
    return (
      <>
        <ImageList
          ref={ref => this.imageList = ref}
          data={this.state.imageList}
          onHide={this.timeoutTrigger?.onBackFromSecondMenu}
        />
        <AnimationWrap
          range={[-dp(100), dp(20)]}
          animated={'right'}
          visible={this.state.showSide}
          style={{
            position: 'absolute',
            top: dp(20),
            // right: 0,
          }}
        >
          <SideBar
            ref={ref => this.sideBar = ref}
            sections={[
              this.getSideBarItems(),
              this.getSideBarMapItems()
            ]}
            showIndicator
          />
        </AnimationWrap>

      </>
    )
  }


  renderSlideBar = () => {
    return (
      <View style={[styles.toolView]}>
        <View style={styles.toolRow}>
          <Text style={{width: '100%', textAlign: 'center', fontSize: dp(12),color:'white'}}>位置调整</Text>
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
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{"缩放"}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[5, 20]}
            defaultMaxValue={this.scaleValue}
            barColor={'#FF6E51'}
            onMove={loc => {
              SExhibition.scaleFlatMap(loc/10)
              this.scaleValue = loc
            }}
          />
        </View>
        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: '#fff'}}>{"旋转"}</Text>
          <SlideBar
            // ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 180]}
            defaultMaxValue={this.rotationValue}
            barColor={'#FF6E51'}
            onMove={loc => {
              SExhibition.rotationFlatMap(loc)
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
          trigger={() => {
            this.setState({
              showSide: false
            })
          }}
        />
        {this.state.showScan && this.state.isScan && this.renderScan()}
        {!this.state.showGuide && this.renderBack()}
        {(!this.state.showScan && !this.state.showGuide) && this.renderScanIcon()}
        {(!this.state.showScan && !this.state.showGuide && !this.state.showScan) && this.renderSideBar()}
        {this.state.showSlide && !this.state.showScan && this.renderSlideBar()}
        <ARArrow
          arrowShowed={() => {
            Toast.show('请按照箭头引导转动屏幕查看地图', {
              backgroundColor: 'rgba(0,0,0,.5)',
              textColor: '#fff',
            })
          }}
        />
        <ARGuide
          show={this.state.showGuide}
          animationName={'Ar平面地图'}
          onSkip={() => {
            this.showGuide(false)
          }}
          onGuideEnd={() => {
            const globlaPose = getGlobalPose()
            if(globlaPose != null) {
              this.start(globlaPose)
            }
          }}
        />

      </>
    )
  }
}

export default FlatMapVIew



interface AnimationWrapProps extends React.ClassAttributes<AnimationWrap>{
  visible: boolean
  style: ViewStyle
  range: [number, number]
  animated: 'left' | 'right' | 'top' | 'bottom'
}

class AnimationWrap extends React.Component<AnimationWrapProps> {


  value: Animated.Value

  constructor(props: AnimationWrapProps) {
    super(props)

    this.value = new Animated.Value(props.range[props.visible ? 1 : 0])
  }

  componentDidUpdate(prevProps: Readonly<AnimationWrapProps>): void {
    if(prevProps.visible !== this.props.visible) {
      if(this.props.visible) {
        this.show()
      } else {
        this.hide()
      }
    }
  }

  show = () => {
    Animated.timing(this.value, {
      toValue: this.props.range[1],
      duration: 500,
      useNativeDriver: false
    }).start()
  }

  hide = () =>{
    Animated.timing(this.value, {
      toValue: this.props.range[0],
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  render(): React.ReactNode {
    return (
      <Animated.View
        style={[
          this.props.style,
          this.props.animated === 'bottom' && { bottom: this.value},
          this.props.animated === 'top' && { top: this.value},
          this.props.animated === 'left' && { left: this.value},
          this.props.animated === 'right' && { right: this.value},
        ]}
      >
        {this.props.children}
      </Animated.View>
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