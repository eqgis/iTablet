/**
 * 地图右侧功能基础类
 */
import { ImageSourcePropType } from 'react-native'
import ToolbarModule from '../containers/workspace/components/ToolBar/modules/ToolbarModule'

interface ActionsType {[key: string]: () => any}

interface FunctionModuleProps {
  key: string,
  type: string,
  title: string, // 模块名称，进入地图后的标题
  size: number, // 默认图标
  image: ImageSourcePropType, // 点击高亮图标
  getData: string, // 默认地图名
  getMenuData: () => void,
  getHeaderView: () => void,
  getHeaderData: () => boolean, // action之前的检测，返回false则不执行之后的action
  getCustomView: () => boolean, // action之后的检测，返回false则不执行之后的action
  getBottomView: () => void, // 默认地图资源
  actions: ActionsType, // 默认地图资源对应的地图index
  action: () => any,
}

export default class FunctionModule {

  props: FunctionModuleProps
  key: string
  type: string
  title: string // 模块名称，进入地图后的标题
  size: number // 默认图标
  image: ImageSourcePropType // 点击高亮图标
  getData: string // 默认地图名
  getMenuData: () => void
  getHeaderView: () => void
  getHeaderData: () => boolean // action之前的检测，返回false则不执行之后的action
  getCustomView: () => boolean // action之后的检测，返回false则不执行之后的action
  getBottomView: () => void // 默认地图资源
  actions: ActionsType // 默认地图资源对应的地图index

  ToolbarModule: any

  constructor(props: FunctionModuleProps) {
    this.props = props || {}
    this.type = this.props.type
    this.title = this.props.title || ''
    this.key = this.props.key || this.title
    this.size = this.props.size
    this.image = this.props.image
    // 模块相关数据
    this.getData = this.props.getData
    this.getMenuData = this.props.getMenuData
    this.getHeaderData = this.props.getHeaderData
    this.getHeaderView = this.props.getHeaderView
    this.getCustomView = this.props.getCustomView
    this.getBottomView = this.props.getBottomView
    // 整合默认事件和自定义事件
    this.actions = Object.assign({}, this.props.actions || {})
  }

  /**
   * 自定义高度
   * @param type
   * @param orientation 横竖屏方向
   * @param additional  补充数据，自行定义
   */
  // eslint-disable-next-line
  getToolbarSize = (type: string, orientation: string, additional: any) => {
    // let height = 0,
    //   column = -1,
    //   row = -1
    // return { height, column, row, autoShowBox }
  }

  getTitle = () => this.title

  setToolbarModule = (param: any) => {
    this.ToolbarModule = param
  }

  /**
   * 存放当前数据到ToolbarModule
   * @param type
   */
  setModuleData = (type = this.type) => {
    const toolbarModule = this.ToolbarModule || ToolbarModule
    toolbarModule.setData({
      type,
      title: this.title,
      getData: this.getData,
      actions: this.actions,
      getToolbarSize: this.getToolbarSize,
    })
  }

  /**
   * 启动模块事件
   * @param type
   */
  action = (type: string) => {
    this.setModuleData(type)
    this.props.action && this.props.action()
  }

  /**
   * 添加模块事件
   * @param _actions
   */
  addActions = (_actions: ActionsType) => {
    this.actions = Object.assign(this.actions || {}, _actions)
  }
}

/** 模块相关默认事件 **/
// const Actions: ActionsType = {
//   /********** ToolbarBottomButtons事件 **********/
//   commit: () => {}, // 提交
//   menu: () => {}, // 屏幕中间的指滑菜单
//   showMenuBox: () => {}, // 指滑菜单和内容框交替显示
//   showAttribute: () => {}, // 显示属性
//   undo: () => {}, // 地图撤销
//   redo: () => {}, // 地图重做
//   close: () => {}, // 关闭Toolbar
//   toolbarBack: () => {}, // Toolbar界面回退

//   /********** ToolbarContentView事件 **********/
//   listSelectableAction: () => {}, // Toolbar SelectList类型点击事件
//   listAction: () => {}, // Toolbar List类型点击事件

//   /********** 地图事件 **********/
//   geometrySelected: () => {}, // 地图对象选择事件
// }