/**
 * 自定义Array实例方法
 */
export default (function() {
  /** 克隆一个新的MaArray，并且内部所有键值对都是新的 * */
  Array.prototype.clone = function() {
    return [].concat(this)
  }
  
  Array.prototype.deepClone = function() {
    return deepClone(this)
  }
  
  function deepClone(obj, hash = new WeakMap()) {
    if (!isObject(obj) || typeof obj === 'function') {
      return obj
    }
    // 查表
    if (hash.has(obj)) return hash.get(obj)

    let isArray = Array.isArray(obj)
    let cloneObj = isArray ? [] : {}
    // 哈希表设值
    hash.set(obj, cloneObj)

    let result = Object.keys(obj).map(key => {
      return {
        [key]: deepClone(obj[key], hash)
      }
    })
    return Object.assign(cloneObj, ...result)
  }
  
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
  }
  
})
