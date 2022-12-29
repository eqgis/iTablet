import { StyleSheet } from 'react-native'
import { color } from '../../../../../styles'
import { scaleSize } from '../../../../../utils'

const styles = StyleSheet.create({
  buttonText: {
    color: color.fontColorGray,
    fontSize: scaleSize(24),
    textAlign: 'center',
  },
  inputBackgroud: {
    backgroundColor: color.colorEF,
    height: scaleSize(90),
    borderRadius: scaleSize(40),
    paddingHorizontal: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(20),
  },
  textInputStyle: {
    width: '100%',
    fontSize: scaleSize(28),
    borderBottomColor: color.borderLight,
    color: 'black',
    textAlign: 'center',
  },
  loginStyle: {
    height: scaleSize(60),
    width: '50%',
    backgroundColor: color.itemColorBlack,
    marginTop: scaleSize(60),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  registerContainerStyle: {
    position: 'absolute',
    bottom: 30,
    width: '70%',
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  registetrText: {
    paddingHorizontal: 5,
    lineHeight: 40,
    color: color.font_color_white,
    fontSize: scaleSize(24),
  },

  // iPortalLogin
  loginSectionView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginTop: scaleSize(10),
  },
  sectionViewStyle: {
    flex: 1,
    width: '100%',
    // alignItems: 'center',
  },
  inpuViewStyle: {
    width: '75%',
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: scaleSize(24),
    color: '#A0A0A0',
    marginTop: scaleSize(10),
    marginLeft: scaleSize(30),
  },
  customInputStyle: {
    fontSize: scaleSize(28),
    paddingLeft: scaleSize(52),
  },
  sectionTitleStyle: {
    fontSize: scaleSize(30),
    color: color.fontColorGray3,
    marginLeft: scaleSize(30),
  },

  settingsView: {
    marginTop: scaleSize(30),
    // paddingVertical: scaleSize(20),
    width: '75%',
    borderRadius: scaleSize(40),
    backgroundColor: color.colorEF,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(10),
  },
  settingHeader: {
    height: scaleSize(70),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  arrowImg: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
})
export default styles
