/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import {
  Platform,
  View,
  Text,
  TextInput,
  BackHandler,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { SMSceneView, Point3D, Camera, SScene } from 'imobile_for_reactnative'
import {
  Container,
  Dialog,
  InputDialog,
  MenuDialog,
  PanResponderView,
  Progress,
  MTBtn,
  RedDot,
} from '../../../../components'
import {
  FunctionToolbar,
  MapToolbar,
  MapController,
  ToolBar,
  OverlayView,
  MapNavMenu,
  MapNavIcon,
  BackgroundOverlay,
} from '../../components'
import { MapHeaderButton } from '../../../../constants'
import { getPublicAssets ,getThemeAssets} from '../../../../assets'
import { Toast, scaleSize, screen } from '../../../../utils'
import { color } from '../../../../styles'
import { share3DModule, tool3DModule } from '../../components/ToolBar/modules'
import NavigationService from '../../../NavigationService'
import styles from './styles'
import { getLanguage } from '../../../../language'
import SurfaceView from '../../../../components/SurfaceView'
import ToolbarModule from '../../components/ToolBar/modules/ToolbarModule'
import { BackHandlerUtil } from '../../util'
import GuideViewMapSceneModel from '../../components/GuideViewMapSceneModel'
import { Bar } from 'react-native-progress'
import sceneInfoType from '../../../../redux/models/scenes'
import { Action3D } from 'imobile_for_reactnative/NativeModule/interfaces/scene/SSceneType'

const SAVE_TITLE = '是否保存当前场景'
export default class Map3D extends React.Component {
  props: {
    nav: Object,
    language: string,
    editLayer: Object,
    latestMap: Object,
    navigation: Object,
    online: Object,
    toolbarStatus: Object,
    downloads: Array,
    setEditLayer: () => {},
    setLatestMap: () => {},
    setCurrentAttribute: () => {},
    setAttributes: () => {},
    exportmap3DWorkspace: () => {},
    refreshLayer3dList: () => {},
    resetLayer3dList: () => {},
    setCurSceneInfo: (params: typeof sceneInfoType | null) => void,
    user: Object,
    device: Object,
    appConfig: Object,
    mapModules: Object,
    backActions: Object,
    setBackAction: () => {},
    removeBackAction: () => {},
    setToolbarStatus: () => {},
    mapSceneGuide: Object,
    showSampleData: Object,
    setSampleDataShow: () => {},
  }

  constructor(props) {
    super(props)
    global.sceneName = ''
    global.openWorkspace = false
    global.action3d = Action3D.NULL
    global.offlineScene = false
    const params = this.props.route.params
    this.mapName = params.mapName || null
    this.state = {
      title: '',
      popShow: false,
      // inputText: '',
      showErrorInfo: false,
      measureShow: false,
      measureResult: '',
      showMenuDialog: false, //裁剪菜单
      showPanResponderView: false, //裁剪拖动界面
      clipSetting: {}, //裁剪数据
      cutLayers: [], //三维裁剪的图层数组
      tips: '', //裁剪数值信息
      samplescale:new Animated.Value(0.1),
    }
    this.selectKey = '' //裁剪选中的key
    this.changeLength = 0 //总的位移
    this.leftInterval = null // 作画定时器
    this.rightInterval = null //右滑定时器
    this.name = params.name || ''
    this.type = params.type || 'MAP_3D'
    this.mapLoaded = false // 判断地图是否加载完成
  }

  componentDidMount() {
    if (global.isLicenseValid) {
      this.container.setLoading(
        true,
        getLanguage(this.props.language).Prompt.LOADING,
      )


      this.unsubscribeFocus = () => {
        if (this.showFullonBlur) {
          this.showFullMap(false)
          this.showFullonBlur = false
        }
        this.backgroundOverlay && this.backgroundOverlay.setVisible(false)
      }

      this.unsubscribeDidFocus = () => {
        if (this.showFullonBlur) {
          this.showFullMap(false)
          this.showFullonBlur = false
        }
        this.backgroundOverlay && this.backgroundOverlay.setVisible(false)
      }

      this.unsubscribeBlur = () => {
        if (!this.fullMap) {
          this.showFullMap(true)
          this.showFullonBlur = true
        }
        this.backgroundOverlay && this.backgroundOverlay.setVisible(true)
      }

      this.props.navigation.addListener('willFocus', this.unsubscribeFocus)
      //跳转回mapview速度太快时会来不及触发willFocus，在didFocus时重复处理相关逻辑
      this.props.navigation.addListener('didFocus', this.unsubscribeDidFocus)
      this.props.navigation.addListener('willBlur', this.unsubscribeBlur)

      BackHandler.addEventListener('hardwareBackPress', this.backHandler)
    } else {
      global.SimpleDialog.set({
        text: getLanguage(global.language).Prompt.APPLY_LICENSE_FIRST,
        confirmAction: () => NavigationService.goBack(),
        cancelAction: () => NavigationService.goBack(),
      })
      global.SimpleDialog.setVisible(true)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.downloads.length > 0 &&
      JSON.stringify(this.props.downloads) !==
        JSON.stringify(prevProps.downloads)
    ) {
      let data
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (
          this.props.downloads[i].id &&
          this.props.downloads[i].params.module === global.Type
        ) {
          data = this.props.downloads[i]
        }
      }
      if (data && this.mProgress) {
        this.mProgress.progress = data.progress / 100
      }
    }
  }

  componentWillUnmount() {
    // global.SaveMapView&&global.SaveMapView.setTitle(SAVE_TITLE)
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.route.name,
      })
    }
    global.Type = null
    this.attributeListener && this.attributeListener.remove()
    this.circleFlyListen && this.circleFlyListen.remove()
    this.props.navigation.removeListener('willFocus', this.unsubscribeFocus)
    this.props.navigation.removeListener('didFocus', this.unsubscribeDidFocus)
    this.props.navigation.removeListener('willBlur', this.unsubscribeBlur)
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
  }

  backHandler = () => {
    return BackHandlerUtil.backHandler(this.props.nav, this.props.backActions)
  }

  getLayers = async () => {
    // 获取三维图层
    let layerlist
    try {
      layerlist = await SScene.getLayers()
    } catch (e) {
      layerlist = []
    }
    // 获取三维地形
    let terrainLayerList
    try {
      terrainLayerList = await SScene.getTerrainLayers()
    } catch (e) {
      terrainLayerList = []
    }
    layerlist = JSON.parse(JSON.stringify(layerlist.concat(terrainLayerList)))
    let cutLayers = layerlist.map(layer => {
      layer.selected = true
    })
    this.setState({
      layerlist,
      cutLayers,
    })
  }
  initListener = async () => {
    SScene.initGestureListener().then(() => {
      SScene.initAttributeListener()
      SScene.initCircleFlyListener()
      SScene.setAction(Action3D.PAN3D)
      global.action3d = Action3D.PAN3D
    })
  }

  addAttributeListener = async () => {
    this.attributeListener = await SScene.addAttributeListener(result => {
      global.action3d === Action3D.PAN3D && this.showFullMap(!this.fullMap)

      let list = []
      let arr = []
      Object.keys(result).forEach(key => {
        let item = {
          fieldInfo: { caption: key },
          name: key,
          value: result[key],
        }
        if (key === 'id') {
          arr.unshift(item)
        } else {
          arr.push(item)
        }
      })
      list.push(arr)
      this.props.setAttributes(list)
    },
    )
  }

  addCircleFlyListen = async () => {
    this.circleFlyListen = SScene.addCircleFlyListener(() => {
      tool3DModule().actions.circleFly()
    }
    )
  }

  _addScene = async () => {
    if (!this.name) {
      setTimeout(() => {
        this.container.setLoading(false)
        Toast.show(getLanguage(this.props.language).Prompt.NO_SCENE)
        this.mapLoaded = true
        //'无场景显示')
      }, 1500)
      // iOS上次打开的场景被删除、且没有其余场景时，再次进入模块场景会卡住，调这个接口初始化一下 zcj
      if(Platform.OS === 'ios'){
        SScene.initNoScene()
        // initNoScene() 里设置了isRender 需要closeWorkspace里设置
        global.openWorkspace = true
      }
      // if (this.props.showSampleData) {
      let animatedList = []
      animatedList.push(
        Animated.timing(this.state.samplescale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: false,
        })
      )
      animatedList.push(
        Animated.timing(this.state.samplescale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        })
      )
      Animated.sequence(animatedList).start()
      // }
      return
    }
    try {
      SScene.openScene(this.name).then(async result => {
        if (!result) {
          this.container.setLoading(false)
          this.mapLoaded = true
          return
        }
        SScene.setNavigationControlVisible(false)
        this.initListener()
        global.openWorkspace = true
        global.sceneName = this.name
        global.offlineScene = true
        setTimeout(() => {
          this.container.setLoading(false)
          // Toast.show('无场景显示')
        }, 1500)
        this.mapLoaded = true
        // 只有是球面场景时才添加底图 add jiakai
        if (await SScene.isEarthScene()) {
          await SScene.changeBaseLayer(1)
        }
        this.getLayers()
        this.props.refreshLayer3dList && this.props.refreshLayer3dList()
        const defaultSceneInfo: sceneInfoType = {
          name: this.name,
          server: '',
          mtime: '',
          isOnlineScence: false,
          image: 611,
          rightView: undefined,
        }
        this.props.setCurSceneInfo && this.props.setCurSceneInfo(defaultSceneInfo)
      }).catch(() =>{
        //reject异常处理 zhangxt
        setTimeout(() => {
          this.container.setLoading(false)
          // Toast.show('无场景显示')
          this.mapLoaded = true
        }, 1500)
      })

      // if (this.props.showSampleData) {
      let animatedList = []
      animatedList.push(
        Animated.timing(this.state.samplescale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: false,
        })
      )
      animatedList.push(
        Animated.timing(this.state.samplescale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        })
      )
      Animated.sequence(animatedList).start()
      // }
    } catch (e) {
      setTimeout(() => {
        this.container.setLoading(false)
        // Toast.show('无场景显示')
        this.mapLoaded = true
      }, 1500)
    }
    // await SScene.addLayer3D(
    //   'http://t0.tianditu.com/img_c/wmts',
    //   'l3dBingMaps',
    //   'bingmap',
    //   'JPG_PNG',
    //   96.0,
    //   true,
    //   'c768f9fd3e388eb0d155405f8d8c6999',
    // )
  }

  _onGetInstance = ()=> {
    // console.warn("add scene")

    //放到这里打开场景，更稳定 add xiezhy
    // let startOpen = false
    // let openScene = () => {

    // if (startOpen) return
    // startOpen = true
    // clearTimeout(this.openTimer)

    if (Platform.OS === 'android') {
      this.props.setBackAction({
        key: 'Map3D',
        action: this.back,
      })
    }
    global.SaveMapView && global.SaveMapView.setTitle(SAVE_TITLE)

    // 三维地图只允许单例
    // setTimeout(this._addScene, 2000)
    this._addScene()
    this.addAttributeListener()
    this.addCircleFlyListen()
    // }

    // this._addScene()
  }

  _pop_list = (show, type) => {
    //底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState(() => {
      return { popShow: show, popType: type }
    })
  }

  _flyToPoint = () => {
    (async function() {
      let point = await new Point3D().createObj(116.5, 39.9, 500)
      this.scene.flyToPoint(point)
    }.bind(this)())
  }

  _flyToCamera = () => {
    (async function() {
      let camera = await new Camera().createObj(
        116.467575,
        39.91542777777778,
        1000,
        300,
        30,
      )
      this.scene.flyToCamera(camera, 300, true)
    }.bind(this)())
  }

  _changeLayerColor = () => {
    (async function() {
      let layers3ds = await this.scene.getLayer3Ds()
      let layer3D = await layers3ds.get(4)
      layer3D.setObjectsColor(1, 255, 0, 0, 0.8)
      await this.scene.refresh()
    }.bind(this)())
  }

  showMenuDialog = params => {
    let { clipSetting, showMenuDialog } = params
    if (showMenuDialog === undefined) {
      showMenuDialog = !this.state.showMenuDialog
    }
    if (clipSetting === undefined) {
      clipSetting = this.state.clipSetting
    }
    this.setState({
      showMenuDialog,
      showPanResponderView: false,
      clipSetting,
    })
  }

  //获取裁剪设置ClipSetting
  getClipSetting = () => {
    return this.state.clipSetting
  }
  setClipSetting = clipSetting => {
    this.setState({
      clipSetting,
    })
  }
  back = async () => {
    // global.SaveMapView &&
    //   global.openWorkspace &&
    //   global.SaveMapView.setVisible(true, this.setLoading)
    // if (!global.openWorkspace) {
    //   this.container && this.container.setLoading(false)
    //   NavigationService.goBack()
    // }
    // global.sceneName = ''
    if (!this.mapLoaded) return
    try {
      if (global.isCircleFlying) {
        await SScene.stopCircleFly()
        await SScene.clearCircleFlyPoint()
      }
      if (Platform.OS === 'android') {
        if (this.state.showPanResponderView || this.state.showMenuDialog) {
          this.setState({
            showMenuDialog: false,
            showPanResponderView: false,
            tips: '',
          })
          return
        }
        if (this.toolBox && this.toolBox.getState().isShow) {
          // this.toolBox.close()
          this.toolBox.getToolbarModule().getParams().buttonView.close()
          return true
        } else if (this.SaveDialog && this.SaveDialog.getState().visible) {
          this.SaveDialog.setDialogVisible(false)
          return true
        } else if (
          global.removeObjectDialog &&
          global.removeObjectDialog.getState().visible
        ) {
          global.removeObjectDialog.setDialogVisible(false)
          return true
        }
      }

      this.container &&
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.CLOSING_3D,
          //'正在关闭'
        )
      // if (global.openWorkspace) {
        // this.SaveDialog && this.SaveDialog.setDialogVisible(true)
        // await SScene.saveWorkspace()
      this.mapController?.stopCompass()
      await SScene.closeWorkspace()
      // 重置redux里的3d图层数据
      this.props.resetLayer3dList && await this.props.resetLayer3dList()
      this.props.setCurSceneInfo && await this.props.setCurSceneInfo()
      this.container && this.container.setLoading(false)
      this.closeSample()
      NavigationService.goBack()
      // } else {
      //   this.container && this.container.setLoading(false)
      //   NavigationService.goBack()
      // }
    } catch (e) {
      this.container && this.container.setLoading(false)
      NavigationService.goBack()
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  //遮盖层
  renderOverLayer = () => {
    return (
      <OverlayView
        ref={ref => (global.OverlayView = ref)}
        onPress={() => {
          this.toolBox && this.toolBox.overlayOnPress()
        }}
      />
    )
  }

  _onKeySelect = item => {
    //拖动裁剪 显示PanResponderView
    this.selectKey = item.selectKey
    this.setState({
      showMenuDialog: false,
      showPanResponderView: true,
      tips: '',
    })
  }
  renderMenuDialog = () => {
    let data = [
      {
        key: getLanguage(this.props.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_LENGTH,
        selectKey: 'length',
        action: this._onKeySelect,
      },
      {
        key: getLanguage(this.props.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_WIDTH,
        selectKey: 'width',
        action: this._onKeySelect,
      },
      {
        key: getLanguage(this.props.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_HEIGHT,
        selectKey: 'height',
        action: this._onKeySelect,
      },
      { key: 'X', selectKey: 'X', action: this._onKeySelect },
      { key: 'Y', selectKey: 'Y', action: this._onKeySelect },
      { key: 'Z', selectKey: 'Z', action: this._onKeySelect },
    ]
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: color.transOverlay,
        }}
      >
        <MenuDialog
          data={data}
          autoSelect={true}
          viewableItems={5}
          selectKey={this.selectKey}
          device={this.props.device}
        />
      </View>
    )
  }
  /**
   * 移动的时候改变clipSetting 每次调用changeLength改变
   * @param type  -1：左移  1：右移  0：结束移动，setState改变clipSetting
   * @param cb
   * @private
   */
  _changeClipSetting = (type, cb) => {
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    this.changeLength += 10 * type
    let distance = 0
    switch (this.selectKey) {
      case 'X':
      case 'Y':
        distance = this.changeLength / 5000000
        clipSetting[this.selectKey] += distance
        if (clipSetting[this.selectKey] < 0) {
          clipSetting[this.selectKey] = 0
        } else if (clipSetting[this.selectKey] > 360) {
          clipSetting[this.selectKey] = 360
        }
        break
      case 'Z':
        distance = this.changeLength / 200
        clipSetting[this.selectKey] += distance
        if (clipSetting[this.selectKey] < 0) {
          clipSetting[this.selectKey] = 0
        }
        break
      case 'width':
      case 'height':
      case 'length':
        distance = this.changeLength / 100
        clipSetting[this.selectKey] += distance
        if (clipSetting[this.selectKey] < 1) {
          clipSetting[this.selectKey] = 1
        }
        break
    }
    if (type === 0) {
      this.setState(
        {
          clipSetting,
        },
        () => {
          cb && cb(clipSetting)
        },
      )
    } else {
      //parseFloat去除小数后多余的0
      this.setState(
        {
          tips: parseFloat(clipSetting[this.selectKey]),
        },
        () => {
          cb && cb(clipSetting)
        },
      )
    }
  }

  //移动
  _onHandleMove = async (evt, gestureState) => {
    let { dx } = gestureState
    if (dx > 10 && !this.rightInterval) {
      //右移
      if (this.leftInterval) {
        clearInterval(this.leftInterval)
      }
      this.rightInterval = setInterval(() => {
        this._changeClipSetting(1, async clipSetting => {
          await SScene.clipByBox(clipSetting)
        })
      }, 100)
    } else if (dx < -10 && !this.leftInterval) {
      //左移
      if (this.rightInterval) {
        clearInterval(this.rightInterval)
      }
      this.leftInterval = setInterval(() => {
        this._changeClipSetting(-1, async clipSetting => {
          await SScene.clipByBox(clipSetting)
        })
      }, 100)
    }
  }

  //结束移动
  _onHandleMoveEnd = (evt, gestureState) => {
    let { dx, dy } = gestureState
    if (Math.abs(dx) > 10 && Math.abs(dy) < Math.abs(dx)) {
      this._changeClipSetting(0, async clipSetting => {
        this.changeLength = 0
        ToolbarModule.addData({ clipSetting })
      })
    } else if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      this.setState({
        tips: '',
        showMenuDialog: true,
        showPanResponderView: false,
      })
    }
    this.leftInterval && clearInterval(this.leftInterval)
    this.rightInterval && clearInterval(this.rightInterval)
    this.leftInterval = null
    this.rightInterval = null
    this.changeLength = 0
  }

  clearClip = () => {
    this.selectKey = ''
    this.setState({
      tips: '',
      showMenuDialog: false,
      showPanResponderView: false,
      clipSetting: {},
    })
  }
  renderPanResponderView = () => {
    let tips = this.state.tips === '' ? this.state.clipSetting[this.selectKey] : this.state.tips
    tips = tips.toString().length > 8 ? tips.toFixed(6) : tips
    let needTips = !!tips
    let padding =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? { paddingHorizontal: scaleSize(80) }
        : {}
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...padding,
          backgroundColor: color.transOverlay,
          flexDirection: 'row',
        }}
      >
        <View style={styles.addAndSubText}>
          <View style={[styles.textBackground, { marginLeft: scaleSize(15) }]}>
            <Text style={styles.subText}>{'－'}</Text>
          </View>
        </View>

        <PanResponderView
          onHandleMove={this._onHandleMove}
          onHandleMoveEnd={this._onHandleMoveEnd}
          withTopBar={true}
        >
          {needTips && (
            <View style={styles.measureResultContainer}>
              <View style={styles.measureResultView}>
                <Text style={styles.measureResultText}>{tips}</Text>
              </View>
            </View>
          )}
        </PanResponderView>

        <View style={styles.addAndSubText}>
          <View style={[styles.textBackground, { marginRight: scaleSize(15) }]}>
            <Text style={styles.addText}>{'＋'}</Text>
          </View>
        </View>
      </View>
    )
  }
  renderFunctionToolbar = () => {
    return (
      <FunctionToolbar
        language={this.props.language}
        ref={ref => (this.functionToolbar = ref)}
        getToolRef={() => {
          return this.toolBox
        }}
        getNavMenuRef={() => this.NavMenu}
        type={this.type}
        showFullMap={this.showFullMap}
        device={this.props.device}
        online={this.props.online}
        mapModules={this.props.mapModules}
        user={this.props.user}
      />
    )
  }
  renderMapController = () => {
    return (
      <MapController
        ref={ref => (this.mapController = ref)}
        type={'MAP_3D'}
        device={this.props.device}
      />
    )
  }

  showFullMap = isFull => {
    this.showFullonBlur = !isFull
    if (isFull === this.fullMap) return
    let full = isFull === undefined ? !this.fullMap : !isFull
    this.container && this.container.setHeaderVisible(full)
    this.container && this.container.setBottomVisible(full)
    this.functionToolbar && this.functionToolbar.setVisible(full)
    this.mapController && this.mapController.setVisible(full)
    this.NavIcon && this.NavIcon.setVisible(full)
    this.fullMap = isFull
  }

  confirm = async () => {
    // eslint-disable-next-line
    // const content = /[@#\$%\^&\*]+/g
    // let result = content.test(this.state.inputText)
    // let result = content.test(this.inputText)
    if (
      // result ||
      this.inputText === '' ||
      this.inputText === null
      // this.state.inputText === '' ||
      // this.state.inputText === null
    ) {
      this.inputText = null
      this.setState({
        // inputText: null,
        showErrorInfo: true,
      })
      return
    }
    // let point = this.toolBox.getPoint()
    let point = this.toolBox.getToolbarModule().getData().point
    SScene.addGeoText(
      point.pointX,
      point.pointY,
      point.pointZ,
      this.inputText,
      // this.state.inputText,
    ).then(() => {
      this.inputText = ''
      // this.setState({
      //   inputText: '',
      // })
    })
    // this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
  }

  cancel = async () => {
    this.setState({
      showErrorInfo: false,
    })
    // this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
  }

  setInputDialogVisible = (visible, params = {}) => {
    this.InputDialog && this.InputDialog.setDialogVisible(visible, params)
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        initIndex={0}
        type={this.type}
        layerManager={this._layer_manager}
      />
    )
  }

  renderMapNavIcon = () => {
    return (
      <MapNavIcon
        ref={ref => (this.NavIcon = ref)}
        getNavMenuRef={() => this.NavMenu}
        device={this.props.device}
        mapColumnNavBar={this.props.mapColumnNavBar}
        navBarDisplay={this.props.navBarDisplay}
        setNavBarDisplay={this.props.setNavBarDisplay}
      />
    )
  }

  /**
   * 横屏时的导航栏
   */
  renderMapNavMenu = () => {
    return (
      <MapNavMenu
        ref={ref => (this.NavMenu = ref)}
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        user={this.props.user}
        initIndex={0}
        type={this.type}
        device={this.props.device}
        mapColumnNavBar={this.props.mapColumnNavBar}
        navBarDisplay={this.props.navBarDisplay}
      />
    )
  }

  renderBackgroundOverlay = () => {
    return (
      <BackgroundOverlay
        ref={ref => (this.backgroundOverlay = ref)}
        device={this.props.device}
      />
    )
  }

  setLoading = async (value, content) => {
    this.container.setLoading(value, content)
  }

  renderTool = () => {
    return (
      <ToolBar
        ref={ref => (global.ToolBar = this.toolBox = ref)}
        user={this.props.user}
        existFullMap={() => this.showFullMap(false)}
        confirmDialog={this.confirm}
        dialog={() => this.dialog}
        showFullMap={this.showFullMap}
        {...this.props}
        setAttributes={this.props.setAttributes}
        measureShow={this.measureShow}
        showMenuDialog={this.showMenuDialog}
        clearClip={this.clearClip}
        getClipSetting={this.getClipSetting}
        setClipSetting={this.setClipSetting}
        setContainerLoading={this.setLoading}
        layerList={this.state.layerlist}
        changeLayerList={this.getLayers}
        getOverlay={() => global.OverlayView}
      />
    )
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        // style={{
        //   height: scaleSize(220),
        // }}
        // opacityStyle={{
        //   height: scaleSize(220),
        // }}
        type={'modal'}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      >
        <View style={styles.item}>
          {/* <Text style={styles.title}>文本内容</Text> */}
          <TextInput
            underlineColorAndroid={'transparent'}
            accessible={true}
            accessibilityLabel={'文本内容'}
            onChangeText={text => {
              // this.setState({
              //   inputText: text,
              // })
              this.inputText = text
            }}
            // value={this.state.inputText}
            placeholder={
              getLanguage(this.props.language).Prompt.PLEASE_ENTER_TEXT
            }
            placeholderTextColor={color.fontColorGray}
            style={styles.textInputStyle}
          />
        </View>
        <Text style={styles.placeholder}>
          {this.state.showErrorInfo &&
            getLanguage(this.props.language).Friends.INPUT_INVALID}
        </Text>
      </Dialog>
    )
  }

  renderInputDialog = () => {
    return <InputDialog ref={ref => (this.InputDialog = ref)} label="名称" />
  }

  measureShow = (value, result) => {
    this.setState({ measureShow: value, measureResult: result })
  }

  renderMeasureLabel = () => {
    return (
      <View style={styles.measureResultContainer}>
        <View style={styles.measureResultView}>
          <Text style={styles.measureResultText}>
            {this.state.measureResult}
          </Text>
        </View>
      </View>
    )
  }

  renderProgress = () => {
    let data
    if (this.props.downloads.length > 0) {
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (
          this.props.downloads[i].id &&
          this.props.downloads[i].params.module === global.Type
        ) {
          data = this.props.downloads[i]
          break
        }
      }
    }
    if (!data) return <View />
    return (
      <Progress
        ref={ref => (this.mProgress = ref)}
        style={styles.progressView}
        //下载示范数据进度条高度，统一修改为8 yangsl
        height={8}
        progressAniDuration={0}
        progressColor={color.item_selected_bg}
      />
    )
  }

  renderHeaderRight = () => {
    let itemWidth =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 100 : 65
    let size =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50

    const currentMapModule = this.props.mapModules.modules[this.props.user.currentUser.userName].find(item => {
      return item.key === this.type
    })
    let buttonInfos = (currentMapModule && currentMapModule.headerButtons) || [
      MapHeaderButton.Share,
      MapHeaderButton.Search,
    ]
    let buttons = []
    for (let i = 0; i < buttonInfos.length; i++) {
      let info
      if (typeof buttonInfos[i] === 'string') {
        switch (buttonInfos[i]) {
          case MapHeaderButton.Share:
            info = {
              key: MapHeaderButton.Share,
              image: getPublicAssets().common.icon_nav_share,
              action: share3DModule().action,
            }
            break
          case MapHeaderButton.Search:
            info = {
              key: MapHeaderButton.Search,
              image: getPublicAssets().common.icon_search,
              action: () => {
                NavigationService.navigate('PointAnalyst', {
                  type: 'pointSearch',
                })
              },
            }
            break
        }
      } else {
        info = buttonInfos[i]
      }
      if (buttonInfos[i] === MapHeaderButton.Share || info.newInfo) {
        info &&
          buttons.push(
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <MTBtn
                key={info.key}
                style={[styles.headerBtn, this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
                  height: screen.HEADER_HEIGHT_LANDSCAPE - 2,
                }]}
                imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
                image={info.image}
                onPress={info.action}
              />
              {
                info.newInfo &&
                <RedDot style={{position: 'absolute', top: 0, right: 0}} />
              }
              {buttonInfos[i] === MapHeaderButton.Share && this.props.online.share[0] &&
                global.Type === this.props.online.share[0].module &&
                this.props.online.share[0].progress !== undefined && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: scaleSize(4),
                    justifyContent: 'space-between',
                  }}
                >
                  <Bar
                    style={{
                      width: scaleSize(size), height: 2, borderWidth: 0,
                      backgroundColor: 'black', top: scaleSize(4),
                    }}
                    progress={
                      this.props.online.share[this.props.online.share.length - 1]
                        .progress
                    }
                    width={scaleSize(60)}
                  />
                </View>
              )}
            </View>
          )
      }else{
        info &&
        buttons.push(
          <MTBtn
            key={info.key}
            style={[styles.headerBtn, this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
              height: screen.HEADER_HEIGHT_LANDSCAPE - 2,
            }]}
            imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
            image={info.image}
            onPress={info.action}
          />,
        )
      }
    }
    return (
      <View
        style={{
          // width: scaleSize(itemWidth * buttons.length),
          flexDirection: 'row',
          justifyContent: buttons.length === 1 ? 'flex-end' : 'space-between',
          alignItems: 'center',
        }}
      >
        {buttons}
      </View>
    )
  }

  //三维浏览引导界面 add jiakai
  renderMapSceneGuideView = () => {
    return(
      <GuideViewMapSceneModel
        language={this.props.language}
        device={this.props.device}
      />
    )
  }

  //隐藏示范数据按钮
  closeSample = () =>{
    this.props.setSampleDataShow(false)
  }

  /** 示范数据 */
  _renderSampleData = () => {
    let right
    if (
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
    ) {
      right = {
        right: scaleSize(120),
        bottom: scaleSize(26),
      }
    } else {
      right = {
        right: scaleSize(20),
        bottom: scaleSize(135),
      }
    }
    return (
      <View
        style={[styles.iconSap, right]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // this.closeSample()
            NavigationService.navigate('SampleMap')
          }}
        >
          <Animated.Image
            style={{ width: scaleSize(120), height: scaleSize(120) ,transform:[{scale:this.state.samplescale}]}}
            resizeMode={'contain'}
            source={getThemeAssets().publicAssets.icon_tool_download}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            width: scaleSize(40),
            height: scaleSize(35),
            right: 0,
            top: 0,
          }}
          onPress={() => {
            this.closeSample()
          }}
        ></TouchableOpacity>
      </View>
    )
  }

  renderContainer = () => {
    return (
      <Container
        ref={ref => (this.container = ref)}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: getLanguage(this.props.language).Map_Module.MODULE_3D,
          //'三维场景',
          navigation: this.props.navigation,
          backAction: this.back,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
          },
          headerStyle: {
            right:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? scaleSize(96)
                : 0,
          },
          headerRight: this.renderHeaderRight(),
          type: 'fix',
        }}
        bottomBar={
          // this.props.device.orientation.indexOf('LANDSCAPE') < 0 &&
          this.renderToolBar()
        }
        bottomProps={{ type: 'fix' }}
      >
        {global.isLicenseValid && (
          <SMSceneView
            style={styles.map}
            moduleId={0x02}
            onGetScene={this._onGetInstance}
          />
        )}
        <SurfaceView
          ref={ref => (global.MapSurfaceView = ref)}
          orientation={this.props.device.orientation}
        />
        {this.renderMapController()}
        {this.renderFunctionToolbar()}
        {this.renderOverLayer()}
        {this.renderTool()}
        {this.renderDialog()}
        {this.renderInputDialog()}
        {this.state.measureShow && this.renderMeasureLabel()}
        {this.state.showMenuDialog && this.renderMenuDialog()}
        {this.state.showPanResponderView && this.renderPanResponderView()}
        {this.props.showSampleData && this._renderSampleData()}
        {/*{this.renderMapNavIcon()}*/}
        {/*{this.renderMapNavMenu()}*/}
        {this.renderBackgroundOverlay()}
      </Container>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderContainer()}
        {this.renderProgress()}
        {this.props.mapSceneGuide && this.renderMapSceneGuideView()}
      </View>
    )
  }
}
