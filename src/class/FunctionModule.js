/**
 * 地图右侧功能基础类
 */
import ToolbarModule from '../containers/workspace/components/ToolBar/modules/ToolbarModule'

export default class FunctionModule {
  constructor(props) {
    this.props = props || {}
    this.type = this.props.type
    this.title = this.props.title || ''
    this.key = this.props.key || this.title
    this.size = this.props.size
    this.image = this.props.image
    // 模块相关数据
    this.getData = this.props.getData
    this.getMenuData = this.props.getMenuData
    // 整合默认事件和自定义事件
    this.actions = Object(this.props.actions || {}, Actions)
  }

  /**
   * 自定义高度
   * @param type
   * @param orientation 横竖屏方向
   * @param additional  补充数据，自行定义
   */
  // eslint-disable-next-line
  getToolbarSize = (type, orientation, additional) => {
    // let height = 0,
    //   column = -1,
    //   row = -1
    // return { height, column, row }
  }

  getTitle = () => this.title

  setToolbarModule = param => {
    this.ToolbarModule = param
  }

  /**
   * 存放当前数据到ToolbarModule
   * @param type
   */
  setModuleData = (type = this.type) => {
    let toolbarModule = this.ToolbarModule || ToolbarModule
    toolbarModule.setData({
      type,
      getData: this.getData,
      actions: this.actions,
      getToolbarSize: this.getToolbarSize,
    })
  }

  /**
   * 启动模块事件
   * @param type
   */
  action = type => {
    this.setModuleData(type)
    this.props.action && this.props.action()
  }

  /**
   * 添加模块事件
   * @param _actions
   */
  addActions = (_actions = {}) => {
    this.actions = Object(this.actions || {}, _actions)
  }
}

/** 模块相关默认事件 **/
const Actions = {
  /********** ToolbarBottomButtons事件 **********/
  commit: () => {}, // 提交
  menu: () => {}, // 屏幕中间的指滑菜单
  showMenuBox: () => {}, // 指滑菜单和内容框交替显示
  showAttribute: () => {}, // 显示属性
  undo: () => {}, // 地图撤销
  redo: () => {}, // 地图重做
  close: () => {}, // 关闭Toolbar
  toolbarBack: () => {}, // Toolbar界面回退

  /********** ToolbarContentView事件 **********/
  listSelectableAction: () => {}, // Toolbar SelectList类型点击事件
  listAction: () => {}, // Toolbar List类型点击事件

  /********** 地图事件 **********/
  geometrySelected: () => {}, // 地图对象选择事件
}
