import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: scaleSize(44),
    width: scaleSize(44),
  },
  sectionHeader: {
    height: scaleSize(80),
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleSize(20),
  },
  sectionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: scaleSize(25),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: size.fontSize.fontSizeXXl,
    color: color.content,
  },
  sectionSubTitle: {
    fontSize: scaleSize(20),
    color: '#A0A0A0',
  },
  rightIconView: {
    height: '100%',
    width: scaleSize(60),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon_big: {
    height: scaleSize(52),
    width: scaleSize(60),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
  },
  dialogContent: {
    paddingTop: scaleSize(30),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogTextStyle: {
    fontSize: scaleSize(24),
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  dialogTitleImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
})
