/* eslint-disable arrow-parens */
/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang Li
*/

import { Utility } from 'imobile_for_reactnative'
import ConstPath from '../constants/ConstPath'

async function readConfig() {
  const filePath = `${await Utility.appendingHomeDirectory(
    ConstPath.CustomerPath,
  )}mapinfo.txt`

  const strJson = await Utility.readFile(filePath)
  return JSON.parse(strJson)
}

async function getMapDatasource() {
  const filePath = `${await Utility.appendingHomeDirectory(
    ConstPath.CustomerPath,
  )}mapinfo.txt`

  const strJson = await Utility.readFile(filePath)
  const jsonInfo = JSON.parse(strJson)

  return jsonInfo.data[0].maps
}

async function saveMapInfo(configInfo, mapname, dataSources) {
  const filePath = `${await Utility.appendingHomeDirectory(
    ConstPath.CustomerPath,
  )}mapinfo.txt`

  const mapList = {
    mapName: `${mapname}.xml`,
    UDBName: dataSources,
    plot: ['TY.plot'],
  }
  configInfo.data[0].maps.push(mapList)
  const strJson = JSON.stringify(configInfo)
  Utility.writeFile(filePath, strJson)
}
async function updateMapInfo(configInfo) {
  const filePath = `${await Utility.appendingHomeDirectory(
    ConstPath.CustomerPath,
  )}mapinfo.txt`

  const strJson = JSON.stringify(configInfo)
  Utility.writeFile(filePath, strJson)
}
function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
}
export default {
  readConfig,
  getMapDatasource,
  updateMapInfo,
  saveMapInfo,
  isJSON,
}
