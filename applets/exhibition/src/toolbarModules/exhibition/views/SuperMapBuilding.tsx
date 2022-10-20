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
  rightBtn: {
    width: dp(60),
    height: dp(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: dp(2),
    borderRightColor: 'white',
    backgroundColor: 'white',
  },
  rightSubBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: dp(26),
    height: dp(26),
  },
  btnImg: { position: 'absolute', width: '100%', height: '100%' },
  rightBtnTxt: { fontSize: 10 },
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
    top: dp(0),
    bottom: dp(0),
    right: dp(0),
    width: dp(60),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  functionBar: {
    flexDirection: 'column',
    width: dp(60),
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

type ToolType = 'position' | 'sectioning' | 'attribute' | 'lighting' | 'advertising'

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
      if (result) {
        SARMap.stopAREnhancePosition()
        this.setState({ showScan: false })
        const relativePositin: Vector3 = {
          x: 0,
          y: 0,
          z: -1,
        }
        const targetPxpPath = await this.importData()
        if (targetPxpPath) {
          await this.addARSceneLayer(targetPxpPath, {
            location: {
              x: 0,
              y: 0,
              z: 0,
            },
            scale: -0.995,
          })
          SExhibition.setTrackingTarget({
            pose: result,
            translation: relativePositin,
          })
          SExhibition.startTrackingTarget()
        }
      }
    })
  }

  importData = async () => {
    try {
      const home = await FileTools.getHomeDirectory()
      const importPath = home + ConstPath.Common + 'Exhibition/AR超图大厦/ChengDuSuperMap'
      const targetHomePath = home + ConstPath.CustomerPath + 'Data/Scene/ChengDuSuperMap/'
      const targetPath = targetHomePath + 'ChengDuSuperMap.sxwu'
      const targetPxpPath = home + ConstPath.CustomerPath + 'Data/Scene/ChengDuSuperMap.pxp'
      if (await FileTools.fileIsExist(targetPxpPath)) {
        if (await FileTools.fileIsExist(targetPath)) {
          Toast.show('已经导入数据')
          return targetPxpPath // 已经导入
        } else {
          await FileTools.deleteFile(targetPxpPath)
        }
      } else {
        if (await FileTools.fileIsExist(targetHomePath)) {
          await FileTools.deleteFile(targetHomePath)
        }
      }
      Toast.show('开始导入数据')
      const tempData = await DataHandler.getExternalData(importPath) || []
      const result = await DataHandler.importWorkspace3D(tempData[0])
      if (result) {
        Toast.show('导入数据成功')
        return targetPxpPath
      } else {
        Toast.show('导入数据失败')
        return ''
      }
    } catch (error) {
      Toast.show('导入数据失败')
      __DEV__ && console.warn(error)
    }
  }

  addARSceneLayer = async (pxpPath: string, option?: {location?: Point3D, rotation?: Point3D, scale?: number}) => {
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
          if (defaultLayer) {
            props.setCurrentARLayer(defaultLayer)
          }
        }
      }
    } catch(e) {
      __DEV__ && console.warn(e)
    }
  }

  showAttribute = (isShow: boolean) => {
    try {
      AppToolBar.addData({
        allowedShowAttribute: isShow,
      })
      const props = AppToolBar.getProps()
      const mapInfo = props.arMapInfo
      if (!isShow) {
        AppToolBar.getProps().setPipeLineAttribute([])
        if (mapInfo?.currentLayer?.ar3DLayers?.length > 0) {
          for (let i = 0; i < mapInfo.currentLayer.ar3DLayers.length; i++) {
            const layer = mapInfo.currentLayer.ar3DLayers[i]
            SARMap.setLayerVisible(layer.name, layer.isVisible)
          }
        }
      } else {
        if (mapInfo?.currentLayer?.ar3DLayers?.length > 0) {
          for (let i = 0; i < mapInfo.currentLayer.ar3DLayers.length; i++) {
            const layer = mapInfo.currentLayer.ar3DLayers[i]
            SARMap.setLayerVisible(layer.name, !layer.isVisible)
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
    if (this.state.showScan) {
      this.setState({ showScan: false })
      return
    }
    if (this.state.toolType) {
      await SARMap.submit()
      this.setState({
        toolType: '',
      })
      this.showAttribute(false)
      return
    }
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    if (layer) {
      SARMap.stopARCover(layer.name)
    }
    AppToolBar.addData({
      PipeLineAttribute: undefined,
    })

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

  startScan = () => {
    this.scanRef?.scan()
    SARMap.setAREnhancePosition()
  }

  checkSence = () => {
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
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => {
            this.setState({ showScan: true })
          }}
        >
          <Image
            style={styles.backImg}
            source={getImage().icon_other_scan}
          />
        </TouchableOpacity>
      </>
    )
  }

  renderRightButton = (props: {
    style?: ViewStyle,
    onPress: () => void,
    image: ImageSourcePropType,
    imageSelected: ImageSourcePropType,
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
            source={props.key === this.state.toolType ? props.imageSelected : props.image}
          />
        </View>

        <Text style={styles.rightBtnTxt}>
          {props.title}
        </Text>
      </TouchableOpacity>
    )
  }

  /** 位置调整 */
  renderPosition = () => {
    return this.renderRightButton({
      image: getImage().tool_location,
      imageSelected: getImage().tool_location_selected,
      onPress: () => {
        if (!this.checkSence()) return
        this.showAttribute(false)
        this.setState({
          toolType: 'position',
        })
        const props = AppToolBar.getProps()
        const mapInfo = props.arMapInfo
        mapInfo?.currentLayer?.name && SARMap.appointEditAR3DLayer(mapInfo.currentLayer.name)
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
        if (!this.checkSence()) return
        this.showAttribute(false)
        this.setState({
          toolType: 'sectioning',
        })
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
      onPress: () => {
        if (!this.checkSence()) return
        this.setState({
          toolType: 'attribute',
        })
        this.showAttribute(true)
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
        if (!this.checkSence()) return
        this.showAttribute(false)
        this.setState({
          toolType: 'lighting',
        })
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
        if (!this.checkSence()) return
        this.showAttribute(false)
        this.setState({
          toolType: 'advertising',
        })
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
    const maxWidthSmall = (height / 2 - width * 0.7 / 2) * 0.9

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
        top: width / 2,
        right: 0,
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
          style={style}
        >
          <TouchableOpacity
            style={{
              width: dp(100),
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          // onPress={this.startScan}
          >
            <Image
              style={styles.btnImg}
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
        type={this.state.toolType}
        data={{
          layerName: mapInfo.currentLayer.name,
        }}
        close={async () => {
          if (this.state.toolType) {
            await SARMap.submit()
            this.setState({
              toolType: '',
            })
            return
          }
        }}
      />
    )
  }

  renderFunctionBar = () => {
    return (
      <View style={styles.functionBarView} pointerEvents={'box-none'}>
        <View style={styles.functionBar}>
          {this.renderPosition()}
          {this.renderSectioning()}
          {this.renderAttribute()}
          {this.renderLightingEffect()}
          {this.renderAdvertising()}
        </View>
      </View>
    )
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
  constructor(props: ToolViewProps) {
    super(props)
  }

  close = () => {
    this.props.close?.()
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
        {/* {this.props.type === 'sectioning' && this.renderSectioning()} */}
        {/* {this.props.type === 'lighting' && this.renderLighting()} */}
        {/* {this.props.type === 'advertising' && this.renderAdvertising()} */}
      </View>
    )
  }
}