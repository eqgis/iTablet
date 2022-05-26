import { ARLayer } from "imobile_for_reactnative"
import { AIRecognitionInfo, ARNodeStyle } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { ARElement, ARElementStyle, IAnimationParam, IARTransform } from "imobile_for_reactnative/types/interface/ar"
import { GeometrySelectedEvent } from "imobile_for_reactnative/types/interface/mapping/SMap"
import ToolBarContainer from "../SMToolbar/ToolbarContainer"
import { Props } from "../Toolbar"
import { ModuleList } from "../Toolbar/modules"
import CameraRoll from "@react-native-community/cameraroll"

let toolbarRef: ToolBarContainer<ModuleList>

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

/** toolbar 中保存临时数据 */
interface ToolBarData {
  transformInfo?: IARTransform
  /** 选中的AR对象 */
  selectARElement?: ARElement
  addNewDsetWhenCreate?: boolean
  /** 要添加的动画参数 */
  animationParam?: IAnimationParam
  /** 当前图层的风格 */
  currentLayerStyle?: ARElementStyle
 
  /** 是否正在添加AR对象，控制添加频率 */
  isAddingARElement?: boolean
 
  /** 添加沙盒路径 */
  sandTablePath?: string
  sandTablePaths?:string[]


  /** 选中的沙盘模型路径 */
  sandTableModels?: string[]

  isAlbumFirstAdd?: boolean
  /** AR属性表,选中的属性字段名称 */
  selectedAttribute?: string[]
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

/** toolbar显示为tab类型时，重置内部数据 */
function resetTabData() {
  toolbarRef?.resetTabData()
}

/** 显示/隐藏 toolbarTab 下的 view */
function showTabView(visible: boolean) {
  toolbarRef.showTabView(visible)
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
  showTabView,
  getCurrentOption,
  toggleListVisible
}

