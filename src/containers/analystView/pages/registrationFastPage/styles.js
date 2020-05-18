import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
    height: '100%',
  },
  headerBtnTitle: {
    color: 'white',
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

  leftWrap: {
    flex: 1,
    height: scaleSize(26),
    color: color.black,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeSm,
    marginLeft: scaleSize(15),
    backgroundColor: color.content_white,
  },
  rightItem: {
    flex: 1,
    width: '100%',
    textAlign: 'center',
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
    marginLeft: scaleSize(15),
  },
  lineStyle: {
    width: '100%',
    height: 1,
    marginLeft: scaleSize(20),
    backgroundColor: color.background,
  },
  textOriginalStyle: {
    flex: 1,
    height: scaleSize(26),
    color: color.black,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeSm,
    marginLeft: scaleSize(15),
    backgroundColor: color.content_white,
  },
  textOriginalStyle2: {
    flex: 1,
    height: scaleSize(52),
    color: color.black,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeSm,
    marginLeft: scaleSize(15),
    backgroundColor: color.content_white,
  },
  selectionImg: {
    width: scaleSize(20),
    height: scaleSize(8),
    marginRight: scaleSize(20),
  },
  parameterView: {
    // height:scaleSize(60),
    marginTop: scaleSize(20),
    backgroundColor: color.content_white,
  },
  parameterHeaderTextView: {
    height: scaleSize(60),
    marginLeft: scaleSize(20),
    justifyContent: 'center',
  },
  parameterTextView: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.gray,
  },
  parameterSubitem: {
    width: '70%',
    height: scaleSize(80),
    paddingRight: scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  parameterItem: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
    paddingLeft: scaleSize(20),
  },
  parameterItemTitleText: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.black,
  },
  parameterItemText: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.gray,
  },
  arithmeticText: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.black,
  },
  arithmeticItemView: {
    height: scaleSize(60),
    marginLeft: scaleSize(30),
    justifyContent: 'center',
  },
})
