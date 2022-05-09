import { StyleSheet } from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },
  btn: {
    flexDirection: 'column',
    height: scaleSize(80),
    marginHorizontal: scaleSize(80),
    marginBottom: scaleSize(80),
    marginTop: scaleSize(10),
    borderRadius: scaleSize(40),
    backgroundColor: color.itemColorGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.white,
  },

  // item's style
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: scaleSize(44),
    paddingLeft: scaleSize(54),
    paddingTop: scaleSize(36),
    paddingBottom: scaleSize(20),
  },
  itemImg: {
    width: scaleSize(104),
    height: scaleSize(104),
    borderRadius: scaleSize(52),
  },
  itemText: {
    flex: 1,
    marginLeft: scaleSize(44),
    color: color.itemColorGray,
    fontSize: size.fontSize.fontSizeLg,
    textAlign: 'left',
  },
  itemSelect: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
})
