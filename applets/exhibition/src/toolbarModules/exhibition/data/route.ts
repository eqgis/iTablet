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


// 超人博士的录屏路线
const routev_0_11 = require("./routev_0_11.json")
const routev_0_12 = require("./routev_0_12.json")
const routev_0_13 = require("./routev_0_13.json")
const routev_0_21 = require("./routev_0_21.json")
const routev_0_22 = require("./routev_0_22.json")
const routev_0_23 = require("./routev_0_23.json")
const routev_0_31 = require("./routev_0_31.json")
const routev_0_32 = require("./routev_0_32.json")
const routev_0_33 = require("./routev_0_33.json")

// 博士学的录屏路线
const routev_1_11 = require("./routev_1_11.json")
const routev_1_12 = require("./routev_1_12.json")
const routev_1_13 = require("./routev_1_13.json")
const routev_1_21 = require("./routev_1_21.json")
const routev_1_22 = require("./routev_1_22.json")
const routev_1_23 = require("./routev_1_23.json")
const routev_1_31 = require("./routev_1_31.json")
const routev_1_32 = require("./routev_1_32.json")
const routev_1_33 = require("./routev_1_33.json")

// 博士学的打招呼
const doctorGreet0 = require("./doctorGreet0.json")
// 超人博士的打招呼
const doctorGreet1 = require("./doctorGreet1.json")

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

  routev_0_11,
  routev_0_12,
  routev_0_13,
  routev_0_21,
  routev_0_22,
  routev_0_23,
  routev_0_31,
  routev_0_32,
  routev_0_33,


  routev_1_11,
  routev_1_12,
  routev_1_13,
  routev_1_21,
  routev_1_22,
  routev_1_23,
  routev_1_31,
  routev_1_32,
  routev_1_33,

  doctorGreet0,
  doctorGreet1,
}

function getRoute(): typeof routes {
  return routes
}

export {
  getRoute
}