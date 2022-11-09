import { AppEvent, AppToolBar, Toast, DataHandler, AppLog } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ScaledSize, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Scan from '../components/Scan'
import { SARMap, ARLayerType, FileTools, IARTransform, ARAction, ARElementType } from 'imobile_for_reactnative'
import { Point3D } from 'imobile_for_reactnative/types/data'
import { ConstPath } from '@/constants'
import SlideBar from 'imobile_for_reactnative/components/SlideBar'
import CircleBar from '../components/CircleBar'
import PipeLineAttribute from '../components/pipeLineAttribute'
import ARArrow from '../components/ARArrow'
import { SceneLayerStatus } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { shouldBuildingMapData, buildingImported } from '../Actions'
import SideBar, { Item } from '../components/SideBar'
import AnimationWrap from '../components/AnimationWrap'

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
    backgroundColor: '#rgba(255,255,255,0.8)',
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

type ToolType = 'guide' | 'lighting' | 'spot' | 'reset' | 'edit'

interface State {
  showScan: boolean
  showGuide: boolean
  showCover: boolean
  showSide: boolean
  toolType: ToolType | ''
}

export interface AddOption {
  translation?: Point3D
  rotation?: Point3D
  parentId?: number
  foucus?: boolean
  updatefoucus?: boolean
  scale?: number
}

let currentElement: any

class SandBoxView extends React.Component<Props, State> {

  scanRef: Scan | null = null
  clickWait = false
  pose: SARMap.Pose | undefined
  relativePositin: Point3D = {
    x: 0,
    y: 0,
    z: -1,
  }
  isOpen = false // 是否已经打开模型
  oraginLayerStatus: SceneLayerStatus | undefined // 图层原始大小比例
  lastLayerStatus: SceneLayerStatus | undefined // 图层上一次大小比例
  toolView: ToolView | undefined | null

  constructor(props: Props) {
    super(props)

    this.state = {
      showGuide: false,
      showSide: true,
      showScan: true,
      showCover: false,

      toolType: '',
    }
    AppToolBar.addData({
      PipeLineAttribute: PipeLineAttribute,
    })
  }

  componentDidMount(): void {
    SARMap.setAREnhancePosition()
    SARMap.setAction(ARAction.NULL)
    AppEvent.addListener('ar_image_tracking_result', async result => {
      this.pose = result
      if (result) {
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
        }
      }
    })
    // AppEvent.addListener('ar_single_click', this.onSingleClick)
  }

  onSingleClick = () => {
    this.setState({showSide: !this.state.showSide})
  }

  getSideBarItems = (): Item[] => {
    return [
      {
        image: getImage().tool_lighting,
        image_selected: getImage().tool_lighting_selected,
        title: '光照',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.switchTool('lighting')
        }
      },
      {
        image: getImage().tool_spot,
        image_selected: getImage().tool_spot_selected,
        title: '景点',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.switchTool('spot')
        }
      },
      {
        image: getImage().tool_guide,
        image_selected: getImage().tool_guide_selected,
        title: '游园路线',
        action: () => {
          if (!this.checkSenceAndToolType()) return
          this.switchTool('guide')
        }
      },
      // {
      //   image: getImage().tool_guide,
      //   image_selected: getImage().tool_guide_selected,
      //   title: '编辑',
      //   action: () => {
      //     if (!this.checkSenceAndToolType()) return
      //     // SARMap.setAction(ARAction.SCALE)
      //     AppToolBar.setOnARElementSelect((element, childIndex) => {
      //       console.warn(childIndex, element)
      //       currentElement = element
      //       console.warn(element)
      //       // inner_sandTable@sandTable
      //       // wave@ARMAP_DEFAULT
      //       console.warn(element.id, element.layerName)
      //       SARMap.appointEditElement(element.id, element.layerName)
      //       // AppEvent.removeListener('ar_single_click')
      //       SARMap.setAction(ARAction.SCALE)
      //       this.switchTool('edit')
      //     })
      //     SARMap.setAction(ARAction.SELECT)
      //   }
      // },
    ]
  }

  getSideBarReset = (): Item[] => {
    return [
      {
        image: getImage().icon_tool_reset,
        image_selected: getImage().icon_tool_reset_selected,
        title: '复位',
        action: async () => {
          if (!this.checkSenceAndToolType()) return
          if (this.oraginLayerStatus) {
            const props = AppToolBar.getProps()
            const layerName = props.arMapInfo.currentLayer.name
            // this.toolView?.reset()
            layerName && await SARMap.setSceneLayerStatus(layerName, this.oraginLayerStatus)
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
      let newDatasource = false
      const props = AppToolBar.getProps()
      const mapInfo = props.arMapInfo
      AppToolBar.addData({
        addNewDSourceWhenCreate: false,
        addNewDsetWhenCreate: false,
      })
      // TODO 打开地图,判断是否要创建新地图和新数据源
      if (!props.arMap.currentMap) {
        await AppToolBar.getProps().createARMap()
        newDatasource = true
      } else if (!mapInfo) {
        newDatasource = true
      }

      // const type = ARLayerType.AR_MODEL_LAYER

      // //若已存在场景图层则先移除
      // const sceneLayers = mapInfo?.layers?.filter((layer: ARLayer) => {
      //   return layer.type === type
      // })
      // if (sceneLayers && sceneLayers.length > 0) {
      //   await SARMap.removeARLayer(sceneLayers[0].name)
      // }

      let datasourceName = DataHandler.getARRawDatasource()
      // let sandBoxDs = 'sandbox'
      let waveDs = 'wave'
      // const sResult = await DataHandler.createARElementDatasource(props.currentUser, datasourceName, sandBoxDs, newDatasource, true, type)
      // const wResult = sResult.success && await DataHandler.createARElementDatasource(props.currentUser, sResult.datasourceName, waveDs, !sResult.success, true, type)
      const wResult = await DataHandler.createARElementDatasource(props.currentUser, datasourceName, waveDs, newDatasource, true, ARLayerType.AR_MEDIA_LAYER)

      const home = await FileTools.getHomeDirectory()
      const targetHomePath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/'

      let mediaLayerName = ''

      // if (sResult.success && sResult.datasourceName) {
      //   datasourceName = sResult.datasourceName
      //   sandBoxDs = sResult.datasetName || ''
      //   if (newDatasource) {
      //     DataHandler.setARRawDatasource(datasourceName)
      //   }

      //   sandLayerName = await SARMap.addElementLayer(datasourceName, sandBoxDs, type, false)
      // }
      if (typeof wResult !== 'boolean' && wResult.success && wResult.datasourceName) {
        datasourceName = wResult.datasourceName
        waveDs = wResult.datasetName || ''
        if (newDatasource) {
          DataHandler.setARRawDatasource(datasourceName)
        }

        mediaLayerName = await SARMap.addElementLayer(datasourceName, waveDs, ARLayerType.AR_MEDIA_LAYER, false)
      }

      const layers = await props.getARLayers()

      // if (sandLayerName !== '') {

      //   if (sandLayerName !== '') {
      //     const defaultLayer = layers.find(item => {
      //       return item.type === type
      //     })
      //     if (defaultLayer?.name) {
      //       props.setCurrentARLayer(defaultLayer)
      //       this.oraginLayerStatus = await SARMap.getSceneLayerStatus(defaultLayer.name, )

      //       // 添加glb
      //       const glbs = await FileTools.getPathListByFilterDeep(targetHomePath, 'glb')
      //       const paths: string = []
      //       for (const glb of glbs) {
      //         // SARMap.addARModel(defaultLayer.name, glb.path, {
      //         //   x: 0,
      //         //   y: 0,
      //         //   z: 0,
      //         // })
      //         paths.push(glb.path)
      //       }
      //       SARMap.addModelToSandTable(paths)
      //       // SARMap.addARModel(defaultLayer.name, targetHomePath + 'terrain10301.glb', {
      //       //   x: 0,
      //       //   y: 0,
      //       //   z: 0,
      //       // })
      //     }
      //   }
      if (mediaLayerName !== '') {
        if (mediaLayerName !== '') {
          const mediaLayer = layers.find(item => {
            return item.type === ARLayerType.AR_MEDIA_LAYER
          })
          if (mediaLayer?.name) {
            SARMap.addARMedia(mediaLayer.name, ARElementType.AR_VIDEO, targetHomePath + 'wave.mp4', {
              position: {
                x: 0,
                y: -49,
                z: 0,
              },
              rotation: {
                x: 90,
                y: 0,
                z: 2.94,
              },
              scale: {
                x: 5720,
                y: 6390,
                z: 3720,
              },
            })
          }
        }
      }
      // }

      // const home = await FileTools.getHomeDirectory()
      // const targetHomePath = home + ConstPath.CustomerPath + 'Data/ARResource/SandBox/'
      SARMap.createARSandTable()
      // 添加glb
      const glbs = await FileTools.getPathListByFilterDeep(targetHomePath, 'glb,mp4')
      const paths: string[] = []
      for (const glb of glbs) {
        // SARMap.addARModel(defaultLayer.name, glb.path, {
        //   x: 0,
        //   y: 0,
        //   z: 0,
        // })
        paths.push(glb.path)
      }
      SARMap.addModelToSandTable(paths)
      // await this.save('SandBox')
      // SARMap.addARModel(defaultLayer.name, targetHomePath + 'terrain10301.glb', {
      //   x: 0,
      //   y: 0,
      //   z: 0,
      // })

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
    AppToolBar.addData({
      PipeLineAttribute: undefined,
    })
    await this.arrowTricker(false)
    AppEvent.removeListener('ar_image_tracking_result')
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
    if (this.state.toolType !== toolType) {
      this.setState({
        toolType: toolType,
      }, () => {
        cb?.()
      })
    } else if (this.state.toolType && this.state.toolType === toolType) {
      await SARMap.submit()
      this.setState({
        toolType: '',
      }, () => {
        this.clickWait = false
      })
    }
  }

  checkSenceAndToolType = () => {
    const props = AppToolBar.getProps()
    if (!props.arMap.currentMap) {
      Toast.show('请对准演示台上二维码进行扫描')
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

    const maxWidthLarge = (height / 2 - scanSize / 2) * 0.9
    const maxWidthSmall = (height / 2 - width * 0.7 / 2)

    if (isLargeScreen) {
      space = spaceLarge
      position = isPortrait ? positionLargePortrait : positionLargeLand
      maxWidth = maxWidthLarge
    } else {
      space = spaceSmall
      position = isPortrait ? postionSmallPortrait : postionSmallLand
      maxWidth = maxWidthSmall
    }

    let style: ViewStyle = {
      position: 'absolute',
      flex: 1,
      width: '100%',
      height: dp(70),
      alignItems: 'center',
      top: position,
      overflow: 'hidden',
    }
    if (!isPortrait && space < dp(70)) {
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
            <Text
              style={{
                color: 'white',
                marginTop: dp(10),
                textAlign: 'center',
              }}
            >
              {'请对准演示台上二维码进行扫描'}
            </Text>
          </View>
        </View>
      </>
    )
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
          // layerName: mapInfo?.currentLayer?.name || '',
          // id: 1,
          layerName: currentElement?.layerName || '',
          id: currentElement?.id || -1,
        }}
        close={async () => {
          if (this.state.toolType) {
            // SARMap.commitSandTableChanges()
            // await SARMap.submit()
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
          top: dp(10),
          // right: 0,
        }}
      >
        <SideBar
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
          top: dp(80),
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
        {(!this.state.showScan && !this.state.showGuide) && this.renderSideBar()}
        {this.state.showCover && this.renderCover()}
        <ARArrow />
        {this.state.showScan && this.renderScan()}
        {this.renderToolView()}
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

// const circleSize = dp(66)
// const circleR = dp(30)
// const circleStrokeWidth = dp(4)

class ToolView extends React.Component<ToolViewProps, unknown> {
  scaleBar: SlideBar | undefined | null
  rotationX: CircleBar | undefined | null
  rotationY: CircleBar | undefined | null
  rotationZ: CircleBar | undefined | null

  constructor(props: ToolViewProps) {
    super(props)
  }

  close = () => {
    this.props.close?.()
  }

  renderPosition = () => {
    let transformData: IARTransform = {
      // layerName: this.props.data.layerName,
      // id: this.props.data.id || -1,
      layerName: currentElement?.layerName || '',
      id: currentElement?.id || -1,
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
          <Text style={{width: '100%', textAlign: 'center', fontSize: dp(12)}}>位置调整</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={this.close}
          >
            <Image
              style={styles.closeImg}
              source={getImage().icon_close}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12)}}>缩放</Text>
          <SlideBar
            ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[0, 2000]}
            defaultMaxValue={1000}
            barColor={'#FF6E51'}
            onMove={loc => {
              const scale = loc / 100 - 1
              transformData = {
                ...transformData,
                scale: scale,
                type: 'scale',
                layerName: currentElement?.layerName || '',
                id: currentElement?.id || -1,
              }
              SARMap.setARElementTransform(transformData)
            }}
          />
        </View>
        <View style={styles.toolRow}>
          <Text style={{textAlign: 'center', fontSize: dp(12)}}>旋转</Text>
          <SlideBar
            ref={ref => this.scaleBar = ref}
            style={styles.slideBar}
            range={[-180, 180]}
            defaultMaxValue={0}
            barColor={'#FF6E51'}
            onMove={value => {
              transformData = {
                ...transformData,
                rotationY: value,
                type: 'rotation',
                layerName: currentElement?.layerName || '',
                id: currentElement?.id || -1,
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

  renderSectioning = () => {
    return (
      <>
        <View style={styles.toolRow}>
          <Text style={{width: '100%', textAlign: 'center'}}>剖切</Text>
        </View>
        <View style={styles.toolRow}>
          <Text>横向</Text>
          <SlideBar
            style={styles.slideBar}
            range={[0, 100]}
            defaultMaxValue={100}
            onMove={loc => {
              SARMap.clipByBox({
                direction: 'x',
                percent: loc,
              })
            }}
          />
        </View>
        <View style={styles.toolRow}>
          <Text>纵向</Text>
          <SlideBar
            style={styles.slideBar}
            range={[0, 100]}
            defaultMaxValue={100}
            onMove={loc => {
              SARMap.clipByBox({
                direction: 'z',
                percent: loc,
              })
            }}
          />
        </View>
      </>
    )
  }

  renderLighting = () => {
    return null
  }

  renderAdvertising = () => {
    return null
  }

  render() {
    if (this.props.type === '') return null
    return (
      <View style={styles.toolView}>
        {/* <View style={styles.toolBgView}/> */}
        {this.props.type === 'edit' && this.renderPosition()}
        {/* {this.props.type === 'sectioning' && this.renderSectioning()} */}
        {/* {this.props.type === 'lighting' && this.renderLighting()} */}
        {/* {this.props.type === 'advertising' && this.renderAdvertising()} */}
      </View>
    )
  }
}