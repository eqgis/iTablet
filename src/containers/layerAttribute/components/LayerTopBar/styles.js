import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.bgW,
    paddingVertical: scaleSize(26),
    width: '100%',
  },
  rightList: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(40),
  },
  rightScrollList: {
    paddingHorizontal: scaleSize(40),
  },
  imgBtn: {
    flexDirection: 'row',
    height: size.imageSize.large,
    width: size.imageSize.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    backgroundColor: color.itemColorGray2,
    height: scaleSize(80),
    width: scaleSize(110),
    marginLeft: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: color.itemColorGray2,
    height: scaleSize(80),
    minWidth: scaleSize(220),
    paddingHorizontal: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(8),
  },
  btnTitle: {
    backgroundColor: 'transparent',
    fontSize: size.fontSize.fontSizeXXl,
    color: color.fontColorGray,
    marginLeft: scaleSize(10),
  },
  enableBtnTitle: {
    backgroundColor: 'transparent',
    fontSize: size.fontSize.fontSizeXXl,
    color: color.contentColorGray,
    paddingBottom: scaleSize(4),
  },
})
