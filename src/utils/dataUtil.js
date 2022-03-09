import { getLanguage } from '../language'
import { FileTools } from "imobile_for_reactnative"
const Parser = require('react-native-xml2js').Parser

function sortByPinYin(arr) {
  arr.sort((param1, param2) => param1.localeCompare(param2))
  return arr
}

function pySegSort(arr) {
  if (!String.prototype.localeCompare) return null

  const letters = '*abcdefghjklmnopqrstwxyz'.split('')
  const zh = '阿八嚓哒妸发旮哈讥咔垃麻拏噢妑七呥扨它穵夕丫帀'.split('')

  const segs = []
  let curr
  letters.forEach((item, i) => {
    curr = { letter: item, data: [] }
    arr.forEach(item2 => {
      if (
        (!zh[i - 1] || zh[i - 1].localeCompare(item2) <= 0) &&
        item2.localeCompare(zh[i]) === -1
      ) {
        curr.data.push(item2)
      }
    })
    if (curr.data.length) {
      segs.push(curr)
      curr.data.sort((a, b) => a.localeCompare(b))
    }
  })
  return segs
}

function formatPhone(value) {
  return value.replace(/[&|\\*^%$#@\-()\s]/g, '')
}

function checkMobile(value) {
  if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(value)) {
    return false
  }
  return true
}

function CheckTel(value) {
  // 电话验证
  const reg = /^([0-9]|[-])+$/g
  let isValid
  isValid = reg.exec(value)
  if (!isValid) {
    return false
  }
  return true
}

const DataType = {
  '[object String]': 'String',
  '[object Number]': 'Number',
  '[object Boolean]': 'Boolean',
  '[object Undefined]': 'Undefined',
  '[object Null]': 'Null',
  '[object Function]': 'Function',
  '[object Date]': 'Date',
  '[object Array]': 'Array',
  '[object RegExp]': 'RegExp',
  '[object Error]': 'Error',
  '[object HTMLDocument]': 'HTMLDocument',
  '[object global]': 'global',
}

function getType(data) {
  const type = Object.prototype.toString.call(data)
  return DataType[type]
}

function colorRgba(str, n = 1) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let sColor = str.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        // 例如：#eee,#fff等
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    const sColorChange = {}
    for (let i = 1; i < 7; i += 2) {
      const key = i === 1 ? 'r' : i === 3 ? 'g' : 'b'
      sColorChange[key] = parseInt(`0x${sColor.slice(i, i + 2)}`)
    }
    sColorChange.a = n
    return sColorChange
  }
  return sColor
}

function checkColor(str) {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  return reg.test(str)
}

function colorHex(obj) {
  return `#${((1 << 24) + (obj.r << 16) + (obj.g << 8) + obj.b)
    .toString(16)
    .slice(1)}`
}

const chnNumChar = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
}
const chnNameValue = {
  十: { value: 10, secUnit: false },
  百: { value: 100, secUnit: false },
  千: { value: 1000, secUnit: false },
  万: { value: 10000, secUnit: true },
  亿: { value: 100000000, secUnit: true },
}
function ChineseToNumber(chnStr) {
  let rtn = 0
  let section = 0
  let number = 0
  let secUnit = false
  const str = chnStr.split('')
  for (let i = 0; i < str.length; i++) {
    const num = chnNumChar[str[i]]
    if (typeof num !== 'undefined') {
      number = num
      if (i === str.length - 1) {
        section += number
      }
    } else {
      const unit = chnNameValue[str[i]].value
      secUnit = chnNameValue[str[i]].secUnit
      if (secUnit) {
        section = (section + number) * unit
        rtn += section
        section = 0
      } else {
        section += (number + (i === 0 ? 1 : 0)) * unit
      }
      number = 0
    }
  }
  return rtn + section
}

// 数字加上千分位符号
function NumberWithThousandSep(nummber, fix = 2, ellipsisZero = true) {
  let num = (nummber || 0).toString()
  if (fix >= 0 && num.indexOf('.') !== -1) {
    nummber = nummber.toFixed(fix)
    num = (nummber || 0).toString()
  }
  let int = num
  let decimal = ''
  if (num.indexOf('.') !== -1) {
    int = num.substr(0, num.indexOf('.'))
    decimal = num.substr(num.indexOf('.') + 1)
    if (ellipsisZero && parseInt(decimal) === 0) {
      decimal = ''
    }
  }
  let result = ''
  while (int.length > 3) {
    result = `,${int.slice(-3)}${result}`
    int = int.slice(0, int.length - 3)
  }
  if (int) {
    result = int + result
  }
  if (fix !== 0 && decimal !== '') {
    result = `${result}.${decimal}`
  }
  return result
}

function angleTransfer(value = 0, decimals = -1) {
  let degrees
  let minutes
  let seconds
  let temp = value
  degrees = Math.floor(temp)

  temp = (temp - degrees) * 60
  minutes = Math.floor(temp)

  temp = (temp - minutes) * 60
  seconds = temp
  if (decimals >= 0) {
    seconds = seconds.toFixed(decimals)
  }
  return `${degrees}°${minutes}'${seconds}"`
}

/**
 * 数组元素交换位置
 * @param {array} arr 数组
 * @param {number} index1 添加项目的位置
 * @param {number} index2 删除项目的位置
 * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
 */
function swapArray(arr = [], index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

/**
 * 深拷贝一个对象
 * @param obj
 * @returns {{}}
 */
function cloneObj(obj) {
  let newObj = {}
  if (obj instanceof Array) {
    newObj = []
  }
  for (const key in obj) {
    const val = obj[key]
    newObj[key] = typeof val === 'object' ? cloneObj(val) : val
  }
  return newObj
}

// 获取不带后缀的文件名
function getFileNameWithOutExt(text) {
  const json = text.split('.')
  return text.replace(`.${json[json.length - 1]}`, '')
}

// 检查ip+port是否合法
function checkIpPort(ip) {
  const re = /^(\d+)\.(\d+)\.(\d+)\.(\d+):(\d{3,4})$/ // 正则表达式
  if (re.test(ip)) {
    if (
      RegExp.$1 < 256 &&
      RegExp.$2 < 256 &&
      RegExp.$3 < 256 &&
      RegExp.$4 < 256
    ) {
      return true
    }
  }
  return false
}

// 获取合法命名
function getLegalName(text = '', re = '') {
  if (text.length === 0) return text
  let res = text.trim()
  res = res.replace(/^[\d+|_+|@|#]+/, '') // 去掉字符串首部命名不合法
  res = res.replace(/^[^a-zA-Z]+/, '') // 去掉字符串首部命名不合法
  if (re) {
    res = res.replace(re, '')
  } else {
    res = res.replace(
      /\^|\.|\*|\?|!|\/|\\|\$|&|\||,|\[|]|{|}|\(|\)|\+|=|——|《|》|<|>|\/|\s|:|;|,|。|，|？|【|】|「|」|·|`|‘|’|“|0”|%/g,
      '',
    )
  }
  return res
}

// 检查命名是否合法
function isLegalName(text = '', language = 'CN') {
  if (text.length === 0) {
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_EMPTY,
    }
  }
  // const pattern1 = new RegExp(
  //   "^[0-9`_~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+～·《》\\s-¥œ∑´†¥¨ˆπ“‘åß∂ƒ˙∆˚¬…æ«Ω≈√∫˜µ≤≥µ≠–ºª•¶§∞¢£™¡]",
  // )
  // const pattern2 = new RegExp(
  //   "[`~!$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+～·《》\\s¥œ∑´†¥¨ˆπ“‘åß∂ƒ˙∆˚¬…æ«Ω≈√∫˜µ≤≥µ≠–ºª•¶§∞¢£™¡]",
  // )
  // const emojiPattern = new RegExp(
  //   // eslint-disable-next-line no-control-regex
  //   '/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|[\uD800-\uDBFF]|[\uDC00-\uDFFF]|[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g',
  // )
  
  const pattern1 = /^[a-zA-Z\u4e00-\u9fa5一-龠ぁ-んァ-ヴーàâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇÖŞİĞçöşığ]/ // 判断首字母
  const pattern2 = /^[ #_@0-9a-zA-Z_\u4e00-\u9fa5一-龠ぁ-んァ-ヴーء-ي٠-٩àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇÖŞİĞçöşığ]+$/
  if (!pattern1.test(text[0])) {
    // 判断首字母
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_START_WITH_A_LETTER,
    }
  }
  if (!pattern2.test(text)) {
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_ILLEGAL_CHARACTERS,
    }
  }
  return {
    result: true,
  }
}

function isLegalURL(URL, language = GLOBAL.language) {
  const str = URL
  const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
  const objExp = new RegExp(Expression)

  if (!objExp.test(str)) {
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_INVALID_URL,
    }
  }

  return {
    result: true,
  }
}

/**
 * 检查是否为合法的url
 */
function checkUrl(text, checkProtocal = true) {
  let error = ''
  let pattern
  if(checkProtocal) {
    pattern = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  } else{
    pattern = /[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  }
  if(!pattern.test(text)) {
    error = getLanguage().Prompt.ERROR_INFO_INVALID_URL
  }
  return error
}

/**
 * 处理url中含有/../的路径问题
 * @param {*} url 
 * @returns 
 */
function dealUrl(url = '') {
  try {
    if (url === '') return url
    let index = 0
    while((index = url.indexOf('/../')) > 0){
      url = url.substr(0, url.substr(0, index).lastIndexOf('/') + 1) + url.substr(index + 4)
    }
    return url
  } catch (e) {
    // eslint-disable-next-line no-console
    __DEV__ && console.warn(e)
    return url
  }
}


/**
 * 检查是否为合法的在线3维场景服务地址
 * 格式： http://192.168.11.117:8090/iserver/services/3D-pipe3D/rest/realspace/scenes/pipe3D
 */
function checkOnline3DServiceUrl(text) {
  let error = ''
  error = checkUrl(text, false)
  if(error === '') {
    const pattern = /(.+\/rest\/realspace)\/scenes\/(.+)/
    if(!pattern.test(text)) {
      error = getLanguage().Profile.INVALID_SERVER_ADDRESS
    }
  }

  return error
}

function getNameByURL(str) {
  let idx = str.lastIndexOf('/')
  idx = idx > -1 ? idx : str.lastIndexOf('\\')
  if (idx < 0) {
    return str
  }
  const file = str.substring(idx + 1)
  const arr = file.split('.')
  return arr[0]
}

/**
 * xml转js对象
 * @param {*} xml
 */
async function xml2js(xml) {
  const promise = await new Promise((resolve, reject) => {
    const parser = new Parser({ explicitArray: false })

    parser.parseString(xml, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
  return promise
}

/**
 * 数据深拷贝
 * @param obj
 * @param hash
 * @returns {*}
 */
function deepClone(obj, hash = new WeakMap()) {
  if (!isObject(obj) || typeof obj === 'function') {
    return obj
  }
  if (typeof o === 'object' && Object.keys(obj).length === 0) {
    if (obj instanceof Array) {
      return []
    }
    return {}
  }
  // 查表
  if (hash.has(obj)) return hash.get(obj)

  let isArray = Array.isArray(obj)
  let cloneObj = isArray ? [] : {}
  // 哈希表设值
  hash.set(obj, cloneObj)

  let result = Object.keys(obj).map(key => {
    return {
      [key]: deepClone(obj[key], hash),
    }
  })
  return Object.assign(cloneObj, ...result)
}

function isObject(o) {
  return (typeof o === 'object' || typeof o === 'function') && o !== null
}

async function getAvailableFileName(path, name, ext) {
  let result = await FileTools.fileIsExist(path)
  if (!result) {
    await FileTools.createDirectory(path)
  }
  let _ext = ''
  if (ext) {
    _ext = '.' + ext
  }
  let availableName = name + _ext
  if (await FileTools.fileIsExist(path + '/' + availableName)) {
    for (let i = 1; ; i++) {
      availableName = name + '_' + i + _ext
      if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
        return availableName
      }
    }
  } else {
    return availableName
  }
}

/**
 * 获取url中指定参数
 * @param {*} url
 * @param {*} key
 * @returns string
 */
function getUrlQueryVariable(url, key) {
  let varStr = url.split("?")[1]
  let vars = varStr.split("&")
  for (const item of vars) {
    let pair = item.split("=")
    if(pair[0] == key) {
      return pair[1]
    }
  }
  return ''
}

export default {
  sortByPinYin,
  pySegSort,
  formatPhone,
  checkMobile,
  CheckTel,
  getType,
  colorRgba,
  colorHex,
  ChineseToNumber,
  NumberWithThousandSep,
  checkColor,
  angleTransfer,
  swapArray,
  cloneObj,
  getFileNameWithOutExt,
  checkIpPort,
  getLegalName,
  getAvailableFileName,

  isLegalName,
  isLegalURL,
  dealUrl,

  getNameByURL,
  xml2js,

  deepClone,

  getUrlQueryVariable,

  checkOnline3DServiceUrl,
}
