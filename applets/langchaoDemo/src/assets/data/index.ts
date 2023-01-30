
const contryCode = require('./countryCode.json')

const jsonData = {
  contryCode,
}

function getJson(): typeof jsonData {
  return jsonData
}

/********************** html资源 **********************/

const LangchaoUserPrivacyPolicy_CN = require("./LangchaoUserPrivacyPolicy_CN.html")
const LangchaoUserPrivacyPolicy_EN = require("./LangchaoUserPrivacyPolicy_EN.html")

const htmlData = {
  LangchaoUserPrivacyPolicy_CN,
  LangchaoUserPrivacyPolicy_EN,
}

function getHtml(): typeof htmlData {
  return htmlData
}

export {
  getJson,
  getHtml,
}