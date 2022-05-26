import { StyleSheet } from 'react-native'
import { scaleSize, AppStyle, dp } from '../../../../../../../utils'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppStyle.Color.WHITE,
    paddingVertical: scaleSize(26),
    width: '100%',
  },
  rightList: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(40),
  },
  rightScrollList: {
    paddingHorizontal: scaleSize(40),
  },
  imgBtn: {
    flexDirection: 'row',
    height: dp(24),
    width: dp(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    flexDirection: 'column',
    // backgroundColor: AppStyle.Color.LIGHT_GRAY,
    backgroundColor: AppStyle.Color.WHITE,
    // height: dp(50),
    width: dp(110),
    // marginLeft: dp(8),
    // borderRadius: dp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnTitle: {
    ...AppStyle.h2,
  },
  btn: {
    backgroundColor: AppStyle.Color.LIGHT_GRAY,
    height: scaleSize(80),
    minWidth: scaleSize(220),
    paddingHorizontal: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(8),
  },
  btnTitle: {
    backgroundColor: 'transparent',
    ...AppStyle.h2,
    marginTop: dp(16),
  },
  enableBtnTitle: {
    ...AppStyle.h2,
    backgroundColor: 'transparent',
    paddingBottom: scaleSize(4),
  },
})
