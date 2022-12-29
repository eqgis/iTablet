import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export const MAX_VISIBLE_NUMBER = 5 // 显示的最大个数

export const BOTTOM_LANDSCAPE = scaleSize(26)
export const ITEM_VIEW_WIDTH_L = scaleSize(126)  // 横屏时宽度
export const ITEM_VIEW_HEIGHT_L = scaleSize(88)  // 横屏时高度
// export const ITEM_VIEW_WIDTH_P = scaleSize(88)  // 竖屏时高度
export const ITEM_VIEW_HEIGHT_P = scaleSize(100) // 竖屏时高度
export const INDICATOR_VIEW_SIZE = scaleSize(50) // 箭头高宽尺寸
export const PADDING_L = scaleSize(20) // 横屏时两边
// scaleSize(774) 横屏时最大宽度
export const MAX_WIDTH_L = ITEM_VIEW_WIDTH_L * MAX_VISIBLE_NUMBER + INDICATOR_VIEW_SIZE * 2 + PADDING_L * 2
export const MAX_HEIGHT_P = ITEM_VIEW_HEIGHT_P * MAX_VISIBLE_NUMBER + INDICATOR_VIEW_SIZE * 2

export default StyleSheet.create({
  containerP: {
    position: 'absolute',
    backgroundColor:  color.rightListBgColor, // color.white,
    borderRadius: scaleSize(12),
    width: scaleSize(96),
    maxHeight: MAX_HEIGHT_P,
  },
  containerL: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: color.rightListBgColor, // color.white,
    borderRadius: scaleSize(44),
    height: ITEM_VIEW_HEIGHT_L,
    maxWidth: MAX_WIDTH_L,
    paddingHorizontal: PADDING_L,
    alignItems: 'center',
    bottom: BOTTOM_LANDSCAPE,
  },
  containerShadow: {
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  separator: {
    marginTop: scaleSize(10),
  },
  btnViewP: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // height: ITEM_VIEW_HEIGHT_P,
    minHeight: ITEM_VIEW_HEIGHT_P,
    backgroundColor: 'transparent',
  },
  btnViewL: {
    flexDirection: 'column',
    height: ITEM_VIEW_HEIGHT_L,
    width: ITEM_VIEW_WIDTH_L,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    paddingHorizontal: scaleSize(5),
    width: '100%',
  },
  btnImage: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  indicatorViewP: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: INDICATOR_VIEW_SIZE,
    backgroundColor: 'transparent',
  },
  indicatorViewL: {
    alignItems: 'center',
    justifyContent: 'center',
    width: INDICATOR_VIEW_SIZE,
    height: INDICATOR_VIEW_SIZE,
    backgroundColor: 'transparent',
  },
  indicatorImageP: {
    height: scaleSize(24),
    width: '100%',
  },
  indicatorImageL: {
    height: '100%',
    width: scaleSize(24),
  },
  moreImageView: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImage: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  progress: {
    width: scaleSize(60),
    // width: scaleSize(18),
    height: 2,
    // position: 'absolute',
    // right: scaleSize(0),
    // left: scaleSize(0),
    // top: scaleSize(4),
    bottom: scaleSize(4),
    borderWidth: 0,
  },
  cornerMark: {
    position: 'absolute',
    right: scaleSize(0),
    top: scaleSize(0),
    width: scaleSize(32),
    height: scaleSize(32),
  },
})
