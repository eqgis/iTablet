import { StyleSheet, Platform } from 'react-native'
import { size, color } from '../../styles'
import { scaleSize } from '../../utils'

const ROW_HEIGHT = scaleSize(80)

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: size.fontSize.fontSizeXXl,
  },

  /** Check按钮 * */
  select: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: scaleSize(160),
  },
  selectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectImgView: {
    width: ROW_HEIGHT,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    backgroundColor: 'transparent',
  },

  /** 顶部视图 * */
  topView: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.bgW,
  },
  topLeftView: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    paddingLeft: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  topRightView: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    // paddingRight: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  topRightView2: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    // paddingRight: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  topText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  /** 列表item * */
  content: {
    marginLeft: scaleSize(40),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  downImg: {
    marginLeft: scaleSize(4),
    width: scaleSize(30),
    height: scaleSize(30),
  },
})
