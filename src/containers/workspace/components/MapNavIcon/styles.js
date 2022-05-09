import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
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
})
