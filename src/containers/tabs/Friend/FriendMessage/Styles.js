/**
 * Created by imobile-xzy on 2019/3/16.
 */

import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils/screen'
import { color, size } from '../../../../styles'

const styles = StyleSheet.create({
  ItemViewStyle: {
    // paddingLeft: scaleSize(44),
    // paddingRight: scaleSize(44),
    height: scaleSize(114),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(60),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ITemHeadTextStyle: {
    fontSize: scaleSize(30),
    color: 'white',
  },
  
  ITemTextViewStyle: {
    marginRight: scaleSize(10),
    marginLeft: scaleSize(25),
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  itemSeparator: {
    height: scaleSize(2),
    backgroundColor: color.separateColorGray3,
    marginLeft: scaleSize(150),
  },
  itemImg: {
    marginLeft: scaleSize(44),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    backgroundColor: color.bgW,
  },
  timeStr: {
    marginRight: scaleSize(44),
    fontSize: size.fontSize.fontSizeSm,
    color: 'grey',
    textAlign: 'right',
  },
  listHeader: {
    height: scaleSize(114),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.bgW,
    borderTopLeftRadius: scaleSize(36),
    borderTopRightRadius: scaleSize(36),
  },
  rightImg: {
    width: scaleSize(52),
    height: scaleSize(52),
    marginRight: scaleSize(44)
  },
})

export { styles }
