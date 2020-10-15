/* eslint-disable import/no-duplicates */
import { screen } from '../../../../../utils'
import * as Modules from '../modules'
import mapFunctionModules from '../../../../../../configs/mapFunctionModules'
import ToolBarHeight from './ToolBarHeight'

// 更新类中的数据
// function setParams(params) {
//   // _params = params
//   CollectionData.setParams(params)
//   PlotData.setParams(params)
//   StartData.setParams(params)
//   ShareData.setParams(params)
//   MoreData.setParams(params)
//   Map3DData.setParams(params)
// }
class ToolbarModule {
  constructor() {
    this._params = {} // 外部数据和方法 Toolbar props
    this._data = {} // 临时数据
  }

  setParams(params = {}) {
    this._params = params
  }

  addParams(params = {}) {
    Object.assign(this._params, params)
  }

  getParams() {
    return this._params
  }

  setData(data = {}) {
    this._data = data
  }

  addData(data = {}) {
    Object.assign(this._data, data)
  }

  getData() {
    return this._data
  }

  /** 获取Toolbar 高度、行数、列数 **/
  getToolbarSize(type, additional = {}) {
    const params = this.getParams()
    let toolbarSize = {}
    let data = this.getData()
    let orientation
    if (params && params.device && params.device.orientation) {
      orientation = params.device.orientation
    } else {
      orientation = screen.getOrientation()
    }
    // 找当前模块下自定义的getToolbarSize，如果返回false，则去ToolBarHeight中去获取对应类型高度
    if (data && data.getToolbarSize) {
      toolbarSize = data.getToolbarSize(type, orientation, additional)
    }
    if (!toolbarSize || Object.keys(toolbarSize).length === 0) {
      toolbarSize = ToolBarHeight.getToolbarSize(type, orientation, additional)
    }
    return toolbarSize
  }

  _modules = new Array()

  getModules() {
    if (this._modules.length === 0) {
      for (let key in Modules) {
        // eslint-disable-next-line import/namespace
        let item = Modules[key]()
        item.setToolbarModule && item.setToolbarModule(this)
        this._modules.push(item)
      }
    }
    return this._modules
  }

  add(param) {
    let item = param()
    item.setToolbarModule(this)
    this._modules.push(item)
  }

  getModule(type, params = {}) {
    let module

    let modules = this.getModules()
    //TODO 优化
    modules.map(item => {
      // 严格按照命名规范，type名称SM_yyy_zzz（SM_ 为系统字段，自定义不可使用）
      if (type.indexOf(item.type) === 0) {
        module = item
      }
    })

    if (module !== undefined) {
      return module
    }
    // TODO 新增自定义FunctionModule
    module = mapFunctionModules.getModule(type, params)
    return module
  
    // TODO 待AR相关type更改后使用以下代码
    // let modules = this.getModules()
    // // SM_ 开头的为系统字段
    // if (type.indexOf('SM_') === 0) {
    //   modules.map(item => {
    //     if (type.indexOf(item.type) === 0) {
    //       module = item
    //     }
    //   })
    // } else if (type !== '') {
    //   // 自定义FunctionModule
    //   module = mapFunctionModules.getModule(type, params)
    // }
    //
    // return module
  }

  /**
   * 获取Toolbar内容数据和底部对应按钮
   * @param type
   * @param params
   * @returns {Promise.<{data, buttons}>}
   */
  async getToolBarData(type, params = {}) {
    let toolBarData = {
      data: [],
      buttons: [],
    }

    let module = this.getModule(type, params)
    if (module && module.getData) {
      toolBarData = await module.getData(type, params)
    }

    return toolBarData
  }

  async setToolBarData(type, params = {}) {
    let module = this.getModule(type, params)
    if (module && module.setModuleData) {
      module.setModuleData(type)
    }
  }

  /**
   * 获取菜单弹框数据
   * @param type
   * @param others {themeType}
   * @returns {Array}
   */
  getMenuDialogData(type, ...others) {
    let module = this.getModule(type)
    let data = (module.getMenuData && module.getMenuData(type, ...others)) || []
    return data
  }
}

let defaultModule = new ToolbarModule()
let modules = new Map()

function getToolbarModule(key) {
  if (!modules.has(key)) {
    modules.set(key, new ToolbarModule())
  }
  return modules.get(key)
}

function deleteToolbarModule(key) {
  if (modules.has(key)) {
    modules.delete(key)
  }
}

export { getToolbarModule, deleteToolbarModule }

export default defaultModule
