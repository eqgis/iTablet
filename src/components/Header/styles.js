import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color, zIndexLevel } from '../../styles'

export default StyleSheet.create({
  defaultHeaderView: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: color.white,
    alignItems: 'center',
  },
  fixHeaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: zIndexLevel.FOUR + 1,
    width: '100%',
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatHeaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: zIndexLevel.FOUR + 1,
    width: '100%',
    backgroundColor: '#rgba(255, 255, 255, 0)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatNoTitleHeaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100019,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#rgba(255, 255, 255, 0)',
  },
  navigationHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    zIndex: zIndexLevel.FOUR + 1,
    width: 60,
    padding: 5,
    marginLeft: scaleSize(20),
    justifyContent: 'center',
  },
  backIcon: {
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0)',
    marginRight: 3,
  },
  iconBtnBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnBgDarkColor: {
    backgroundColor: '#rgba(0, 0, 0, 0.6)',
  },
  headerLeftView: {
    position: 'absolute',
    zIndex: zIndexLevel.FOUR + 1,
    width: 60,
    marginLeft: scaleSize(35),
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  headerRightView: {
    position: 'absolute',
    zIndex: zIndexLevel.FOUR + 1,
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    right: scaleSize(25),
  },
  headerTitleView: {
    position: 'absolute',
    zIndex: -1,
    left: scaleSize(80),
    right: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: color.content,
    fontSize: setSpText(36),
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  subTitle: {
    color: color.gray3,
    fontSize: setSpText(20),
  },
  count: {
    position: 'absolute',
    color: '#fa575c',
    left: 38,
  },
})
