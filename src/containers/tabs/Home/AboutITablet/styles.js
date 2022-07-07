import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
// const SCREEN_WIDTH = Dimensions.get('window').width
export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    // marginTop: scaleSize(70),
    //    backgroundColor:"pink",
  },
  iTablet: {
    width: scaleSize(128),
    height: scaleSize(128),
  },
  headerTitle: {
    height: scaleSize(50),
    // marginTop: scaleSize(25),
    color: color.fontColorBlack,
    fontSize: setSpText(36),
  },
  version: {
    marginTop: scaleSize(5),
    color: color.fontColorBlack,
    fontSize: setSpText(22),
  },
  contentView: {
    flex: 1,
    flexDirection: 'column',
  },
  support: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
  },
  consult: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportTitle: {
    color: color.fontColorBlack,
    fontSize: setSpText(26),
  },
  consultTitle: {
    color: color.fontColorBlack,
    fontSize: setSpText(26),
  },
  phone: {
    color: color.fontColorGray,
    fontSize: setSpText(22),
  },
  separator: {
    backgroundColor: color.fontColorBlack,
    height: 1,
  },
  footerView: {
    // marginTop: scaleSize(270),
    height: scaleSize(50),
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"pink",
  },
  separatorView: {
    width: scaleSize(51),
    height: scaleSize(40),
    flexDirection: 'column',
    alignItems: 'center',
  },
  cloumSeparator: {
    width: 1,
    height: scaleSize(40),
    backgroundColor: color.fontColorGray,
  },
  offcial: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    left: scaleSize(10),
  },
  protocol: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  footerItem: {
    color: color.switch,
    fontSize: setSpText(22),
  },
  informationView: {
    paddingVertical: scaleSize(10),
  },
  information: {
    width: scaleSize(385),
    textAlign: 'center',
    color: color.fontColorGray,
    fontSize: setSpText(16),
  },
})
