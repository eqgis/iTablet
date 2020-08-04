import { StyleSheet } from 'react-native'
import { constUtil, scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContainer: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#bbbbbb',
    height: scaleSize(80),
  },
  rowOne: {
    height: scaleSize(98),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  btn: {
    height: scaleSize(50),
    width: scaleSize(60),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn1: {
    height: scaleSize(50),
    width: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_image: {
    height: scaleSize(44),
    width: scaleSize(44),
  },
  btn_image_small: {
    height: scaleSize(30),
    width: scaleSize(30),
  },
  btn_image_big: {
    height: scaleSize(52),
    width: scaleSize(52),
  },
  more_image: {
    height: scaleSize(44),
    width: scaleSize(44),
  },
  btnImage: {
    // height: scaleSize(40),
    width: scaleSize(40),
  },
  btnImageView: {
    height: scaleSize(80),
    width: scaleSize(100),
    // paddingHorizontal: scaleSize(10),
    backgroundColor: color.blue2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_container: {
    // height:40,
    // width: scaleSize(),
    flex: 1,
    marginLeft: scaleSize(30),
  },
  text: {
    fontSize: setSpText(24),
    color: color.black,
    backgroundColor: 'transparent',
  },
  rowTwo: {
    height: scaleSize(90),
    width: constUtil.WIDTH,
    backgroundColor: 'white',
  },
  smallImage: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  additionView: {
    flexDirection: 'column',
    width: '100%',
    // paddingLeft: scaleSize(60),
  },
  radioView: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: scaleSize(2),
    borderColor: color.USUAL_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelected: {
    height: scaleSize(20),
    width: scaleSize(20),
    borderRadius: scaleSize(10),
    backgroundColor: color.USUAL_BLUE,
  },
  radioViewGray: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: scaleSize(2),
    borderColor: color.gray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelectedGray: {
    height: scaleSize(20),
    width: scaleSize(20),
    borderRadius: scaleSize(10),
    backgroundColor: color.gray,
  },
})
