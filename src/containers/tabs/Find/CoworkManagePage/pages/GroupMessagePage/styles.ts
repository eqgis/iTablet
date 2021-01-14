import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../../../utils'
import { color, size } from '../../../../../../styles'

export default StyleSheet.create({
  subContainer: {
    flex: 1,
  },
  headerBtnTitle: {
    fontSize: scaleSize(24),
    color: color.fontColorBlack,
  },
  HeadViewStyle: {
    height: scaleSize(72),
    backgroundColor: color.itemColorGray2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
    marginLeft: scaleSize(80),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  item: {
    marginLeft: scaleSize(46),
    marginRight: scaleSize(42),
  },
  itemImg: {
    marginLeft: scaleSize(32),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },

  ITemTextViewStyle: {
    paddingHorizontal: scaleSize(32),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  FlatListViewStyle: {
    position: 'absolute',
    width: scaleSize(26),
    right: scaleSize(15),
    top: scaleSize(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListItemViewStyle: {
    marginVertical: 2,
    height: scaleSize(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    marginLeft: scaleSize(46),
    marginRight: scaleSize(200),
  },

  nullView: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nullImage: {
    height: scaleSize(270),
    width: scaleSize(270),
  },
  nullTitle: {
    marginTop: scaleSize(40),
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray3,
  },
})