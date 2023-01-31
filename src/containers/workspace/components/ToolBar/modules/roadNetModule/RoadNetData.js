/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SNavigationInner } from "imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner"

async function getData() {
  const data = await SNavigationInner.getAllNavData()
  return data
}

export default {
  getData,
}
