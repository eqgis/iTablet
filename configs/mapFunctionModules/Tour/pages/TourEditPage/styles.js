import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../../src/utils'
import { color } from '../../../../../src/styles'
import { Height } from '../../../../../src/constants'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.content_white,
  },
  moreView: {
    flex: 1,
    marginRight: scaleSize(10),
  },
  moreImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: Height.TABLE_ROW_HEIGHT_3,
  },
  arrow: {
    width: scaleSize(40),
    height: scaleSize(40),
    tintColor: color.imageColorBlack,
  },
})
