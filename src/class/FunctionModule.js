/**
 * 地图右侧功能基础类
 */
import ToolbarModule from '../containers/workspace/components/ToolBar/modules/ToolbarModule'

export default class FunctionModule {
  constructor(props) {
    this.props = props || {}
    this.type = this.props.type
    this.key = this.props.title
    this.title = this.props.title || ''
    this.size = this.props.size
    this.image = this.props.image
    // 模块相关数据
    this.getData = this.props.getData
    this.getMenuData = this.props.getMenuData
    // 整合默认事件和自定义事件
    this.actions = Object(this.props.actions || {}, Actions)
  }

  /** 自定义高度 **/
  // eslint-disable-next-line
  getToolbarSize = (type, orientation, additional) => {
    // let height = 0,
    //   column = -1,
    //   row = -1
    // return { height, column, row }
  }

  /** 存放当前数据到ToolbarModule **/
  setModuleData = (type = this.type) => {
    ToolbarModule.setData({
      type,
      getData: this.getData,
      actions: this.actions,
      getToolbarSize: this.getToolbarSize,
    })
  }

  /** 启动模块事件 **/
  action = type => {
    this.setModuleData(type)
    this.props.action && this.props.action()
  }

  /** 添加模块事件 **/
  addActions = (_actions = {}) => {
    this.actions = Object(this.actions || {}, _actions)
  }
}

/** 模块相关默认事件 **/
const Actions = {
  /********** ToolbarBottomButtons事件 **********/
  commit: () => {},
  menu: () => {},
  showMenuBox: () => {},
  showAttribute: () => {},
  undo: () => {},
  redo: () => {},
  close: () => {},
  toolbarBack: () => {},

  /********** ToolbarContentView事件 **********/
  listSelectableAction: () => {},

  /********** 地图事件 **********/
  geometrySelected: () => {},
}
