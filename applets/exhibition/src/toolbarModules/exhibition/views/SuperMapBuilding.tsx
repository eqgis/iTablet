import { AppEvent, AppStyle, AppToolBar, Toast, DataHandler, AppPath, AppLog } from '@/utils'
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Image, ImageSourcePropType, ScaledSize, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Scan from '../components/Scan'
import { SARMap, ARLayerType, FileTools, IARTransform, ARLayer, ARAction, SExhibition } from 'imobile_for_reactnative'
import { Point3D, Vector3 } from 'imobile_for_reactnative/types/data'
import { ConstPath } from '@/constants'
import DataLocal from '@/utils/DataHandler/DataLocal'
import { UserRoot } from '@/utils/AppPath'
import SlideBar from 'imobile_for_reactnative/components/SlideBar'
import CircleBar from '../components/CircleBar'
import PipeLineAttribute from '../components/pipeLineAttribute'
import ARArrow from '../components/ARArrow'
import { Pose, SceneLayerStatus } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { shouldBuildingMapData, buildingImported } from './Actions'

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

type ToolType = 'position' | 'sectioning' | 'attribute' | 'lighting' | 'advertising' | 'reset'

interface State {
  showScan: boolean
  showCover: boolean
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

class SuperMapBuilding extends React.Component<Props, State> {

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
      showScan: true,
      showCover: false,

      toolType: '',
    }
    this.showAttribute(false)
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
          await this.addARSceneLayer(targetPxpPath, {
            translation: {
              x: 0,
              y: 0,
              z: -1,
            },
            pose: JSON.parse(JSON.stringify(result)),
            // scale: -0.99,
            scale: 0.01,
          })
        }
      }
    })
  }

  arrowTricker = async (isOpen: boolean) => {
    if (isOpen && this.pose && this.relativePositin) {
      await SExhibition.setTrackingTarget({
        pose: this.pose,
        translation: this.relativePositin,
      })
      await SExhibition.startTrackingTarget()
    } else {
      await SExhibition.stopTrackingTarget()
    }
  }

  importData = async () => {
    try {
      const home = await FileTools.getHomeDirectory()
      const importPath = home + ConstPath.Common + 'Exhibition/AR超图大厦/ChengDuSuperMap'
      const targetHomePath = home + ConstPath.CustomerPath + 'Data/Scene/ChengDuSuperMap/'
      const targetPath = targetHomePath + 'ChengDuSuperMap.sxwu'
      const targetPxpPath = home + ConstPath.CustomerPath + 'Data/Scene/ChengDuSuperMap.pxp'

      const needToImport = await shouldBuildingMapData()

      if (needToImport && await FileTools.fileIsExist(targetHomePath)) {
        await FileTools.deleteFile(targetHomePath)
      } else {
        if (await FileTools.fileIsExist(targetPxpPath)) {
          if (await FileTools.fileIsExist(targetPath)) {
            // Toast.show('已经导入数据')
            return targetPxpPath // 已经导入
          } else {
            await FileTools.deleteFile(targetPxpPath)
          }
        } else {
          if (await FileTools.fileIsExist(targetHomePath)) {
            await FileTools.deleteFile(targetHomePath)
          }
        }
      }

      // Toast.show('开始导入数据')
      const tempData = await DataHandler.getExternalData(importPath) || []
      const result = await DataHandler.importWorkspace3D(tempData[0])
      if (result) {
        buildingImported()
        // Toast.show('导入数据成功')
        return targetPxpPath
      } else {
        // Toast.show('导入数据失败')
        return ''
      }
    } catch (error) {
      // Toast.show('导入数据失败')
      __DEV__ && console.warn(error)
    }
  }

  addARSceneLayer = async (pxpPath: string, option: { pose: Pose, translation: Vector3, scale?: number}) => {
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

      //若已存在场景图层则先移除
      const sceneLayers = mapInfo?.layers?.filter((layer: ARLayer) => {
        return layer.type === ARLayerType.AR_SCENE_LAYER
      })
      if (sceneLayers && sceneLayers.length > 0) {
        await SARMap.removeARLayer(sceneLayers[0].name)
      }

      let datasourceName = DataHandler.getARRawDatasource()
      let datasetName = 'scene'
      const result = await DataHandler.createARElementDatasource(props.currentUser, datasourceName, datasetName, newDatasource, true, ARLayerType.AR3D_LAYER)
      if (result.success && result.datasourceName) {
        datasourceName = result.datasourceName
        datasetName = result.datasetName || ''
        if (newDatasource) {
          DataHandler.setARRawDatasource(datasourceName)
        }

        const homePath = await FileTools.getHomeDirectory()
        const pxp = await DataLocal.getPxpContent(pxpPath)
        if (pxp === null) return
        const wsPath = homePath + AppPath.User.path + '/' + props.currentUser.userName + UserRoot.Data.ARScene.path + '/' + pxp.Workspace.server
        const addLayerName = await SARMap.addSceneLayer(datasourceName, datasetName, wsPath, option)
        if (addLayerName !== '') {
          const layers = await props.getARLayers()
          const defaultLayer = layers.find(item => {
            return item.type === ARLayerType.AR_SCENE_LAYER
          })
          if (defaultLayer?.name) {
            props.setCurrentARLayer(defaultLayer)
            this.oraginLayerStatus = await SARMap.getSceneLayerStatus(defaultLayer.name)
          }
        }
      }
      this.isOpen = true
      this.arrowTricker(true)
    } catch(e) {
      this.isOpen = false
      __DEV__ && console.warn(e)
    }
  }

  showAttribute = async (isShow: boolean) => {
    try {
      AppToolBar.addData({
        allowedShowAttribute: isShow,
      })
      const props = AppToolBar.getProps()
      const mapInfo = props.arMapInfo
      if (!isShow) {
        AppToolBar.getProps().setPipeLineAttribute([])
        this.arrowTricker(true)
        if (mapInfo?.currentLayer?.ar3DLayers?.length > 0) {
          for (let i = 0; i < mapInfo.currentLayer.ar3DLayers.length; i++) {
            const layer = mapInfo.currentLayer.ar3DLayers[i]
            await SARMap.setLayerVisible(layer.name, layer.isVisible)
          }
        }
      } else {
        if (mapInfo?.currentLayer?.ar3DLayers?.length > 0) {
          this.arrowTricker(false)
          for (let i = 0; i < mapInfo.currentLayer.ar3DLayers.length; i++) {
            const layer = mapInfo.currentLayer.ar3DLayers[i]
            await SARMap.setLayerVisible(layer.name, !layer.isVisible)
          }
        }
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
    // if (this.state.toolType) {
    //   if(this.state.toolType === 'attribute') {
    //     const props = AppToolBar.getProps()
    //     const mapInfo = props.arMapInfo
    //     // 退出属性,还原比例
    //     mapInfo?.currentLayer?.name && this.lastLayerStatus && await SARMap.setSceneLayerStatus(mapInfo?.currentLayer?.name, this.lastLayerStatus)
    //     this.showAttribute(false)
    //   } else {
    //     await SARMap.submit()
    //   }

    //   this.switchTool('', () => {
    //     this.clickWait = false
    //   })
    //   return
    // }
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
    if (this.state.toolType === 'attribute' && toolType !== 'attribute') {
      const props = AppToolBar.getProps()
      const mapInfo = props.arMapInfo
      // 退出属性,还原比例
      mapInfo?.currentLayer?.name && this.lastLayerStatus && await SARMap.setSceneLayerStatus(mapInfo?.currentLayer?.name, this.lastLayerStatus)
      this.showAttribute(false)
    } else if (this.state.toolType === 'sectioning' && toolType !== 'sectioning') {
      SARMap.clearAR3DClipPlane()
    }
    if (this.state.toolType !== toolType) {
      this.setState({
        toolType: toolType,
      }, () => {
        cb?.()
      })
    } else if (this.state.toolType && this.state.toolType === toolType) {
      if(this.state.toolType === 'attribute') {
        const props = AppToolBar.getProps()
        const mapInfo = props.arMapInfo
        // 退出属性,还原比例
        mapInfo?.currentLayer?.name && this.lastLayerStatus && await SARMap.setSceneLayerStatus(mapInfo?.currentLayer?.name, this.lastLayerStatus)
        this.showAttribute(false)
      } else {
        await SARMap.submit()
      }
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
      Toast.show('请先扫描二维码,打开超图大厦')
      return false
    }
    return true
  }

  renderBack = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={this.back}
        >
          <Image
            style={styles.backImg}
            source={getImage().icon_return}
          />
        </TouchableOpacity>
        {
          !this.state.showScan &&
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => {
              let toolType = this.state.toolType
              if (this.state.toolType) {
                toolType = ''
                SARMap.submit()
                this.showAttribute(false)
              }
              this.arrowTricker(false)
              SARMap.setAREnhancePosition()
              this.setState({ showScan: true, toolType })
            }}
          >
            <Image
              style={styles.backImg}
              source={getImage().icon_other_scan}
            />
          </TouchableOpacity>
        }
      </>
    )
  }

  renderRightButton = (props: {
    style?: ViewStyle,
    onPress: () => void,
    image: ImageSourcePropType,
    imageSelected?: ImageSourcePropType,
    key: ToolType,
    title: string,
  }) => {
    return (
      <TouchableOpacity
        key={props.key}
        style={[
          styles.rightBtn,
          props.style,
          props.key === this.state.toolType && { borderRightColor: '#F24F02'},
        ]}
        onPress={props.onPress}
      >
        <View style={styles.rightSubBtn}>
          <Image
            style={styles.btnImg}
            source={props.key === this.state.toolType && props.imageSelected ? props.imageSelected : props.image}
          />
        </View>

        <Text style={styles.rightBtnTxt}>
          {props.title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderReset = () => {
    return this.renderRightButton({
      image: getImage().icon_tool_reset,
      onPress: async () => {
        if (!this.checkSenceAndToolType()) return
        // 若是属性功能,点击复位,则退出ToolView
        if (this.state.toolType === 'attribute') {
          this.switchTool('')
        }
        if (this.oraginLayerStatus) {
          const props = AppToolBar.getProps()
          const layerName = props.arMapInfo.currentLayer.name
          this.toolView?.reset()
          layerName && await SARMap.setSceneLayerStatus(layerName, this.oraginLayerStatus)
        }
      },
      style: styles.resetBtn,
      key: 'reset',
      title: '复位',
    })
  }

  /** 位置调整 */
  renderPosition = () => {
    return this.renderRightButton({
      image: getImage().tool_location,
      imageSelected: getImage().tool_location_selected,
      onPress: () => {
        if (!this.checkSenceAndToolType()) return
        this.showAttribute(false)

        this.switchTool('position', () => {
          const props = AppToolBar.getProps()
          const mapInfo = props.arMapInfo
          mapInfo?.currentLayer?.name && SARMap.appointEditAR3DLayer(mapInfo.currentLayer.name)
        })
      },
      key: 'position',
      title: '调整位置',
    })
  }

  /** 剖切 */
  renderSectioning = () => {
    return this.renderRightButton({
      image: getImage().tool_sectioning,
      imageSelected: getImage().tool_sectioning_selected,
      onPress: () => {
        if (!this.checkSenceAndToolType()) return
        this.showAttribute(false)
        this.switchTool('sectioning')
      },
      key: 'sectioning',
      title: '剖切',
    })
  }

  /** 属性 */
  renderAttribute = () => {
    return this.renderRightButton({
      image: getImage().tool_attribute,
      imageSelected: getImage().tool_attribute_selected,
      onPress: async () => {
        if (!this.checkSenceAndToolType()) return
        this.switchTool('attribute', async () => {
          await this.showAttribute(true)
          const props = AppToolBar.getProps()
          const mapInfo = props.arMapInfo
          mapInfo?.currentLayer?.name && await SARMap.appointEditAR3DLayer(mapInfo.currentLayer.name)
          console.warn(mapInfo?.currentLayer?.name)
          const status = await SARMap.getSceneLayerStatus(mapInfo?.currentLayer?.name)
          this.lastLayerStatus = {...status}

          // status.rx = 0
          // status.ry = 166.23
          // status.rz = 0
          status.sx = 0.06
          status.sy = 0.06
          status.sz = 0.06
          status.x = status.x || 0
          status.y = status.y || 0
          status.z = (status.z || 0) - 1

          await SARMap.setSceneLayerStatus(mapInfo?.currentLayer?.name, status)
        })
      },
      key: 'attribute',
      title: '属性',
    })
  }

  /** 光效 */
  renderLightingEffect = () => {
    return this.renderRightButton({
      image: getImage().tool_lighting,
      imageSelected: getImage().tool_lighting_selected,
      onPress: () => {
        if (!this.checkSenceAndToolType()) return
        this.showAttribute(false)
        this.switchTool('lighting')
      },
      key: 'lighting',
      title: '光效',
    })
  }

  /** 广告牌 */
  renderAdvertising = () => {
    return this.renderRightButton({
      image: getImage().tool_advertise,
      imageSelected: getImage().tool_advertise_selected,
      onPress: () => {
        if (!this.checkSenceAndToolType()) return
        this.showAttribute(false)
        this.switchTool('advertising')
      },
      key: 'advertising',
      title: '广告牌',
    })
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

  renderToolView = () => {
    // if (!this.state.toolType) return null
    const props = AppToolBar.getProps()
    const mapInfo = props.arMapInfo
    if (!props.arMap.currentMap || !mapInfo || !mapInfo.currentLayer) {
      // Toast.show('请先扫描二维码,打开超图大厦')
      return null
    }
    return (
      <ToolView
        ref={ref => this.toolView = ref}
        type={this.state.toolType}
        data={{
          layerName: mapInfo.currentLayer.name,
        }}
        close={async () => {
          if (this.state.toolType) {
            await SARMap.submit()
            this.switchTool('')
            return
          }
        }}
      />
    )
  }

  renderFunctionBar = () => {
    return (
      <View style={styles.functionBarView}>
        {this.renderReset()}
        <View style={styles.functionBar}>
          {this.renderPosition()}
          {/* {this.renderSectioning()} */}
          {this.renderAttribute()}
          {/* {this.renderLightingEffect()} */}
          {/* {this.renderAdvertising()} */}
        </View>
      </View>
    )
    // return (
    //   // <View style={styles.functionBarView} pointerEvents={'box-none'}>
    //   <View style={styles.functionBar}>
    //     {this.renderPosition()}
    //     {/* {this.renderSectioning()} */}
    //     {this.renderAttribute()}
    //     {/* {this.renderLightingEffect()} */}
    //     {/* {this.renderAdvertising()} */}
    //   </View>
    //   // </View>
    // )
  }

  render() {
    return (
      <>
        {this.renderFunctionBar()}
        {this.state.showCover && this.renderCover()}
        <ARArrow />
        {this.state.showScan && this.renderScan()}
        {this.renderToolView()}
        {this.renderBack()}
      </>
    )
  }
}

export default SuperMapBuilding

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

const circleSize = dp(66)
const circleR = dp(30)
const circleStrokeWidth = dp(4)

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

  reset = () => {
    this.resetPosition()
  }

  resetPosition = () => {
    try {
      if (this.props.type !== 'position') return
      this.scaleBar?.onClear()
      this.rotationX?.reset()
      this.rotationY?.reset()
      this.rotationZ?.reset()
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  renderPosition = () => {
    let transformData: IARTransform = {
      layerName: this.props.data.layerName,
      id: this.props.data.id || -1,
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
            range={[0, 200]}
            defaultMaxValue={100}
            barColor={'#FF6E51'}
            onMove={loc => {
              const scale = loc / 100 - 1
              transformData = {
                ...transformData,
                scale: scale,
                type: 'scale',
              }
              SARMap.setARElementTransform(transformData)
            }}
          />
        </View>
        <View style={styles.toolRow}>
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
        </View>
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
        {this.props.type === 'position' && this.renderPosition()}
        {this.props.type === 'sectioning' && this.renderSectioning()}
        {/* {this.props.type === 'lighting' && this.renderLighting()} */}
        {/* {this.props.type === 'advertising' && this.renderAdvertising()} */}
      </View>
    )
  }
}