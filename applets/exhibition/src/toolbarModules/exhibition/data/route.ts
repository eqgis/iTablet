const route01 = require("./route01.json")
const route02 = require("./route02.json")
const route03 = require("./route03.json")

const route11 = require("./route11.json")
const route12 = require("./route12.json")
const route13 = require("./route13.json")

const routes = {
  route01,
  route02,
  route03,
  route11,
  route12,
  route13,
}

function getRoute(): typeof routes {
  return routes
}

export {
  getRoute
}