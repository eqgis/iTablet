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
    color: color.fontColorBlack,
    fontSize: 17,
  },
  listItem: {
    // flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  itemText: {
    flex: 1,
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontSize: size.fontSize.fontSizeXl,
  },
  itemRightView: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBtnView: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  selectImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    backgroundColor: 'transparent',
  },
  children: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(40),
    justifyContent: 'flex-start',
  },
  dialogStyle: {
    width: scaleSize(500),
    height: scaleSize(340),
  },
})
