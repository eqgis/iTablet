import { StyleSheet, Platform } from 'react-native'
import { AppStyle, dp, scaleSize, setSpText } from '../../../../../../../utils'

export default StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  containerP: {
    borderTopLeftRadius: dp(40),
    borderTopRightRadius: dp(40),
  },
  headerBtnTitle: {
    color: AppStyle.Color.BLACK,
    fontSize: 17,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: dp(13),
    paddingHorizontal: dp(40),
    width: '100%',
    height: dp(80),
  },
  btn: {
    height: dp(40),
    borderRadius: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btn1: {
    width: dp(62),
    backgroundColor: AppStyle.Color.Button_Dark,
  },
  btn2: {
    flex: 1,
    marginLeft: dp(16),
    backgroundColor: AppStyle.Color.Button_Gray,
  },
  text1: {
    color: AppStyle.Color.WHITE,
    fontSize: setSpText(24),
  },
  text2: {
    color: AppStyle.Color.WHITE,
    fontSize: setSpText(24),
  },
  rows: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: scaleSize(60),
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
    color: AppStyle.Color.Text_Light,
    fontSize: setSpText(24),
  },
  customRightStyle: {
    flex: 1,
    height: scaleSize(72),
    borderRadius: scaleSize(20),
    backgroundColor: AppStyle.Color.LIGHT_WIHTE,
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
    color: AppStyle.Color.BLUE,
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
    fontSize: setSpText(24),
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
    width: '100%',
    flexDirection: 'column',
  },
  typeView: {
    width: dp(72),
    height: dp(28),
    borderRadius: dp(12),
    borderColor: AppStyle.Color.LIGHT_WIHTE,
    borderWidth: scaleSize(2),
    backgroundColor: AppStyle.Color.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(8),
  },
  typeText: {
    fontSize: setSpText(22),
    color: AppStyle.Color.Text_Light,
  },
})
