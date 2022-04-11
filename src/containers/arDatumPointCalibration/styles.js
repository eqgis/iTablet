import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils/index'
import { dp } from '../../utils'

const SCAN_SIZE = scaleSize(512)
const CORNER_SIZE = scaleSize(60)
const BORDER_SIZE = 3
const OFFSET = -2
export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  scanContainer:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  scanMask: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 0,
  },
  scanMaskCenter: {
    flex: 0,
    height: SCAN_SIZE,
    width: '100%',
    flexDirection: 'row',
  },
  scanWindow: {
    flex: 0,
    height: '100%',
    width: SCAN_SIZE,
    borderColor: 'rgba(200,200,200,0.6)',
    borderWidth: 1,
    zIndex: 1,
  },
  windowCornerLT: {
    height: CORNER_SIZE,
    width: CORNER_SIZE,
    borderTopColor: '#ffffff',
    borderTopWidth: BORDER_SIZE,
    borderLeftColor: '#ffffff',
    borderLeftWidth: BORDER_SIZE,
    position: 'absolute',
    top: OFFSET,
    left: OFFSET,
  },
  windowCornerLB: {
    height: CORNER_SIZE,
    width: CORNER_SIZE,
    borderBottomColor: '#ffffff',
    borderBottomWidth: BORDER_SIZE,
    borderLeftColor: '#ffffff',
    borderLeftWidth: BORDER_SIZE,
    position: 'absolute',
    bottom: OFFSET,
    left: OFFSET,
  },
  windowCornerRT: {
    height: CORNER_SIZE,
    width: CORNER_SIZE,
    borderTopColor: '#ffffff',
    borderTopWidth: BORDER_SIZE,
    borderRightColor: '#ffffff',
    borderRightWidth: BORDER_SIZE,
    position: 'absolute',
    top: OFFSET,
    right: OFFSET,
  },
  windowCornerRB: {
    height: CORNER_SIZE,
    width: CORNER_SIZE,
    borderBottomColor: '#ffffff',
    borderBottomWidth: BORDER_SIZE,
    borderRightColor: '#ffffff',
    borderRightWidth: BORDER_SIZE,
    position: 'absolute',
    bottom: OFFSET,
    right: OFFSET,
  },
  scanTip: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: scaleSize(40),
    marginBottom: scaleSize(60),
  },
  scanTipImg: {
    width: scaleSize(160),
    height: scaleSize(160),
  },
  scanButton: {
    position: 'absolute',
    bottom: scaleSize(100),
    width: scaleSize(112),
  },
  scanButtonImg: {
    width: scaleSize(112),
    height: scaleSize(112),
  },
  scanBg: {
    width: '90%',
    position: 'absolute',
  },
  scanLine: {
    width: '100%',
    height: scaleSize(100),
  },


  viewBox: {
    height: scaleSize(848),
    width: scaleSize(656),
    borderRadius: scaleSize(40),
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scaleSize(30),
    paddingHorizontal: scaleSize(60),
  },
  titleBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleBtn: {
    height: scaleSize(34),
    width: scaleSize(34),
  },
  title: {
    fontSize: scaleSize(32),
  },
  subTitle : {
    marginTop: scaleSize(10),
    fontSize: scaleSize(24),
    color: '#8a8a8f',
    textAlign: 'center',
  },
  iconPhone: {
    width: scaleSize(320),
    height: scaleSize(320),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  button:{
    width: scaleSize(112),
    height: scaleSize(112),
    // borderRadius: scaleSize(56),
    // backgroundColor: '#f8f8f8',
    borderRadius: scaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: scaleSize(72),
    height: scaleSize(72),
    borderRadius: scaleSize(36),
  },
  buttonText: {
    width: scaleSize(112),
    color: '#505050',
    marginTop: scaleSize(10),
    fontSize: scaleSize(22),
    textAlign: 'center',
  },
  inputBox: {
    width: '100%',
    height: scaleSize(80),
    // borderRadius: scaleSize(40),
    // backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleSize(12),
    borderBottomWidth: dp(1),
    borderBottomColor: '#ECECEC'
  },
  inputIcon: {
    height: scaleSize(80),
    width: scaleSize(80),
    borderRadius: scaleSize(40),
  },
  input: {
    flex: 1,
    height: scaleSize(80),
    backgroundColor: 'rgba(0,0,0,0)',
  },
  closeBtn: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: scaleSize(50),
    height: scaleSize(50),
  },

  listItem: {
    height: scaleSize(110),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f8",
  },
  listIcon: {
    width: scaleSize(62),
    height: scaleSize(62),
    marginRight: scaleSize(24),
  },
  itemL: {
    flex: 0,
    textAlign: 'right',
    paddingRight: scaleSize(24),
    fontSize: scaleSize(24),
  },
  itemR: {
    flex: 1,
    fontSize: scaleSize(24),
  }
})