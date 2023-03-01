/**
 * MapView辅助工具类
 */
import { SMap, GeoStyle } from 'imobile_for_reactnative'
import { MapConstrolStyle } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { Platform } from 'react-native'

/**
 * 设置选择集样式
 * @param layerPath
 * @param geoStyle
 * @returns {Promise.<void>}
 */
async function setSelectionStyle(layerPath = '', geoStyle = null) {
  if (!geoStyle) {
    geoStyle = new GeoStyle()
    geoStyle.setFillForeColor(0, 255, 0, 0.5)
    geoStyle.setLineWidth(1)
    geoStyle.setLineColor(70, 128, 223)
    geoStyle.setMarkerHeight(1)
    geoStyle.setMarkerWidth(1)
    geoStyle.setMarkerSize(5)
    // geoStyle.setMarkerColor(255, 0, 0)
  }
  SMap.setLayerSelectionStyle(layerPath, geoStyle)
}

/** 点选（单选）选择集样式 */
async function setSingleSelectionStyle(layerPath = '') {
  const geoStyle = new GeoStyle()
  geoStyle.setFillOpaqueRate(0)
  geoStyle.setLineWidth(0.1)
  geoStyle.setLineColor(0, 0, 255)
  geoStyle.setMarkerSize(2.4)
  SMap.setLayerSelectionStyle(layerPath, geoStyle)
}

async function setDefaultMapControlStyle() {
  // const nodeStyle = new GeoStyle()
  // nodeStyle.setLineColor(0, 0, 0, 1)
  // nodeStyle.setMarkerSize(4)
  // nodeStyle.setMarkerStyle(34)
  const style:MapConstrolStyle = {
    // nodeStyle: JSON.stringify(nodeStyle),
    nodeColor: {r:220, g:0, b:0, a:1},
    nodeSize: 1,
    strokeColor: {r:0, g:0, b:180, a:1},
    strokeFillColor: {r:255, g:200, b:200, a:127 / 255.0},
    strokeWidth: 1,
  }


  return SMap.setMapControlStyle(style)
}

export default {
  setSelectionStyle,
  setSingleSelectionStyle,
  setDefaultMapControlStyle,
}
