import { Module } from "@/class"

interface BundleUtilParams {
  addMapModule: (module: typeof Module, cb?: () => void) => Promise<void>,
}

let _addMapModule: (module: typeof Module, cb?: () => void) => Promise<void>

function init(params: BundleUtilParams) {
  _addMapModule = params.addMapModule
}

function loadModule(module: typeof Module, cb?: () => void) {
  try {
    if (!_addMapModule) return false
    _addMapModule(module, cb)
    return true
  } catch (e) {
    return false
  }
}

export default {
  init,
  loadModule,
}