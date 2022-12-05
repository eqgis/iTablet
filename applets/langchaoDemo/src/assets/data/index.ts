
const contryCode = require('./countryCode.json')

const jsonData = {
  contryCode,
}

function getJson(): typeof jsonData {
  return jsonData
}

export {
  getJson
}