import { StyleSheet } from 'react-native'
import { scaleSize, screen } from '../../../../utils'
import { color } from '../../../../styles'

const FUNCTIONHEIGHT = scaleSize(143) + screen.getIphonePaddingTop()
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'stretch',
  },
  functionToolbar: {
    position: 'absolute',
    top: FUNCTIONHEIGHT,
    right: scaleSize(20),
    backgroundColor: color.white,
  },
})
