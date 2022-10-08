import { ARElement, ARElementStyle, IAnimationParam, IARTransform, ARLayer } from "imobile_for_reactnative/types/interface/ar"
import ToolBarContainer from "imobile_for_reactnative/components/ToolbarKit/ToolbarContainer"
import { Props } from "../Toolbar"
import { ModuleList } from "../Toolbar/modules"
import CameraRoll from "@react-native-community/cameraroll"
import { GeometrySelectedEvent } from "imobile_for_reactnative/types/interface/mapping/SMap"
import { AIRecognitionInfo, ARAttributeStyle, ARNodeStyle } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
let toolbarRef: ToolBarContainer<ModuleList>

export const arLayerType:  {
  POI: 'POI',
  VECTOR: 'VECTOR',
  THREE_D: 'THREE_D',
  MODEL: 'MODEL',
  SAND_TABLE: 'SAND_TABLE',
  EFFECT: 'EFFECT',
  WIDGET: 'WIDGET',
} = {
  POI: 'POI',
  VECTOR: 'VECTOR',
  THREE_D: 'THREE_D',
  MODEL: 'MODEL',
  SAND_TABLE: 'SAND_TABLE',
  EFFECT: 'EFFECT',
  WIDGET: 'WIDGET',
}

function setToolBar(ref: ToolBarContainer<ModuleList>  | null) {
  if(!ref) return
  toolbarRef = ref
}

function getToolBar() {
  return toolbarRef
}

function getProps(): Props {
  return toolbarRef.props as Props
}

function getState() {
  return toolbarRef.state
}
/** ar矢量线符号数据格式 */
interface ARSymbolObj {
  image: number | string  // 64位二进制图片
  text: string
  number: number
}

/** 柱状图数据类型 */
interface chartDataType {
  name: string,
  value: number | string,
  color: string,
}

interface chartType {
  data: Array<chartDataType>,
  unit: string
}

/** toolbar 中保存临时数据 */
interface ToolBarData {
    /** 添加 ar 视频图片时的路径 */
    arContent?: string
    /** 添加 ar 视频图片时的路径集合 */
    arPhotos?: CameraRoll.PhotoIdentifier[]
    /** 相册名称 */
    albumName?:string
    videoType?:number
    /** 添加模型时模型路径 */
    modelPath?: string
    /** 设置AR对象变换时的临时数据 */
    transformInfo?: IARTransform
    scanCalibration?: {x: number, y: number, h: number}
    /** 选择的三维场景目录 */
    sceneFilePath?: string
    /** 要操作的AR图层  */
    selectARLayer?: ARLayer
    /** 选中的AR对象 */
    selectARElement?: ARElement
    /** AR对象内子节点的序号 */
    selectedChildIndex?: number
    /** 添加的AR对象 */
    addARElement?: ARElement
    /** 创建AR数据源时遇到同名是否新建 */
    addNewDSourceWhenCreate?: boolean
    /** 创建AR数据集时遇到同名是否新建 */
    addNewDsetWhenCreate?: boolean
    /** tab类型toolbar打开时显示的标签序号 */
    tabShowIndex?: number
    /** 要添加的动画参数 */
    animationParam?: IAnimationParam
    /** 当前图层的风格 */
    currentLayerStyle?: ARElementStyle
    /** 几何对象选择事件 */
    geometrySelectEvent?: GeometrySelectedEvent
    /** 导航剩余路径长度 */
    naviRemain?: number
    /** 选中 callout 的 tag */
    selectARCalloutTag?:string
    /** AR图层可见范围 */
    maxVisibleBounds?: number
    minVisibleBounds?: number
    maxAnimationBounds?: number
    minAnimationBounds?: number
    /** 是否正在添加AR对象，控制添加频率 */
    isAddingARElement?: boolean
    /** 当前点击的AI识别对象 */
    currentTouchRecognition?: AIRecognitionInfo
     /** 判断node点击相应 */
    isNodeTouch?:boolean
    /** node风格 */
    nodeStyle?: ARNodeStyle
    currentNodeStyle?: ARNodeStyle
    /** 特效图层的持续时间 */
    secondsToPlay?: number
    /** 特效图层的中心x坐标 */
    centerX?: number
    /** 特效图层的中心y坐标 */
    centerY?: number
    /** 点击添加小组件标识 */
    isAlbumFirstAdd?:boolean
    /** 添加沙盒路径 */
    sandTablePath?: string
    sandTablePaths?:string[]
    /** 当前所在板块的索引类型 */
    // moduleIndex?: number
    moduleKey?: keyof typeof arLayerType | undefined
    /** 特效图层是否未添加完毕  false表示添加完毕， true表示未添加完毕 */
    isNotEndAddEffect?: boolean
    /** AR属性表,选中的属性字段名称 */
    selectedAttribute?: string[]

    /** 矢量线图层是否正在添加 true表示正在添加， false表示已经添加完成 */
    isLineAdd?: boolean
    /** 矢量符号线的符号路径 */
    markerLineContent?: string
    /** 矢量线符号的文件夹路径 */
    arSymbolFilePath?: string
    /** ar矢量线符号数组 */
    ARSymbolObjList?: Array<ARSymbolObj>
    /** ar 矢量线编辑的类型 1:对象编辑 2:节点添加 3:节点编辑 */
    LineEditType?: number
    /** 编辑里线是焦点添加还是当前位置添加 true：焦点添加  false：当前位置添加 */
    foucusAddPoint?: boolean

    /** 选中的沙盘模型路径 */
    sandTableModels?: string[]
    /** 柱状图的数据 */
    chartData?: chartType  // Array<chartDataType>

    attributeStyle?: ARAttributeStyle | null

    /** 三维管线的Ar属性 */
    attribute3D?: attribute3DType
    /** 选中的对象是否拥有骨骼动画 true表示有骨骼动画， false表示没有骨骼动画 */
    ownModelAnimation?: boolean
}

export interface attribute3DType {
  head: Array<attribute3DHeadtype>,
  data: Array<Array<attribute3DItemType>>,
}
export interface attribute3DHeadtype {
  caption: string,
  defaultValue?: string,
  isRequired?: boolean,
  isSystemField?: boolean,
  maxLength?: number,
  name?: string,
  type?: number,

}
export interface attribute3DItemType {
  fieldInfo: attribute3DHeadtype,
  name: string,
  value: string,
}


const toolBarData: ToolBarData = {}

/** 添加临时数据 */
function addData(data: ToolBarData) {
  Object.assign(toolBarData, data)
}

/** 获取临时数据 */
function getData(): ToolBarData {
  return toolBarData
}

function getCurrentOption(): {name: keyof ModuleList, key: ModuleList[keyof ModuleList]} | undefined {
  if(history.length === 0) return undefined
  return history[history.length -1]
}

/** 历史记录 */
const history: {name: keyof ModuleList, key: ModuleList[keyof ModuleList]}[] = []

/** 通过模块 key 和模块内的 key 获取预定义的数据设置 toolbar并显示  */
function show<name extends keyof ModuleList>(
  module: name,
  key: ModuleList[name]
) {
  const option = {
    name: module,
    key: key
  }
  history.push(option)
  toolbarRef?.setVisible(true, option)
}

/**
 * 插入一页
 * @param index 插入的位置 小于0为倒序
 */
function insert<name extends keyof ModuleList>(
  module: name,
  key: ModuleList[name],
  index: number,
) {
  const option = {
    name: module,
    key: key
  }
  history.splice(index, 0, option)
}

/**
 * 移除一页
 * @param index 移除的位置 小于0为倒序
 */
function remove(index: number) {
  history.splice(index, 1)
}

/**
 * 替换一页
 * @param index 替换的位置 小于0为倒序
 */
function replace<name extends keyof ModuleList>(
  module: name,
  key: ModuleList[name],
  index: number,
) {
  const option = {
    name: module,
    key: key
  }
  history.splice(index, 1, option)
}


/**
 * 隐藏 toolbar
 * @param noClear 不清空历史
 */
function hide(noClear?: boolean) {
  if(!noClear){
    history.splice(0, history.length)
  }
  toolbarRef?.setVisible(false)
}

/** 重新显示 toolbar */
function reshow(){
  if(history.length == 0) return
  toolbarRef?.setVisible(true, history[history.length - 1])
}

/** 返回上一页 */
function goBack() {
  if(toolbarRef?.state.visible) {
    if(history.length > 1) {
      history.pop()
      toolbarRef?.setVisible(true, history[history.length - 1])
    } else {
      hide()
    }
  }
}

/**
 * toolbar显示为tab类型时，重置内部数据
 * @deprecated 使用resetPage支持Toolbar所有类型的组件
 */
function resetTabData() {
  toolbarRef?.resetTabData()
}

/** 重置当前toolbar页面， 也会调用PageAction，就和第一次进入当前页面一样 */
function resetPage() {
  toolbarRef?.resetPage()
}

/**
 * 在底部的按钮里添加新的按钮  deleteBottomBtn
 * @param newBottoms  新插入的按钮数组
 * @param index 插入的位置(如果用的是menu会忽略自动在第一个按钮后面插入的两个按钮)
 */
function addBottomBtn(newBottoms: Array<ToolBarBottomItem>, index: number) {
  toolbarRef?.addBottomBtn(newBottoms, index)
}

/**
 * 在底部的按钮里移除某个按钮
 * @param index 要移除按钮的位置
 * @param count 移除的个数
 */
function deleteBottomBtn(index: number, count: number) {
  toolbarRef?.deleteBottomBtn(index, count)
}

/** 显示/隐藏 toolbarTab 下的 view */
function showTabView(visible: boolean) {
  toolbarRef.showTabView(visible)
}

/** 显示/隐藏 toolbarMenu 下的 view */
function showMenuView(visible: boolean) {
  toolbarRef.showMenuView(visible)
}

/** 切换 ToolbarList 的显隐 */
function toggleListVisible() {
  toolbarRef.toggleListVisible()
}

export default {
  setToolBar,
  getToolBar,
  getProps,
  getState,
  addData,
  getData,
  show,
  insert,
  remove,
  replace,
  hide,
  goBack,
  reshow,
  resetTabData,
  resetPage,
  showTabView,
  getCurrentOption,
  toggleListVisible,
  addBottomBtn,
  deleteBottomBtn,
  showMenuView,
}

