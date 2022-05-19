import React from 'react'
import { screen } from '../../../../utils'
import { Header } from '../../../../components'
import {
  ConstToolType,
  TouchType,
  Const,
  ToolbarType,
  ChunkType,
} from '../../../../constants'
import TouchProgress from '../TouchProgress'
// import * as ExtraDimensions from 'react-native-extra-dimensions-android'
import ExtraDimensions from 'react-native-extra-dimensions-android'
import ToolbarModuleDefault, { getToolbarModule } from './modules/ToolbarModule'
import { View, Animated, Platform, TouchableOpacity, Image } from 'react-native'
import { SMap, SScene, Action } from 'imobile_for_reactnative'
import ToolbarBtnType from './ToolbarBtnType'
import styles from './styles'
import {
  ToolbarMenuDialog,
  ToolbarContentView,
  ToolbarBottomButtons,
} from './components'
import Utils from './utils'

interface ToolbarVisibleParam {
  /** 是否全屏， */
  isFullScreen: boolean
  /** 工具栏高度 */
  height: number
  /** 容器的类型, list | table */
  containerType: 'list' | 'table' //
  /** 是否重置ToolbarModule中的data */
  resetToolModuleData: boolean
  /** setVisible之后 global.TouchType的值  */
  touchType: any
  /** setVisible之后是否退出全屏 */
  isExistFullMap: boolean 
  /** 专题类型 */
  themeType: any
  /**  是否显示指滑横向进度条 */
  isTouchProgress: boolean
  /** 是否显示指滑菜单 */
  showMenuDialog: boolean
  /** 指滑菜单选中目标的key */
  selectKey: string
  /** 指滑菜单选中目标的name */
  selectName: string
  /**  table类型的列数 */
  column: number
  /**  table类型的行数 */
  row: number
  /** setVisible之后的回调函数 */
  cb: () => void
}

interface Props extends Partial<DefaultProps> {
  language: string,
  children: any,
  type: string,
  navigation: Object,
  data: Array,
  existFullMap: () => {},
  measureType:() => {},
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
  laboratory: Object,
  selectPointType: string, // 地图点选组件类型

  confirm: () => {},
  showDialog: () => {},
  addGeometrySelectedListener: () => {},
  removeGeometrySelectedListener: () => {},
  setSaveViewVisible?: () => {},
  setContainerLoading?: () => {},
  showFullMap: (show: boolean) => void,
  dialog: () => {},
  setMapLegend?: () => {}, //设置图例显隐的redux状态
  getMenuAlertDialogRef: () => {},
  getLayers: () => {}, // 更新数据（包括其他界面）
  setCurrentMap: () => {}, // 设置当前地图
  setCollectionInfo: () => {}, // 设置当前采集数据源信息
  setCurrentLayer: () => {}, // 设置当前图层
  // importTemplate: () => {}, // 导入模板
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
  switchAr: (visible: boolean) => void,
  removeAIDetect: (gone: boolean) => void,
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
  // 设置地图Title
  setMapTitle?: () => {},

  showArNavi: () => {},
  showNavigation: () => {},
}

interface DefaultProps {
  containerProps: {
    data: [],
    containerType: keyof typeof ToolbarType,
    themeType: '',
    isFullScreen: boolean,
    column: number, // 只有table可以设置
  },
  getOverlay: () => void,
  toolbarModuleKey: string,
}



interface State {
  type: string
  containerType: any,
  isFullScreen: boolean,
  data: [],
  secdata: [],
  buttons: [],
  bottom: Animated.Value,
  right: Animated.Value,
  showMenuDialog: boolean,
  isTouch: boolean,
  isTouchProgress: boolean,
  selectName: string,
  selectKey: string,
  hasSoftMenuBottom: boolean,
  showCustomHeader: boolean,
  customView: JSX.Element | null,
}

// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true

// let isSharing = false

const defaultProps: DefaultProps = {
  containerProps: {
    data: [],
    containerType: ToolbarType.table,
    themeType: '',
    isFullScreen: DEFAULT_FULL_SCREEN,
    column: DEFAULT_COLUMN, // 只有table可以设置
  },
  getOverlay: () => {},
  toolbarModuleKey: '',
}

export default class ToolBar extends React.Component<Props & DefaultProps, State> {

  static defaultProps = defaultProps

  shareTo: string

  height: number

  isShow: boolean

  column: number

  row: number

  lastState: any

  ToolbarModule: any

  buttonView: ToolbarBottomButtons | null = null

  contentView: ToolbarContentView | null = null

  constructor(props: Props & DefaultProps) {
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
      secdata: [],
      buttons: [],
      bottom: new Animated.Value(-props.device.height),
      right: new Animated.Value(-props.device.width),
      showMenuDialog: false,
      isTouch: true,
      isTouchProgress: false,
      selectName: '',
      selectKey: '',
      hasSoftMenuBottom: false,
      showCustomHeader: false,
      customView: null,
    }
    this.height = 0
    this.isShow = false
    this.column = -1
    this.row = -1
    // this.isBoxShow = false
    this.lastState = {}

    if (props.toolbarModuleKey === '') {
      this.ToolbarModule = ToolbarModuleDefault
    } else {
      this.ToolbarModule = getToolbarModule(props.toolbarModuleKey)
    }
    this.setToolbarParams(props, this.state)
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      // ExtraDimensions.addSoftMenuBarWidthChangeListener({
      //   softBarPositionChange: val => {
      //     if (this.state.hasSoftMenuBottom !== val) {
      //       this.setState({ hasSoftMenuBottom: val })
      //     }
      //   },
      // })
    }
  }

  shouldComponentUpdate(nextProps: Props & DefaultProps, nextState: State) {
    let tempNext = Object.assign({}, nextProps)
    let tempthis = Object.assign({}, this.props)
    tempNext.nav && delete tempNext.nav
    tempthis.nav && delete tempthis.nav
    let shouldUpdate =
      JSON.stringify(tempthis) !== JSON.stringify(tempNext) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    // if (shouldUpdate) {
    this.setToolbarParams(nextProps, nextState)
    // }
    return shouldUpdate
  }

  componentWillUnmount() {
    this.buttonView = null
    this.contentView = null
  }

  getContentViewHeight = () => {
    // return this.height
    return this.contentView ? this.contentView.height : this.height
  }

  setContentViewHeight = (height: number) => {
    this.height = height
    if (this.contentView) this.contentView.height = height
  }

  getBoxShow = () => {
    return this.contentView ? this.contentView.isBoxShow : false
  }

  setToolbarParams = (props: Props & DefaultProps, state: State) => {
    if (!props) props = this.props
    if (!state) state = this.state
    this.ToolbarModule.setParams({
      type: state.type,
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      scrollListToLocation: this.scrollListToLocation,
      showMenuBox: this.showMenuBox,
      mapMoveToCurrent: this.mapMoveToCurrent,
      contentView: this.contentView, // ToolbarContentView ref
      buttonView: this.buttonView, // ToolbarBottomButtons ref
      ...props,
    })
  }

  showFullMap = () => {
    this.props.showFullMap && this.props.showFullMap(true)
  }

  switchAr = (visible: boolean) => {
    this.props.switchAr && this.props.switchAr(visible)
  }

  removeAIDetect = (bGone: boolean) => {
    this.props.removeAIDetect && this.props.removeAIDetect(bGone)
  }

  existFullMap = () => {
    this.props.existFullMap && this.props.existFullMap()
  }

  getData = async type => {
    let toolbarModule = await this.ToolbarModule.getToolBarData(type, {
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
    Object.assign(this.lastState, this.state, {
      height: this.getContentViewHeight(),
    })
  }

  /**
   * 设置遮罩层的显隐
   * @param visible
   */
  setOverlayViewVisible = (visible: boolean) => {
    let overlay = this.props.getOverlay()
    overlay && overlay.setVisible(visible)
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

  measure = params => {
    this.props.measure && this.props.measure(params)
  }

  /**
   * 设置是否显示
   * isShow: 是否显示
   * type:   显示数据类型
   * params: {
   *   isFullScreen:        是否全屏，
   *   height:              工具栏高度
   *   containerType:       容器的类型, list | table
   *   resetToolModuleData: 是否重置ToolbarModule中的data
   *   touchType:           setVisible之后 global.TouchType的值
   *   isExistFullMap:      setVisible之后是否退出全屏
   *   themeType:           专题类型
   *
   *   isTouchProgress:     是否显示指滑横向进度条
   *
   *   showMenuDialog:      是否显示指滑菜单
   *   selectKey:           指滑菜单选中目标的key
   *   selectName:          指滑菜单选中目标的name
   *
   *   column:              table类型的列数
   *   row:                 table类型的行数
   *
   *   cb:                  setVisible之后的回调函数
   * }
   **/
  setVisible = (isShow: boolean, type = '', params: Partial<ToolbarVisibleParam> = {}) => {
    try {
      if (params.measureType){
        this.measure(params)
      }
      if (params.touchType) {
        global.TouchType = params.touchType
      } else {
        if (isShow) {
          global.TouchType = TouchType.NULL
          global.bubblePane && global.bubblePane.reset() // 重置气泡提示
        } else if (!isShow) {
          global.TouchType = TouchType.NORMAL
        }
      }
      if (
        this.isShow !== isShow ||
        this.state.type !== type ||
        params.isFullScreen !== this.state.isFullScreen ||
        params.height !== this.getContentViewHeight() ||
        params.buttons !== this.state.buttons ||
        params.selectKey !== this.state.selectKey ||
        params.isTouchProgress !== this.state.isTouchProgress
      ) {
        (async function() {
          let data = params.data
          let buttons = params.buttons
          let customView = params.customView
          let pageAction = params.pageAction
          if (data === undefined || buttons === undefined) {
            let _data = await this.getData(type)
            data = data || _data.data
            buttons = buttons || _data.buttons
            customView = customView || _data.customView
            pageAction = pageAction || _data.pageAction
            if ((!data || data.length === 0) && (!buttons || buttons.length === 0) && !customView) {
              buttons = [ToolbarBtnType.CANCEL]
            }
          }
          if (pageAction) {
            pageAction()
          }
          // 每次type改变，设置ToolbarModule当前数据，以便调用当前模块中的方法和数据
          if (this.state.type !== type && params.resetToolModuleData) {
            await this.ToolbarModule.setToolBarData(type)
          }
          let containerType =
            (params && params.containerType) || ToolbarType.table
          let newHeight = this.getContentViewHeight()
          if (!isShow) {
            newHeight = 0
          } else if (params && typeof params.height === 'number') {
            newHeight = params.height
          } else if (!params || params.height === undefined) {
            let _size = this.ToolbarModule.getToolbarSize(containerType, {
              data,
              type,
            })
            newHeight = _size.height
          }
          this.shareTo = params.shareTo || ''

          this.setState(
            {
              showMenuDialog: params.showMenuDialog || false,
              type: type,
              data: params.data || data || [],
              secdata: params.secdata || [],
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
              if (!isNaN(newHeight)) this.setContentViewHeight(newHeight)
              if (!isNaN(params.column)) this.column = params.column
              if (!isNaN(params.row)) this.row = params.row
              this.showToolbarAndBox(isShow, type)
              // setVisible之后是否退出全屏
              const { isExistFullMap = true } = params
              !isShow && isExistFullMap && this.props.existFullMap && this.props.existFullMap()
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
          this.state.selectPointType !== 'selectPoint' &&
          this.props.existFullMap &&
          this.props.existFullMap()
        this.updateOverlayView()
      }
    } catch (error) {
      console.warn(error)
    }
  }

  resetContentView = () => {
    if (this.contentView) {
      this.contentView.resetContent()
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

  showToolbarAndBox = (isShow: boolean) => {
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
          isInteraction: false,
          toValue: isShow
            ? 0
            : -Math.max(this.props.device.height, this.props.device.width),
          duration: Const.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
      animatedList.push(
        Animated.timing(this.state.right, {
          isInteraction: false,
          toValue: isShow
            ? 0
            : -Math.max(this.props.device.height, this.props.device.width),
          duration: Const.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
      this.isShow = isShow
    }
    // if (!this.contentView) return
    // Box内容框的显示和隐藏
    let positionNumber = parseFloat(JSON.stringify(position))
    if (positionNumber < 0) {
      animatedList.forEach(animated => animated && animated.start())
    } else if (animatedList.length > 0) {
      Animated.sequence(animatedList).start()
    }
  }

  back = type => {
    try {
      if (
        this.ToolbarModule.getData().actions &&
        this.ToolbarModule.getData().actions.toolbarBack
      ) {
        this.ToolbarModule.getData().actions.toolbarBack(type)
        return
      }
    } catch (e) {
      console.warn(e)
    }
  }

  // close = (type = this.state.type, actionFirst = false) => {
  close = () => {
    let newState = { data: [], type: '' }
    if (global.Type === ChunkType.MAP_EDIT) {
      global.showMenu = true
      newState.selectKey = ''
    }

    this.showToolbarAndBox(false)
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
    this.setContentViewHeight(0)
    SMap.setAction(Action.PAN)

    // this.updateOverlayView()
    global.TouchType = TouchType.NORMAL
  }

  getToolbarModule = () => {
    return this.ToolbarModule
  }

  menu = (params = {}) => {
    try {
      if (
        this.ToolbarModule.getData().actions &&
        this.ToolbarModule.getData().actions.menu
      ) {
        this.ToolbarModule.getData().actions.menu(
          params.type || this.state.type,
          params.selectKey || this.state.selectKey,
          {
            showBox: height => {
              if (height !== undefined) this.getContentViewHeight(height)
              this.contentView &&
                this.contentView.changeHeight(
                  this.state.showMenuDialog ? this.getContentViewHeight() : 0,
                )
            },
            setData: params => {
              this.setState(params, () => {
                this.updateOverlayView()
              })
            },
          },
        )
      }
    } catch (error) {
      console.warn(e)
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

  showMenuBox = (params = {}) => {
    if (
      this.ToolbarModule.getData().actions &&
      this.ToolbarModule.getData().actions.showMenuBox
    ) {
      this.ToolbarModule.getData().actions.showMenuBox(
        params.type || this.state.type,
        params.selectKey || this.state.selectKey,
        {
          showBox: (params = {}) => {
            // this.isBoxShow = !this.isBoxShow
            // this.setBoxShow()

            let height = this.getContentViewHeight()
            if (params.height !== undefined) {
              height = params.height
              delete params.height
            }

            this.contentView &&
              this.contentView.changeHeight(!this.getBoxShow() ? height : 0)

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
    } else {
      this.contentView &&
        this.contentView.changeHeight(
          !this.getBoxShow() ? this.getContentViewHeight() : 0,
        )

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
          isFullScreen: !this.getBoxShow(),
        },
        () => {
          this.contentView &&
            this.contentView.changeHeight(
              this.getBoxShow() ? 0 : this.getContentViewHeight(),
            )
          this.updateOverlayView()
        },
      )
    } else {
      this.contentView &&
        this.contentView.changeHeight(
          this.getBoxShow() ? 0 : this.getContentViewHeight(),
        )
      if (global.Type === ChunkType.MAP_EDIT) {
        if (
          this.state.type &&
          (this.state.type.indexOf(ConstToolType.SM_MAP_MARKS_TAGGING_EDIT) !==
            -1 ||
            this.state.type.indexOf(
              ConstToolType.SM_MAP_MARKS_TAGGING_STYLE,
            ) !== -1)
        ) {
          return
        }
        if (global.showMenu) {
          global.showMenu = false
          this.setState({
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.PLACEHOLDER,
              ToolbarBtnType.FLEX,
            ],
          })
        } else {
          global.showMenu = true
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
      this.state.type === ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER ||
      this.state.isTouchProgress ||
      this.state.showMenuDialog
    )
      return
    global.TouchType = TouchType.NORMAL
    if (
      this.ToolbarModule.getData().actions &&
      this.ToolbarModule.getData().actions.overlayOnPress
    ) {
      this.ToolbarModule.getData().actions.overlayOnPress()
    }
    if (
      this.state.type === ConstToolType.SM_MAP_THEME_PARAM_CREATE_DATASETS ||
      this.state.type === ConstToolType.SM_MAP_THEME_PARAM_CREATE_EXPRESSION ||
      this.state.type ===
        ConstToolType.SM_MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
    ) {
      this.setVisible(false)
    } else if (
      typeof this.state.type === 'string' &&
      this.state.type.indexOf('SM_MAP_THEME_PARAM') >= 0
    ) {
      this.contentView && this.contentView.changeHeight(0)
      // this.isBoxShow = false
      this.getBoxShow(false)
      this.setState(
        {
          isFullScreen: false,
        },
        () => {
          this.updateOverlayView()
        },
      )
    } else if (this.state.type === ConstToolType.SM_MAP3D_WORKSPACE_LIST) {
      this.showToolbarAndBox(false)
      this.props.existFullMap && this.props.existFullMap()
      this.props.getOverlay() && this.props.getOverlay().setVisible(false)
    } else if (
      this.state.type === ConstToolType.SM_MAP_PLOT_ANIMATION_TEMP ||
      this.state.type === ConstToolType.SM_MAP_PLOT_ANIMATION_XML_LIST ||
      this.state.type === ConstToolType.SM_MAP_PLOT_ANIMATION_GO_OBJECT_LIST
    ) {
      let height = 0
      this.props.showFullMap && this.props.showFullMap(true)
      let type = ConstToolType.SM_MAP_PLOT_ANIMATION_START
      this.setVisible(true, type, {
        isFullScreen: false,
        height,
        cb: () => SMap.setAction(Action.SELECT),
      })
    } else if (this.state.type === ConstToolType.SM_MAP_PLOT_ANIMATION_NODE_CREATE) {
      // TODO savePlotAnimationNode
      // this.contentView.savePlotAnimationNode()
    } else if (this.state.type === ConstToolType.SM_MAP3D_FLY_LIST) {
      SScene.checkoutListener('startTouchAttribute')
      SScene.setAction('PAN3D')
      global.action3d = 'PAN3D'
      this.setVisible(false)
    } else {
      this.setVisible(false)
    }
    if (global.Type === ChunkType.MAP_EDIT) {
      global.showMenu = true
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
        secdata={this.state.secdata}
        existFullMap={this.existFullMap}
        setVisible={this.setVisible}
        showBox={this.showBox}
        customView={this.state.customView}
        getToolbarModule={() => this.ToolbarModule}
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
        getToolbarModule={() => this.ToolbarModule}
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
        getToolbarModule={() => this.ToolbarModule}
      />
    )
  }

  renderCustomHeaderRight = () => {
    const rightButtons = []
    const headerData = this.ToolbarModule.getHeaderData(this.state.type)
    if (!headerData || !headerData.headerRight) return null
    headerData.headerRight.forEach(item => {
      rightButtons.push(
        <TouchableOpacity
          key={item.key}
          onPress={() => {
            if (item.action && typeof item.action === 'function') {
              item.action()
            }
          }}
          style={[styles.headerRightView, item.style]}
        >
          <Image
            resizeMode={'contain'}
            // source={getThemeAssets().ar.toolbar.ai_setting}
            source={item.image}
            style={styles.headerRightImg}
          />
        </TouchableOpacity>
      )
    })
    return rightButtons
  }

  customHeaderBack = () => {
    const headerData = this.ToolbarModule.getHeaderData(this.state.type)
    if (headerData && headerData.backAction) {
      headerData.backAction()
    } else {
      this.setVisible(false)
    }
  }

  /** 自定义Header */
  renderCustomHeader = () => {
    // if (!this.state.showCustomHeader) return null
    const headerData = this.ToolbarModule.getHeaderData(this.state.type)
    if (!headerData) return null
    return (
      <Header
        ref={ref => (this.containerHeader = ref)}
        backAction={this.customHeaderBack}
        withoutBack={headerData.withoutBack}
        title={headerData.title}
        type={headerData.type}
        headerRight={this.renderCustomHeaderRight()}
        headerLeft={headerData.headerLeft}
        headerTitleViewStyle={headerData.headerTitleViewStyle}
      />
    )
  }

  /** 自定义Header */
  renderCustomView = () => {
    const CustomView = this.ToolbarModule.getCustomView(this.state.type)
    if (!CustomView) return null
    return CustomView
  }

  /** 自定义Bottom */
  renderCustomBottom = () => {
    const bottomView = this.ToolbarModule.getBottomView?.(this.state.type)
    if (bottomView) {
      return bottomView
    }
    return null
  }

  renderBottom = () => {
    const bottomView = this.ToolbarModule.getBottomView?.(this.state.type)
    if (bottomView) {
      return bottomView
    }
    let containerStyle =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? styles.fullContainerLandscape
        : styles.fullContainer
    let size = { height: this.props.device.height }
    if (this.state.isFullScreen && this.state.isTouchProgress) {
      let softBarHeight = 0
      if (Platform.OS === 'android') {
        softBarHeight = this.state.hasSoftMenuBottom
          ? ExtraDimensions.getSoftMenuBarHeight()
          : 0
      }

      size = { height: screen.getScreenSafeHeight(this.props.device.orientation) - softBarHeight }
    }
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      size.width = this.props.device.width
    }
    let showContainerRadius = !(this.state.isTouchProgress && this.state.isFullScreen) &&
      this.props.device.orientation.indexOf('LANDSCAPE') < 0
    return (
      <Animated.View
        style={[
          containerStyle,
          this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? { right: this.state.right, height: '100%' }
            : { bottom: this.state.bottom, width: '100%' },
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
              if (
                this.state.type === ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER_PICKER
              ) {
                this.showPicker()
                return
              } else if(this.state.type !== ConstToolType.SM_AR_EDIT_LAYER_VISIBLE_BOUNDS) {
                this.menu()
              }
            }}
          />
        )}
        {this.state.showMenuDialog && this.renderMenuDialog()}
        <View
          style={
            (
              !(this.state.isTouchProgress && this.state.isFullScreen) ||
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
            ) &&
            !this.state.customView && [styles.containerRadius, this.state.data.length > 0 && styles.containerShadow]
          }
          pointerEvents={'box-none'}
        >
          <View
            style={[
              this.props.device.orientation.indexOf('LANDSCAPE') === 0
                ? styles.containersLandscape
                : styles.containers,
              !this.state.customView && showContainerRadius && styles.containerRadius,
              !this.state.customView && styles.hidden,
              Platform.OS === 'android' ?
                (this.props.device.orientation.indexOf('LANDSCAPE') === 0
                  ? { height: screen.getScreenSafeHeight(this.props.device.orientation) }
                  : {}) : ({}),
            ]}
            pointerEvents={'box-none'}
          >
            {this.renderView()}
            {this.renderBottomBtns()}
          </View>
        </View>
      </Animated.View>
    )
  }

  render() {
    return (
      <>
        {this.renderCustomHeader()}
        {this.renderCustomView()}
        {this.renderBottom()}
      </>
    )
  }
}