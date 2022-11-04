const route01 = require("./route01.json")
const route02 = require("./route02.json")
const route03 = require("./route03.json")

const routes = {
  route01,
  route02,
  route03,
}

function getRoute(): typeof routes {
  return routes
}

export {
  getRoute
}