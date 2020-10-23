// import { DatasetType } from 'imobile_for_reactnative'

/**
 * 检测传入的Toolbar类型是否占用系统字段
 * @param types (String | Array | Object)
 */
function checkCustomToolbarType (types) {
  const error = 'Types beginning with SM are system reserved fields and cannot be used: '
  if (types instanceof Object) {
    const SysKeys = Object.keys(types)
    for (let i = 0; i < SysKeys.length; i++) {
      if (types[SysKeys[i]].indexOf('SM_') === 0) {
        throw new Error(error + types[SysKeys[i]])
      }
    }
  } else if (types instanceof Array) {
    for (let i = 0; i < types.length; i++) {
      if (types[i].indexOf('SM_') === 0) {
        throw new Error(error + types[i])
      }
    }
  } else if (typeof types === 'string') {
    if (types.indexOf('SM_') === 0) {
      throw new Error(error + types)
    }
  }
}

// const vectorType = [
//   DatasetType.CAD,
//   DatasetType.TEXT,
//   DatasetType.LINE,
//   DatasetType.REGION,
//   DatasetType.POINT,
//   DatasetType.TABULAR,
// ]

// function isVectorDataset(type) {
//   for (let i = 0; i < vectorType.length; i++) {
//     if (type === vectorType[i]) return true
//   }
//   return false
// }

function getMediaTypeByPath(uri = '') {
  let type = ''
  if (!uri) return type
  uri = uri.toLowerCase()
  if (
    uri.endsWith('mp4') ||
    uri.endsWith('mov') ||
    uri.endsWith('avi') ||
    uri.endsWith('wmv') ||
    uri.indexOf('/video/') > 0
  ) {
    type = 'video'
  } else if (
    uri.endsWith('jpg') ||
    uri.endsWith('jpeg') ||
    uri.endsWith('png') ||
    uri.endsWith('gif') ||
    uri.endsWith('bmp') ||
    uri.indexOf('/images/') > 0
  ) {
    type = 'photo'
  }
  return type
}

export default {
  // isVectorDataset,
  getMediaTypeByPath,
  checkCustomToolbarType,
}
