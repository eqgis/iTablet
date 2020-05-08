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
    marginLeft: scaleSize(30),
    fontSize: scaleSize(24),
    width: '100%',
  },
})
