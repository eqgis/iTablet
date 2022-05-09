import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, zIndexLevel, size } from '../../../../styles'
import { ConstToolType, Height } from '../../../../constants'

export default StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  fullContainerLandscape: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  themeoverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(105, 105, 105, 0.3)',
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    minHeight: Height.TOOLBAR_BUTTONS,
    backgroundColor: 'transparent',
  },
  containerRadius: {
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
  },
  containerShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: color.itemColorGray3,
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 20,
  },
  hidden: {
    overflow: 'hidden',
  },
  containersLandscape: {
    flexDirection: 'row',
    height: '100%',
    // maxWidth: ConstToolType.HEIGHT[3] + Height.TOOLBAR_BUTTONS,
    backgroundColor: 'transparent',
  },
  buttonz: {
    flexDirection: 'row',
    height: Height.TOOLBAR_BUTTONS,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    // flex: 1,
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(45),
    width: scaleSize(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: color.theme,
    color: 'white',
  },
  themeitem: {
    padding: 10,
    fontSize: 25,
    paddingLeft: 20,
    height: 60,
    backgroundColor: color.theme,
    color: 'white',
  },
  cell: {
    // flex: 1,
  },
  tabsView: {
    height: ConstToolType.HEIGHT[3] - Height.TOOLBAR_BUTTONS,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
  list: {
    width: scaleSize(300),
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(48,48,48,0.85)',
  },
  text: {
    color: 'white',
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    backgroundColor: 'transparent',
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },

  // Custom Header
  headerRightView: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerRightImg: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
})
