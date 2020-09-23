import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  dialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    marginTop: scaleSize(10),
    width: scaleSize(80),
    height: scaleSize(80),
    // opacity: 1,
  },
  promptTitle: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(32),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginHorizontal: scaleSize(30),
    textAlign: 'left',
  },
  dialogBackground: {
    height: scaleSize(250),
  },
  opacityView: {
    height: scaleSize(250),
  },
})
