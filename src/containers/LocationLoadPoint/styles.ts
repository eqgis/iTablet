/** 外部设备页面的样式文件 */
import { dp } from "imobile_for_reactnative/utils/size"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContentView: {
    width: '100%',
    flexDirection: 'column',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: dp(10),
    height:dp(50),
    // backgroundColor: '#fff',
    borderBottomColor: '#f9f9f9',
    borderBottomWidth: dp(1),
  },
  text: {
    fontSize: dp(16),
  },
  image: {
    height: dp(30),
    width: dp(30),
  },
  headerRightText: {
    fontSize: dp(16),
  },

})

export default styles

