/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SMap } from 'imobile_for_reactnative'

async function getData() {
  const data = await SMap.getAllNavData()
  return data
}

export default {
  getData,
}
