import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils/index'
const SCAN_SIZE = scaleSize(640)
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
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    borderColor: '#0379FF',
    borderWidth: 2,
  },
  scanTip: {
    color: '#ffffff',
    textAlign: 'center',
  },
  scanButton: {
    position: 'absolute',
    bottom: scaleSize(100),
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
    height: scaleSize(880),
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
    height: scaleSize(44),
    width: scaleSize(44),
  },
  title: {
    fontSize: scaleSize(32),
  },
  subTitle : {
    fontSize: scaleSize(24),
    color: '#8a8a8f',
  },
  iconPhone: {
    width: scaleSize(320),
    height: scaleSize(320),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  button:{
    width: scaleSize(112),
    height: scaleSize(112),
    borderRadius: scaleSize(56),
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: scaleSize(72),
    height: scaleSize(72),
    borderRadius: scaleSize(36),
  },
  buttonText: {
    color: '#505050',
    marginTop: scaleSize(10),
    fontSize: scaleSize(22),
  },
  inputBox: {
    width: '100%',
    height: scaleSize(80),
    borderRadius: scaleSize(40),
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleSize(12),
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
    width: scaleSize(52),
    height: scaleSize(52),
    borderRadius: scaleSize(26),
    marginTop: scaleSize(40),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: scaleSize(24),
    height: scaleSize(24),
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