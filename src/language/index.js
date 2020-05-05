global.language = 'CN'
global.APP_VERSION = 'V3.1.0_20200323'
function getLanguage(param) {
  let language = {}
  switch (param) {
    case 'EN':
      language = require('./EN/index').default
      break
    case 'TR':
      language = require('./TR/index').default
      break
    case 'JA':
      language = require('./JA/index').default
      break
    case 'CN':
    default:
      language = require('./CN/index').default
      break
  }
  return language
}

export { getLanguage }
