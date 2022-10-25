import { StyleSheet, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  containerP: {
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: 17,
  },
  btns: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(30),
    paddingHorizontal: scaleSize(60),
    width: '100%',
  },
  btn: {
    height: scaleSize(80),
    width: '100%',
    borderRadius: scaleSize(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn1: {
    backgroundColor: color.itemColorGray,
  },
  btn2: {
    marginTop: scaleSize(32),
    borderColor: color.itemColorGray,
    borderWidth: scaleSize(2),
    backgroundColor: color.white,
  },
  text1: {
    color: color.white,
    fontSize: size.fontSize.fontSizeLg,
  },
  text2: {
    color: color.itemColorGray,
    fontSize: size.fontSize.fontSizeLg,
  },
  rows: {
    flex: 1,
    flexDirection: 'column',
    // marginHorizontal: scaleSize(60),
    marginLeft: scaleSize(60),
    paddingRight: scaleSize(60),
    backgroundColor: 'transparent',
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: scaleSize(60),
    backgroundColor: 'transparent',
  },
  titleStyle: {
    width: scaleSize(86),
    textAlign: 'left',
    color: color.contentColorGray,
    fontSize: size.fontSize.fontSizeLg,
  },
  customRightStyle: {
    flex: 1,
    height: scaleSize(72),
    borderRadius: scaleSize(20),
    backgroundColor: color.bgG2,
  },
  disableStyle: {
    borderRadius: scaleSize(20),
    backgroundColor: 'transparent',
  },
  saveAndContinueImage: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  saveAndContinueView2: {
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveAndContinueText: {
    fontSize: setSpText(24),
    textAlign: 'center',
    color: color.blue2,
  },
  input: {
    height: scaleSize(50),
    paddingHorizontal: scaleSize(15),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
  },
  defaultValueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rowLabel: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'left',
  },
  inputOverLayer: {
    position: 'absolute',
    right: 1,
    top: 1,
    left: 1,
    bottom: 1,
    borderRadius: scaleSize(8),
    backgroundColor: '#rgba(0, 0, 0, 0.1)',
  },
  inputView: {
    flex: 2,
  },
  typeRows: {
    flex: 1,
    flexDirection: 'column',
  },
  typeView: {
    width: scaleSize(144),
    height: scaleSize(60),
    borderRadius: scaleSize(6),
    borderColor: color.bgG2,
    borderWidth: scaleSize(2),
    backgroundColor: color.w,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(8)
  },
  typeText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.contentColorGray,
  },
})
