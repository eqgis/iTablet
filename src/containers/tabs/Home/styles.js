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
    borderRadius: scaleSize(40),
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
  dialog: {
    flexDirection: 'column',
    // height: scaleSize(464),
    width: scaleSize(392),
    borderRadius: scaleSize(40),
    paddingVertical: scaleSize(20),
  },
  
  // ExitDialog
  exitDialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scaleSize(30),
  },
  exitDialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  exitDialogTile: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  
  dialogHeader: {
    height: scaleSize(64),
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  promptTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.theme_white,
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'absolute',
    right: 0,
    left: 0,
  },
  dialogHeaderBtnView: {
    marginRight: scaleSize(36),
    width: scaleSize(64),
    height: scaleSize(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogHeaderBtn: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  dialogContent: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: scaleSize(40),
  },
  dialogInfo: {
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeXl,
    color: color.fontColorBlack,
    fontWeight: 'bold',
  },
  dialogSize: {
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray3,
    marginTop: scaleSize(10),
  },
  dialogButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: scaleSize(64),
  },
  dialogButton: {
    width: scaleSize(264),
    height: scaleSize(64),
    borderRadius: scaleSize(32),
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scaleSize(22),
  },
  checkImg: {
    width: scaleSize(32),
    height: scaleSize(32),
  },
  dialogCheck: {
    marginLeft: scaleSize(12),
    fontSize: size.fontSize.fontSizeSm,
    color: color.fontColorGray2,
  },
  tabText: {
    textAlign: 'center',
    color: color.itemColorGray,
    fontSize: scaleSize(20),
  },
  datasContainer: {
    flex: 1,
    backgroundColor: color.white,
  },
  scrollContentStyleP: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: scaleSize(30),
  },
  scrollContentStyleL: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: scaleSize(10),
  },
  itemView: {
    marginVertical: scaleSize(15),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  itemImg: {
    width: scaleSize(45),
    height: scaleSize(45),
  },
  itemText: {
    marginTop: scaleSize(4),
    textAlign: 'center',
    fontSize: scaleSize(20),
    color: color.fontColorGray2,
  },
  titleText: {
    marginTop: scaleSize(4),
    textAlign: 'center',
    fontSize: scaleSize(30),
    color: color.black,
    fontWeight: 'bold',
  },
  knowText: {
    textAlign: 'center',
    fontSize: scaleSize(25),
    color: color.white,
    fontWeight: 'bold',
  },
  knowView: {
    backgroundColor: color.itemColorGray,
    borderRadius: scaleSize(50),
    width: scaleSize(220),
    height: scaleSize(70),
    // bottom: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:scaleSize(20),
    marginVertical:scaleSize(20),
  },
})
