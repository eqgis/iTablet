import { AppEvent, AppToolBar, AppUser, DataHandler, Toast } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
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

interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  showGuide: boolean
  imageList: ImageItem[]
}

interface FlatMap {
  extFolderName: string
  mapName: string
}

const flatMaps: FlatMap[] = [
  {
    extFolderName: '台风登陆路径',
    mapName: '2021年7号台风查帕卡(CEMPAKA)'
  },
  {
    extFolderName: '玛多地震',
    mapName: '玛多地震'
  },
  {
    extFolderName: '红色足迹_71',
    mapName: '红色足迹'
  },
]
class FlatMapVIew extends React.Component<Props, State> {

  scanRef: Scan | null = null

  isMapOpend = false

  imageList: ImageList | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      showScan: getGlobalPose() == null,
      showGuide: false,
      imageList: [],
    }
  }

  getSideBarItems = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_reset,
        title: '复位',
        action: () => {
          this.hideListIfAny()
          SExhibition.onFlatFunctionPress('reset')
        }
      },
      {
        image: getImage().flat_ai_pic,
        title: '配图',
        action: () => {
          this.setState({
            imageList: this.getAiList()
          })
        }
      },
      {
        image: getImage().flat_search,
        title: '查询',
        action: () => {
          this.hideListIfAny()
          SExhibition.onFlatFunctionPress('search')

        }
      },
      {
        image: getImage().flat_buffer,
        title: '分析',
        action: () => {
          this.hideListIfAny()
          SExhibition.onFlatFunctionPress('buffer')
        }
      },
      {
        image: getImage().flat_plot,
        title: '标绘',
        action: () => {
          this.hideListIfAny()
          SExhibition.onFlatFunctionPress('plot')
        }
      }
    ]
  }

  getSideBarMapItems = (): Item[] => {
    return [
      {
        image: getImage().flat_change_map,
        action: () => {
          this.setState({
            imageList: this.getMapList()
          })
        }
      }
    ]
  }

  getMapList = (): ImageItem[] => {
    return [
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail.png'},
        path: '',
        onTouch: () => {
          this.hideListIfAny()
          SExhibition.changeFlatMap(0)
        }
      },
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail2.png'},
        path: '',
        onTouch: () => {
          this.hideListIfAny()
          SExhibition.changeFlatMap(1)
        }
      },
      {
        image: { uri: 'file:///sdcard/iTablet/Common/Exhibition/AR平面地图/thumbnail3.png'},
        path: '',
        onTouch: () => {
          this.hideListIfAny()
          SExhibition.changeFlatMap(2)
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

  componentDidMount(): void {
    this.importData().then(() => {
      if(this.state.showScan) {
        SARMap.setAREnhancePosition()
      }
    })
    AppEvent.addListener('ar_image_tracking_result', result => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})

        setGolbalPose(result)

        if(!isFlatMapGuided()) {
          setFlatMapGuided()
          this.showGuide(true)
        } else {
          this.start(result)
        }
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
  }

  showGuide = (show: boolean) => {
    this.setState({showGuide: show})
  }

  start = (pose: Pose) => {
    SExhibition.addTempPoint()
    this.addMap(pose)
  }

  addMap = async (pose: Pose) => {
    if(!this.isMapOpend) {
      SExhibition.addTempPoint()
      await SMap.openMapName(flatMaps[0].mapName)
      await SMap.openMap(flatMaps[0].mapName)
      this.isMapOpend = true
    }
    const relativePositin: Vector3 = {
      x: 0,
      y: 0,
      z: -1,
    }
    SExhibition.removeTempPoint()
    SExhibition.addFlatMap({
      pose: pose,
      translation: relativePositin
    })
    SExhibition.setTrackingTarget({
      pose: pose,
      translation: relativePositin
    })
    SExhibition.startTrackingTarget()
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
      SARMap.stopAREnhancePosition()
      SExhibition.resumeTrackingTarget()
      this.setState({showScan: false})
      return
    }
    AppEvent.removeListener('ar_image_tracking_result')
    SExhibition.stopTrackingTarget()
    SExhibition.removeFlatMap()
    AppToolBar.goBack()
  }

  startScan = () => {
    if(this.state.showScan) return
    SExhibition.pauseTrackingTarget()
    this.setState({showScan: true})
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

  renderScanIcon = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(80),
          left: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(25),
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

  renderSideBar = () => {
    return (
      <>
        <ImageList
          ref={ref => this.imageList = ref}
          data={this.state.imageList}
        />
        <SideBar
          sections={[
            this.getSideBarItems(),
            this.getSideBarMapItems()
          ]}
          showIndicator
        />
      </>
    )
  }

  render() {
    return(
      <>
        {this.state.showScan && this.renderScan()}
        {!this.state.showGuide && this.renderBack()}
        {(!this.state.showScan && !this.state.showGuide) && this.renderScanIcon()}
        {(!this.state.showScan && !this.state.showGuide) && this.renderSideBar()}
        <ARArrow
          arrowShowed={() => {
            Toast.show('请按照箭头引导转动屏幕查看地图')
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