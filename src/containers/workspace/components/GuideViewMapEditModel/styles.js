import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'


export default StyleSheet.create({
  btn: {
    paddingHorizontal: scaleSize(5),
    width: '100%',
  },
  btnImage: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
})
