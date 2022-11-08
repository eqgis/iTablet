// 超人博士的路线
const route0_11 = require("./route0_11.json")
const route0_12 = require("./route0_12.json")
const route0_13 = require("./route0_13.json")
const route0_21 = require("./route0_21.json")
const route0_23 = require("./route0_23.json")
const route0_31 = require("./route0_31.json")
const route0_32 = require("./route0_32.json")

// 博士学的路线
const route1_11 = require("./route1_11.json")
const route1_12 = require("./route1_12.json")
const route1_13 = require("./route1_13.json")
const route1_21 = require("./route1_21.json")
const route1_23 = require("./route1_23.json")
const route1_31 = require("./route1_31.json")
const route1_32 = require("./route1_32.json")

const routes = {
  route0_11,
  route0_12,
  route0_13,
  route0_21,
  route0_23,
  route0_31,
  route0_32,

  route1_11,
  route1_12,
  route1_13,
  route1_21,
  route1_23,
  route1_31,
  route1_32,
}

function getRoute(): typeof routes {
  return routes
}

export {
  getRoute
}