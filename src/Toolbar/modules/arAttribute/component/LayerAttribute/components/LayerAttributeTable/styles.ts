import { StyleSheet } from 'react-native'
import { scaleSize, AppStyle } from '../../../../../../../utils'

const ROW_HEIGHT = scaleSize(80)
export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: AppStyle.Color.subTheme,
    backgroundColor: AppStyle.Color.WHITE,
  },
  listContainer: {
    backgroundColor: 'transparent',
    // borderWidth: scaleSize(2),
    borderColor: AppStyle.Color.GRAY,
    borderRadius: scaleSize(12)
  },
  head: {
    height: scaleSize(60),
    // backgroundColor: AppStyle.Color.theme,
    backgroundColor: '#505050',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: AppStyle.Color.Text_Dark,
  },
  row: {
    height: scaleSize(80),
    flexDirection: 'row',
  },
  selectRow: {
    backgroundColor: AppStyle.Color.BLUE,
  },
  headerText: {
    // color: AppStyle.Color.themeText,
    color: '#FBFBFB',
    textAlign: 'center',
  },
  text: {
    // flex:1,
    textAlign: 'center',
    // color: AppStyle.Color.themeText,
    color: '#303030',
  },
  selectText: {
    color: AppStyle.Color.WHITE,
  },
  dataWrapper: {
    flex: 1,
    marginTop: -1,
    backgroundColor: AppStyle.Color.WHITE,
  },
  textInput: {
    textAlign: 'center',
  },
  border: {
    flex: 1,
    // borderColor: AppStyle.Color.borderLight,
    borderColor: '#A0A0A0',
  },
  indexCell: {
    height: ROW_HEIGHT,
    // backgroundColor: AppStyle.Color.bgW2,
    backgroundColor: AppStyle.Color.LIGHT_GRAY2,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCellText: {
    color: AppStyle.Color.Text_Dark,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  cell: {
    height: ROW_HEIGHT,
    backgroundColor: 'transparent',
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  disableCellStyle: {
    height: ROW_HEIGHT,
    // backgroundColor: AppStyle.Color.bgW,
    // backgroundColor: 'rgba(230, 230, 230, 0.85)',
    backgroundColor: AppStyle.Color.LIGHT_GRAY,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: AppStyle.Color.Text_Dark,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})
