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
    backgroundColor: '#EFEFEF',
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
    flexDirection: 'row',
    width: '100%',
    marginTop: scaleSize(10),
  },
  sectionViewStyle: {
    width: '100%',
    alignItems: 'center',
  },
  inpuViewStyle: {
    width: '75%',
  },
  textStyle: {
    fontSize: scaleSize(24),
    color: '#A0A0A0',
    marginTop: scaleSize(10),
    marginLeft: scaleSize(40),
  },
})
export default styles
