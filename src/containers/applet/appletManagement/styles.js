import { StyleSheet } from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentView: {
    flexDirection: 'column',
    borderRadius: scaleSize(28),
    backgroundColor: color.white,
    marginHorizontal: scaleSize(36),
    marginVertical: scaleSize(26),
    minHeight: scaleSize(300),
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: color.itemColorGray2,
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  contentHeaderView: {
    flexDirection: 'row',
    height: scaleSize(90),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: scaleSize(36),
    borderBottomWidth: scaleSize(2),
    borderBottomColor: color.separateColorGray,
  },
  contentHeaderTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
  },
  contentHeaderImg: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scaleSize(26),
  },
  
  // item's style
  btn: {
    flexDirection: 'column',
    minHeight: scaleSize(100),
    width: scaleSize(100),
    alignItems: 'center',
  },
  itemImg: {
    width: scaleSize(84),
    height: scaleSize(84),
    borderRadius: scaleSize(42),
  },
  itemText: {
    marginTop: scaleSize(10),
    color: '#2C2C2B',
    fontSize: size.fontSize.fontSizeLg,
    textAlign: 'center',
  },
  progressView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: scaleSize(84),
    height: scaleSize(84),
    borderRadius: scaleSize(42),
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
