import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../utils'
import { color, zIndexLevel } from '../../../styles'
import size from '../../../styles/size'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: zIndexLevel.FOUR,
    backgroundColor: color.white,
  },
  userImg: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  userView: {
    width: scaleSize(80),
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headTitle: {
    flex: 1,
    height: scaleSize(60),
    color: color.black,
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: setSpText(34),
  },
  moreView: {
    width: scaleSize(48),
    height: scaleSize(48),
  },
  moreImg: {
    width: scaleSize(48),
    height: scaleSize(48),
  },
  dialogBackground: {
    height: scaleSize(300),
    backgroundColor: color.content_white,
  },
  dialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scaleSize(30),
  },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  promptTtile: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  depict: {
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeLg,
    color: color.theme_white,
    marginTop: scaleSize(2),
  },
  opacityView: {
    height: scaleSize(300),
    backgroundColor: color.content_white,
  },
  btnTitle: {
    fontSize: setSpText(20),
    color: '#303030',
  },
  checkView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: scaleSize(20),
  },
  checkImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  dialogCheck: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.theme_white,
  },
})
