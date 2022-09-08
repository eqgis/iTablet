/** NTRIP设置页面的样式文件 */
import { dp } from "imobile_for_reactnative/utils/size"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRightText: {
    fontSize: dp(16),
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: dp(40),
    height:dp(40),
  },
  itemSeperator: {
    width: '100%',
    height: dp(1),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  itemSeperatorLine: {
    width: '80%',
    height: dp(1),
    backgroundColor: '#efeff4'
  },

  seperator: {
    height: dp(10),
    backgroundColor: '#f9f9f9',
    marginTop: dp(20),
  },
  text: {
    width: dp(80),
    fontSize: dp(16),
    color: '#A0A0A0',
    textAlign: 'right',
    marginRight: dp(20),
  },
  itemValueBtn: {
    // width: dp(150),
    flex:1,
    height: dp(30),
    // borderColor: '#ccc',
    // borderWidth: dp(1),
    // alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    // fontSize: dp(14),
    color: '#A0A0A0',
    textAlign: 'left',
    // lineHeight: dp(30),
  },
  // itemValueBtnText: {
  //   width: dp(140),
  //   height: dp(30),
  //   fontSize: dp(14),
  //   color: '#A0A0A0',
  //   textAlign: 'left',
  //   lineHeight: dp(30),
  // },

  pickerView:{
    width: '100%',
    flexDirection: 'column',
    paddingVertical: dp(20),
  },
  pickerSize: {
    width: dp(160),
    height: dp(30),
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(40),
    height:dp(40),
  },

  listTitleView: {
    width:'100%',
    height: dp(40),
    flexDirection: 'row',
    paddingHorizontal: dp(20),
    // backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: dp(16),
    color: '#333',
  },

})

export default styles

