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
    fontSize: scaleSize(24),
  },
  listItem: {
    // flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  itemText: {
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontSize: size.fontSize.fontSizeXl,
  },
  currentView: {
    height: scaleSize(30),
    minWidth: scaleSize(120),
    paddingHorizontal: scaleSize(4),
    borderRadius: scaleSize(4),
    backgroundColor: color.bgG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize(30),
  },
  currentText: {
    fontSize: size.fontSize.fontSizeSm,
    color: 'white',
    backgroundColor: 'transparent',
  },
})
