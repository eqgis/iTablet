import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: 17,
  },
  listItem: {
    // flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  iconView: {
    height: scaleSize(50),
    width: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallIcon: {
    height: scaleSize(30),
    width: scaleSize(30),
  },
  icon: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  itemText: {
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontSize: size.fontSize.fontSizeXl,
  },
})
