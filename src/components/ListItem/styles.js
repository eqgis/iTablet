import { StyleSheet } from 'react-native'
import { size, color } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    // justifyContent: 'center',
    marginHorizontal: scaleSize(30),
    height: scaleSize(90),
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: '5',
    height: scaleSize(90) - 1,
  },
  image: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginRight: scaleSize(30),
  },
  title: {
    flex: 1,
    fontSize: size.fontSize.fontSizeXl,
    marginLeft: scaleSize(30),
    color: color.contentColorGray,
  },
  value: {
    flex: 1,
    marginLeft: scaleSize(20),
    fontSize: size.fontSize.fontSizeXl,
    backgroundColor: 'transparent',
    textAlign: 'left',
    color: color.contentColorGray,
  },
  separator: {
    flex: 1,
    marginLeft: scaleSize(30),
    marginRight: scaleSize(30),
    height: 1,
    backgroundColor: color.separateColorGray3,
  },
})
