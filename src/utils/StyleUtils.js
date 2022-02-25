/**
 * MapView辅助工具类
 */
import { SMap, GeoStyle } from 'imobile_for_reactnative'
import { Platform } from 'react-native'

/**
 * 设置选择集样式
 * @param layerPath
 * @param geoStyle
 * @returns {Promise.<void>}
 */
async function setSelectionStyle(layerPath = '', geoStyle) {
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
  SMap.setSelectionStyle(layerPath, geoStyle)
}

/** 点选（单选）选择集样式 */
async function setSingleSelectionStyle(layerPath = '') {
  const geoStyle = new GeoStyle()
  geoStyle.setFillOpaqueRate(0)
  geoStyle.setLineWidth(0.1)
  geoStyle.setLineColor(0, 0, 255)
  geoStyle.setMarkerSize(2.4)
  SMap.setSelectionStyle(layerPath, geoStyle)
}

async function setDefaultMapControlStyle() {
  const nodeStyle = new GeoStyle()
  nodeStyle.setFillForeColor(0, 0, 0, 1)
  nodeStyle.setLineWidth(1)
  nodeStyle.setLineColor(0, 0, 0)
  nodeStyle.setMarkerHeight(1)
  nodeStyle.setMarkerWidth(1)
  nodeStyle.setMarkerSize(5)
  // nodeStyle.setMarkerColor(0, 0, 0)

  let style = {
    nodeStyle: JSON.stringify(nodeStyle),
    nodeColor: [0, 0, 0, 1],
    nodeSize: 0.5,
    strokeColor: [84, 160, 240, 0],
    // strokeColor: [240, 160, 84, 0],
    // strokeColor: colorRgb2Hex(255, 0, 0, 1),
    strokeFillColor: [200, 200, 200, 127 / 255],
    strokeWidth: 1,
    objectColor: [0, 255, 255, 255],
    objectWidth: 1,
  }
  if (Platform.OS === 'android'){
    style = {
      nodeStyle: JSON.stringify(nodeStyle),
      nodeColor: [0, 0, 0, 1],
      nodeSize: 0.5,
      // strokeColor: [84, 160, 240, 0],
      strokeColor: [240, 160, 84, 0],
      // strokeColor: colorRgb2Hex(255, 0, 0, 1),
      strokeFillColor: [200, 200, 200, 127 / 255],
      strokeWidth: 1,
      objectColor: [0, 255, 255, 255],
      objectWidth: 1,
    }
  }

  return SMap.setMapControlStyle(style)
}

export default {
  setSelectionStyle,
  setSingleSelectionStyle,
  setDefaultMapControlStyle,
}
