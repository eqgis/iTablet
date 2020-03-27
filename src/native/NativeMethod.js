import { NativeModules } from 'react-native'

const { NativeMethod } = NativeModules

function getTemplates(userName = '', module = '') {
  return NativeMethod.getTemplates(userName, module)
}

export default {
  getTemplates,
}
