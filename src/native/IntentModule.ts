import { NativeModules } from 'react-native'

const { IntentModule } = NativeModules

const navParams: {[key: string]: any} = {}

function getNavParams() {
  return navParams
}

function getNavParam(name: string) {
  try {
    if (Object.keys(navParams).indexOf(name) >= 0) {
      return navParams[name]
    }
    return null
  } catch(e) {
    return null
  }
}

function setNavParam(name: string, params: {[key: string]: any}) {
  try {
    navParams[name] = params
  } catch(e) {
  }
}

function openModel(modulePath = '', bundleType: string, options?: {
  name: string,
  params: {[key: string]: any},
}) {
  try {
    if (!modulePath) return false
    if (options?.params) {
      navParams[options.name] = options?.params
    }
    return IntentModule.openModel(modulePath, bundleType)
  } catch(e) {
    return false
  }
}

function open(url = '') {
  try {
    if (!open) return false
    return IntentModule.open(url)
  } catch(e) {
    return false
  }
}

function getAssetsBundles() {
  try {
    return IntentModule.getAssetsBundles()
  } catch(e) {
    return []
  }
}

function getBundles() {
  try {
    return IntentModule.getBundles()
  } catch(e) {
    return []
  }
}

function getUnusedBundles() {
  try {
    return IntentModule.getUnusedBundles()
  } catch(e) {
    return []
  }
}

function loadModel(modelPath: string) {
  try {
    return IntentModule.loadModel(modelPath)
  } catch(e) {
    return false
  }
}

function goBack() {
  try {
    return IntentModule.goBack()
  } catch(e) {
    return false
  }
}

export default {
  getNavParams,
  getNavParam,
  setNavParam,
  openModel,
  open,
  getAssetsBundles,
  getBundles,
  getUnusedBundles,
  loadModel,
  goBack,
}