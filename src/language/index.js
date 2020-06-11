global.language = 'CN'
global.APP_VERSION = 'V3.1.1_20200518'
function getLanguage(param) {
  let language = {}
  switch (param) {
    case 'CN':
      language = require('./CN/index').default
      break
    case 'TR':
      language = require('./TR/index').default
      break
    case 'JA':
      language = require('./JA/index').default
      break
    case 'FR':
      language = require('./FR/index').default
      break
    case 'AR':
      language = require('./AR/index').default
      break
    case 'EN':
    default:
      language = require('./EN/index').default
      break
  }
  return language
}

export { getLanguage }
