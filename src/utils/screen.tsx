import { Dimensions, PixelRatio, Platform, NativeModules } from 'react-native'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'
import Orientation, { orientation as orientationType, specificOrientation } from 'react-native-orientation'
import { DeviceUtils } from 'imobile_for_reactnative'

export type OrientationType = orientationType | specificOrientation

const defaultPixel = PixelRatio.get() // iphone6的像素密度
const dp2px = (dp: number) => PixelRatio.getPixelSizeForLayoutSize(dp) // DP to PX
const px2dp = (px: number) => PixelRatio.roundToNearestPixel(px) // PX to DP
let deviceWidth = getScreenWidth() // Dimensions.get('window').width //设备的宽度
let deviceHeight = getScreenHeight() // Dimensions.get('window').height //设备的高度
let deviceSafeHeight = getScreenSafeHeight() // 设备安全高度
// const defaultPixel = 2.25
// const fontScale = PixelRatio.getFontScale()

/** 是否有虚拟按键 Android */
let hasNavigationBar = false
/** 虚拟按键高度 Android */
let navigationBarHeight = 0

/**
 * 记录是否有虚拟按键
 * @param has
 */
function setHasNavigationBar(has: boolean) {
  hasNavigationBar = has
}

/**
 * 获取是否有虚拟按键
 * @returns
 */
function getHasNavigationBar() {
  return hasNavigationBar
}

/**
 * 记录虚拟按键高度
 * @param height
 */
function setNavigationBarHeight(height: number) {
  navigationBarHeight = height
}

/**
 * 获取虚拟按键高度
 * @returns
 */
function getNavigationBarHeight() {
  return navigationBarHeight
}

const screenWidth = Math.min(
  Dimensions.get('window').width,
  Dimensions.get('window').height,
)

// eslint-disable-next-line no-unused-vars
const screenHeight = Math.max(
  Dimensions.get('window').width,
  Dimensions.get('window').height,
)

/**
 * 适配宽度 392.72dp 设备的大小
 *
 * 其他大小设备按宽度等比缩放
 */
export function dp(size: number) {
  return size * getDpRatio()
}

function getDpRatio() {
  //TODO 范围有待调整
  if(screenWidth < 500) {
    return screenWidth / 392.72
  }
  if(screenWidth < 1000) {
    return 1.25
  }
  return 1.36
}

function getScreenWidth(orientation?: OrientationType): number {
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
function getScreenHeight(orientation?: OrientationType): number {
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
    const deviceScreenHeight = Math.max(
      Dimensions.get('screen').height,
      Dimensions.get('screen').width,
    )
    // 第一次用window获取的高度有可能和screen相等,导致底部虚拟按钮高度和状态栏高度倍计算到window的height中,需要减去
    if (deviceScreenHeight === deviceHeight) {
      // 减去状态栏高度,若有虚拟按键,则继续减去虚拟按钮高度
      deviceHeight -= NativeModules.StatusBarManager.HEIGHT + (hasNavigationBar ? navigationBarHeight : 0)
    }
  }
  return deviceHeight
}
function getScreenSafeHeight(orientation?: OrientationType): number {
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
    const screenHeight = Math.max(
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

function getScreenSafeWidth(orientation?: OrientationType): number {
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
    ratio = parseFloat((Math.max(deviceHeight, deviceWidth) / 1000.0).toFixed(2))
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
let scale = 1 // 获取缩放比例
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
export function scaleSize(size: number) {
  size = Math.round(size * 0.7 * getRatio())
  return size
}

export function fixedSize(size: number) {
  size = (size * scale) / defaultPixel
  return size
}

export function setSpText(size: number) {
  size = size * (Platform.OS === 'ios' ? 0.8 : 0.7) * getRatio()
  return size
}

export function fixedText(size: number) {
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
const X_BOTTOM_L = 20

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

let orientation: OrientationType | '' = ''
function setOrientation(o: OrientationType) {
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
function getIphonePaddingTop(orientation?: OrientationType): number {
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
function getIphonePaddingBottom(orientation?: OrientationType): number {
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
function getIphonePaddingHorizontal(orientation?: OrientationType): {
  paddingLeft: number,
  paddingRight: number,
} {
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

export function px(size: number) {
  return size / defaultPixel
}

/**
 * 计算地图右侧弹出非全屏页面的宽度
 * @param orientation
 * @returns {*}
 */
export function getMapChildPageWith(orientation?: OrientationType): number {
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
    if (!global.isPad && ration < 1.8) {
      width *= 0.6
    }
  }
  return width
}

const HEADER_HEIGHT = scaleSize(100)
const HEADER_HEIGHT_LANDSCAPE = scaleSize(60)
function getHeaderHeight(orientation?: OrientationType): number {
  let height = HEADER_HEIGHT
  orientation = orientation || getOrientation()
  if (orientation.indexOf('LANDSCAPE') === 0) {
    height = HEADER_HEIGHT_LANDSCAPE
  }
  return height + getIphonePaddingTop(orientation)
}

/************************************************* 屏幕锁定 ******************************************************/
let lockOrientation: OrientationType | '' = ''
/**
 * 锁定屏幕方向
 * @param orientation 屏幕方向
 */
function lockScreen(orientation: OrientationType) {
  lockOrientation = orientation
}
/**
 * 解锁屏幕方向
 */
function unLockScreen() {
  lockOrientation = ''
}
/**
 * 获取屏幕方向
 */
function getLockScreen() {
  return lockOrientation
}

function lockToPortrait() {
  Orientation.lockToPortrait()
  lockOrientation = 'PORTRAIT'
}

function lockToLandscape() {
  Orientation.lockToLandscape()
  lockOrientation = 'LANDSCAPE'
}

function unlockAllOrientations() {
  Orientation.unlockAllOrientations()
  lockOrientation = ''
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
  X_BOTTOM_L,
  HEADER_HEIGHT,
  HEADER_HEIGHT_LANDSCAPE,
  isIphoneX,
  getIphonePaddingTop,
  getIphonePaddingBottom,
  getIphonePaddingHorizontal,
  getHeaderHeight,

  lockScreen,
  lockToLandscape,
  unLockScreen,
  getLockScreen,
  lockToPortrait,
  unlockAllOrientations,

  setHasNavigationBar,
  getHasNavigationBar,
  setNavigationBarHeight,
  getNavigationBarHeight,
}
