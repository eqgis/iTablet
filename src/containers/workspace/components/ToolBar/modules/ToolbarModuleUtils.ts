import * as Modules from '../modules'
import mapFunctionModules from '../../../../../../configs/mapFunctionModules'
import FunctionModule from '../../../../../class/FunctionModule'

const _modules: FunctionModule[] = []
const _appletModules: Set<FunctionModule> = new Set()

function getModules(context: any) {
  try {
    if (_modules.length === 0) {
      for (const key in Modules) {
        const item = Modules[key]()
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
  const item = param()
  item.setToolbarModule(context)
  _modules.push(item)
}

function getAppletModule(type: string) {
  try {
    let module
    for (const item of _appletModules) {
      if (type.indexOf(item.type) === 0) {
        module = item
        break
      }
    }
    return module
  } catch (error) {
    return []
  }
}

function addAppletModule(param: () => FunctionModule) {
  const item = param()
  // item.setToolbarModule(context)
  _appletModules.add(item)
}

function getModule(context: any, type: string, params = {}) {
  try {
    let module
    const modules = getModules(context)
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
      module = mapFunctionModules.getModule(type)
      if (!module) {
        // 查找小插件中的FunctionModule
        module = getAppletModule(type)
      }
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
  addAppletModule,
}