// 超人博士的路线
const route0_11 = require("./route0_11.json")
const route0_12 = require("./route0_12.json")
const route0_13 = require("./route0_13.json")
const route0_21 = require("./route0_21.json")
const route0_23 = require("./route0_23.json")
const route0_31 = require("./route0_31.json")
const route0_32 = require("./route0_32.json")

// 博士学的路线
const route11 = require("./route11.json")
const route12 = require("./route12.json")
const route13 = require("./route13.json")

const routes = {
  route0_11,
  route0_12,
  route0_13,
  route0_21,
  route0_23,
  route0_31,
  route0_32,

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