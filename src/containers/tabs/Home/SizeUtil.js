import { Platform } from 'react-native'
import { fixedSize } from '../../../utils'

const itemWidth_P_PAD = fixedSize(360)
const itemHeight_P_PAD = fixedSize(150)
const itemWidth_L_PAD = fixedSize(160)
const itemHeight_L_PAD = fixedSize(240)
const imageSize_PAD = fixedSize(68)
const starImageSize_PAD = fixedSize(28)

const itemWidth_P = fixedSize(256)
const itemHeight_P = fixedSize(180)
const itemWidth_L = fixedSize(210)
const itemHeight_L = fixedSize(200)
const imageSize = fixedSize(88)
const starImageSize = fixedSize(36)

const itemGap = fixedSize(20)

function getItemWidth(orientation, isPad = false) {
  let value
  if (orientation.indexOf('LANDSCAPE') >= 0) {
    value = isPad ? itemWidth_L_PAD : itemWidth_L
  } else {
    // Android Pad横竖屏比例和iOS Pad不一样
    value = isPad
      ? Platform.OS === 'android'
        ? itemWidth_P_PAD - fixedSize(66)
        : itemWidth_P_PAD
      : itemWidth_P
  }
  return value
}

function getItemHeight(orientation, isPad = false) {
  let value
  if (orientation.indexOf('LANDSCAPE') >= 0) {
    value = isPad ? itemHeight_L_PAD : itemHeight_L
  } else {
    value = isPad ? itemHeight_P_PAD : itemHeight_P
  }
  return value
}

function getImageSize(isPad = false) {
  return isPad ? imageSize_PAD : imageSize
}

function getStarImageSize(isPad = false) {
  return isPad ? starImageSize_PAD : starImageSize
}

function getItemGap() {
  return itemGap
}

export default {
  getItemWidth,
  getItemHeight,
  getImageSize,
  getStarImageSize,
  getItemGap,
}
