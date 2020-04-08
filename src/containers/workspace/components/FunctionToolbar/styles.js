import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: color.content_white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  separator: {
    marginTop: scaleSize(10),
  },
  btnView: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: scaleSize(5),
    paddingBottom: scaleSize(10),
    width: scaleSize(80),
  },
  indicatorView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: scaleSize(15),
  },
  indicatorImage: {
    height: scaleSize(20),
    width: scaleSize(20),
  },
  moreImageView: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImage: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  progress: {
    width: scaleSize(60),
    // width: scaleSize(18),
    height: 2,
    // position: 'absolute',
    // right: scaleSize(0),
    // left: scaleSize(0),
    // top: scaleSize(4),
    bottom: scaleSize(4),
    borderWidth: 0,
  },
})
