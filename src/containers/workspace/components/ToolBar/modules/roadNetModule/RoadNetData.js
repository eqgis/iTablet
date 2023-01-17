/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SMap, SNavigation } from 'imobile_for_reactnative'

async function getData() {
  const data = await SNavigation.getAllNavData()
  return data
}

export default {
  getData,
}
