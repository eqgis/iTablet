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
    justifyContent: 'space-between',
    paddingHorizontal: dp(10),
    height:dp(40),
  },
  seperator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  text: {
    fontSize: dp(16),
    color: '#A0A0A0',
  },
  itemValueBtn: {
    width: dp(150),
    height: dp(30),
    borderColor: '#ccc',
    borderWidth: dp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemValueBtnText: {
    width: dp(140),
    height: dp(30),
    fontSize: dp(14),
    color: '#A0A0A0',
    textAlign: 'left',
    lineHeight: dp(30),
  },

  pickerView:{
    width: '100%',
    flexDirection: 'column',
  },
  pickerSize: {
    width: dp(180),
    height: dp(30),
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(10),
    height:dp(40),
  },

  listTitleView: {
    width:'100%',
    height: dp(40),
    flexDirection: 'row',
    paddingHorizontal: dp(10),
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  marginT40: {
    marginTop: dp(20),
  },
  listTitle: {
    fontSize: dp(16),
    color: '#333',
  },

})

export default styles

