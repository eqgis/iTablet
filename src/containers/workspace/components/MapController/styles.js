import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: scaleSize(34),
    bottom: scaleSize(135),
    flexDirection: 'column',
    backgroundColor: 'transparent',
    // padding: scaleSize(20),
  },
  topView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    width: scaleSize(64),
    height: scaleSize(64),
  },
  compass: {
    borderRadius: scaleSize(8),
  },
  separator: {
    marginTop: scaleSize(30),
    // backgroundColor:"red",
    // top:scaleSize(-80),
    // position:'absolute',
    // width:scaleSize(50),
    // height:scaleSize(50),
    // borderRadius: scaleSize(4),
    // backgroundColor: 'white',
  },
  compassView: {
    // top:scaleSize(-80),
    // position:'absolute',
    width: scaleSize(60),
    height: scaleSize(60),
    borderRadius: scaleSize(8),
    backgroundColor: 'white',
    marginTop: scaleSize(30),
    // marginBottom: scaleSize(25),
  },
  shadow: {
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
})
