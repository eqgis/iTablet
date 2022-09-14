import { StyleSheet } from 'react-native'
import { Const } from '../../constants'
import { scaleSize, setSpText } from '../../utils'
import { color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  historypoint: {
    flexDirection: 'row',
    width: '100%',
    height: scaleSize(50),
    marginLeft: scaleSize(5),
    marginRight: scaleSize(5),
  },
  historyTitle: {
    backgroundColor: 'transparent',
    fontSize: setSpText(30),
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonname: {
    width: scaleSize(90),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    fontSize: setSpText(20),
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  historyDataView: {
    position: 'absolute',
    height: scaleSize(570),
    // width: '90%',
    paddingVertical: scaleSize(10),
    // backgroundColor: '#2D2D2F',
    backgroundColor: color.background,
    borderRadius: scaleSize(10),
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: scaleSize(120),
  },
  list: {
    position: 'absolute',
    height: scaleSize(450),
    left: scaleSize(5),
    right: scaleSize(5),
    marginTop: scaleSize(10),
    bottom: scaleSize(55),
    backgroundColor: 'transparent',
  },
  listaction: {
    position: 'absolute',
    flexDirection: 'row',
    height: scaleSize(50),
    left: scaleSize(5),
    right: scaleSize(5),
    bottom: scaleSize(5),
    backgroundColor: 'transparent',
  },
  capture: {
    position: 'absolute',
    width: 80,
    height: 80,
    bottom: scaleSize(230),
    left: '50%',
    marginLeft: -40,
    // backgroundColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    width: scaleSize(50),
    height: scaleSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  itemView: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: color.background,
  },
  historyCloseIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historySelect: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleSize(10),
    backgroundColor: 'transparent',
  },
  historyDelete: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleSize(40),
    marginRight: scaleSize(20),
    backgroundColor: 'transparent',
  },
  smallIcon: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  smallIcons: {
    marginLeft: scaleSize(10),
    width: scaleSize(30),
    height: scaleSize(30),
  },
  toolbarView: {
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: color.white,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
    overflow: 'hidden',
  },
  toolbar: {
    // position: 'absolute',
    flexDirection: 'row',
    minHeight: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // left: 0,
    // right: 0,
    // bottom: Const.BOTTOM_HEIGHT,
  },
  toolbarb: {
    // position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
  buttonView: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    minHeight: Const.BOTTOM_HEIGHT,
    // paddingHorizontal: scaleSize(20),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    // left: scaleSize(20),
    // right: scaleSize(20),
    bottom: 0,
  },
  buttonViewb: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: 0,
  },
  topView: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: scaleSize(100),
    left: 0,
    right: 0,
    bottom: 0,
  },
  lengthChangeView: {
    position: 'absolute',
    flexDirection: 'column',
    height: scaleSize(45),
    minWidth: scaleSize(180),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    top: scaleSize(150),
    left: scaleSize(20),
  },
  titleTotal: {
    height: scaleSize(45),
    // width: scaleSize(240),
    minWidth: scaleSize(180),
    fontSize: setSpText(30),
    backgroundColor: '#rgba(45, 45, 47, 0.5)',
    // backgroundColor: '#FBFBFB',
    // color: '#rgba(70, 128, 223, 1)',
    color: '#FFFFFF',
    // textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'left',
    borderRadius: scaleSize(5),
  },
  historyItem: {
    flexDirection: 'row',
    height: scaleSize(60),
    width: '70%',
    marginLeft: scaleSize(20),
    marginRight: scaleSize(5),
    fontSize: setSpText(30),
    backgroundColor: color.background,
    color: '#FFFFFF',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: scaleSize(5),
  },
  historyItemText: {
    height: scaleSize(60),
    // width: '100%',
    marginLeft: scaleSize(2),
    marginRight: scaleSize(2),
    fontSize: setSpText(30),
    backgroundColor: color.background,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
    // paddingLeft: 5,
    // paddingRight: 5,
    // textAlign: 'left',
    borderRadius: scaleSize(5),
  },
  currentLengthChangeView: {
    position: 'absolute',
    flexDirection: 'row',
    height: scaleSize(45),
    minWidth: scaleSize(200),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    marginLeft: -scaleSize(120),
    left: '50%',
  },
  title: {
    height: scaleSize(45),
    // width: scaleSize(240),
    minWidth: scaleSize(200),
    fontSize: setSpText(30),
    backgroundColor: '#rgba(45, 45, 47, 0.5)',
    // backgroundColor: '#FBFBFB',
    // color: '#rgba(70, 128, 223, 1)',
    color: '#FFFFFF',
    // textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'left',
    borderRadius: scaleSize(5),
  },
  btn_image: {
    position: 'absolute',
    left: scaleSize(10),
    width: scaleSize(100),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btn_image2: {
    position: 'absolute',
    right: scaleSize(10),
    width: scaleSize(100),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  opacityView: {
    height: scaleSize(300),
    backgroundColor: color.content_white,
  },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  dialogBackground: {
    height: scaleSize(300),
    backgroundColor: color.content_white,
  },
  dialogHeaderView: {
    paddingTop: scaleSize(30),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  clickHintView: {
    position: 'absolute',
    flexDirection: 'column',
    height: scaleSize(45),
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    top: scaleSize(150),
    right: scaleSize(20),
  },
  clickHintText: {
    height: scaleSize(45),
    minWidth: scaleSize(300),
    fontSize: setSpText(30),
    backgroundColor: '#rgba(45, 45, 47, 0.8)',
    color: '#FFFFFF',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'right',
    borderRadius: scaleSize(5),
  },
  addcaptureView: {
    position: 'absolute',
    width: 80,
    height: 80,
    bottom: scaleSize(340),
    left: '50%',
    marginLeft: -40,
    // backgroundColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addcapture:{
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
  },
  addiconView: {
    width: scaleSize(180),
    height: scaleSize(180),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  addText: {
    fontSize: setSpText(30),
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop:-scaleSize(10),
  },
  addButtonView: {
    width: scaleSize(120),
    height: scaleSize(120),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})