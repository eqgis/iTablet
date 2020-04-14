import React from 'react'
import { screen } from '../../../../utils'
import {
  ConstToolType,
  TouchType,
  Const,
  ToolbarType,
} from '../../../../constants'
import TouchProgress from '../TouchProgress'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'
import ToolbarModule from './modules/ToolbarModule'
import ToolbarHeight from './modules/ToolBarHeight'
import { View, Animated, Platform, KeyboardAvoidingView } from 'react-native'
import { SMap, SScene, Action } from 'imobile_for_reactnative'
import ToolbarBtnType from './ToolbarBtnType'
import constants from '../../constants'
import styles from './styles'
import {
  ToolbarMenuDialog,
  ToolbarContentView,
  ToolbarBottomButtons,
} from './components'
import Utils from './utils'

// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true

// let isSharing = false

export default class ToolBar extends React.PureComponent {
  props: {
    language: string,
    children: any,
    type: string,
    containerProps?: Object,
    navigation: Object,
    data: Array,
    existFullMap: () => {},
    symbol: Object,
    user: Object,
    map: Object,
    layers: Object,
    online: Object,
    collection: Object,
    template: Object,
    currentLayer: Object,
    selection: Array,
    device: Object,
    mapLegend?: Object, //图例参数对象
    layerList?: Array, //三维图层
    toolbarStatus: Object,

    confirm: () => {},
    showDialog: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    setSaveViewVisible?: () => {},
    setSaveMapDialogVisible?: () => {},
    setContainerLoading?: () => {},
    showFullMap: () => {},
    dialog: () => {},
    setMapLegend?: () => {}, //设置图例显隐的redux状态
    getMenuAlertDialogRef: () => {},
    getLayers: () => {}, // 更新数据（包括其他界面）
    setCurrentMap: () => {}, // 设置当前地图
    setCollectionInfo: () => {}, // 设置当前采集数据源信息
    setCurrentLayer: () => {}, // 设置当前图层
    importTemplate: () => {}, // 导入模板
    importWorkspace: () => {}, // 打开模板
    setAttributes: () => {},
    getMaps: () => {},
    exportWorkspace: () => {},
    getSymbolTemplates: () => {},
    getSymbolPlots: () => {},
    openWorkspace: () => {},
    closeWorkspace: () => {},
    openMap: () => {},
    closeMap: () => {},
    setCurrentTemplateInfo: () => {},
    setCurrentPlotInfo: () => {},
    setTemplate: () => {},
    setInputDialogVisible: () => {},
    exportmap3DWorkspace: () => {},
    importSceneWorkspace: () => {},
    getMapSetting: () => {},
    showMeasureResult: () => {},
    refreshLayer3dList: () => {},
    setCurrentSymbols: () => {},
    saveMap: () => {},
    measureShow: () => {},
    clearAttributeHistory: () => {},
    changeLayerList?: () => {}, //切换场景改变三维图层
    showMenuDialog?: () => {}, //显示裁剪菜单
    getClipSetting?: () => {}, //获取三维裁剪最新的参数 每次设置裁剪图层时需要重新获取
    setClipSetting?: () => {}, //获取当前裁剪设置
    clearClip?: () => {}, //清除三维裁剪相关信息
    setMapIndoorNavigation: () => {},
    setMapNavigationShow: () => {},
    setMapNavigation: () => {},
    setMap2Dto3D: () => {},
    switchAr: () => {},
    setOpenOnlineMap: () => {},
    downloads: Array,
    downloadFile: () => {},
    deleteDownloadFile: () => {},
    //设置、获取室外导航数据
    setNavigationDatas: () => {},
    getNavigationDatas: () => {},
    //更改导航路径
    changeNavPathInfo: () => {},
    //获取FloorListView
    getFloorListView: () => {},
    //改变当前楼层ID
    changeFloorID: () => {},
    setToolbarStatus: () => {},
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: ToolbarType.table,
      themeType: '',
      isFullScreen: DEFAULT_FULL_SCREEN,
      column: DEFAULT_COLUMN, // 只有table可以设置
    },
  }

  constructor(props) {
    super(props)
    this.shareTo = ''
    this.state = {
      // isShow: false,
      type: props.type, // 当前传入的类型
      containerType: props.containerProps.containerType,
      isFullScreen: props.containerProps.isFullScreen,
      // height: props.containerProps.height,
      // column: props.containerProps.column,
      // data: this.getData(props.type),
      data: [],
      buttons: [],
      bottom: new Animated.Value(-props.device.height),
      right: new Animated.Value(-props.device.width),
      showMenuDialog: false,
      isTouch: true,
      isTouchProgress: false,
      selectName: '',
      selectKey: '',
      hasSoftMenuBottom: false,
    }
    this.height = 0
    this.isShow = false
    this.column = -1
    this.row = -1
    this.isBoxShow = false
    this.lastState = {}

    this.setToolbarParams()
  }

  componentDidMount() {
    ExtraDimensions.addSoftMenuBarWidthChangeListener({
      softBarPositionChange: val => {
        this.setState({ hasSoftMenuBottom: val })
      },
    })
  }

  componentDidUpdate(prevProps, prevState) {
    let tempPrev = Object.assign({}, prevProps)
    let tempthis = Object.assign({}, this.props)
    tempPrev.nav && delete tempPrev.nav
    tempthis.nav && delete tempthis.nav
    this.setToolbarParams()
    if (
      this.props.device.orientation !== prevProps.device.orientation ||
      this.state.type !== prevState.type
    ) {
      this.changeHeight(this.props.device.orientation, this.state.type)
    }
  }

  componentWillUnmount() {
    this.buttonView = null
    this.contentView = null
    ToolbarModule.setParams({})
  }

  setToolbarParams = () => {
    ToolbarModule.setParams({
      type: this.state.type,
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      scrollListToLocation: this.scrollListToLocation,
      showMenuBox: this.showMenuBox,
      mapMoveToCurrent: this.mapMoveToCurrent,
      contentView: this.contentView, // ToolbarContentView ref
      buttonView: this.buttonView, // ToolbarBottomButtons ref
      mapLegend: this.props.mapLegend,
      ...this.props,
    })
  }

  changeHeight = async () => {
    if (this.height === 0) {
      let position =
        this.props.device.orientation.indexOf('LANDSCAPE') === 0
          ? this.state.right
          : this.state.bottom
      Animated.timing(position, {
        toValue: this.isShow
          ? 0
          : -Math.max(this.props.device.height, this.props.device.width),
        duration: Const.ANIMATED_DURATION,
      }).start()
      return
    }
    // if (!(this.isShow && this.isBoxShow)) {
    //   this.showToolbar()
    //   return
    // }
    let _data = ToolbarHeight.getToolbarSize(this.state.containerType, {
      data: this.state.data,
    })
    if (
      this.height !== _data.height ||
      this.column !== _data.column ||
      this.row !== _data.row
    ) {
      this.height = _data.height
      this.column = _data.column
      this.row = _data.row
      this.showToolbar()
    }
  }

  showFullMap = () => {
    this.props.showFullMap && this.props.showFullMap(true)
  }

  switchAr = () => {
    this.props.switchAr && this.props.switchAr()
  }

  existFullMap = () => {
    this.props.existFullMap && this.props.existFullMap()
  }

  getBoxShow = () => this.isBoxShow

  setBoxShow = isBoxShow => {
    this.isBoxShow = isBoxShow
  }

  getData = async type => {
    let toolbarModule = await ToolbarModule.getToolBarData(type, {
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      scrollListToLocation: this.scrollListToLocation,
      contentView: this.contentView, // ToolbarContentView ref
      buttonView: this.buttonView, // ToolbarBottomButtons ref
      ...this.props,
    })
    // let data = toolbarModule.data
    // let buttons = toolbarModule.buttons
    // this.lastUdbList = toolbarModule.data //保存上次的数据源数据

    return toolbarModule
  }

  /** 记录Toolbar上一次的state **/
  setLastState = () => {
    Object.assign(this.lastState, this.state, { height: this.height })
  }

  /**
   * 设置遮罩层的显隐
   * @param visible
   */
  setOverlayViewVisible = visible => {
    GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(visible)
  }

  //更新遮盖层状态
  updateOverlayView = () => {
    if (this.isShow) {
      if (this.state.isTouchProgress || this.state.showMenuDialog) {
        this.setOverlayViewVisible(false)
      } else {
        this.setOverlayViewVisible(this.state.isFullScreen)
      }
    } else {
      this.setOverlayViewVisible(false)
    }
  }

  /**
   * 设置是否显示
   * isShow: 是否显示
   * type:   显示数据类型
   * params: {
   *   isFullScreen:    是否全屏，
   *   height:          工具栏高度
   *   column:          表格列数（仅table可用）
   *   containerType:   容器的类型, list | table
   *   resetToolModuleData: 是否重置ToolbarModule中的data
   * }
   **/
  setVisible = (isShow, type = this.state.type, params = {}) => {
    if (isShow && GLOBAL.TouchType !== TouchType.ANIMATION_WAY) {
      GLOBAL.TouchType = TouchType.NULL
      GLOBAL.bubblePane && GLOBAL.bubblePane.reset() // 重置气泡提示
    } else if (!isShow) {
      GLOBAL.TouchType = TouchType.NORMAL
    }
    if (
      this.isShow !== isShow ||
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.height ||
      // params.column !== this.state.column ||
      params.buttons !== this.state.buttons ||
      params.selectKey !== this.state.selectKey ||
      params.isTouchProgress !== this.state.isTouchProgress
      // params.listSelectable !== this.state.listSelectable
    ) {
      (async function() {
        let data = params.data
        let buttons = params.buttons
        let customView = params.customView
        if (data === undefined || buttons === undefined) {
          let _data = await this.getData(type)
          data = data || _data.data
          buttons = buttons || _data.buttons
          customView = customView || _data.customView
        }
        // 每次type改变，设置ToolbarModule当前数据，以便调用当前模块中的方法和数据
        if (this.state.type !== type && params.resetToolModuleData) {
          await ToolbarModule.setToolBarData(type)
        }
        let containerType =
          (params && params.containerType) || ToolbarType.table
        let newHeight = this.height
        if (!isShow) {
          newHeight = 0
        } else if (params && typeof params.height === 'number') {
          newHeight = params.height
        } else if (!params || params.height === undefined) {
          let _size = ToolbarHeight.getToolbarSize(containerType, {
            data,
          })
          newHeight = _size.height
        }
        this.shareTo = params.shareTo || ''

        this.setState(
          {
            showMenuDialog: params.showMenuDialog || false,
            type: type,
            data: params.data || data,
            customView: customView,
            buttons: params.buttons || buttons,
            isTouchProgress: params.isTouchProgress || false,
            isFullScreen:
              params && params.isFullScreen !== undefined
                ? params.isFullScreen
                : DEFAULT_FULL_SCREEN,
            containerType,
            themeType:
              params && params.themeType
                ? params.themeType
                : isShow
                  ? this.state.themeType
                  : '',
            selectKey: params && params.selectKey ? params.selectKey : '',
            selectName: params && params.selectName ? params.selectName : '',
          },
          () => {
            // if (!showViewFirst) {
            if (!isNaN(newHeight)) this.height = newHeight
            if (!isNaN(params.column)) this.column = params.column
            if (!isNaN(params.row)) this.row = params.row
            this.showToolbarAndBox(isShow, type)
            !isShow && this.props.existFullMap && this.props.existFullMap()
            // }
            if (params.cb) {
              setTimeout(() => params.cb(), Const.ANIMATED_DURATION_2)
            }
            this.updateOverlayView()
          },
        )
      }.bind(this)())
    } else {
      this.showToolbarAndBox(isShow)
      if (params.cb) {
        setTimeout(() => params.cb(), Const.ANIMATED_DURATION_2)
      }
      !isShow &&
        GLOBAL.MapSelectPointType !== 'selectPoint' &&
        this.props.existFullMap &&
        this.props.existFullMap()
      this.updateOverlayView()
    }
  }

  getState = () => {
    return {
      type: this.state.type, // 当前传入的类型
      containerType: this.state.containerType,
      isFullScreen: this.state.isFullScreen,
      isShow: this.isShow,
    }
  }

  showToolbarAndBox = (isShow, type = this.state.type) => {
    let animatedList = []
    //let keyboardHeight = this.keyboardHeight ? 344 : 0
    //标注 如果横屏高度不够键盘弹起，则部分弹起，除掉底部功能栏
    // if (
    //   this.props.device.height - ConstToolType.NEWTHEME_HEIGHT[2] <
    //   keyboardHeight
    // ) {
    //   keyboardHeight -= Const.BOTTOM_HEIGHT
    // }
    let position =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? this.state.right
        : this.state.bottom
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: isShow
            ? 0
            : -Math.max(this.props.device.height, this.props.device.width),
          duration: Const.ANIMATED_DURATION,
        }),
      )
      animatedList.push(
        Animated.timing(this.state.right, {
          toValue: isShow
            ? 0
            : -Math.max(this.props.device.height, this.props.device.width),
          duration: Const.ANIMATED_DURATION,
        }),
      )
      this.isShow = isShow
    }
    if (!this.contentView) return
    // Box内容框的显示和隐藏
    let positionNumber = parseFloat(JSON.stringify(position))
    if (
      type === ConstToolType.MAP_THEME_PARAM ||
      type === ConstToolType.MAP_THEME_PARAM_GRAPH
    ) {
      let animated = this.contentView.changeHeight({
        height: 0,
        column: this.column > -1 ? this.column : undefined,
        row: this.row > -1 ? this.row : undefined,
        wait: true,
      })
      animated && animatedList.push(animated)
      this.isBoxShow = false
    } else {
      if (
        JSON.stringify(this.contentView.getContentHeight()) !==
        this.height.toString()
      ) {
        let boxAnimated = this.contentView.changeHeight({
          height: this.height,
          column: this.column > -1 ? this.column : undefined,
          row: this.row > -1 ? this.row : undefined,
          wait: true,
        })
        if (boxAnimated) {
          JSON.stringify(this.contentView.getContentHeight()) === '0' &&
          positionNumber >= 0
            ? animatedList.unshift(boxAnimated)
            : animatedList.push(boxAnimated)
        }
      }
      this.isBoxShow = true
    }
    if (positionNumber < 0) {
      animatedList.forEach(animated => animated && animated.start())
    } else if (animatedList.length > 0) {
      Animated.sequence(animatedList).start()
    }
  }

  showToolbar = async (isShow, cb = () => {}) => {
    let animatedList = []
    let position =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? this.state.right
        : this.state.bottom
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: isShow
            ? 0
            : -Math.max(this.props.device.height, this.props.device.width),
          duration: Const.ANIMATED_DURATION,
        }),
      )
      animatedList.push(
        Animated.timing(this.state.right, {
          toValue: isShow
            ? 0
            : -Math.max(this.props.device.height, this.props.device.width),
          duration: Const.ANIMATED_DURATION,
        }),
      )
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    let boxPosition = parseFloat(JSON.stringify(position))
    // if (
    //   JSON.stringify(this.contentView.getContentHeight()) !==
    //   this.height.toString()
    // ) {
    let boxAnimated =
      // this.isBoxShow &&
      await this.contentView.changeHeight({
        height: this.isBoxShow ? this.height : 0,
        column: this.column > -1 ? this.column : undefined,
        row: this.row > -1 ? this.row : undefined,
        wait: true,
      })
    if (boxAnimated) {
      this.height === 0 && boxPosition >= 0
        ? animatedList.unshift(boxAnimated)
        : animatedList.push(boxAnimated)
    }
    // }
    if (animatedList.length > 0) {
      if (boxPosition < 0) {
        animatedList.forEach(animated => animated && animated.start())
      } else {
        Animated.sequence(animatedList).start()
      }
    }
    if (cb) {
      setTimeout(() => cb(), Const.ANIMATED_DURATION_2)
    }
  }

  back = () => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.toolbarBack
    ) {
      ToolbarModule.getData().actions.toolbarBack()
      return
    }
  }

  // close = (type = this.state.type, actionFirst = false) => {
  close = () => {
    let newState = { data: [] }
    if (GLOBAL.Type === constants.MAP_EDIT) {
      GLOBAL.showMenu = true
      newState.selectKey = ''
    }

    this.showToolbar(false)
    if (
      this.state.isTouchProgress === true ||
      this.state.showMenuDialog === true
    ) {
      newState.isTouchProgress = false
      newState.showMenuDialog = false
    }
    this.props.existFullMap && this.props.existFullMap()
    this.setState(newState, () => {
      this.updateOverlayView()
    })
    this.height = 0
    SMap.setAction(Action.PAN)

    this.updateOverlayView()
    GLOBAL.TouchType = TouchType.NORMAL
  }

  getToolbarModule = () => {
    return ToolbarModule
  }

  menu = () => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.menu
    ) {
      ToolbarModule.getData().actions.menu(
        this.state.type,
        this.state.selectKey,
        {
          showBox: height => {
            if (height !== undefined) this.height = height
            this.contentView &&
              this.contentView.changeHeight(
                this.state.showMenuDialog ? this.height : 0,
              )
            // this.isBoxShow = this.state.showMenuDialog
            this.isBoxShow = false
          },
          setData: params => {
            // this.isBoxShow = !this.isBoxShow
            // this.isBoxShow = false
            this.setState(params, () => {
              this.updateOverlayView()
            })
          },
        },
      )
    }
  }

  menus = () => {
    if (this.state.showMenuDialog === false) {
      this.setState({ showMenuDialog: true }, () => {
        this.updateOverlayView()
      })
    } else {
      this.setState({ showMenuDialog: false }, () => {
        this.updateOverlayView()
      })
    }
    this.setState({ isTouchProgress: false }, () => {
      this.updateOverlayView()
    })
  }

  showMenuBox = () => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.showMenuBox
    ) {
      ToolbarModule.getData().actions.showMenuBox(
        this.state.type,
        this.state.selectKey,
        {
          showBox: (params = {}) => {
            this.isBoxShow = !this.isBoxShow

            let height = this.height
            if (params.height !== undefined) {
              height = params.height
              delete params.height
            }

            this.contentView &&
              this.contentView.changeHeight(this.isBoxShow ? height : 0)

            if (Object.keys(params).length > 0) {
              this.setState(params, () => {
                this.updateOverlayView()
              })
            } else {
              this.updateOverlayView()
            }
          },
          setData: (params = {}) => {
            if (Object.keys(params).length > 0) {
              this.setState(params, () => {
                this.updateOverlayView()
              })
            }
          },
        },
      )
      return
    }

    if (Utils.isTouchProgress(this.state.selectKey)) {
      // 显示指滑进度条
      this.setState(
        {
          isTouchProgress: !this.state.isTouchProgress,
          showMenuDialog: false,
          isFullScreen: !this.state.isTouchProgress,
        },
        () => {
          this.updateOverlayView()
        },
      )
      this.isBoxShow = false
    } else {
      this.isBoxShow = !this.isBoxShow

      this.contentView &&
        this.contentView.changeHeight(this.isBoxShow ? this.height : 0)

      this.setState(
        {
          showMenuDialog: false,
          isFullScreen: false,
        },
        () => {
          this.updateOverlayView()
        },
      )
    }
  }

  showBox = (autoFullScreen = false) => {
    if (autoFullScreen) {
      this.setState(
        {
          isFullScreen: !this.isBoxShow,
        },
        () => {
          this.contentView &&
            this.contentView.changeHeight(this.isBoxShow ? 0 : this.height)
          this.isBoxShow = !this.isBoxShow
          this.updateOverlayView()
        },
      )
    } else {
      this.contentView &&
        this.contentView.changeHeight(this.isBoxShow ? 0 : this.height)
      this.isBoxShow = !this.isBoxShow
      if (GLOBAL.Type === constants.MAP_EDIT) {
        if (
          GLOBAL.MapToolType &&
          (GLOBAL.MapToolType.indexOf(ConstToolType.MAP_TOOL_TAGGING_EDIT) !==
            -1 ||
            GLOBAL.MapToolType.indexOf(ConstToolType.MAP_TOOL_TAGGING_STYLE) !==
              -1)
        ) {
          return
        }
        if (GLOBAL.showMenu) {
          GLOBAL.showMenu = false
          this.setState({
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.PLACEHOLDER,
              ToolbarBtnType.FLEX,
            ],
          })
        } else {
          GLOBAL.showMenu = true
          this.setState({
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.MENU,
              ToolbarBtnType.FLEX,
            ],
          })
        }
      }
    }
  }

  mapMoveToCurrent = async () => {
    let moveToCurrentResult = await SMap.moveToCurrent()
    if (!moveToCurrentResult) {
      await SMap.moveToPoint({ x: 116.21, y: 39.42 })
    }
    await SMap.setScale(0.0000060635556556859582)
  }

  overlayOnPress = () => {
    if (
      !this.state.isFullScreen ||
      this.state.type === ConstToolType.STYLE_TRANSFER ||
      this.state.isTouchProgress ||
      this.state.showMenuDialog
    )
      return
    GLOBAL.TouchType = TouchType.NORMAL
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.overlayOnPress
    ) {
      ToolbarModule.getData().actions.overlayOnPress()
    }
    if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS ||
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION ||
      this.state.type ===
        ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
    ) {
      this.setVisible(false)
    } else if (
      typeof this.state.type === 'string' &&
      this.state.type.indexOf('MAP_THEME_PARAM') >= 0
    ) {
      this.contentView && this.contentView.changeHeight(0)
      this.isBoxShow = false
      this.setState(
        {
          isFullScreen: false,
        },
        () => {
          this.updateOverlayView()
        },
      )
    } else if (this.state.type === ConstToolType.MAP3D_WORKSPACE_LIST) {
      this.showToolbarAndBox(false)
      this.props.existFullMap && this.props.existFullMap()
      GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)
    } else if (
      this.state.type === ConstToolType.MAP_PLOTTING_ANIMATION ||
      this.state.type === ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST
    ) {
      let height = 0
      this.props.showFullMap && this.props.showFullMap(true)
      let type = ConstToolType.PLOT_ANIMATION_START
      this.setVisible(true, type, {
        isFullScreen: false,
        height,
        cb: () => SMap.setAction(Action.SELECT),
      })
    } else if (this.state.type === ConstToolType.PLOT_ANIMATION_NODE_CREATE) {
      // TODO savePlotAnimationNode
      // this.contentView.savePlotAnimationNode()
    } else if (this.state.type === ConstToolType.MAP3D_TOOL_FLYLIST) {
      SScene.checkoutListener('startTouchAttribute')
      SScene.setAction('PAN3D')
      GLOBAL.action3d = 'PAN3D'
      this.setVisible(false)
    } else {
      this.setVisible(false)
    }
    // if (this.state.type === ConstToolType.MAP_BASE) {
    //   this.props.getLayers()
    // }
    if (GLOBAL.Type === constants.MAP_EDIT) {
      GLOBAL.showMenu = true
      // GLOBAL.showFlex = true
      this.setState({ selectKey: '' })
    }
  }

  renderView = () => {
    return (
      <ToolbarContentView
        ref={ref => (this.contentView = ref)}
        {...this.props}
        type={this.state.type}
        containerType={this.state.containerType}
        data={this.state.data}
        existFullMap={this.existFullMap}
        setVisible={this.setVisible}
        showBox={this.showBox}
        customView={this.state.customView}
      />
    )
  }

  renderBottomBtns = () => {
    return (
      <ToolbarBottomButtons
        ref={ref => (this.buttonView = ref)}
        selection={this.props.selection}
        toolbarStatus={this.props.toolbarStatus}
        type={this.state.type}
        close={this.close}
        back={this.back}
        setVisible={this.setVisible}
        buttons={this.state.buttons}
        showBox={this.showBox}
        showMenuBox={this.showMenuBox}
        menu={this.menu}
        device={this.props.device}
      />
    )
  }

  renderMenuDialog = () => {
    return (
      <ToolbarMenuDialog
        {...this.props}
        type={this.state.type}
        themeType={this.state.themeType}
        selectKey={this.state.selectKey}
        mapLegend={this.props.mapLegend}
        device={this.props.device}
        mapMoveToCurrent={this.mapMoveToCurrent}
      />
    )
  }

  render() {
    let containerStyle = this.state.isFullScreen
      ? this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? { ...styles.fullContainerLandscape, height: this.props.device.height }
        : { ...styles.fullContainer, width: this.props.device.width }
      : this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? styles.wrapContainerLandscape
        : styles.wrapContainer
    let size = this.state.isFullScreen
      ? { height: this.props.device.height }
      : {}
    if (this.state.isFullScreen && this.state.isTouchProgress) {
      let softBarHeight = this.state.hasSoftMenuBottom
        ? ExtraDimensions.getSoftMenuBarHeight()
        : 0
      size = { height: screen.getScreenSafeHeight() - softBarHeight }
    }
    size.width = this.props.device.width
    // size.height = this.props.device.height
    let keyboardVerticalOffset
    if (Platform.OS === 'android') {
      keyboardVerticalOffset =
        this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 0 : 200
    } else {
      keyboardVerticalOffset =
        this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 250 : 500
    }
    return (
      <Animated.View
        style={[
          containerStyle,
          this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? { right: this.state.right }
            : { bottom: this.state.bottom },
          (this.state.isFullScreen || this.state.isTouchProgress) &&
            this.props.device.orientation.indexOf('LANDSCAPE') !== 0 && {
            paddingTop: screen.isIphoneX()
              ? screen.X_TOP + screen.X_BOTTOM
              : Platform.OS === 'ios'
                ? 20
                : 0,
          },
          size,
        ]}
        pointerEvents={'box-none'}
        // onLayout={event => {
        //   let { width, height, x, y } = event.nativeEvent.layout
        //   console.log(width, height, x, y)
        // }}
      >
        {!this.state.isTouchProgress && !this.state.showMenuDialog && (
          <View style={styles.themeoverlay} pointerEvents={'box-none'} />
        )}
        {this.state.isTouchProgress && this.state.isFullScreen && (
          <TouchProgress
            device={this.props.device}
            selectName={this.state.selectName}
            showMenu={() => {
              // 智能配图选择器，唤起选择器菜单
              if (this.state.type === ConstToolType.STYLE_TRANSFER_PICKER) {
                this.showPicker()
                return
              } else {
                this.menu()
              }
            }}
          />
        )}
        {this.state.showMenuDialog && this.renderMenuDialog()}
        {this.state.type === ConstToolType.MAP_TOOL_TAGGING_SETTING ? (
          <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={'position'}
          >
            <View
              style={[
                this.props.device.orientation.indexOf('LANDSCAPE') === 0
                  ? styles.containersLandscape
                  : styles.containers,
              ]}
            >
              {this.renderView()}
              {this.renderBottomBtns()}
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View
            style={[
              this.props.device.orientation.indexOf('LANDSCAPE') === 0
                ? styles.containersLandscape
                : styles.containers,
            ]}
          >
            {this.renderView()}
            {this.renderBottomBtns()}
          </View>
        )}
      </Animated.View>
    )
  }
}
