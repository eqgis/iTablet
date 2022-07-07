import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size, zIndexLevel } from '../../../../styles'
export default StyleSheet.create({
  dialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    marginTop: scaleSize(10),
    width: scaleSize(80),
    height: scaleSize(80),
    // opacity: 1,
  },
  dialogView: {
    width: scaleSize(600),
    backgroundColor: color.content_white,
  },
  promptView: {
    width: scaleSize(600),
    backgroundColor: color.content_white,
    // marginBottom: scaleSize(20),
    paddingTop: scaleSize(30),
    paddingBottom: scaleSize(50),
    paddingHorizontal: scaleSize(30),
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: zIndexLevel.FIVE,
  },
  promptTitle: {
    fontSize: size.fontSize.fontSizeLg,
    lineHeight: scaleSize(32),
    color: color.contentColorBlack,
    marginTop: scaleSize(5),
    marginHorizontal: scaleSize(30),
    textAlign: 'center',
  },
  promptContent: {
    width: '90%',
    fontSize: size.fontSize.fontSizeMd,
    lineHeight: scaleSize(32),
    color: color.contentColorBlack,
    marginTop: scaleSize(30),
    // marginHorizontal: scaleSize(30),
    textAlign: 'left',
  },
  promptTips: {
    width: '90%',
    fontSize: size.fontSize.fontSizeMd,
    lineHeight: scaleSize(32),
    color: color.fontColorGray3,
    marginTop: scaleSize(40),
    // marginHorizontal: scaleSize(30),
    textAlign: 'left',
  },
  dialogBackground: {
    height: scaleSize(250),
  },
  opacityView: {
    height: scaleSize(250),
  },
})
