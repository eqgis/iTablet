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
  headerBtn: {
    marginTop: scaleSize(20),
    borderRadius: scaleSize(8),
    width: scaleSize(80),
    height: scaleSize(80),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImgBtn: {
    width: scaleSize(44),
    height: scaleSize(44),
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
    width: '100%',
    height: '100%',
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
    flex: 1,
    height: scaleSize(50),
    flexDirection: 'row',
    paddingHorizontal: scaleSize(80),
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  albumBtn: {
    position: 'absolute',
    width: scaleSize(128),
    height: scaleSize(128),
    bottom: scaleSize(40),
    left: scaleSize(88),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumImgBtn: {
    width: scaleSize(64),
    height: scaleSize(64),
  },
  capture: {
    position: 'absolute',
    width: scaleSize(128),
    height: scaleSize(128),
    bottom: scaleSize(40),
    left: '50%',
    marginLeft: -scaleSize(64),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconBg: {
    width: scaleSize(128),
    height: scaleSize(128),
  },
  cameraIcon: {
    width: scaleSize(128),
    height: scaleSize(128),
  },
  iconView: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  smallIcon: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  buttonView: {
    position: 'absolute',
    flexDirection: 'row',
    height: scaleSize(120),
    paddingHorizontal: scaleSize(80),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    left: scaleSize(60),
    right: scaleSize(60),
    borderRadius: scaleSize(32),
    bottom: scaleSize(32),
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
    height: scaleSize(360),
    backgroundColor: color.white,
    justifyContent: 'space-around',
    alignItems: 'center',
    left: scaleSize(60),
    right: scaleSize(60),
    bottom: scaleSize(180),
    borderRadius: scaleSize(32),
  },
  title: {
    flex: 1,
    fontSize: setSpText(24),
    backgroundColor: 'transparent',
    color: color.fontColorBlack,
    textAlign: 'left',
  },
  titleConfidence: {
    minWidth: scaleSize(100),
    fontSize: setSpText(24),
    backgroundColor: 'transparent',
    color: color.fontColorBlack,
    textAlign: 'left',
  },
  titleElse: {
    height: scaleSize(50),
    minWidth: scaleSize(600),
    fontSize: setSpText(24),
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
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
    height: scaleSize(40),
    width: scaleSize(40),
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
  },
  overlayPreviewTop: {
    position: 'absolute',
    height: scaleSize(145),
    top: 0,
    left: scaleSize(60),
    right: scaleSize(60),
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
  },
  overlayPreviewRight: {
    position: 'absolute',
    height: '100%',
    width: scaleSize(60),
    top: 0,
    right: 0,
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
  },
  overlayPreviewBottom: {
    position: 'absolute',
    height: scaleSize(600),
    bottom: 0,
    left: scaleSize(60),
    right: scaleSize(60),
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
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
