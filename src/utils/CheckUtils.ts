import { getLanguage } from "../language"

/**
 * 返回合法小数的字符串
 * @param value 输入字符串
 */
export function formatFloat(value: string): string {
  value = value.replace(/[^[\d-]\d.]/g, '') //清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
  value = value
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
  if (value.indexOf('.') < 0 && value != '') {
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    return parseFloat(value) + ''
  } else if (value == '') {
    return '0'
  }
  return value
}

/** 通用检查输入错误的方法 */
function generalCheck(text: string): string {
  let error = ''
  if(text !== '') {
    const pattern1 = /^[a-zA-Z\u4e00-\u9fa5一-龠ぁ-んァ-ヴーàâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇÖŞİĞçöşığ]/ // 判断首字母
    const pattern2 = /^[ #_@0-9a-zA-Z_\u4e00-\u9fa5一-龠ぁ-んァ-ヴーء-ي٠-٩àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇÖŞİĞçöşığ]+$/
    if (!pattern1.test(text[0])) {
      error = getLanguage().ERROR_INFO_START_WITH_A_LETTER
    }
    if (!pattern2.test(text)) {
      error = getLanguage().ERROR_INFO_ILLEGAL_CHARACTERS
    }
  }

  return error
}

/**
 * 检查是否为合法的url
 */
function checkUrl(text: string, checkProtocal = true): string {
  let error = ''
  let pattern
  if(checkProtocal) {
    pattern = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  } else{
    pattern = /[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
  }
  if(!pattern.test(text)) {
    error = getLanguage().ERROR_INFO_INVALID_URL
  }
  return error
}



function defaultCheck(text: string): string {
  return generalCheck(text)
}

function checkLayerCaption(text: string): string {
  let error = ''
  //TODO 可根据具体情景实现具体的方法
  error = generalCheck(text)
  return error
}

/**
 * 检查是否为合法的在线3维服务地址
 * 格式： http://192.168.11.117:8090/iserver/services/3D-pipe3D/rest/realspace/scenes/pipe3D
 */
function checkOnline3DServiceUrl(text: string): string {
  let error = ''
  error = checkUrl(text, false)
  if(error === '') {
    const pattern = /(.+\/rest\/realspace)\/scenes\/(.+)/
    if(!pattern.test(text)) {
      error = getLanguage().INVALID_SERVER_ADDRESS
    }
  }

  return error
}

// 数字相关

//正数检查
function _checkPositveNumber(text: string): string {
  const value = Number(text)
  if(isNaN(value) || value <= 0) {
    return getLanguage().SHOULD_BE_POSITIVE_NUMBER
  }
  return ''
}

//整数检查
function _checkIntegerNumber(text: string): string {
  let error = ''

  const result = parseInt(text)
  if(isNaN(result) || text.indexOf('.') > -1) {
    error = getLanguage().SHOULD_BE_INTEGER
  }

  return error
}

//正整数检查
function _checkPositiveIntegerNumber(text: string): string {
  let error = ''
  error = _checkPositveNumber(text)
  if(error === '') {
    error = _checkIntegerNumber(text)
  }

  return error
}

//浮点数检查
function _checkFloatNumber(text: string): string {
  let error = ''

  const result = parseFloat(text)
  if(isNaN(result)) {
    error = getLanguage().SHOULD_BE_DECIMAL_FRACTION
  }

  return error
}

//正浮点数检查
function _checkPositveFloatNumber(text: string): string {
  let error = ''
  error = _checkPositveNumber(text)
  if(error === '') {
    error = _checkFloatNumber(text)
  }

  return error
}

/**
 * @param type 'positive' 是否为正数
 */
function checkFloat(type?:'positive'): (text: string) => string {
  if(type === 'positive') {
    return _checkPositveFloatNumber
  } else {
    return _checkFloatNumber
  }
}

function checkInteger(type?: 'positive'): (text: string) => string {
  if(type === 'positive') {
    return _checkPositiveIntegerNumber
  } else {
    return _checkIntegerNumber
  }
}


/** 输入检查方法 */
export const CheckSpell = {
  defaultCheck,
  /** 检查图层名 */
  checkLayerCaption,
  /** 检查是否为合法的在线3维服务地址 */
  checkOnline3DServiceUrl,
  /** 检查是否为合法浮点数 */
  checkFloat,
  /** 检查是否为合法整数 */
  checkInteger,
}