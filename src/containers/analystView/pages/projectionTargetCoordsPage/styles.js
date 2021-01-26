import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
    height: '100%',
  },
  subContainer: {
    marginTop: scaleSize(30),
    flexDirection: 'column',
    backgroundColor: color.white,
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: size.fontSize.fontSizeXXl,
  },
  headerBtnTitleDisable: {
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXXl,
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
  item: {
    width: '100%',
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  titleView: {
    height: scaleSize(60),
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleSize(24),
    marginLeft: scaleSize(30),
    color: color.gray,
  },
  lineStyle: {
    width: '100%',
    height: 1,
    marginLeft: scaleSize(30),
    backgroundColor: color.background,
  },
  leftWrap: {
    flex: 1,
    // height: scaleSize(60),
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  rightItem: {
    width: scaleSize(300),
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  rightText: {
    width: '100%',
    marginLeft: scaleSize(30),
    marginRight: scaleSize(30),
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  tipText: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeSm,
    color: color.fontColorGray2,
  },
})
