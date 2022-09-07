/**
 * 动态添加导航工具
 */
const _navigator: Set<any> = new Set()

function addNavigator(navigator: any[]) {
  try {
    if (navigator.length === 0) return
    for (const item of navigator) {
      _navigator.add(item)
    }
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

function getNavigator() {
  return _navigator
}

function isSameNavigator(s1: Set<any>, s2: Set<any>) {
  if (s1.size !== s2.size) {
    return false
  }
  return [...s1].every(i => s2.has(i))
}

export default {
  addNavigator,
  getNavigator,
  isSameNavigator,
}