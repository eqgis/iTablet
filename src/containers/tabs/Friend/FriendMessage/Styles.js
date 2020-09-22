/**
 * Created by imobile-xzy on 2019/3/16.
 */

import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils/screen'
import { color, size } from '../../../../styles'

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
    borderTopLeftRadius: scaleSize(36),
    borderTopRightRadius: scaleSize(36),
    overflow: 'hidden',
  },
  ItemViewStyle: {
    // paddingLeft: scaleSize(44),
    // paddingRight: scaleSize(44),
    height: scaleSize(114),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
  ITemTextViewStyle: {
    marginLeft: scaleSize(32),
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray2,
  },
  itemSeparator: {
    height: scaleSize(2),
    backgroundColor: color.separateColorGray3,
    marginLeft: scaleSize(150),
  },
  itemImg: {
    marginLeft: scaleSize(32),
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
