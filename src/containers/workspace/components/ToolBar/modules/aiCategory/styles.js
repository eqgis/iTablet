import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../../../utils'
import { color } from '../../../../../../styles'

export default StyleSheet.create({
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
  takeplace: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: 5,
    backgroundColor: 'transparent',
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
  previewImage: {
    position: 'absolute',
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
    left: scaleSize(60),
    right: scaleSize(60),
    top: scaleSize(144),
    bottom: scaleSize(600),
    borderRadius: scaleSize(32),
    overflow: 'hidden',
  },
})
