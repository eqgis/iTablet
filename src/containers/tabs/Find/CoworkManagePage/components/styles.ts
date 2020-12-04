
import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../../utils'
import { size, color } from '../../../../../styles'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'column',
    marginHorizontal: scaleSize(30),
    padding: scaleSize(20),
    borderWidth: 1,
    borderRadius: scaleSize(8),
    borderColor: color.gray7,
  },
  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: scaleSize(30),
    padding: scaleSize(20),
    borderWidth: 1,
    borderRadius: scaleSize(8),
    borderColor: color.gray7,
  },
  title: {
    fontSize: size.fontSize.fontSizeXl,
    color: color.fontColorBlack,
    alignSelf: 'center',
  },
  contentView: {
    marginVertical: scaleSize(20),
    flexDirection: 'column',
  },
  contentItemView: {
    flexDirection: 'row',
    marginVertical: scaleSize(4),
  },
  contentTextView: {
    width: scaleSize(160),
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  contentTextView2: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingLeft: scaleSize(30),
  },
  contentText: {
    fontSize: size.fontSize.fontSizeLg,
    color: 'grey',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginTop: scaleSize(8),
  },
})
