/** 外部设备页面的样式文件 */
import { dp } from "imobile_for_reactnative/utils/size"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(10),
    height:dp(50),
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: dp(10),
    marginVertical: dp(25),
  },
  searchText: {
    fontSize: dp(16),
    marginHorizontal: dp(10),
  },
  text: {
    fontSize: dp(16),
  },
  image: {
    height: dp(30),
    width: dp(30),
  },
  seperator: {
    height: dp(10),
    backgroundColor: '#f9f9f9',
    marginTop: dp(20),
  },
  headerRightText: {
    fontSize: dp(16),
  },


  pickerView:{
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: dp(10),
  },
  pickerSize: {
    width: dp(140),
    height: dp(30),
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(10),
    paddingLeft: dp(40),
    height:dp(50),
  },
  listContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: dp(10),
  },
  listTitleView: {
    width:'100%',
    height: dp(40),
    flexDirection: 'row',
    paddingHorizontal: dp(20),
    // backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  marginT40: {
    marginTop: dp(20),
  },
  listTitle: {
    fontSize: dp(16),
    color: '#333',
  },
  listContentView: {
    width: '100%',
    paddingHorizontal: dp(10),
    paddingLeft: dp(30),
    flexDirection: 'column',
  },

})

export default styles

