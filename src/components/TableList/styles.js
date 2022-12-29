import { StyleSheet } from 'react-native'
// import { scaleSize } from '../../utils'
import { color } from '../../styles'

export default StyleSheet.create({
  scrollContainer: {
    // flex: 1,
    flexDirection: 'column',
    // backgroundColor: color.content_white,
    backgroundColor: 'transparent',
  },
  normalContainer: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // backgroundColor: color.content_white,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    // height: scaleSize(120),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
