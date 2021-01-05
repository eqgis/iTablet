interface OBJ {
  [name: string]: string,
}

interface LANGUAGE {
  [name: string]: OBJ,
}

function getLanguage(param: string): LANGUAGE {
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
