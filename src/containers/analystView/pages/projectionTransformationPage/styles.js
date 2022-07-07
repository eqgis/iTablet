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
})
