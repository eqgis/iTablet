import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize, setSpText } from '../../../../utils'
export const MAX_VISIBLE_NUMBER = 5 // 显示的最大个数

export const ITEM_VIEW_HEIGHT_P = scaleSize(100) // 竖屏时高度
export const INDICATOR_VIEW_SIZE = scaleSize(50) // 箭头高宽尺寸
export const MAX_HEIGHT_P =
  ITEM_VIEW_HEIGHT_P * MAX_VISIBLE_NUMBER + INDICATOR_VIEW_SIZE * 2

export default StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
    height: '100%',
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: size.fontSize.fontSizeXXl,
  },
  headerBtnTitleDisable: {
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXXl,
  },
  tabView: {
    height: scaleSize(80),
  },

  topView: {
    flexDirection: 'column',
  },
  checkView: {
    flexDirection: 'row',
    height: scaleSize(60),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: scaleSize(30),
  },
  checkTips: {
    marginLeft: scaleSize(10),
    fontSize: size.fontSize.fontSizeSm,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  subTitleView: {
    flexDirection: 'row',
    height: scaleSize(60),
    marginTop: scaleSize(8),
    marginHorizontal: scaleSize(30),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  btnsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(50),
    height: scaleSize(80),
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  leftWrap: {
    flex: 1,
    height: scaleSize(60),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#rgba(240, 240, 240 ,0)',
  },
  rightItem: {
    flex: 1,
    width: '100%',
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeSm,
    color: color.fontColorBlack,
  },
  item: {
    width: '100%',
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  title: {
    fontSize: scaleSize(24),
    marginLeft: 15,
  },
  detalItemView: {
    // height: scaleSize(300),
    backgroundColor: color.content_white,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  detalItemHeaderView: {
    flexDirection: 'row',
    height: scaleSize(60),
    marginHorizontal: scaleSize(30),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detalSubItemView: {
    flexDirection: 'row',
    height: scaleSize(60),
    marginHorizontal: scaleSize(30),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lineStyle: {
    height: 1,
    width: '100%',
    backgroundColor: color.background,
  },
  lineSubStyle: {
    height: 1,
    width: '100%',
    marginLeft: scaleSize(30),
    backgroundColor: color.background,
  },
  textStyle: {
    fontSize: scaleSize(24),
    width: scaleSize(120),
  },
  textInputStyle: {
    flex: 1,
    height: scaleSize(60),
    marginLeft: scaleSize(30),
    fontSize: scaleSize(24),
    padding: 0,
  },

  clickHintView: {
    position: 'absolute',
    flexDirection: 'column',
    height: scaleSize(45),
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    top: scaleSize(10),
    right: scaleSize(10),
  },
  clickHintText: {
    height: scaleSize(45),
    minWidth: scaleSize(300),
    fontSize: setSpText(25),
    // backgroundColor: '#rgba(45, 45, 47, 0.8)',
    color: color.black,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'right',
    // borderRadius: scaleSize(5),
  },
  hidden: {
    position: 'absolute',
    left: -99999,
    height: '100%',
    width: '100%',
  },

  toolbarContainer: {
    position: 'absolute',
    top: '10%',
    right: scaleSize(20),
    backgroundColor: color.white,
    borderRadius: scaleSize(12),
    width: scaleSize(96),
    maxHeight: MAX_HEIGHT_P,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  btnViewP: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_VIEW_HEIGHT_P,
    backgroundColor: 'transparent',
  },
  btn: {
    paddingHorizontal: scaleSize(5),
    width: '100%',
  },
  btnImage: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
})
