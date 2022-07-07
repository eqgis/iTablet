import * as Modules from '../modules'
import mapFunctionModules from '../../../../../../configs/mapFunctionModules'
import FunctionModule from '../../../../../class/FunctionModule'

const _modules = new Array()

function getModules(context: any) {
  try {
    if (_modules.length === 0) {
      for (let key in Modules) {
        // eslint-disable-next-line import/namespace
        let item = Modules[key]()
        item.setToolbarModule && item.setToolbarModule(context)
        _modules.push(item)
      }
    }
    return _modules
  } catch (error) {
    return []
  }
}

function add(context: any, param: () => FunctionModule) {
  let item = param()
  item.setToolbarModule(context)
  _modules.push(item)
}

function getModule(context: any, type: string, params = {}) {
  try {
    let module
    let modules = getModules(context)
    if (typeof type !== 'string') return null // 防止type不为字符串
    // SM_ 开头的为系统字段
    if (type.indexOf('SM_') === 0) {
      modules.map(item => {
        if (type.indexOf(item.type) === 0) {
          module = item
        }
      })
    } else if (type !== '') {
      // 自定义FunctionModule
      module = mapFunctionModules.getModule(type, params)
    }
    return module
  } catch (error) {
    return []
  }
}

export default {
  getModules,
  add,
  getModule,
}