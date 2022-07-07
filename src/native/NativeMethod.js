import { NativeModules } from 'react-native'

const { NativeMethod } = NativeModules

function getTemplates(userName = '', module = '') {
  return NativeMethod.getTemplates(userName, module)
}

function getTemplatesList(userName = '', module = '') {
  return NativeMethod.getTemplatesList(userName, module)
}

export default {
  getTemplates,
  getTemplatesList,
}
