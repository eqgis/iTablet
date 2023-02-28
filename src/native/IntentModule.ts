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

function open(url = '') {
  try {
    if (!open) return false
    return IntentModule.open(url)
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

function loadBundle(bundlePath) {
  try {
    return IntentModule.loadBundle(bundlePath)
  } catch(e) {
    return false
  }
}

export default {
  getNavParams,
  getNavParam,
  setNavParam,
  open,
  goBack,
  loadBundle,
}