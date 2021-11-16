import { Platform, StyleSheet } from 'react-native'
import { scaleSize, fixedSize } from '../../../../../../utils'
import { zIndexLevel, color, size } from '../../../../../../styles'

export default StyleSheet.create({
  headerBack: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    width: scaleSize(60),
    height: scaleSize(60),
  },
  headerRightBtn: {
    width: scaleSize(60),
    height: scaleSize(60),
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0.8)',
    zIndex: zIndexLevel.FOUR + 2,
  },
  preview: {
    marginTop: scaleSize(120),
    height: fixedSize(800),
    width: fixedSize(600),
    alignSelf: 'center',
    borderRadius: scaleSize(40),
    overflow: 'hidden',
  },
  detectBottomView: {
    position: 'absolute',
    bottom: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    left: '-50%',
    right: '-50%',
  },
  bottomBtnImg: {
    width: scaleSize(120),
    height: scaleSize(120),
    marginRight: 3,
  },
  previewBottom: {
    position: 'absolute',
    bottom: scaleSize(60),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    zIndex: zIndexLevel.FOUR + 3,
  },
  previewBottomContent: {
    flexDirection: 'row',
    height: fixedSize(120),
    width: fixedSize(600),
    paddingHorizontal: scaleSize(26),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(16),
    backgroundColor: 'white',
  },
  previewBottomLeftContent: {
    flex: 1,
    padding: scaleSize(16),
    flexDirection: 'column',
    alignContent: 'flex-start',
    justifyContent: 'center',
    // borderRadius: scaleSize(16),
    // backgroundColor: 'white',
  },
  previewBottomTitle: {
    color: color.black,
    fontSize: size.fontSize.fontSizeMd,
  },
  input: {
    flex: 1,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    fontSize: size.fontSize.fontSizeLg,
    borderBottomWidth: 1,
    borderBottomColor: '#BBBBBB',
  },
  confirmBtn: {
    height: scaleSize(80),
    width: scaleSize(140),
    backgroundColor: color.contentColorGray,
    borderRadius: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
})