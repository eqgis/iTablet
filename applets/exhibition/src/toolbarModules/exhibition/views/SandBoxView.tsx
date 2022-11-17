import { AppEvent, AppToolBar, Toast, AppLog } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, ScrollView, StyleSheet, Text, TouchableOpacity, View, EmitterSubscription } from 'react-native'
import Scan from '../components/Scan'
import { SARMap, FileTools, IARTransform, ARAction, ARLayerType } from 'imobile_for_reactnative'
import { Point3D } from 'imobile_for_reactnative/types/data'
import { ConstPath } from '@/constants'
import SlideBar from 'imobile_for_reactnative/components/SlideBar'
// import CircleBar from '../components/CircleBar'
import PipeLineAttribute from '../components/pipeLineAttribute'
import ARArrow from '../components/ARArrow'
import { positionNodeInfo, SceneLayerStatus } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { shouldBuildingMapData, buildingImported } from '../Actions'
import SideBar, { Item } from '../components/SideBar'
import AnimationWrap from '../components/AnimationWrap'
import ARViewLoadHandler from '../components/ARViewLoadHandler'
import TimeoutTrigger from '../components/TimeoutTrigger'
import ScanWrap from '../components/ScanWrap'
import ImageItem, { ImageItemData } from '../components/ImageItem'
import { addEffectLayer } from '@/Toolbar/modules/arMapAdd/Actions'
import BottomMenu from '../components/BottomMenu'

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: dp(20),
    left: dp(20),
    width: dp(60),
    height: dp(60),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backImg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scanBtn: {
    position: 'absolute',
    top: dp(80),
    left: dp(20),
    width: dp(60),
    height: dp(60),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  resetBtn: {
    borderTopLeftRadius: dp(10),
    borderBottomLeftRadius: dp(10),
  },
  rightBtn: {
    width: dp(50),
    height: dp(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: dp(2),
    borderRightColor: 'white',
    backgroundColor: 'white',
  },
  rightSubBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: dp(30),
    height: dp(30),
  },
  btnImg: { position: 'absolute', width: '100%', height: '100%' },
  rightBtnTxt: { fontSize: dp(10), color: '#0E0E0E' },
  cover: {
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
  },
  coverImgView: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: dp(30),
    height: dp(30),
  },
  functionBarView: {
    position: 'absolute',
    flexDirection: 'column',
    top: dp(40),
    right: dp(0),
    width: dp(50),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // functionBar: {
  //   position: 'absolute',
  //   flexDirection: 'column',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   top: dp(40),
  //   right: dp(0),
  //   width: dp(60),
  //   // height: dp(120),
  //   borderTopLeftRadius: dp(10),
  //   borderBottomLeftRadius: dp(10),
  //   overflow: 'hidden',
  //   backgroundColor: 'white',
  // },
  functionBar: {
    flexDirection: 'column',
    marginTop: dp(8),
    width: dp(50),
    borderTopLeftRadius: dp(10),
    borderBottomLeftRadius: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingVertical: dp(10),
  },

  // ToolView
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
  toolView: {
    position: 'absolute',
    left: dp(22),
    bottom: dp(22),
    width: dp(360),
    backgroundColor: '#1E1E1EA6',
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
  toolScrollView: {
    position: 'absolute',
    bottom: dp(15),
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  slideBar: {
    flex: 1,
    height: dp(30),
    marginLeft: dp(20),
  },
  circleBarRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: dp(20),
  },
  circleBar: {
    flexDirection: 'column',
    alignItems: 'center',
  },
})

interface Props {
  windowSize: ScaledSize
}

type ToolType = 'mountain_guide' | 'effects' | 'spot' | 'reset' | 'edit' | 'boat_guide' | 'lighting'

interface State {
  showScan: boolean
  showGuide: boolean
  showCover: boolean
  showSide: boolean
  toolType: ToolType | ''
  /** 是否允许扫描界面进行扫描 true表示允许 fasle表示不允许 */
  isScan: boolean
}

export interface AddOption {
  translation?: Point3D
  rotation?: Point3D
  parentId?: number
  foucus?: boolean
  updatefoucus?: boolean
  scale?: number
}

let currentLayer: SARMap.ARLayer
interface SpotType {name: string, path: string, index: number}
let spotOriginIndex: {[name: string]: SpotType} = {}
let oraginSandboxStatus: positionNodeInfo | undefined // 图层原始大小比例

class SandBoxView extends React.Component<Props, State> {

  scanRef: Scan | null = null
  sideBar: SideBar | null = null
  clickWait = false
  pose: SARMap.Pose | undefined
  relativePositin: Point3D = {
    x: 0,
    y: 0,
    z: -1,
  }
  isOpen = false // 是否已经打开模型
  lastLayerStatus: SceneLayerStatus | undefined // 图层上一次大小比例
  toolView: ToolView | undefined | null
  timeoutTrigger: TimeoutTrigger | null = null
  listeners: {
    addListener:EmitterSubscription | undefined,
    infoListener:EmitterSubscription | undefined
  } | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      showGuide: false,
      showSide: true,
      showScan: true,
      isScan: true,
      showCover: false,

      toolType: '',
    }
    AppToolBar.addData({
      PipeLineAttribute: PipeLineAttribute,
    })
  }

  arViewDidMount = (): void => {
    // SARMap.setAREnhancePosition()
    this.listeners = SARMap.addMeasureStatusListeners({
      addListener: async result => {
        if (result) {
          if(this.state.showScan && !this.state.isScan) {
            // 启用增强定位
            SARMap.setAREnhancePosition()
          }
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

    SARMap.setAction(ARAction.NULL)
    AppEvent.addListener('ar_image_tracking_result', async result => {
      this.pose = result
      if (result) {
        this.timeoutTrigger?.onBackFromScan()
        SARMap.stopAREnhancePosition()
        this.setState({ showScan: false })
        this.relativePositin = {
          x: 0,
          y: 0,
          z: -1,
        }
        const targetPxpPath = await this.importData()
        if (targetPxpPath) {
          // 创建AR地图

          // 创建AR数据源,数据集,图层
          await this.addARLayer()

          Toast.show('定位成功',{
            backgroundColor: 'rgba(0,0,0,.5)',
            textColor: '#fff',
            position: dp(50),
          })
        }
      }
    })
    AppEvent.addListener('ar_single_click', this.onSingleClick)
  }

  onSingleClick = () => {
    if(this.state.showSide) {
      this.timeoutTrigger?.onBarHide()
    } else {
      this.timeoutTrigger?.onBarShow()
    }
    this.setState({showSide: !this.state.showSide})
  }

  getSideBarItems = (): Item[] => {
    return [
      {
        image: getImage().tool_location,
        image_selected: getImage().tool_location_selected,
        title: '位置调整',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.timeoutTrigger?.onShowSecondMenu()
          SARMap.appointEditElement(1, currentLayer?.name)
          SARMap.setAction(ARAction.SCALE)
          this.switchTool('edit')
        }
      },
      {
        image: getImage().tool_lighting,
        image_selected: getImage().tool_lighting_selected,
        title: '光照',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.timeoutTrigger?.onShowSecondMenu()
          SARMap.openSandBoxLighting(currentLayer?.name, 1, {})
          this.switchTool('lighting')
        }
      },
      {
        image: getImage().tool_spot,
        image_selected: getImage().tool_spot_selected,
        title: '景点',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.timeoutTrigger?.onShowSecondMenu()
          this.switchTool('spot')
        }
      },
      {
        image: getImage().tool_boat_guide,
        image_selected: getImage().tool_boat_guide,
        title: '游船路线',
        action: async () => {
          if (!this.checkSenceAndToolType()) return
          this.timeoutTrigger?.onShowSecondMenu()
          this.switchTool('boat_guide')
        }
      },
      {
        image: getImage().tool_mountain_guide,
        image_selected: getImage().tool_mountain_guide,
        title: '登山路线',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.timeoutTrigger?.onShowSecondMenu()
          this.switchTool('mountain_guide')
        }
      },
      {
        image: getImage().tool_effect,
        image_selected: getImage().tool_effect,
        title: '天气',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.timeoutTrigger?.onShowSecondMenu()
          this.switchTool('effects')
        }
      },
    ]
  }

  getSideBarReset = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_reset,
        image_selected: getImage().icon_tool_reset_selected,
        title: '复位',
        showIndicator: false,
        action: async () => {
          if (!this.checkSenceAndToolType()) return
          if (oraginSandboxStatus) {
            this.state.toolType === '' && this.timeoutTrigger?.onFirstMenuClick()
            this.toolView?.reset()
            await SARMap.setSandBoxPosition(currentLayer.name, 1, oraginSandboxStatus)
          }
        }
      }
    ]
  }

  arrowTricker = async (isOpen: boolean) => {
    // if (isOpen && this.pose && this.relativePositin) {
    //   await SExhibition.setTrackingTarget({
    //     pose: this.pose,
    //     translation: this.relativePositin,
    //   })
    //   await SExhibition.startTrackingTarget()
    // } else {
    //   await SExhibition.stopTrackingTarget()
    // }
  }

  importData = async () => {
    try {
      const home = await FileTools.getHomeDirectory()
      const importPath = home + ConstPath.Common + 'Exhibition/AR景区沙盘/SandBox'
      const targetHomePath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/'

      const needToImport = await shouldBuildingMapData()

      if (needToImport && await FileTools.fileIsExist(targetHomePath)) {
        await FileTools.deleteFile(targetHomePath)
      } else if (await FileTools.fileIsExist(targetHomePath)) {
        return targetHomePath // 已经导入
      }

      const result = await FileTools.copydir(importPath, targetHomePath)
      if (result) {
        buildingImported()
        return targetHomePath
      } else {
        return ''
      }
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  addARLayer = async () => {
    try {
      const props = AppToolBar.getProps()
      AppToolBar.addData({
        addNewDSourceWhenCreate: false,
        addNewDsetWhenCreate: false,
      })
      if (!props.arMap.currentMap) {
        await AppToolBar.getProps().createARMap()
      }

      // 公共glb
      const home = await FileTools.getHomeDirectory()
      const targetHomePath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/'
      await SARMap.createARSandTable()
      // 添加glb
      // const glbs = await FileTools.getPathListByFilterDeep(targetHomePath, 'glb')
      const glbs = await FileTools.getPathListByFilter(targetHomePath, {
        extension: 'glb',
      })
      const paths: string[] = []
      for (const glb of glbs) {
        paths.push(home + glb.path)
      }

      // 游船
      const shipPath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/游船'
      const shipGlbs = await FileTools.getPathListByFilter(shipPath, {
        extension: 'glb',
      })
      for (const glb of shipGlbs) {
        paths.push(home + glb.path)
      }

      // 景点
      const spotPath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/景点'
      const spotGlbs = await FileTools.getPathListByFilter(spotPath, {
        extension: 'glb',
      })
      const spotPaths = []
      for (const glb of spotGlbs) {
        spotPaths.push(home + glb.path)
      }

      await SARMap.addModelToSandTable(paths, {
        position: {
          // y: -100,
          // z: -320,
          x: 0,
          y: -1,
          z: -1.5,
        },
        rotation: {
          // x: 90,
          // y: -80,
          // z: 2.94,
        },
        scale: {
          x: 0.0025,
          y: 0.0025,
          z: 0.0025,
        },
      })
      await SARMap.addARMediaToSandbox(targetHomePath + 'wave.mp4', {
        position: {
          x: -30,
          y: -49,
          z: -48,
        },
        rotation: {
          x: 90,
          y: 5,
          z: 2.94,
        },
        scale: {
          x: 120000,
          y: 75000,
          z: 0,
        },
      })
      const spotIndexes = await SARMap.addModelToSandTable(spotPaths, {
        position: { x: 0, y: -1, z: -1.5 },
        scale: { x: 0.0025, y: 0.0025, z: 0.0025 },
      })
      for (let i = 0; i < spotIndexes.length; i++) {
        const spotName = spotPaths[i].substring(spotPaths[i].lastIndexOf('/') + 1, spotPaths[i].lastIndexOf('.'))
        // spotOriginIndex.[spotName]
        spotOriginIndex = Object.assign(spotOriginIndex, {[spotName]: {
          name: spotName,
          path: spotPaths[i],
          index: spotIndexes[i],
        }})
      }

      const layers = await props.getARLayers()
      for(const layer of layers) {
        if (layer.type === ARLayerType.AR_MODEL_LAYER) {
          currentLayer = layer
        }
      }

      if(currentLayer) {
        await SARMap.setLayerMaxVisibleBounds(currentLayer.name, -1)
        SARMap.getElementPositionInfo(currentLayer?.name, 1).then(result => {
          oraginSandboxStatus = result?.renderNode
        })
      }
      this.isOpen = true
      this.arrowTricker(true)
    } catch(e) {
      this.isOpen = false
      __DEV__ && console.warn(e)
    }
  }

  save = async (name?: string) => {
    try {
      if (name) {
        await SARMap.saveAsARSandTable(name, await FileTools.getHomeDirectory() + ConstPath.CustomerPath + 'Data/ARSandTable')
      } else {
        await SARMap.saveARSandTable()
      }
    } catch (error) {
      __DEV__ && AppLog.error(error)
    }
  }

  cover = () => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if (layer) {
      SARMap.startARCover(layer.name)
    }
  }

  back = async () => {
    if (this.clickWait) return
    this.clickWait = true
    if (this.state.showScan) {
      if(this.state.isScan) {
        SARMap.stopAREnhancePosition()
      }
      if (this.isOpen) {
        this.arrowTricker(true)
      }
      this.setState({ showScan: false }, () => {
        this.clickWait = false
      })
      return
    }
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if (layer) {
      await SARMap.stopARCover(layer.name)
    }
    await SARMap.closeARSandTable()
    AppToolBar.addData({
      PipeLineAttribute: undefined,
    })
    await this.arrowTricker(false)
    AppEvent.removeListener('ar_image_tracking_result')
    this.listeners && this.listeners.addListener?.remove()
    AppEvent.removeListener('ar_single_click', this.onSingleClick)
    if (this.state.showScan) {
      await SARMap.stopAREnhancePosition()
    }
    // SARMap.close()
    const props = AppToolBar.getProps()
    await props.closeARMap()
    await props.setCurrentARLayer()
    AppToolBar.goBack()
    this.clickWait = false
  }

  switchTool = async (toolType: ToolType | '', cb?: () => void) => {

    if (this.state.toolType === 'effects') {
      const props = AppToolBar.getProps()
      const layers = await props.getARLayers()
      const effectLayer = layers.find(item => {
        return item.type === ARLayerType.EFFECT_LAYER
      })
      if(effectLayer) {
        SARMap.setLayerVisible(effectLayer.name, false)
      }
    } else if (this.state.toolType === 'lighting') {
      SARMap.closeSandBoxLighting()
    } else if (this.state.toolType === 'edit') {
      SARMap.setAction(ARAction.NULL)
    }

    if (this.state.toolType !== toolType) {
      this.setState({
        toolType: toolType,
      }, () => {
        cb?.()
      })
    } else if (this.state.toolType && this.state.toolType === toolType) {
      // await SARMap.submit()
      this.setState({
        toolType: '',
      }, () => {
        this.clickWait = false
      })
    }
    if (toolType === '') {
      this.sideBar?.clear()
    }
  }

  checkSenceAndToolType = () => {
    const props = AppToolBar.getProps()
    if (!props.arMap.currentMap) {
      Toast.show('请对准演示台上二维码进行扫描', {
        backgroundColor: 'rgba(0,0,0,.5)',
        textColor: '#fff',
      })
      return false
    }
    return true
  }

  startScan = () => {
    let toolType = this.state.toolType
    if (this.state.toolType) {
      toolType = ''
      SARMap.submit()
    }
    this.arrowTricker(false)
    SARMap.setAREnhancePosition()
    this.setState({ showScan: true, toolType })
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

  renderCover = () => {
    return (
      <TouchableOpacity
        style={styles.cover}
        onPress={() => {
          this.setState({ showCover: false })
          this.cover()
        }}
      >
        <View style={styles.coverImgView}>
          <Image
            style={styles.btnImg}
            source={getImage().icon_tool_rectangle}
          />
        </View>

        <Text
          style={{
            fontSize: 10,
          }}
        >
          {'立方体'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderScan = () => {
    return <ScanWrap windowSize={this.props.windowSize} hint={'请对准演示台上二维码进行扫描'}/>
  }

  renderToolView = () => {
    // if (!this.state.toolType) return null
    // const props = AppToolBar.getProps()
    // const mapInfo = props.arMapInfo
    // if (!props.arMap.currentMap || !mapInfo || !mapInfo.currentLayer) {
    // if (!props.arMap.currentMap) {
    //   Toast.show('请先扫描二维码,打开超图大厦')
    //   return null
    // }

    return (
      <ToolView
        ref={ref => this.toolView = ref}
        type={this.state.toolType}
        data={{
          layerName: currentLayer?.name || '',
          id: 1,
        }}
        close={async () => {
          if (this.state.toolType) {
            this.timeoutTrigger?.onBackFromSecondMenu()
            this.switchTool('')
            return
          }
        }}
      />
    )
  }

  renderSideBar = () => {
    return (
      <AnimationWrap
        range={[-dp(100), dp(20)]}
        animated={'right'}
        visible={this.state.showSide}
        style={{
          position: 'absolute',
          top: dp(20),
        }}
      >
        <SideBar
          ref={ref => this.sideBar = ref}
          sections={[
            this.getSideBarReset(),
            this.getSideBarItems(),
          ]}
          showIndicator
        />
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

  render() {
    return (
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
        {this.renderToolView()}
        {(!this.state.showScan && !this.state.showGuide) && this.renderSideBar()}
        {this.state.showCover && this.renderCover()}
        <ARArrow />
        {this.state.showScan && this.state.isScan && this.renderScan()}
        {(!this.state.showScan && !this.state.showGuide) && this.renderScanIcon()}
        {this.renderBack()}
      </>
    )
  }
}

export default SandBoxView

interface PositionData {
  layerName: string,
  id?: number,
  scale?: number,
  rotation?: {
    x: number,
    y: number,
    z: number,
  }
}

interface ToolViewProps {
  data: PositionData,
  type: ToolType | '',
  close: () => void,
}

interface ToolViewState {
  selectKey: string,
  data: any[],
  canBeClick: boolean,
}

// const circleSize = dp(66)
// const circleR = dp(30)
// const circleStrokeWidth = dp(4)
const AnimationTime = 2000

class ToolView extends React.Component<ToolViewProps, ToolViewState> {
  scaleBar: SlideBar | undefined | null
  rotationBar: SlideBar | undefined | null
  // rotationX: CircleBar | undefined | null
  // rotationY: CircleBar | undefined | null
  // rotationZ: CircleBar | undefined | null
  mountainElementIndexes: number[] = []
  lastPosition: positionNodeInfo | undefined
  lastPosition2: {
    position: { x: number, y: number, z: number },
    rotation: { x: number, y: number, z: number },
    scale: { x: number, y: number, z: number },
  } | undefined

  /** 上一个选中的景点 */
  lastSpot: SpotType | undefined

  constructor(props: ToolViewProps) {
    super(props)
    this.state = {
      selectKey: '',
      data: [],
      canBeClick: true,
    }
  }

  componentDidUpdate(prevProps: Readonly<ToolViewProps>): void {
    if (prevProps.type !== this.props.type && this.props.type) {
      this.getData()
    }
    // 退出特效,重置选中
    if (prevProps.type === 'effects' && this.props.type !== 'effects' && this.state.selectKey) {
      this.setState({
        selectKey: '',
        data: [],
      })
    } else if (prevProps.type === 'mountain_guide' && this.props.type !== 'mountain_guide' && this.state.selectKey) {
      this.mountainClose()
    } else if (prevProps.type === 'spot' && this.props.type !== 'spot' && this.state.selectKey) {
      this.spotClose()
    }
  }

  getData = async () => {
    const home = await FileTools.getHomeDirectory()
    if (this.props.type === 'effects') {
      const items = await this.getEffects()
      const data = []
      for (const item of items) {
        const name = item.name.lastIndexOf('.') > 0 ? item.name.substring(0, item.name.lastIndexOf('.')) : item.name
        const imagePath = item.path.replace(item.name, name + '.png')
        let image
        if (!await FileTools.fileIsExist(imagePath)) {
          image = getImage().tool_effect
        } else {
          image = {uri: 'file://' + imagePath}
        }
        data.push({
          key: name,
          name: name,
          image: image,
          path: item.path,
        })
      }
      this.setState({
        data: data,
      })
    } else if (this.props.type === 'mountain_guide') {
      const items = await this.getMountainRoute()
      const data = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const name = item.name.lastIndexOf('.') > 0 ? item.name.substring(0, item.name.lastIndexOf('.')) : item.name
        const imagePath = `${home + item.path}/${name}.png`
        let image
        if (!await FileTools.fileIsExist(imagePath)) {
          image = getImage().tool_effect
        } else {
          image = {uri: 'file://' + imagePath}
        }
        data.push({
          key: name,
          name: name,
          image: image,
          path: item.path,
        })
      }

      this.setState({
        data: data,
      })
    } else if (this.props.type === 'boat_guide') {
      const items = await this.getBoat()
      const data = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const name = item.name.lastIndexOf('.') > 0 ? item.name.substring(0, item.name.lastIndexOf('.')) : item.name
        const imagePath = item.path.replace(item.name, name + '.png')
        let image
        if (!await FileTools.fileIsExist(imagePath)) {
          image = getImage().tool_effect
        } else {
          image = {uri: 'file://' + imagePath}
        }
        data.push({
          key: name,
          name: name,
          image: image,
          path: item.path,
        })
      }

      this.setState({
        data: data,
      })
    } else if (this.props.type === 'spot') {
      const items = await this.getSpot()
      const data = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const name = item.name.lastIndexOf('.') > 0 ? item.name.substring(0, item.name.lastIndexOf('.')) : item.name
        const imagePath = item.path.replace(item.name, name + '.png')
        let image
        if (!await FileTools.fileIsExist(imagePath)) {
          image = getImage().tool_effect
        } else {
          image = {uri: 'file://' + imagePath}
        }
        data.push({
          key: name,
          name: name,
          image: image,
          path: item.path,
        })
      }

      this.setState({
        data: data,
      })
    } else {
      this.setState({
        data: [],
      })
    }
  }

  close = async () => {
    this.props.close?.()
    if (this.state.selectKey) {
      if (this.props.type === 'mountain_guide') {
        this.mountainClose()
      } else if(this.props.type === 'spot') {
        this.spotClose()
      } else {
        this.setState({
          selectKey: '',
          data: [],
        })
      }
    }
    if (this.props.type === 'edit') {
      SARMap.setAction(ARAction.NULL)
    }
  }

  reset = () => {
    this.scaleBar?.onClear()
    this.rotationBar?.onClear()
  }

  /********************************************************** 位置调整 ******************************************************************/
  renderPosition = () => {
    let transformData: IARTransform = {
      // layerName: this.props.data.layerName,
      // id: this.props.data.id || -1,
      // layerName: currentElement?.layerName || '',
      // id: currentElement?.id || -1,
      layerName: currentLayer?.name || '',
      id: 1,
      type: 'position',
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 100,
    }
    return (
      <View style={{paddingBottom: dp(20)}} >
        <View style={styles.toolRow}>
          <Text style={{width: '100%', textAlign: 'center', fontSize: dp(12), color: 'white'}}>位置调整</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={this.close}
          >
            <Image
              style={styles.closeImg}
              source={getImage().icon_cancel02}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: 'white'}}>缩放</Text>
          <SlideBar
            ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 200]}
            defaultMaxValue={100}
            barColor={'#FF6E51'}
            onMove={loc => {
              const scale = loc / 100 - 1
              transformData = {
                ...transformData,
                scale: scale,
                type: 'scale',
                layerName: currentLayer?.name || '',
                id: 1,
              }
              SARMap.setARElementTransform(transformData)
            }}
          />
        </View>
        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12), color: 'white'}}>旋转</Text>
          <SlideBar
            ref={ref => this.rotationBar = ref}
            style={styles.slideBar}
            range={[-180, 180]}
            defaultMaxValue={0}
            barColor={'#FF6E51'}
            onMove={value => {
              transformData = {
                ...transformData,
                rotationY: value,
                type: 'rotation',
                layerName: currentLayer?.name || '',
                id: 1,
              }
              SARMap.setARElementTransform(transformData)
            }}
          />
        </View>
        {/* <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12)}}>旋转</Text>
          <View style={styles.circleBarRow}>
            <CircleBar
              ref={ref => this.rotationX = ref}
              width={circleSize}
              height={circleSize}
              strokeWidth={circleStrokeWidth}
              tabStrokeWidth={0}
              tabR={0}
              r={circleR}
              angle={1}
              value={0}
              min={-180}
              max={180}
              valueUnit={'%'}
              title={'X轴'}
              valueChange={value => {
                transformData = {
                  ...transformData,
                  rotationX: value,
                  type: 'rotation',
                }
                SARMap.setARElementTransform(transformData)
              }}
            />
            <CircleBar
              ref={ref => this.rotationY = ref}
              width={circleSize}
              height={circleSize}
              strokeWidth={circleStrokeWidth}
              tabStrokeWidth={0}
              tabR={0}
              r={circleR}
              angle={1}
              value={0}
              min={-180}
              max={180}
              valueUnit={'%'}
              title={'Y轴'}
              valueChange={value => {
                transformData = {
                  ...transformData,
                  rotationY: value,
                  type: 'rotation',
                }
                SARMap.setARElementTransform(transformData)
              }}
            />
            <CircleBar
              ref={ref => this.rotationZ = ref}
              width={circleSize}
              height={circleSize}
              strokeWidth={circleStrokeWidth}
              tabStrokeWidth={0}
              tabR={0}
              r={circleR}
              angle={1}
              value={0}
              min={-180}
              max={180}
              valueUnit={'%'}
              title={'Z轴'}
              valueChange={value => {
                transformData = {
                  ...transformData,
                  rotationZ: value,
                  type: 'rotation',
                }
                SARMap.setARElementTransform(transformData)
              }}
            />
          </View>
        </View> */}
      </View>
    )
  }

  /********************************************************** 登山路线 ******************************************************************/
  getMountainRoute = async () => {
    const home = await FileTools.getHomeDirectory()
    const routePath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/登山路线'
    const routeDir = await FileTools.getPathListByFilter(routePath, {
      type: 'Directory',
    })

    routeDir.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
    })
    return routeDir
  }

  mountainAction = async (item: ImageItemData) => {
    try {
      if (!item.path) return
      if (item.key === this.state.selectKey) {
        this.mountainClose(false)
        return
      }
      this.setState({
        selectKey: item.key,
      })
      const lastPosition = await SARMap.getElementPositionInfo(currentLayer.name, 1)
      if (lastPosition?.renderNode) {
        this.lastPosition = {
          position: lastPosition.renderNode.position,
          rotation: lastPosition.renderNode.rotation,
          scale:lastPosition.renderNode.scale,
        }
      }
      this.setState({
        canBeClick: false,
      })
      const home = await FileTools.getHomeDirectory()
      const routeDir = await FileTools.getPathListByFilterDeep(item.path.indexOf(home) === 0 ? item.path : (home + item.path), 'glb')
      // 转圈/放大/定位到登山路线
      await SARMap.setSandBoxAnimation(currentLayer.name, 1, {
        position: {
          x: 0,
          y: 0,
          z: -1.5,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        scale: {
          x: 0.004,
          y: 0.004,
          z: 0.004,
        },
        duration: AnimationTime,
      })

      // 依次添加定位点
      const wait = (sec: number) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(true)
          }, 1000 * sec)
        })
      }

      setTimeout(async () => {
        // 等待,防止移动获取位置错误
        this.mountainElementIndexes = []
        // 获取沙盘实际位置
        await SARMap.setSandBoxPosition(currentLayer.name, 1, {
          position: {
            x: 0,
            y: -1,
            z: -2,
          },
          rotation: {
            x: 0,
            y: 0,
            z: 0,
          },
          scale: 0.005,
        })
        for (const route of routeDir) {
          // 添加路线坐标
          const pathIndexs = await SARMap.addModelToSandTable([route.path])

          this.twinkle(pathIndexs[0], 2)
          this.mountainElementIndexes = this.mountainElementIndexes.concat(pathIndexs)
          await wait(1)
        }

        this.setState({
          canBeClick: true,
        })
      }, AnimationTime * 2)
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  mountainClose = async (clearData = true) => {
    try {
      this.setState({
        canBeClick: false,
      })
      for (let i = 0; i < this.mountainElementIndexes.length; i++) {
        SARMap.setSandTableModelVisible(this.mountainElementIndexes[i], false)
      }
      // const lastPosition = await SARMap.getElementPositionInfo(currentLayer.name, 1)
      if (oraginSandboxStatus) {
        // lastPosition.renderNode.position.y = -1
        SARMap.setSandBoxAnimation(currentLayer.name, 1, {
          position: oraginSandboxStatus.position,
          rotation: oraginSandboxStatus.rotation,
          scale: {
            x: oraginSandboxStatus.scale,
            y: oraginSandboxStatus.scale,
            z: oraginSandboxStatus.scale,
          },
          duration: AnimationTime,
        })
      }
      setTimeout(() => {
        oraginSandboxStatus && SARMap.setSandBoxPosition(currentLayer.name, 1, oraginSandboxStatus)
        oraginSandboxStatus = undefined
        this.mountainElementIndexes = []
        if (clearData) {
          this.setState({
            selectKey: '',
            data: [],
            canBeClick: true,
          })
        } else {
          this.setState({
            selectKey: '',
            canBeClick: true,
          })
        }
      }, AnimationTime)
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /********************************************************** 景区 ******************************************************************/
  getSpot = async () => {
    const home = await FileTools.getHomeDirectory()
    const shipPath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/景点1'
    const ships = await FileTools.getPathListByFilterDeep(shipPath, 'glb')

    ships.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
    })
    return ships
  }

  spotAction = async (item: ImageItemData) => {
    try {
      if (!item.path) return
      if (item.key === this.state.selectKey) {
        this.spotClose(false)
        return
      }
      this.setState({
        selectKey: item.key,
      })
      // 隐藏上一个选中的景点
      if (this.lastSpot !== undefined) {
        await SARMap.setSandTableModelVisible(this.lastSpot.index, false)

        await SARMap.setSandTableModelVisible(spotOriginIndex[this.lastSpot.name].index, true)
      }
      // 显示当前选中的景点
      const pathIndexs = await SARMap.addModelToSandTable([item.path])
      if (pathIndexs.length > 0) {
        const spotName = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.lastIndexOf('.'))
        this.lastSpot = {
          name: spotName,
          path: item.path,
          index: pathIndexs[0],
        }
        await SARMap.setSandTableModelVisible(spotOriginIndex[this.lastSpot.name].index, false)

        let position = { x: 0, y: -1, z: -1.5 }
        if (this.lastSpot.name === '晓渔渡') {
          position = { x: 0.7, y: -1, z: -1.5 }
        } else if (this.lastSpot.name === '活动中心') {
          position = { x: 0.6, y: -1, z: -2.4 }
        } else if (this.lastSpot.name === '看云台') {
          position = { x: -0.5, y: -1, z: -2 }
        } else if (this.lastSpot.name === '湖心亭') {
          position = { x: 0, y: -1, z: -1.5 }
        }

        await SARMap.setSandBoxAnimation(currentLayer.name, 1, {
          position: position,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.006, y: 0.006, z: 0.006 },
          duration: AnimationTime,
        })

        position.y = 0
        await SARMap.setSandBoxPosition(currentLayer.name, 1, {
          position: position,
          rotation: { x: 0, y: 0, z: 0 },
          scale: 0.006,
        })
        setTimeout(() => {
          this.lastSpot && this.twinkle(this.lastSpot.index, 2)
        }, AnimationTime)
      }
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  spotClose = async (clearData = true) => {
    try {
      // 隐藏上一个选中的景点
      if (this.lastSpot !== undefined) {
        await SARMap.setSandTableModelVisible(this.lastSpot.index, false)

        await SARMap.setSandTableModelVisible(spotOriginIndex[this.lastSpot.name].index, true)
      }
      if (clearData) {
        this.setState({
          selectKey: '',
          data: [],
        })
      } else {
        this.setState({
          selectKey: '',
        })
      }
      this.lastSpot = undefined
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /********************************************************** 游船路线 ******************************************************************/
  getBoat = async () => {
    const home = await FileTools.getHomeDirectory()
    const shipPath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/游船'
    const ships = await FileTools.getPathListByFilterDeep(shipPath, 'glb')

    ships.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
    })
    return ships
  }

  boatAction = async (item: ImageItemData) => {
    try {
        { x: -14.8262, y: 0, z: -11.2643},
        { x: -7.0157, y: 0, z: -12.9467},
        { x: -12.9655, y: 0, z: -9.9496},
        { x: -16.0149, y: 0, z: -8.9459},
        { x: -19.292, y: 0, z: -6.4939},
        { x: -22.9803, y: 0, z: -3.8235},
        { x: -18.9957, y: 0, z: -3.8235},
      ]
      SARMap.setSandBoxAnimation2(currentLayer.name, 1, modalPath, {
        position: position,
        // rotation: [{
        //   x: 0,
        //   y: 0,
        //   z: 0,
        // }],
        // scale: [{
        //   x: 0.015,
        //   y: 0.015,
        //   z: 0.015,
        // }],
        duration: 5000,
        repeatMode: 2,
        repeatCount: 10,
      })
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /********************************************************** 特效 ******************************************************************/
  boatClose = async (clearData = true) => {
    try {
      if (clearData) {
        this.setState({
          selectKey: '',
          data: [],
        })
      } else {
        this.setState({
          selectKey: '',
        })
      }
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /********************************************************** 天气 ******************************************************************/
  getEffects = async () => {
    const home = await FileTools.getHomeDirectory()
    const effectsPath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/天气'
    const effects = await FileTools.getPathListByFilterDeep(effectsPath, 'areffect')

    effects.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
    })
    return effects
  }

  effectAction = async (item: ImageItemData) => {
    try {
      if (!item.path) return
      this.setState({
        selectKey: item.key,
      })
      let layerName = 'effectLayer'
      const props = AppToolBar.getProps()
      const layers = await props.getARLayers()
      let currentEffectLayer: SARMap.ARLayer | undefined = undefined
      for (const layer of layers) {
        if (layer.name === layerName && layer.type === ARLayerType.EFFECT_LAYER) {
          currentEffectLayer = layer
          layerName = currentEffectLayer.name
          if(!currentEffectLayer.isVisible) {
            SARMap.setLayerVisible(currentEffectLayer.name, true)
          }
          break
        }
      }


      if (currentEffectLayer) {
        SARMap.setAREffect(layerName, item.path)
      } else {
        const path = item.path.replace(homePath, '')
        await addEffectLayer(layerName + '.', path)
      }
      SARMap.setEffectLayerCenter(layerName)
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /****************************************************************************************************************************/
  twinkle = async (id: number, time: number) => {
    let show = false, temp = 0
    const interval = setInterval(async() => {
      if (temp === time && interval) {
        await SARMap.setSandTableModelVisible(id, true)
        clearInterval(interval)
        return
      }
      await SARMap.setSandTableModelVisible(id, show)
      show = !show
      temp++
    }, 300)
  }

  render() {
    // if (this.props.type === '') return null
    if (this.props.type === 'edit') {
      return (
        <View
          style={
            this.props.type === 'edit' ? styles.toolView : styles.toolScrollView
          }>
          {/* <View style={styles.toolBgView}/> */}
          {this.props.type === 'edit' && this.renderPosition()}
          {/* {this.props.type === 'mountain_guide' && this.renderMountainRoute()}
          {this.props.type === 'spot' && this.renderSpot()}
          {this.props.type === 'effects' && this.renderEffects()} */}
        </View>
      )
    }
    return (
      <>
        <BottomMenu
          keyType={"string"}
          currentKey={this.state.selectKey}
          isRepeatClickCancelSelected={true}
          data={this.state.data}
          onSelect={(data) => {
            switch (this.props.type) {
              case 'mountain_guide':
                this.mountainAction(data)
                break
              case 'effects':
                this.effectAction(data)
                break
              case 'boat_guide':
                this.boatAction(data)
                break
              case 'spot':
                this.spotAction(data)
                break
            }
          }}
          visible={this.props.type !== ''}
          imageStyle={{flex: 1, marginTop: 0, width: dp(100), height: dp(100)}}
          // itemStyle={{marginHorizontal: 0}}
          onHide={()=> {
            this.close()
          }}
        />
        {
          !this.state.canBeClick &&
          <View style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'transparent',
              zIndex: 1000,
            }
          ]}/>
        }
      </>
    )
  }
}