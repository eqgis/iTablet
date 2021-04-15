import { Dimensions, PixelRatio, ScaledSize } from 'react-native'

/** RN原本的单位 */
export function dp(size: number): number {
  return size
}

/** 像素 */
export function p(size: number): number {
  return PixelRatio.getPixelSizeForLayoutSize(size)
}

const dimension = Dimensions.get('screen')

/** 获取屏幕宽高 */
export function getScreenDimensions(): ScaledSize {
  return dimension
}