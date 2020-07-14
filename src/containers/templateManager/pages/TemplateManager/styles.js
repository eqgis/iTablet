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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  itemText: {
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontSize: size.fontSize.fontSizeXl,
    height: size.fontSize.fontSizeXl + scaleSize(6),
  },
  currentView: {
    height: scaleSize(30),
    width: scaleSize(120),
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
