import { StyleSheet } from 'react-native'
import { Const } from '../../constants'
import { scaleSize, setSpText } from '../../utils'
import { size, color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  newcontainer: {
    position: 'absolute',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#rgb(45, 45, 47)',
  },
  backImg: {
    position: 'absolute',
    // marginTop: scaleSize(120),
    width: '100%',
    height: '60%',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  classifyTitleView: {
    height: scaleSize(50),
    // width: '100%',
    width: scaleSize(500),
    flexDirection: 'row',
    // paddingHorizontal: scaleSize(20),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capture: {
    position: 'absolute',
    width: scaleSize(120),
    height: scaleSize(120),
    // bottom: 60,
    bottom: scaleSize(12),
    left: '50%',
    marginLeft: -scaleSize(60),
    // backgroundColor: 'white',
    backgroundColor: 'transparent',
    // borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconBg: {
    width: scaleSize(120),
    height: scaleSize(120),
  },
  cameraIcon: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  iconView: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  smallIcon: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  toolbar: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#2D2D2F',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonView: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#2D2D2F',
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
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
  },
  InfoChangeView: {
    position: 'absolute',
    flexDirection: 'column',
    // width: '100%',
    height: scaleSize(300),
    // paddingVertical: scaleSize(10),
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
    left: scaleSize(60),
    right: scaleSize(60),
    bottom: scaleSize(140),
  },
  title: {
    height: scaleSize(50),
    minWidth: scaleSize(300),
    fontSize: setSpText(30),
    backgroundColor: 'transparent',
    color: 'white',
    // textAlign: 'center',
    // paddingLeft: 5,
    textAlign: 'left',
  },
  titleConfidence: {
    height: scaleSize(50),
    minWidth: scaleSize(100),
    fontSize: setSpText(30),
    backgroundColor: 'transparent',
    color: 'white',
    // textAlign: 'center',
    // paddingLeft: 5,
    textAlign: 'left',
  },
  titleElse: {
    height: scaleSize(50),
    minWidth: scaleSize(600),
    fontSize: setSpText(30),
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
    // paddingLeft: 5,
    // textAlign: 'left',
  },

  // Change Controller
  changeView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    left: '50%',
    right: '50%',
    marginLeft: scaleSize(-100),
    marginTop: scaleSize(-100),
    height: scaleSize(40),
    width: scaleSize(200),
    bottom: 0,
    backgroundColor: 'transparent',
  },
  typeBtn: {
    flex: 1,
    height: scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeTextSelected: {
    fontSize: size.fontSize.fontSizeMd,
    color: 'white',
    backgroundColor: 'transparent',
  },
  typeText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.contentColorGray,
    backgroundColor: 'transparent',
  },
  takeplace: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },

  // Video
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoControlView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  play: {
    // position: 'absolute',
    width: scaleSize(100),
    height: scaleSize(100),
    // bottom: 60,
    // left: '50%',
    // top: '50%',
    // marginLeft: -40,
    // marginTop: -40,
    backgroundColor: 'transparent',
    borderRadius: scaleSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(255, 255, 255, 0.3)',
    borderRadius: scaleSize(50),
  },
  overlayPreviewLeft: {
    position: 'absolute',
    width: scaleSize(60),
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
    // borderRadius: scaleSize(50),
  },
  overlayPreviewTop: {
    position: 'absolute',
    height: scaleSize(145),
    top: 0,
    left: scaleSize(60),
    right: scaleSize(60),
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
    // borderRadius: scaleSize(50),
  },
  overlayPreviewRight: {
    position: 'absolute',
    height: '100%',
    width: scaleSize(60),
    top: 0,
    right: 0,
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
    // borderRadius: scaleSize(50),
  },
  overlayPreviewBottom: {
    position: 'absolute',
    height: scaleSize(450),
    bottom: 0,
    left: scaleSize(60),
    right: scaleSize(60),
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
    // borderRadius: scaleSize(50),
  },

  // 进度条
  progressView: {
    position: 'absolute',
    height: 20,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
})
