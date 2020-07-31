import { Dimensions, StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export const itemWidth = Dimensions.get('window').width
export const itemHeight = 140
export const imageWidth = 90
export const imageHeight = 90
export const textHeight = 40
const smallFontSize = 12
const largeFontSize = 18
const paddingLeft = 15
const styles = StyleSheet.create({
  // PublicData
  stateView: {
    height: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.content_white,
  },
  HeaderRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreImg: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  searchImg: {
    height: scaleSize(40),
    width: scaleSize(40),
    marginRight: scaleSize(10),
  },
  ListViewStyle: {
    flex: 1,
    backgroundColor: color.content_white,
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: size.fontSize.fontSizeXXl,
  },

  // DataItem
  itemViewStyle: {
    width: '100%',
    height: itemHeight,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: color.image_bg_white,
  },
  restTitleTextStyle: {
    width: '100%',
    fontSize: largeFontSize,
    fontWeight: 'bold',
    // color: 'white',
    paddingLeft,
    textAlign: 'left',
    flexWrap: 'wrap',
    marginRight: 100,
  },
  viewStyle2: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    paddingLeft,
    marginTop: 10,
    marginRight: 100,
  },
  imageStyle2: {
    width: 20,
    height: 20,
  },
  textStyle2: {
    textAlign: 'left',
    // color: 'white',
    lineHeight: 20,
    fontSize: smallFontSize,
    paddingLeft: 5,
  },
  separateViewStyle: {
    width: '100%',
    height: 2,
  },
})
export default styles
