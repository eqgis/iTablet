import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color } from '../../styles'

export default StyleSheet.create({
  container: {
    backgroundColor: '#FBFBFB',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(114),
    backgroundColor: color.bgW,
    alignItems: 'center',
    borderBottomWidth: scaleSize(2),
    borderBottomColor: color.separateColorGray3,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    backgroundColor: color.bgW,
    paddingHorizontal: scaleSize(50),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selection: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  sectionsTitle: {
    color: '#505050',
    fontSize: setSpText(26),
    marginLeft: scaleSize(46),
  },
  itemName: {
    color: '#505050',
    fontSize: setSpText(26),
  },
  switchText: {
    color: '#505050',
    fontSize: setSpText(26),
  },
  itemValue: {
    color: '#A0A0A0',
    marginRight: scaleSize(15),
    fontSize: setSpText(22),
  },
  itemSeparator: {
    height: 1,
    backgroundColor:  color.separateColorGray3,
  },
})
