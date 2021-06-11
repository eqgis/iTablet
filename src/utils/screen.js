import { Dimensions, PixelRatio, Platform } from 'react-native'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'

const defaultPixel = PixelRatio.get() // iphone6的像素密度
const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize(dp) // DP to PX
const px2dp = px => PixelRatio.roundToNearestPixel(px) // PX to DP
let deviceWidth = getScreenWidth() // Dimensions.get('window').width //设备的宽度
let deviceHeight = getScreenHeight() // Dimensions.get('window').height //设备的高度
let deviceSafeHeight // 设备安全高度
// const defaultPixel = 2.25
// const fontScale = PixelRatio.getFontScale()

/** RN原本的单位 */
export function dp(size) {
  return size
}

function getScreenWidth(orientation) {
  deviceWidth = Dimensions.get('window').width
  if (!orientation) return deviceWidth
  if (orientation.indexOf('LANDSCAPE') === 0) {
    deviceWidth = Math.max(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  } else if (orientation.indexOf('PORTRAIT') >= 0) {
    deviceWidth = Math.min(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  }
  return deviceWidth
}
function getScreenHeight(orientation) {
  deviceHeight = Dimensions.get('window').height
  if (!orientation) return deviceHeight
  if (orientation.indexOf('LANDSCAPE') === 0) {
    deviceHeight = Math.min(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  } else if (orientation.indexOf('PORTRAIT') >= 0) {
    deviceHeight = Math.max(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  }
  return deviceHeight
}
function getScreenSafeHeight(orientation) {
  if (Platform.OS === 'ios') {
    const _orientation = orientation || getOrientation()
    let paddings = 0
    if (isIphoneX() && _orientation.indexOf('PORTRAIT') >= 0) {
      paddings = X_BOTTOM + X_TOP
    }
    return getScreenHeight(orientation) - paddings
  }
  // let screenHeight = ExtraDimensions.getRealWindowHeight()
  if (!orientation) {
    deviceSafeHeight = ExtraDimensions.getRealWindowHeight()
  } else if (orientation.indexOf('LANDSCAPE') === 0) {
    deviceSafeHeight = Math.min(
      ExtraDimensions.getRealWindowHeight(),
      ExtraDimensions.getRealWindowWidth(),
    )
  } else if (orientation.indexOf('PORTRAIT') >= 0) {
    let screenHeight = Math.max(
      ExtraDimensions.getRealWindowHeight(),
      ExtraDimensions.getRealWindowWidth(),
    )
    deviceSafeHeight = screenHeight - ExtraDimensions.getStatusBarHeight()
  }
  // const temp = ExtraDimensions.getRealWindowWidth()
  // if (screenHeight < temp) {
  //   screenHeight = temp
  // }
  // deviceSafeHeight = screenHeight - ExtraDimensions.getStatusBarHeight()
  return deviceSafeHeight
}

function getScreenSafeWidth(orientation) {
  if (Platform.OS === 'ios') {
    const _orientation = orientation || getOrientation()
    let paddings = 0
    if (isIphoneX() && _orientation.indexOf('LANDSCAPE') >= 0) {
      paddings = X_TOP
    }
    return getScreenWidth(orientation) - paddings
  } else {
    return getScreenWidth(orientation)
  }
}

function getRatio() {
  const height = Math.max(deviceHeight, deviceWidth)
  let ratio
  if (height < 700) {
    ratio = 0.75
  } else if (height < 800) {
    ratio = 0.8
  } else if (height < 1000) {
    ratio = (Math.max(deviceHeight, deviceWidth) / 1000.0).toFixed(2)
  } else {
    ratio = 1
  }
  return ratio
}
// px转换成dp
// let w2 = deviceWidth > 320 ? 720 / defaultPixel : 634 / defaultPixel
// let h2 = deviceWidth > 320 ? 1080 / defaultPixel : 1134 / defaultPixel
const w2 = 610 / defaultPixel
const h2 = 1080 / defaultPixel
let scale // 获取缩放比例
if (deviceWidth > deviceHeight) {
  scale = Math.min(deviceHeight / w2, deviceWidth / h2)
} else {
  scale = Math.min(deviceHeight / h2, deviceWidth / w2)
}

/**
 * 设置尺寸的大小
 * @param size: 单位：px （720*1080为模板标记的原始像素值）
 * return number dp
 */
export function scaleSize(size) {
  size = Math.round(size * 0.7 * getRatio())
  return size
}

export function fixedSize(size) {
  size = (size * scale) / defaultPixel
  return size
}

export function setSpText(size) {
  size = size * (Platform.OS === 'ios' ? 0.8 : 0.7) * getRatio()
  return size
}

export function fixedText(size) {
  // size = Math.round(((size * scale + 0.5) * pixelRatio) / fontScale)
  size = Math.round(size * scale + 0.5)
  // if (Platform.OS === 'ios') {
  //   return (size * 1.25) / defaultPixel
  // }
  return size / defaultPixel
}

// iPhoneX
const X_WIDTH = 375
const X_HEIGHT = 812
const IOS_TOP = 20
const X_TOP = 35
const X_BOTTOM = 35

function isIphoneX() {
  if (Platform.OS === 'ios') {
    const { isPad } = Platform
    if (!isPad) {
      const h = getScreenHeight()
      const w = getScreenWidth()
      if (Math.min(w, h) >= X_WIDTH && Math.max(w, h) >= X_HEIGHT) {
        return true
      }
    }
  }

  return false
}

let orientation = ''
function setOrientation(o) {
  if (o) {
    orientation = o
  }
}

function getOrientation() {
  if (orientation === '') {
    return getScreenHeight() > getScreenWidth() ? 'PORTRAIT' : 'LANDSCAPE'
  }
  return orientation
}

/**
 * 获取iphone和iphone X顶部距离
 * @returns {number}
 */
function getIphonePaddingTop(orientation) {
  let paddingTop = 0
  if (Platform.OS === 'android') {
    return paddingTop
  }
  const _orientation = orientation || getOrientation()
  if (_orientation.indexOf('PORTRAIT') < 0) return paddingTop
  if (isIphoneX()) {
    // paddingTop = X_TOP
  } else if (Platform.OS === 'ios') {
    paddingTop = IOS_TOP
  }
  return paddingTop
}

/**
 * 获取iphone和iphone X底部距离
 * @returns {number}
 */
function getIphonePaddingBottom(orientation) {
  let paddingBottom = 0
  if (Platform.OS === 'android') {
    return paddingBottom
  }
  const _orientation = orientation || getOrientation()
  if (isIphoneX() && _orientation.indexOf('PORTRAIT') >= 0) {
    paddingBottom = X_BOTTOM
  }
  return paddingBottom
}

/**
 * 获取iphone和iphone X左右距离
 * @returns {object}
 */
function getIphonePaddingHorizontal(orientation) {
  const paddingHorizontal = {
    paddingLeft: 0,
    paddingRight: 0,
  }
  if (!orientation || Platform.OS !== 'ios') return paddingHorizontal
  if (isIphoneX() && orientation === 'LANDSCAPE-LEFT') {
    paddingHorizontal.paddingLeft = X_TOP
    // paddingHorizontal.paddingRight = 34
  } else if (isIphoneX() && orientation === 'LANDSCAPE-RIGHT') {
    // paddingHorizontal.paddingLeft = 34
    paddingHorizontal.paddingRight = X_TOP
  }
  return paddingHorizontal
}

export function px(size) {
  return size / defaultPixel
}

/**
 * 计算地图右侧弹出非全屏页面的宽度
 * @param orientation
 * @returns {*}
 */
export function getMapChildPageWith(orientation) {
  let { width } = Dimensions.get('screen')
  orientation = orientation || getOrientation()
  const _height = Math.max(
    Dimensions.get('screen').height,
    Dimensions.get('screen').width,
  )
  const _width = Math.min(
    Dimensions.get('screen').height,
    Dimensions.get('screen').width,
  )
  const ration = _height / _width
  if (orientation.indexOf('LANDSCAPE') === 0) {
    width *= 0.45
    if (!GLOBAL.isPad && ration < 1.8) {
      width *= 0.6
    }
  }
  return width
}

const HEADER_HEIGHT = scaleSize(100)
const HEADER_HEIGHT_LANDSCAPE = scaleSize(60)
function getHeaderHeight(orientation) {
  let height = HEADER_HEIGHT
  orientation = orientation || getOrientation()
  if (orientation.indexOf('LANDSCAPE') === 0) {
    height = HEADER_HEIGHT_LANDSCAPE
  }
  return height + getIphonePaddingTop(orientation)
}

export default {
  dp,
  getScreenWidth,
  getScreenHeight,
  getScreenSafeHeight,
  getScreenSafeWidth,
  setOrientation,
  getOrientation,
  deviceWidth,
  deviceHeight,
  px2dp,
  dp2px,
  getMapChildPageWith,

  IOS_TOP,
  X_TOP,
  X_BOTTOM,
  HEADER_HEIGHT,
  HEADER_HEIGHT_LANDSCAPE,
  isIphoneX,
  getIphonePaddingTop,
  getIphonePaddingBottom,
  getIphonePaddingHorizontal,
  getHeaderHeight,
}
